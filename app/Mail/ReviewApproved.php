<?php

namespace App\Mail;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewApproved extends Mailable
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
            subject: 'Your Review Has Been Approved!',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.review-approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
