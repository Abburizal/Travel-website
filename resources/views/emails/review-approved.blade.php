@component('mail::message')
# Your Review Has Been Approved! ✅

Dear {{ $user->name }},

Great news! Your review for **{{ $tour->name }}** has been approved and is now live on our website.

## Your Review

**Rating:** {{ str_repeat('⭐', $review->rating) }}  
**Comment:** "{{ Str::limit($review->comment, 150) }}"

@component('mail::button', ['url' => config('app.url') . '/tours/' . $tour->id])
View Your Review
@endcomponent

Thank you for helping other travelers make informed decisions!

Best regards,<br>
{{ config('app.name') }}
@endcomponent
