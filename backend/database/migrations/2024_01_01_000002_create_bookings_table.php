<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference_code', 20)->unique();
            $table->string('customer_name', 100);
            $table->string('mobile_number', 20);
            $table->string('email', 150);
            $table->date('booking_date');
            $table->unsignedInteger('package_id');
            $table->string('package_name', 100);
            $table->decimal('package_price', 10, 2);
            $table->decimal('advance_amount', 10, 2);
            $table->string('receipt_path', 255)->nullable();
            $table->string('reference_number', 100)->nullable();
            $table->enum('status', ['pending','confirmed','rejected','cancelled'])->default('pending');
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('bookings'); }
};
