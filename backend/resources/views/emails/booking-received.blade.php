@php
    $details = '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Reference</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;font-family:monospace;">' . $refCode . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Booking Date</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . date('d M Y', strtotime($bookDate)) . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Package</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . $pkgName . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;font-size:13px;">Advance Paid</td><td style="color:#15803d;font-weight:700;text-align:right;font-size:13px;">Rs.' . number_format($advance) . '</td></tr>';
@endphp
@include('emails.layout', [
    'subtitle'   => 'Booking Request Received',
    'badgeBg'    => '#dbeafe',
    'badgeColor' => '#1d4ed8',
    'badgeText'  => 'PENDING REVIEW',
    'greeting'   => 'Dear <strong>' . $toName . '</strong>,',
    'mainMsg'    => 'Thank you for booking Atas Resort! We have received your booking request and payment proof. Our admin will review and confirm within a few hours.',
    'details'    => $details,
    'subMsg'     => 'Please save your reference number <strong style="color:#005461;">' . $refCode . '</strong>. You will receive another email once your booking is confirmed.',
])