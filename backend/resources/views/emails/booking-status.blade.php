@php
    $statusConfig = [
        'confirmed' => ['bg'=>'#dcfce7','color'=>'#15803d','text'=>'CONFIRMED','subtitle'=>'Booking Confirmation','mainMsg'=>'Great news! Your booking at Atas Resort has been <strong style="color:#15803d;">confirmed</strong>. We look forward to welcoming you!','subMsg'=>'Please arrive on time. If you need to make any changes, contact us as soon as possible.'],
        'cancelled' => ['bg'=>'#fff8e1','color'=>'#b45309','text'=>'CANCELLED','subtitle'=>'Booking Cancellation','mainMsg'=>'Your booking at Atas Resort has been <strong style="color:#b45309;">cancelled</strong> as requested.','subMsg'=>'Your refund will be processed shortly. We hope to welcome you again!'],
        'rejected'  => ['bg'=>'#fee2e2','color'=>'#dc2626','text'=>'NOT CONFIRMED','subtitle'=>'Booking Update','mainMsg'=>'Unfortunately, we could not confirm your booking at Atas Resort.','subMsg'=>'This may be due to an issue with your payment proof. Please contact us to rebook or resolve this.'],
    ];
    $cfg = $statusConfig[$status] ?? $statusConfig['rejected'];
    $details = '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Reference</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;font-family:monospace;">' . $refCode . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Booking Date</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . date('d M Y', strtotime($bookDate)) . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">Package</td><td style="color:#005461;font-weight:600;text-align:right;font-size:13px;">' . $pkgName . '</td></tr>'
              . '<tr><td style="color:#6b7c82;padding:8px 0;font-size:13px;">Status</td><td style="color:' . $cfg['color'] . ';font-weight:700;text-align:right;font-size:13px;">' . $cfg['text'] . '</td></tr>';
@endphp
@include('emails.layout', [
    'subtitle'   => $cfg['subtitle'],
    'badgeBg'    => $cfg['bg'],
    'badgeColor' => $cfg['color'],
    'badgeText'  => $cfg['text'],
    'greeting'   => 'Dear <strong>' . $toName . '</strong>,',
    'mainMsg'    => $cfg['mainMsg'],
    'details'    => $details,
    'subMsg'     => $cfg['subMsg'],
])