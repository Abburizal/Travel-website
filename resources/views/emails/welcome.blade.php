@component('mail::message')
# Welcome to Flymora Tours! 🌍

Hello {{ $user->name }},

Thank you for joining **Flymora Tours and Travels**! We're excited to help you create unforgettable travel experiences.

## What You Can Do Now

✈️ **Browse Tours** - Explore our amazing tour packages  
⭐ **Save Favorites** - Add tours to your wishlist  
📅 **Book Instantly** - Secure your spot with easy booking  
💬 **Write Reviews** - Share your travel experiences

@component('mail::button', ['url' => config('app.url') . '/tours'])
Explore Tours
@endcomponent

## Why Choose Us?

- 🏆 Expert local guides
- 🎯 Best price guarantee
- 🛡️ Secure payment options
- 📞 24/7 customer support

We're here to make your travel dreams come true!

Best regards,<br>
The Flymora Tours Team

---

**Stay Connected:**  
Website: {{ config('app.url') }}  
Email: info@flymoratours.com  
Phone: +62 123 4567 890
@endcomponent
