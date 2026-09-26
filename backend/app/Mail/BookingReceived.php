<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $toName,
        public string $refCode,
        public string $bookDate,
        public string $pkgName,
        public float  $advance
    ) {}

    public function envelope(): Envelope {
        return new Envelope(subject: "Booking Received - Atas Resort ({$this->refCode})");
    }

    public function content(): Content {
        return new Content(view: 'emails.booking-received');
    }
}
