<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <title>{{ config('app.name', 'Tripin Travel') }}</title>
        
        <!-- Midtrans Snap.js -->
        <script src="https://app.sandbox.midtrans.com/snap/snap.js" 
                data-client-key="{{ config('services.midtrans.client_key') }}"></script>
        
        @vite(['resources/css/app.css', 'resources/js/main.jsx'])
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
