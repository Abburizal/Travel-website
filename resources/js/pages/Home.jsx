import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Explore the World with Tripin Travel
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Discover amazing destinations, create unforgettable memories,
                        and embark on adventures you'll treasure forever.
                    </p>
                    <Link
                        to="/tours"
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 inline-block"
                    >
                        Browse Tours
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Best Destinations</h3>
                            <p className="text-gray-600">
                                Carefully curated tours to the world's most beautiful places
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Affordable Prices</h3>
                            <p className="text-gray-600">
                                Competitive pricing with no hidden fees
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
                            <p className="text-gray-600">
                                Safe and secure payment with Midtrans
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of satisfied travelers and book your dream tour today
                    </p>
                    <Link
                        to="/tours"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 inline-block"
                    >
                        View All Tours
                    </Link>
                </div>
            </section>
        </div>
    );
}
