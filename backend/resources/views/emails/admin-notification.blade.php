@php
    $payment = $receiptPath ? 'Receipt image uploaded' : 'Bank ref: ' . $refNumber;
    $details = '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Reference</td><td style="color:#005461;font-weight:700;text-align:right;font-size:13px;font-family:monospace;">' . $refCode . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Customer Name</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . $custName . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Mobile</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . $custMobile . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Email</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . $custEmail . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Booking Date</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . date('d M Y', strtotime($bookDate)) . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Package</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . $pkgName . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Full Price</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">Rs.' . number_format($pkgPrice) . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Advance Paid</td><td style="color:#15803d;font-weight:700;text-align:right;font-size:13px;">Rs.' . number_format($advance) . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;font-size:13px;">Payment Proof</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . $payment . '</td></tr>';
@endphp
@include('emails.layout', [
    'subtitle'   => 'New Booking Notification',
    'badgeBg'    => '#fef3c7',
    'badgeColor' => '#92400e',
    'badgeText'  => 'ACTION REQUIRED - NEW BOOKING',
    'greeting'   => 'Hello Admin,',
    'mainMsg'    => 'A new booking request has been submitted and is waiting for your review. Please check the payment proof and confirm or reject.',
    'details'    => $details,
    'subMsg'     => 'Login to the admin dashboard to review and take action.',
])