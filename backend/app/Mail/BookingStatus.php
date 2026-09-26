<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingStatus extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $toName,
        public string $status,
        public string $refCode,
        public string $bookDate,
        public string $pkgName
    ) {}

    public function envelope(): Envelope {
        $subjectMap = [
            'confirmed' => "Booking Confirmed - Atas Resort ({$this->refCode})",
            'rejected'  => "Booking Update - Atas Resort ({$this->refCode})",
            'cancelled' => "Booking Cancelled - Atas Resort ({$this->refCode})",
        ];
        return new Envelope(subject: $subjectMap[$this->status] ?? "Booking Update - Atas Resort");
    }

    public function content(): Content {
        return new Content(view: 'emails.booking-status');
    }
}
