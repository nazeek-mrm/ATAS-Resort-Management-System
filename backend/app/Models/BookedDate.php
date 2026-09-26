<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookedDate extends Model
{
    protected $fillable = ['booking_date','status','booking_id','expires_at'];

    protected function casts(): array {
        return ['booking_date' => 'date', 'expires_at' => 'datetime'];
    }

    public function booking() {
        return $this->belongsTo(Booking::class);
    }
}
