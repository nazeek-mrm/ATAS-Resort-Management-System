<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\AdminNotification;
use App\Mail\BookingReceived;
use App\Models\BookedDate;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    private function getPackages(): array {
        return [
            ['id'=>1,  'type'=>'Day',       'time'=>'7.00 AM - 5.00 PM',  'persons'=>20,  'price'=>4000],
            ['id'=>2,  'type'=>'Day-Night', 'time'=>'7.00 AM - 10.00 PM', 'persons'=>20,  'price'=>6000],
            ['id'=>3,  'type'=>'Night',     'time'=>'8.00 PM - 6.00 AM',  'persons'=>20,  'price'=>8000],
            ['id'=>4,  'type'=>'Day',       'time'=>'7.00 AM - 5.00 PM',  'persons'=>40,  'price'=>7000],
            ['id'=>5,  'type'=>'Day-Night', 'time'=>'7.00 AM - 10.00 PM', 'persons'=>40,  'price'=>9000],
            ['id'=>6,  'type'=>'Night',     'time'=>'8.00 PM - 6.00 AM',  'persons'=>40,  'price'=>11000],
            ['id'=>7,  'type'=>'Day',       'time'=>'7.00 AM - 5.00 PM',  'persons'=>80,  'price'=>10000],
            ['id'=>8,  'type'=>'Day-Night', 'time'=>'7.00 AM - 10.00 PM', 'persons'=>80,  'price'=>12000],
            ['id'=>9,  'type'=>'Night',     'time'=>'8.00 PM - 6.00 AM',  'persons'=>80,  'price'=>14000],
            ['id'=>10, 'type'=>'Day',       'time'=>'7.00 AM - 5.00 PM',  'persons'=>100, 'price'=>13000],
            ['id'=>11, 'type'=>'Day-Night', 'time'=>'7.00 AM - 10.00 PM', 'persons'=>100, 'price'=>15000],
            ['id'=>12, 'type'=>'Night',     'time'=>'8.00 PM - 6.00 AM',  'persons'=>100, 'price'=>17000],
            ['id'=>13, 'type'=>'Day',       'time'=>'7.00 AM - 5.00 PM',  'persons'=>150, 'price'=>16000],
            ['id'=>14, 'type'=>'Day-Night', 'time'=>'7.00 AM - 10.00 PM', 'persons'=>150, 'price'=>18000],
            ['id'=>15, 'type'=>'Night',     'time'=>'8.00 PM - 6.00 AM',  'persons'=>150, 'price'=>20000],
        ];
    }

    public function packages_list() {
        return response()->json($this->getPackages());
    }

    public function booked_dates() {
        BookedDate::where('status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->delete();
        $dates = BookedDate::all(['booking_date','status']);
        $result = [];
        foreach ($dates as $d) {
            $result[$d->booking_date->format('Y-m-d')] = $d->status;
        }
        return response()->json($result);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'customer_name'    => 'required|string|max:100',
            'mobile_number'    => 'required|string',
            'email'            => 'required|email|max:150',
            'booking_date'     => 'required|date|after_or_equal:today',
            'package_id'       => 'required|integer|min:1|max:15',
            'package_name'     => 'required|string',
            'package_price'    => 'required|numeric',
            'reference_number' => 'nullable|string|max:100',
            'receipt_image'    => 'nullable|file|mimes:jpg,jpeg,png,gif,pdf|max:5120',
        ]);

        $mobile = preg_replace('/[\s\-\(\)\+]/', '', $validated['mobile_number']);
        if (str_starts_with($mobile, '94') && strlen($mobile) === 11) {
            $mobile = '0' . substr($mobile, 2);
        }
        if (!preg_match('/^0[0-9]{9}$/', $mobile)) {
            return response()->json(['error' => 'Invalid mobile number!'], 422);
        }

        $email = strtolower(trim($validated['email']));
        if (!preg_match('/^[a-z0-9!#$%&\'*+\/=?^_`{|}~.-]+@([a-z0-9-]+\.)+[a-z]{2,}$/', $email)) {
            return response()->json(['error' => 'Please enter a valid and complete email address (e.g. name@gmail.com).'], 422);
        }
        if (preg_match('/@gmail\.(?!com$)[a-z0-9]+$/', $email)) {
            return response()->json(['error' => 'Incomplete or invalid Gmail address. Gmail addresses must end with @gmail.com.'], 422);
        }
        if (preg_match('/@(yahoo|hotmail|outlook)\.(c|co)$/', $email)) {
            return response()->json(['error' => 'Incomplete email domain. Please enter a full domain like .com.'], 422);
        }

        if (empty($request->file('receipt_image')) && empty($validated['reference_number'])) {
            return response()->json(['error' => 'Payment proof required!'], 422);
        }

        $dateExists = BookedDate::where('booking_date', $validated['booking_date'])->exists();
        if ($dateExists) {
            return response()->json(['error' => 'This date is no longer available.'], 409);
        }

        $receiptPath = null;
        if ($request->hasFile('receipt_image')) {
            $receiptPath = $request->file('receipt_image')->store('receipts', 'public');
        }

        $pkgPrice = (float)$validated['package_price'];
        $advance  = round($pkgPrice * 0.30, 2);
        $refCode  = 'ATR-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

        $booking = Booking::create([
            'reference_code'   => $refCode,
            'customer_name'    => $validated['customer_name'],
            'mobile_number'    => $mobile,
            'email'            => $validated['email'],
            'booking_date'     => $validated['booking_date'],
            'package_id'       => $validated['package_id'],
            'package_name'     => $validated['package_name'],
            'package_price'    => $pkgPrice,
            'advance_amount'   => $advance,
            'receipt_path'     => $receiptPath,
            'reference_number' => $validated['reference_number'] ?? null,
            'status'           => 'pending',
        ]);

        BookedDate::create([
            'booking_date' => $validated['booking_date'],
            'status'       => 'pending',
            'booking_id'   => $booking->id,
            'expires_at'   => now()->addMinutes(30),
        ]);

        try {
            Mail::to($validated['email'])->send(new BookingReceived(
                $validated['customer_name'], $refCode,
                $validated['booking_date'], $validated['package_name'], $advance
            ));
            Mail::to(config('mail.from.address'))->send(new AdminNotification(
                $validated['customer_name'], $validated['email'], $mobile,
                $refCode, $validated['booking_date'], $validated['package_name'],
                $pkgPrice, $advance, $receiptPath, $validated['reference_number'] ?? null
            ));
        } catch (\Exception $e) {
            logger()->error('Email failed: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'reference_code' => $refCode], 201);
    }
}
