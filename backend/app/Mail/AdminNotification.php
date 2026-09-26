<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $custName,
        public string $custEmail,
        public string $custMobile,
        public string $refCode,
        public string $bookDate,
        public string $pkgName,
        public float  $pkgPrice,
        public float  $advance,
        public ?string $receiptPath,
        public ?string $refNumber
    ) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "New Booking Alert - {$this->refCode} | Action Required");
    }

    public function content(): Content {
        return new Content(view: 'emails.admin-notification');
    }
}
