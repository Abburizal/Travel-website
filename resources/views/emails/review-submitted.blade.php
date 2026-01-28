@component('mail::message')
# Thank You for Your Review!

Dear {{ $user->name }},

Thank you for taking the time to share your experience with us!

## Review Details

**Tour:** {{ $tour->name }}  
**Rating:** {{ str_repeat('⭐', $review->rating) }}  
**Your Comment:** "{{ Str::limit($review->comment, 100) }}"

@component('mail::panel')
Your review is now pending approval. Once approved by our team, it will be visible on our website to help other travelers make informed decisions.
@endcomponent

We truly appreciate your feedback!

Best regards,<br>
{{ config('app.name') }}
@endcomponent
