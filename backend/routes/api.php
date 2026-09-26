<?php
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\AdminCredentialsController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ForgotPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ---- Public Routes ----
Route::get('/packages', [BookingController::class, 'packages_list']);
Route::get('/booked-dates', [BookingController::class, 'booked_dates']);
Route::post('/bookings', [BookingController::class, 'store']);

// ---- Admin Auth ----
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
Route::get('/admin/me', [AdminAuthController::class, 'me']);

// ---- Forgot Password ----
Route::post('/admin/forgot-password/send-otp', [ForgotPasswordController::class, 'sendOtp']);
Route::post('/admin/forgot-password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
Route::post('/admin/forgot-password/reset', [ForgotPasswordController::class, 'resetPassword']);

// ---- Admin Protected Routes ----
Route::middleware('admin.auth')->group(function () {
    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);
    Route::post('/admin/bookings/{id}/action', [AdminBookingController::class, 'action']);
    Route::patch('/admin/bookings/{id}/note', [AdminBookingController::class, 'updateNote']);
    Route::get('/admin/reports', [AdminBookingController::class, 'reports']);
    Route::put('/admin/credentials', [AdminCredentialsController::class, 'update']);
});