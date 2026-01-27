import React from 'react';

/**
 * Schema Markup Component for SEO
 * Generates JSON-LD structured data
 */

// Organization Schema (Company Info)
export const OrganizationSchema = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Tripin Travel",
        "alternateName": "Flymora Tours & Travels",
        "url": "https://tripin.travel",
        "logo": "https://tripin.travel/images/logo.png",
        "description": "Your trusted partner in creating extraordinary travel experiences. Discover amazing tour packages to destinations around the world.",
        "email": "info@tripin.travel",
        "telephone": "+62-xxx-xxxx-xxxx",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "ID"
        },
        "sameAs": [
            "https://facebook.com/tripintravel",
            "https://twitter.com/tripintravel",
            "https://instagram.com/tripintravel"
        ],
        "priceRange": "IDR 2,000,000 - IDR 50,000,000"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// Product Schema (for Tour packages)
export const TourProductSchema = ({ tour }) => {
    if (!tour) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": tour.name,
        "description": tour.description,
        "image": tour.image_url || "https://tripin.travel/images/default-tour.jpg",
        "url": `https://tripin.travel/tours/${tour.id}`,
        "provider": {
            "@type": "TravelAgency",
            "name": "Tripin Travel"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://tripin.travel/tours/${tour.id}`,
            "priceCurrency": "IDR",
            "price": tour.price,
            "availability": tour.booked_participants < tour.max_participants 
                ? "https://schema.org/InStock" 
                : "https://schema.org/SoldOut",
            "validFrom": tour.available_from,
            "validThrough": tour.available_until
        },
        "touristType": tour.category?.name || "General",
        "itinerary": {
            "@type": "ItemList",
            "numberOfItems": tour.duration,
            "itemListElement": Array.isArray(tour.highlights) 
                ? tour.highlights.map((highlight, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": typeof highlight === 'string' ? highlight.trim() : highlight
                }))
                : []
        }
    };

    // Add aggregate rating if available
    if (tour.average_rating && tour.review_count) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": tour.average_rating,
            "reviewCount": tour.review_count,
            "bestRating": 5,
            "worstRating": 1
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// Review Schema (for individual reviews)
export const ReviewSchema = ({ review, tour }) => {
    if (!review || !tour) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
            "@type": "TouristTrip",
            "name": tour.name
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.rating,
            "bestRating": 5,
            "worstRating": 1
        },
        "author": {
            "@type": "Person",
            "name": review.user?.name || "Anonymous"
        },
        "reviewBody": review.comment,
        "datePublished": review.created_at
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// BreadcrumbList Schema (for navigation)
export const BreadcrumbSchema = ({ items }) => {
    if (!items || items.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// FAQPage Schema
export const FAQPageSchema = ({ faqs }) => {
    if (!faqs || faqs.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

// Website Search Schema
export const WebsiteSearchSchema = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Tripin Travel",
        "url": "https://tripin.travel",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://tripin.travel/tours?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default {
    OrganizationSchema,
    TourProductSchema,
    ReviewSchema,
    BreadcrumbSchema,
    FAQPageSchema,
    WebsiteSearchSchema
};
