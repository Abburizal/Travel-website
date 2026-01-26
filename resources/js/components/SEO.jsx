import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = 'Tripin Travel - Your Adventure Starts Here',
    description = 'Discover amazing tour packages to destinations around the world. Book your dream vacation with Tripin Travel.',
    keywords = 'travel, tours, vacation, adventure, tourism, holiday packages',
    image = '/images/og-default.jpg',
    url = 'https://tripin.travel',
    type = 'website',
    author = 'Tripin Travel'
}) => {
    const siteTitle = 'Tripin Travel';
    const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
    const fullUrl = url.startsWith('http') ? url : `https://tripin.travel${url}`;
    const fullImage = image.startsWith('http') ? image : `https://tripin.travel${image}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
        </Helmet>
    );
};

export default SEO;
