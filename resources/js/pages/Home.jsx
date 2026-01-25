import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Home() {
    const location = useLocation();

    useEffect(() => {
        // Handle scroll after navigation from footer
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location]);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Explore the World with Flymora
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

            {/* About Us Section */}
            <section id="about" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">About Flymora</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Your trusted partner in creating extraordinary travel experiences since 2024
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                        {/* Company Story */}
                        <div>
                            <h3 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h3>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    Founded with a passion for exploration and a commitment to exceptional service, 
                                    Flymora Tours & Travels has been transforming dreams into reality for travelers 
                                    from around the world.
                                </p>
                                <p>
                                    We believe that travel is more than just visiting new places—it's about immersing 
                                    yourself in different cultures, creating lasting memories, and discovering the 
                                    extraordinary in every journey.
                                </p>
                                <p>
                                    With carefully curated tours, expert local guides, and a dedication to sustainability, 
                                    we ensure every adventure is unforgettable, comfortable, and enriching.
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                                <div className="text-gray-700 font-semibold">Happy Travelers</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl text-center">
                                <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                                <div className="text-gray-700 font-semibold">Destinations</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl text-center">
                                <div className="text-4xl font-bold text-purple-600 mb-2">4.8/5</div>
                                <div className="text-gray-700 font-semibold">Average Rating</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl text-center">
                                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                                <div className="text-gray-700 font-semibold">Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Vision & Mission */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <svg className="w-10 h-10 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <h3 className="text-2xl font-bold">Our Vision</h3>
                            </div>
                            <p className="text-blue-100 leading-relaxed">
                                To be the world's most trusted travel partner, inspiring millions to explore, 
                                discover, and connect with the beauty and diversity of our planet while promoting 
                                sustainable and responsible tourism.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8 rounded-xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <svg className="w-10 h-10 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <h3 className="text-2xl font-bold">Our Mission</h3>
                            </div>
                            <p className="text-green-100 leading-relaxed">
                                To deliver exceptional travel experiences through personalized service, expert guidance, 
                                and innovative solutions, while supporting local communities and preserving the natural 
                                and cultural heritage of the destinations we serve.
                            </p>
                        </div>
                    </div>

                    {/* Our Values */}
                    <div className="mb-20">
                        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Core Values</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-gray-800">Customer First</h4>
                                <p className="text-gray-600 text-sm">Your satisfaction is our top priority</p>
                            </div>

                            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-gray-800">Integrity</h4>
                                <p className="text-gray-600 text-sm">Honest and transparent in all we do</p>
                            </div>

                            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-gray-800">Sustainability</h4>
                                <p className="text-gray-600 text-sm">Committed to eco-friendly practices</p>
                            </div>

                            <div className="text-center p-6 hover:shadow-lg transition-shadow rounded-lg">
                                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-gray-800">Innovation</h4>
                                <p className="text-gray-600 text-sm">Continuously improving our services</p>
                            </div>
                        </div>
                    </div>

                    {/* Our Team */}
                    <div>
                        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Meet Our Team</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center group">
                                <div className="relative mb-4 overflow-hidden rounded-xl">
                                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="font-bold text-xl mb-1 text-gray-800">Sarah Johnson</h4>
                                <p className="text-blue-600 font-semibold mb-2">CEO & Founder</p>
                                <p className="text-gray-600 text-sm">
                                    Passionate traveler with 15+ years in the tourism industry
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="relative mb-4 overflow-hidden rounded-xl">
                                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="font-bold text-xl mb-1 text-gray-800">Michael Chen</h4>
                                <p className="text-green-600 font-semibold mb-2">Operations Manager</p>
                                <p className="text-gray-600 text-sm">
                                    Expert in logistics and ensuring seamless travel experiences
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="relative mb-4 overflow-hidden rounded-xl">
                                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h4 className="font-bold text-xl mb-1 text-gray-800">Emily Rodriguez</h4>
                                <p className="text-purple-600 font-semibold mb-2">Customer Relations</p>
                                <p className="text-gray-600 text-sm">
                                    Dedicated to providing exceptional customer support
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
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

                        <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
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

                        <div className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
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

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                        <p className="text-xl text-blue-100">
                            Have questions? We're here to help you plan your perfect adventure
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Email */}
                        <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl hover:bg-opacity-20 transition">
                            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                            <a href="mailto:info@flymora.com" className="text-blue-100 hover:text-white transition">
                                info@flymora.com
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl hover:bg-opacity-20 transition">
                            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                            <a href="tel:+62-21-1234-5678" className="text-blue-100 hover:text-white transition">
                                +62 21 1234 5678
                            </a>
                        </div>

                        {/* Office */}
                        <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl hover:bg-opacity-20 transition">
                            <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                            <p className="text-blue-100">
                                Jl. Sudirman No. 123<br />
                                Jakarta, Indonesia 12190
                            </p>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="text-center mt-12">
                        <p className="text-blue-100 mb-4">Follow us on social media</p>
                        <div className="flex justify-center gap-4">
                            <a href="#" className="bg-white bg-opacity-20 hover:bg-opacity-30 w-12 h-12 rounded-full flex items-center justify-center transition">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="#" className="bg-white bg-opacity-20 hover:bg-opacity-30 w-12 h-12 rounded-full flex items-center justify-center transition">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="#" className="bg-white bg-opacity-20 hover:bg-opacity-30 w-12 h-12 rounded-full flex items-center justify-center transition">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
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
