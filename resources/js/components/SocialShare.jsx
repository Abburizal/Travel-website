import React, { useState } from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
} from 'react-share';

export default function SocialShare({ url, title, description, imageUrl }) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Share This Tour
            </h3>
            
            <div className="flex flex-wrap gap-3">
                {/* Facebook */}
                <FacebookShareButton
                    url={url}
                    quote={title}
                    hashtag="#FlymoraTours"
                >
                    <FacebookIcon size={40} round />
                </FacebookShareButton>

                {/* Twitter */}
                <TwitterShareButton
                    url={url}
                    title={title}
                    hashtags={['FlymoraTours', 'Travel', 'Tour']}
                >
                    <TwitterIcon size={40} round />
                </TwitterShareButton>

                {/* WhatsApp */}
                <WhatsappShareButton
                    url={url}
                    title={title}
                    separator=" - "
                >
                    <WhatsappIcon size={40} round />
                </WhatsappShareButton>

                {/* Copy Link */}
                <button
                    onClick={handleCopyLink}
                    className="w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700 transition flex items-center justify-center group relative"
                    title="Copy Link"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-white" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                        />
                    </svg>
                    
                    {/* Tooltip */}
                    {copied && (
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                            Link Copied!
                        </span>
                    )}
                </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
                Share this amazing tour with your friends and family!
            </p>
        </div>
    );
}
