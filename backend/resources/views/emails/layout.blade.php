<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
<div style="max-width:520px;margin:30px auto;">
    <div style="background:linear-gradient(135deg,#005461,#018790);padding:32px;text-align:center;border-radius:16px 16px 0 0;">
        <h1 style="color:white;font-size:22px;margin:0;letter-spacing:1px;">ATAS RESORT</h1>
        <p style="color:rgba(255,255,255,0.70);margin:6px 0 0;font-size:13px;">{{ $subtitle }}</p>
    </div>
    <div style="background:white;padding:28px 32px;">
        <div style="background:{{ $badgeBg }};border-radius:10px;padding:13px 20px;text-align:center;margin-bottom:22px;">
            <span style="font-size:17px;font-weight:800;color:{{ $badgeColor }};letter-spacing:1px;">{{ $badgeText }}</span>
        </div>
        <p style="color:#1a2e35;font-size:15px;margin-bottom:8px;">{!! $greeting !!}</p>
        <p style="color:#6b7c82;font-size:14px;line-height:1.7;margin-bottom:22px;">{!! $mainMsg !!}</p>
        <div style="background:#f8fafc;border:1px solid #e0eaed;border-radius:12px;padding:20px;margin-bottom:20px;">
            <table style="width:100%;border-collapse:collapse;">{{ $details }}</table>
        </div>
        <p style="color:#6b7c82;font-size:13px;line-height:1.7;">{!! $subMsg !!}</p>
        <div style="border-top:1px solid #f0f0f0;margin-top:18px;padding-top:14px;">
            <p style="color:#6b7c82;font-size:12px;margin:0;">
                Need help? Call us: <a href="tel:+94772147733" style="color:#018790;font-weight:600;text-decoration:none;">+94 77 214 7733</a>
            </p>
        </div>
    </div>
    <div style="background:#005461;padding:16px 32px;border-radius:0 0 16px 16px;text-align:center;">
        <p style="color:rgba(255,255,255,0.55);font-size:11px;margin:0;">
            &copy; {{ date('Y') }} Atas Resort &bull; Addapallam, Nintavur &bull; Automated email
        </p>
    </div>
</div>
</body>
</html>