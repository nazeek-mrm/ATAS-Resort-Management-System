<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    public function sendOtp(Request $request) {
        $request->validate(['backup_email' => 'required|email']);
        $email = strtolower(trim($request->backup_email));
        $admin = Admin::whereRaw('LOWER(TRIM(backup_email)) = ?', [$email])->first();
        if (!$admin) {
            return response()->json(['error' => 'Email not registered as admin backup.'], 404);
        }

        $otp = strval(rand(100000, 999999));
        $admin->update(['otp_code' => $otp, 'otp_expires' => now()->addMinutes(10)]);
        $request->session()->put('reset_email', $admin->backup_email);

        try {
            Mail::to($admin->backup_email)->send(new OtpMail($otp));
            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully to your backup email!'
            ]);
        } catch (\Exception $e) {
            Log::error('OTP email send failure: ' . $e->getMessage());
            return response()->json([
                'success' => true,
                'dev_otp' => $otp,
                'message' => 'OTP generated successfully!'
            ]);
        }
    }

    public function verifyOtp(Request $request) {
        $request->validate(['otp_code' => 'required|string']);
        $email = $request->backup_email ? strtolower(trim($request->backup_email)) : $request->session()->get('reset_email');
        if (!$email) {
            return response()->json(['error' => 'Session expired. Please enter your email again.'], 400);
        }

        $admin = Admin::whereRaw('LOWER(TRIM(backup_email)) = ?', [$email])->first();
        if (!$admin || trim($admin->otp_code) !== trim($request->otp_code)) {
            return response()->json(['error' => 'Wrong OTP!'], 422);
        }
        if ($admin->otp_expires && now()->gt($admin->otp_expires)) {
            return response()->json(['error' => 'OTP expired.'], 422);
        }

        $admin->update(['otp_code' => null]);
        $request->session()->put('reset_email', $admin->backup_email);
        $request->session()->put('otp_verified', true);
        return response()->json(['success' => true]);
    }

    public function resetPassword(Request $request) {
        $request->validate([
            'new_password' => 'required|min:4',
            'confirm_password' => 'required|same:new_password'
        ]);

        $email = $request->backup_email ? strtolower(trim($request->backup_email)) : $request->session()->get('reset_email');
        if (!$email) {
            return response()->json(['error' => 'Session expired. Please restart the process.'], 400);
        }

        $admin = Admin::whereRaw('LOWER(TRIM(backup_email)) = ?', [$email])->first();
        if (!$admin) {
            return response()->json(['error' => 'Admin account not found.'], 404);
        }

        $admin->update(['password' => Hash::make($request->new_password)]);
        $request->session()->forget(['reset_email','otp_verified']);
        return response()->json(['success' => true, 'message' => 'Password reset!']);
    }
}
