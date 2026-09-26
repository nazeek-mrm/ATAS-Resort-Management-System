<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\BookingStatus;
use App\Models\BookedDate;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdminBookingController extends Controller
{
    public function index(Request $request) {
        $status = $request->get('status', 'all');
        $q = trim($request->get('q', ''));

        $query = Booking::orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if (!empty($q)) {
            $query->where(function($sub) use ($q) {
                $sub->where('customer_name', 'like', "%{$q}%")
                    ->orWhere('mobile_number', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('reference_code', 'like', "%{$q}%")
                    ->orWhere('reference_number', 'like', "%{$q}%");
            });
        }

        $bookings = $query->get()->map(function($b) {
            $b->receipt_url = $b->receipt_path ? asset('storage/' . $b->receipt_path) : null;
            return $b;
        });

        $stats = [
            'total'     => Booking::count(),
            'pending'   => Booking::where('status', 'pending')->count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'rejected'  => Booking::where('status', 'rejected')->count(),
            'cancelled' => Booking::where('status', 'cancelled')->count(),
        ];

        return response()->json(['bookings' => $bookings, 'stats' => $stats]);
    }

    public function action(Request $request, int $id) {
        $booking = Booking::findOrFail($id);
        $action  = $request->input('action');
        switch ($action) {
            case 'confirm':
                $booking->update(['status' => 'confirmed']);
                BookedDate::where('booking_id', $id)->update(['status' => 'confirmed', 'expires_at' => null]);
                $this->sendStatusMail($booking, 'confirmed');
                break;
            case 'reject':
                $booking->update(['status' => 'rejected']);
                BookedDate::where('booking_id', $id)->delete();
                $this->sendStatusMail($booking, 'rejected');
                break;
            case 'cancel':
                $booking->update(['status' => 'cancelled']);
                BookedDate::where('booking_id', $id)->delete();
                $this->sendStatusMail($booking, 'cancelled');
                break;
            case 'reconfirm':
                $booking->update(['status' => 'confirmed']);
                $dc = BookedDate::where('booking_id', $id)->first();
                if (!$dc) {
                    BookedDate::create(['booking_date' => $booking->booking_date, 'status' => 'confirmed', 'booking_id' => $id]);
                } else {
                    $dc->update(['status' => 'confirmed', 'expires_at' => null]);
                }
                $this->sendStatusMail($booking, 'confirmed');
                break;
            default:
                return response()->json(['error' => 'Invalid action'], 400);
        }

        $booking = $booking->fresh();
        $booking->receipt_url = $booking->receipt_path ? asset('storage/' . $booking->receipt_path) : null;

        return response()->json(['success' => true, 'booking' => $booking]);
    }

    public function updateNote(Request $request, int $id) {
        $request->validate(['admin_note' => 'nullable|string']);
        $booking = Booking::findOrFail($id);
        $booking->update(['admin_note' => $request->admin_note]);
        $booking->receipt_url = $booking->receipt_path ? asset('storage/' . $booking->receipt_path) : null;
        return response()->json(['success' => true, 'booking' => $booking]);
    }

    public function reports(Request $request) {
        $year = (int)$request->get('year', date('Y'));
        $month = (int)$request->get('month', date('m'));
        $monthPadded = str_pad($month, 2, '0', STR_PAD_LEFT);
        $dateFilter = "$year-$monthPadded";

        $query = Booking::whereRaw("DATE_FORMAT(booking_date, '%Y-%m') = ?", [$dateFilter]);
        $bookings = (clone $query)->orderBy('booking_date', 'asc')->get()->map(function($b) {
            $b->receipt_url = $b->receipt_path ? asset('storage/' . $b->receipt_path) : null;
            return $b;
        });

        $total = (clone $query)->count();
        $confirmed = (clone $query)->where('status', 'confirmed')->count();
        $pending = (clone $query)->where('status', 'pending')->count();
        $rejected = (clone $query)->where('status', 'rejected')->count();
        $cancelled = (clone $query)->where('status', 'cancelled')->count();

        $confirmedQuery = (clone $query)->where('status', 'confirmed');
        $totalRevenue = (float)$confirmedQuery->sum('package_price');
        $totalAdvance = (float)$confirmedQuery->sum('advance_amount');
        $balanceDue = $totalRevenue - $totalAdvance;

        $lostRevenue = (float)(clone $query)->whereIn('status', ['rejected', 'cancelled'])->sum('package_price');

        $firstYearRow = Booking::min('booking_date');
        $firstYear = $firstYearRow ? (int)date('Y', strtotime($firstYearRow)) : (int)date('Y');

        return response()->json([
            'year' => $year,
            'month' => $month,
            'first_year' => $firstYear,
            'current_year' => (int)date('Y'),
            'stats' => [
                'total' => $total,
                'confirmed' => $confirmed,
                'pending' => $pending,
                'rejected' => $rejected,
                'cancelled' => $cancelled,
                'total_revenue' => $totalRevenue,
                'total_advance' => $totalAdvance,
                'balance_due' => $balanceDue,
                'lost_revenue' => $lostRevenue,
                'confirmed_pct' => $total > 0 ? round(($confirmed / $total) * 100, 1) : 0,
                'pending_pct' => $total > 0 ? round(($pending / $total) * 100, 1) : 0,
                'rejected_pct' => $total > 0 ? round(($rejected / $total) * 100, 1) : 0,
                'cancelled_pct' => $total > 0 ? round(($cancelled / $total) * 100, 1) : 0,
            ],
            'bookings' => $bookings
        ]);
    }

    private function sendStatusMail(Booking $booking, string $status) {
        try {
            Mail::to($booking->email)->send(new BookingStatus(
                $booking->customer_name, $status,
                $booking->reference_code,
                $booking->booking_date->format('Y-m-d'),
                $booking->package_name
            ));
        } catch (\Exception $e) {
            logger()->error('Mail failed: ' . $e->getMessage());
        }
    }
}