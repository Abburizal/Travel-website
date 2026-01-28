@component('mail::message')
# Payment Successful! 🎉

Dear {{ $booking->user->name }},

Great news! Your payment has been processed successfully.

## Payment Receipt

**Booking ID:** #{{ $booking->id }}  
**Tour:** {{ $booking->tour->name }}  
**Payment Amount:** Rp {{ number_format($booking->total_price, 0, ',', '.') }}  
**Payment Status:** Confirmed ✓  
**Payment Date:** {{ now()->format('F d, Y H:i') }}

@component('mail::panel')
### What's Next?
Your booking is now confirmed! You will receive a detailed booking confirmation email separately with tour information and instructions.
@endcomponent

@component('mail::button', ['url' => config('app.url') . '/dashboard'])
View Booking Details
@endcomponent

Thank you for choosing Flymora Tours and Travels!

Best regards,<br>
{{ config('app.name') }}

---

**Need Help?**  
Email: info@flymoratours.com  
Phone: +62 123 4567 890
@endcomponent
