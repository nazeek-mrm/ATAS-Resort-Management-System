<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'reference_code','customer_name','mobile_number','email',
        'booking_date','package_id','package_name','package_price',
        'advance_amount','receipt_path','reference_number','status','admin_note'
    ];

    protected function casts(): array {
        return ['booking_date' => 'date', 'package_price' => 'decimal:2', 'advance_amount' => 'decimal:2'];
    }

    public function bookedDate() {
        return $this->hasOne(BookedDate::class);
    }
}
