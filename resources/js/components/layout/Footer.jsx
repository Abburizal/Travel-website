import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <img 
                                src="/images/logo.svg" 
                                alt="Flymora Tours and Travels" 
                                className="h-10"
                            />
                        </div>
                        <p className="text-gray-400">
                            Your trusted partner for unforgettable travel experiences around the world.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/tours" className="text-gray-400 hover:text-white">Tours</a></li>
                            <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <p className="text-gray-400">Email: info@flymoratours.com</p>
                        <p className="text-gray-400">Phone: +62 123 4567 890</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2026 Flymora Tours and Travels. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
