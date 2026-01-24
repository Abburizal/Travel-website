<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingETicket extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎫 E-Ticket Anda Siap - Tripin Travel #' . $this->booking->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-eticket',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
