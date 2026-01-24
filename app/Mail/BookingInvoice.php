<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingInvoice extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $booking;
    public $snapToken;

    public function __construct(Booking $booking, $snapToken)
    {
        $this->booking = $booking;
        $this->snapToken = $snapToken;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invoice Pembayaran - Tripin Travel #' . $this->booking->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-invoice',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
