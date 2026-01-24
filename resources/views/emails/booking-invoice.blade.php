<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Pembayaran</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Tripin Travel</h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Invoice Pembayaran</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px;">Halo, {{ $booking->user->name }}!</h2>
                            <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Terima kasih telah melakukan pemesanan di Tripin Travel. Berikut adalah detail booking Anda:
                            </p>

                            <!-- Booking Details Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc; border-radius: 8px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #718096; font-size: 14px; padding-bottom: 5px;">Booking ID</td>
                                                <td style="color: #1a202c; font-size: 16px; font-weight: 600; text-align: right; padding-bottom: 5px;">#{{ $booking->id }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #718096; font-size: 14px; padding-bottom: 5px;">Tour</td>
                                                <td style="color: #1a202c; font-size: 16px; font-weight: 600; text-align: right; padding-bottom: 5px;">{{ $booking->tour->name }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #718096; font-size: 14px; padding-bottom: 5px;">Tanggal Tour</td>
                                                <td style="color: #1a202c; font-size: 16px; font-weight: 600; text-align: right; padding-bottom: 5px;">{{ $booking->booking_date->format('d M Y') }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #718096; font-size: 14px; padding-bottom: 5px;">Jumlah Peserta</td>
                                                <td style="color: #1a202c; font-size: 16px; font-weight: 600; text-align: right; padding-bottom: 5px;">{{ $booking->number_of_participants }} orang</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 15px; border-top: 2px solid #e2e8f0;">
                                                    <table width="100%" cellpadding="8" cellspacing="0">
                                                        <tr>
                                                            <td style="color: #2d3748; font-size: 18px; font-weight: 700;">Total Pembayaran</td>
                                                            <td style="color: #667eea; font-size: 24px; font-weight: 700; text-align: right;">Rp {{ number_format($booking->total_price, 0, ',', '.') }}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Payment Warning -->
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 25px 0;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                    ⏰ <strong>Selesaikan pembayaran dalam 30 menit</strong><br>
                                    Booking akan otomatis dibatalkan jika belum dibayar sebelum: <strong>{{ $booking->expired_at->format('d M Y, H:i') }} WIB</strong>
                                </p>
                            </div>

                            <!-- Payment Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ config('app.url') }}/my-bookings" 
                                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
                                            💳 Bayar Sekarang
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 25px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                Atau buka halaman <strong>My Bookings</strong> Anda untuk melanjutkan pembayaran.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">Butuh bantuan? Hubungi kami</p>
                            <p style="margin: 0; color: #718096; font-size: 13px;">
                                📧 support@tripintravel.com | 📞 +62 812-3456-7890
                            </p>
                            <p style="margin: 15px 0 0 0; color: #a0aec0; font-size: 12px;">
                                &copy; {{ date('Y') }} Tripin Travel. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
