<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('booked_dates', function (Blueprint $table) {
            $table->id();
            $table->date('booking_date');
            $table->enum('status', ['pending','confirmed'])->default('pending');
            $table->unsignedBigInteger('booking_id');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
        });
    }
    public function down(): void { Schema::dropIfExists('booked_dates'); }
};
