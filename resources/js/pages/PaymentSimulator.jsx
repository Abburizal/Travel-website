import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentSimulator() {
    const { snapToken } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    useEffect(() => {
        loadBookingData();
    }, [snapToken]);

    const loadBookingData = async () => {
        try {
            const response = await axios.get(`/api/payment-simulator/${snapToken}`);
            setBookingData(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load booking data');
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);
        setError('');

        try {
            const response = await axios.post('/api/payment-simulator/complete', {
                snap_token: snapToken,
                payment_method: paymentMethod,
            });

            if (response.data.success) {
                // Show success message
                alert(`✅ Payment Successful!\n\nTransaction ID: ${response.data.transaction_id}\n\nE-ticket has been sent to your email!`);
                
                // Redirect to my bookings
                navigate('/my-bookings');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading payment page...</p>
                </div>
            </div>
        );
    }

    if (error && !bookingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                    >
                        Back to My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Development Mode Warning */}
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                        <span className="text-2xl mr-3">⚠️</span>
                        <div>
                            <p className="font-semibold">Development Mode - Payment Simulator</p>
                            <p className="text-sm mt-1">This is a simulated payment page for testing. In production, this will be replaced with real Midtrans payment gateway.</p>
                        </div>
                    </div>
                </div>

                {/* Payment Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                        <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
                        <p className="text-purple-100">Order ID: {bookingData?.order_id}</p>
                    </div>

                    {/* Booking Details */}
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tour Name:</span>
                                <span className="font-medium text-gray-800">{bookingData?.booking?.tour_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Customer:</span>
                                <span className="font-medium text-gray-800">{bookingData?.booking?.customer_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium text-gray-800">{bookingData?.booking?.customer_email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Participants:</span>
                                <span className="font-medium text-gray-800">{bookingData?.booking?.participants} person(s)</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t">
                                <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                                <span className="text-2xl font-bold text-purple-600">
                                    Rp {parseInt(bookingData?.booking?.total_price || 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h2>
                        <div className="space-y-3">
                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="credit_card"
                                    checked={paymentMethod === 'credit_card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-purple-600"
                                />
                                <span className="ml-3 text-gray-800 font-medium">💳 Credit/Debit Card</span>
                            </label>
                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="bank_transfer"
                                    checked={paymentMethod === 'bank_transfer'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-purple-600"
                                />
                                <span className="ml-3 text-gray-800 font-medium">🏦 Bank Transfer</span>
                            </label>
                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="e_wallet"
                                    checked={paymentMethod === 'e_wallet'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-purple-600"
                                />
                                <span className="ml-3 text-gray-800 font-medium">📱 E-Wallet (GoPay/OVO/Dana)</span>
                            </label>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="p-6 bg-gray-50">
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    '✓ Pay Now'
                                )}
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            🔒 Secure payment powered by Midtrans (Simulated)
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">ℹ️ How to test:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Click "Pay Now" to simulate successful payment</li>
                        <li>• You'll receive an e-ticket email immediately</li>
                        <li>• Booking status will change to "Paid"</li>
                        <li>• Tour quota will be deducted automatically</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
