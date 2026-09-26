@include('emails.layout', [
    'subtitle'   => 'Password Reset',
    'badgeBg'    => '#f0f4f8',
    'badgeColor' => '#005461',
    'badgeText'  => 'PASSWORD RESET OTP',
    'greeting'   => 'Hello Admin,',
    'mainMsg'    => 'You requested a password reset for your Atas Resort admin account. Use the OTP below to reset your password. This OTP expires in 10 minutes.',
    'details'    => '<tr><td style="color:#6b7c82;padding:8px 0;font-size:13px;text-align:center;"><span style="font-size:36px;font-weight:900;color:#005461;letter-spacing:8px;">' . $otp . '</span></td></tr>',
    'subMsg'     => 'If you did not request this, please ignore this email. Your password will remain unchanged.',
])