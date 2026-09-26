<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $username = env('SEED_ADMIN_USERNAME');
        $password = env('SEED_ADMIN_PASSWORD');
        $email = env('SEED_ADMIN_EMAIL');

        if (!$username || !$password || !$email) {
            throw new RuntimeException(
                'Admin seeding requires SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD and SEED_ADMIN_EMAIL.'
            );
        }

        DB::table('admins')->insertOrIgnore([
            'username' => $username,
            'password' => Hash::make($password),
            'backup_email' => $email,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}