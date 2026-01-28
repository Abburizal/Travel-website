@component('mail::message')
# Booking Confirmation

Dear {{ $user->name }},

Thank you for booking with **Flymora Tours and Travels**! Your booking has been confirmed.

## Booking Details

**Booking ID:** #{{ $booking->id }}  
**Tour:** {{ $tour->name }}  
**Destination:** {{ $tour->destination }}  
**Date:** {{ $booking->booking_date->format('l, F d, Y') }}  
**Participants:** {{ $booking->number_of_participants }} person(s)  
**Total Amount:** Rp {{ number_format($booking->total_price, 0, ',', '.') }}

## Tour Information

**Duration:** {{ $tour->duration }} days  
**Category:** {{ $tour->category->name ?? 'N/A' }}

@component('mail::panel')
### Important Information
Please arrive at the meeting point 30 minutes before departure time. Don't forget to bring:
- Valid ID/Passport
- Booking confirmation (this email)
- Comfortable clothing
- Camera for memories!
@endcomponent

@component('mail::button', ['url' => config('app.url') . '/dashboard'])
View My Bookings
@endcomponent

If you have any questions, please don't hesitate to contact us.

Thanks,<br>
{{ config('app.name') }}

---

**Contact Us:**  
Email: info@flymoratours.com  
Phone: +62 123 4567 890  
Website: {{ config('app.url') }}
@endcomponent
