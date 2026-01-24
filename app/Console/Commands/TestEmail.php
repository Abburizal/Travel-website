<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Mail\BookingInvoice;
use App\Mail\BookingETicket;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    protected $signature = 'test:email {type=invoice}';
    protected $description = 'Test email notifications (invoice or eticket)';

    public function handle()
    {
        $type = $this->argument('type');
        
        // Get latest booking with relationships
        $booking = Booking::with(['user', 'tour'])->latest()->first();
        
        if (!$booking) {
            $this->error('No booking found! Create a booking first.');
            return 1;
        }

        $this->info("Testing {$type} email...");
        $this->info("Booking ID: #{$booking->id}");
        $this->info("User: {$booking->user->name} ({$booking->user->email})");
        $this->info("Tour: {$booking->tour->name}");
        
        try {
            if ($type === 'invoice') {
                Mail::to($booking->user->email)
                    ->send(new BookingInvoice($booking, null));
                $this->info("✅ Invoice email sent!");
            } elseif ($type === 'eticket') {
                Mail::to($booking->user->email)
                    ->send(new BookingETicket($booking));
                $this->info("✅ E-Ticket email sent!");
            } else {
                $this->error("Invalid type! Use: invoice or eticket");
                return 1;
            }
            
            $this->info("\n📧 Check your email (or storage/logs/laravel.log if using 'log' driver)");
            return 0;
        } catch (\Exception $e) {
            $this->error("❌ Email failed: " . $e->getMessage());
            return 1;
        }
    }
}

