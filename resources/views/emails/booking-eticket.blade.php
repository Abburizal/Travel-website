<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Ticket Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                            <div style="font-size: 64px; margin-bottom: 10px;">🎉</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Pembayaran Berhasil!</h1>
                            <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">E-Ticket Anda Siap</p>
                        </td>
                    </tr>

                    <!-- Success Message -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 15px 0; color: #1a202c; font-size: 24px;">Selamat, {{ $booking->user->name }}!</h2>
                            <p style="margin: 0 0 25px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Pembayaran Anda telah dikonfirmasi. Berikut adalah e-ticket Anda untuk perjalanan yang akan datang:
                            </p>

                            <!-- E-Ticket Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 3px solid #10b981; border-radius: 12px; overflow: hidden; margin: 30px 0;">
                                <!-- Ticket Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; text-align: center;">
                                        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">E-TICKET</p>
                                        <p style="margin: 5px 0 0 0; color: #d1fae5; font-size: 20px; font-weight: 700;">#{{ str_pad($booking->id, 6, '0', STR_PAD_LEFT) }}</p>
                                    </td>
                                </tr>
                                
                                <!-- Ticket Body -->
                                <tr>
                                    <td style="padding: 30px; background-color: #ffffff;">
                                        <table width="100%" cellpadding="10" cellspacing="0">
                                            <tr>
                                                <td colspan="2" style="padding-bottom: 20px; border-bottom: 2px dashed #e2e8f0;">
                                                    <p style="margin: 0 0 5px 0; color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Destination</p>
                                                    <h3 style="margin: 0; color: #1a202c; font-size: 22px; font-weight: 700;">{{ $booking->tour->name }}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 20px; width: 50%;">
                                                    <p style="margin: 0 0 5px 0; color: #718096; font-size: 12px; text-transform: uppercase;">Passenger</p>
                                                    <p style="margin: 0; color: #1a202c; font-size: 16px; font-weight: 600;">{{ $booking->user->name }}</p>
                                                </td>
                                                <td style="padding-top: 20px; width: 50%; text-align: right;">
                                                    <p style="margin: 0 0 5px 0; color: #718096; font-size: 12px; text-transform: uppercase;">Date</p>
                                                    <p style="margin: 0; color: #1a202c; font-size: 16px; font-weight: 600;">{{ $booking->booking_date->format('d M Y') }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 15px;">
                                                    <p style="margin: 0 0 5px 0; color: #718096; font-size: 12px; text-transform: uppercase;">Participants</p>
                                                    <p style="margin: 0; color: #1a202c; font-size: 16px; font-weight: 600;">{{ $booking->number_of_participants }} Person{{ $booking->number_of_participants > 1 ? 's' : '' }}</p>
                                                </td>
                                                <td style="padding-top: 15px; text-align: right;">
                                                    <p style="margin: 0 0 5px 0; color: #718096; font-size: 12px; text-transform: uppercase;">Total Paid</p>
                                                    <p style="margin: 0; color: #10b981; font-size: 18px; font-weight: 700;">Rp {{ number_format($booking->total_price, 0, ',', '.') }}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 20px; border-top: 2px dashed #e2e8f0;">
                                                    <p style="margin: 15px 0 5px 0; color: #718096; font-size: 12px; text-transform: uppercase;">Payment Status</p>
                                                    <div style="display: inline-block; background-color: #d1fae5; color: #065f46; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                                                        ✓ CONFIRMED
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Barcode Placeholder -->
                                <tr>
                                    <td style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 2px dashed #e2e8f0;">
                                        <div style="background: repeating-linear-gradient(90deg, #000 0px, #000 2px, #fff 2px, #fff 4px); height: 60px; max-width: 300px; margin: 0 auto; border-radius: 4px;"></div>
                                        <p style="margin: 10px 0 0 0; color: #718096; font-size: 12px; letter-spacing: 2px;">{{ strtoupper(str_pad($booking->id, 12, '0', STR_PAD_LEFT)) }}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Important Info -->
                            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 6px; margin: 25px 0;">
                                <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px; font-weight: 600;">📋 Informasi Penting:</p>
                                <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px; line-height: 1.7;">
                                    <li>Tunjukkan e-ticket ini pada saat keberangkatan</li>
                                    <li>Harap datang 15 menit sebelum jadwal keberangkatan</li>
                                    <li>Bawa identitas diri (KTP/Paspor) yang valid</li>
                                </ul>
                            </div>

                            <!-- View Detail Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ config('app.url') }}/my-bookings" 
                                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-size: 15px; font-weight: 600;">
                                            📱 Lihat Detail Booking
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 20px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6; text-align: center;">
                                Simpan email ini sebagai bukti pembayaran Anda.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">Ada pertanyaan? Kami siap membantu!</p>
                            <p style="margin: 0; color: #718096; font-size: 13px;">
                                📧 support@tripintravel.com | 📞 +62 812-3456-7890
                            </p>
                            <p style="margin: 20px 0 0 0; color: #4a5568; font-size: 14px; font-weight: 600;">
                                Selamat menikmati perjalanan Anda! 🌍✈️
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
