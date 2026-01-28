<?php

namespace App\Mail;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public $review;
    public $tour;
    public $user;

    public function __construct(Review $review)
    {
        $this->review = $review->load(['tour', 'user']);
        $this->tour = $review->tour;
        $this->user = $review->user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Review Submitted - Thank You!',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.review-submitted',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
