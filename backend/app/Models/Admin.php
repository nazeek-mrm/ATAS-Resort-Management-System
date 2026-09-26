<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $table = 'admins';
    protected $fillable = ['username', 'password', 'backup_email', 'otp_code', 'otp_expires'];
    protected $hidden = ['password'];

    protected function casts(): array {
        return ['otp_expires' => 'datetime', 'password' => 'hashed'];
    }
}
