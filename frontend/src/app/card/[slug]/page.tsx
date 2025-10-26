'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Phone, Mail, Download, Share2, ArrowLeft } from 'lucide-react';
import { cardApiService } from '@/api/cardService';
import { CardData } from '@/types';
import { LINK_TYPES } from '@/constants/linkTypes';
import { Link } from 'lucide-react'; // fallback icon
import { downloadVCard } from '@/utils/vcard';


const CardDisplayPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const [cardData, setCardData] = useState<CardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const slug = params?.slug as string;

    // Helper function to format image source (handles both base64 and file paths)
    const getImageSrc = (imageData: string | null | undefined): string | undefined => {
        if (!imageData) return undefined;

        // If already has data URL prefix (base64), return as-is
        if (imageData.startsWith('data:')) {
            return imageData;
        }

        // If it looks like a file path (contains / or file extensions)
        if (imageData.includes('/') || imageData.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            // Handle both /uploads and /static prefixes
            return `${baseUrl}/uploads/${imageData}`;
        }

        // Otherwise, assume it's base64 without prefix
        return `data:image/jpeg;base64,${imageData}`;
    };


    useEffect(() => {
        const fetchCard = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                const data = await cardApiService.getCard(slug);

                // Debug logging
                if (data.profilePicture) {
                    console.log('Profile picture received:', data.profilePicture.substring(0, 50) + '...');
                    console.log('Is data URL:', data.profilePicture.startsWith('data:'));
                    console.log('Is file path:', data.profilePicture.includes('/') || data.profilePicture.includes('.'));
                    console.log('Processed URL:', getImageSrc(data.profilePicture)?.substring(0, 100));
                }

                setCardData(data);
            } catch (error) {
                console.error('error fetching card:', error);
                setError(error instanceof Error ? error.message : 'failed to load business card');
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [slug]);

    const handleShare = async (): Promise<void> => {
        const shareUrl = window.location.href;

        if (navigator.share) {
            // use native sharing if available
            try {
                await navigator.share({
                    title: `${cardData?.firstName} ${cardData?.lastName} - digital business card`,
                    text: 'check out my digital business card',
                    url: shareUrl,
                });
            } catch (error) {
                console.log('sharing cancelled or failed');
            }
        } else {
            // fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert('link copied to clipboard!');
            } catch (error) {
                console.error('failed to copy link');
            }
        }
    };

    const handleDownloadVCard = (): void => {
        if (!cardData) return;
        downloadVCard(cardData);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-300">loading your business card...</p>
                </div>
            </div>
        );
    }

    if (error || !cardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center">
                <div className="text-center backdrop-blur-xl bg-black/20 rounded-3xl p-8 border border-white/5">
                    <h1 className="text-2xl font-light text-gray-100 mb-4">card not found</h1>
                    <p className="text-gray-400 mb-6">{error || 'this business card does not exist or has been removed'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="backdrop-blur-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-6 py-3 rounded-2xl transition-all duration-300 border border-blue-500/30"
                    >
                        create your own card
                    </button>
                </div>
            </div>
        );
    }

    const displayName = `${cardData.firstName} ${cardData.lastName}`.trim() || 'anonymous';

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-gray-100 relative">
            {/* background ambient lighting */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-600/5 to-purple-700/5 rounded-full blur-3xl" />
                <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-600/5 to-blue-700/5 rounded-full blur-3xl" />
            </div>

            {/* header with navigation */}
            <header className="relative backdrop-blur-xl bg-black/40 border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>create your own</span>
                    </button>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 backdrop-blur-sm bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-xl transition-all duration-300 border border-purple-500/30"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>share</span>
                        </button>

                        <button
                            onClick={handleDownloadVCard}
                            className="flex items-center space-x-2 backdrop-blur-sm bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-xl transition-all duration-300 border border-green-500/30"
                        >
                            <Download className="w-4 h-4" />
                            <span>save contact</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* main card display */}
            <main className="max-w-2xl mx-auto px-6 py-16 relative">
                <div className="backdrop-blur-xl bg-black/20 rounded-3xl p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                    <div className="text-center relative z-10">
                        {/* profile picture */}
                        <div className="mb-8">
                            {cardData.profilePicture ? (
                                <img
                                    src={getImageSrc(cardData.profilePicture)}
                                    alt={`profile picture of ${displayName}`}
                                    className="w-36 h-36 rounded-full mx-auto object-cover border border-white/20 shadow-2xl"
                                />
                            ) : (
                                <div className="w-36 h-36 rounded-full mx-auto backdrop-blur-sm bg-black/40 border border-dashed border-white/20 flex items-center justify-center shadow-xl">
                                    <span className="text-gray-500 text-sm">no photo</span>
                                </div>
                            )}
                        </div>

                        {/* name */}
                        <h1 className="text-4xl font-light text-gray-100 mb-8 tracking-wide">
                            {displayName}
                        </h1>

                        {/* contact information */}
                        <div className="space-y-4 mb-8">
                            {cardData.phone && (
                                <a
                                    href={`tel:${cardData.phone}`}
                                    className="flex items-center justify-center space-x-3 text-gray-200 backdrop-blur-sm bg-black/20 rounded-2xl px-6 py-4 border border-white/10 hover:border-green-400/30 hover:bg-green-500/5 transition-all duration-300 group"
                                >
                                    <Phone className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                                    <span className="font-medium group-hover:text-green-300">{cardData.phone}</span>
                                </a>
                            )}

                            {cardData.email && (
                                <a
                                    href={`mailto:${cardData.email}`}
                                    className="flex items-center justify-center space-x-3 text-gray-200 backdrop-blur-sm bg-black/20 rounded-2xl px-6 py-4 border border-white/10 hover:border-blue-400/30 hover:bg-blue-500/5 transition-all duration-300 group"
                                >
                                    <Mail className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                                    <span className="font-medium group-hover:text-blue-300">{cardData.email}</span>
                                </a>
                            )}
                        </div>

                        {/* social links */}
                        {cardData.links && cardData.links.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-light text-gray-300 mb-4">connect with me</h2>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {cardData.links.map((link, index) => {
                                        // find the matching link type from your constants
                                        const linkTypeData = LINK_TYPES.find(lt => lt.value === link.type) || {
                                            icon: Link, // fallback icon
                                            color: 'text-gray-400', // fallback color
                                            label: link.label || 'Custom'
                                        };

                                        // Build full URL from username and template
                                        const displayUrl = linkTypeData.urlTemplate
                                            ? linkTypeData.urlTemplate.replace('{id}', link.url)
                                            : link.url;

                                        return (
                                            <a
                                                key={`${link.type}-${index}`} // type + index as unique key
                                                href={displayUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-2 backdrop-blur-sm bg-black/30 rounded-2xl px-4 py-3 border border-white/10 shadow-lg hover:border-white/20 transition-all duration-300 hover:scale-105 group"
                                            >
                                                <linkTypeData.icon className={`w-5 h-5 ${linkTypeData.color} group-hover:scale-110 transition-transform`} />
                                                <span className="text-sm text-gray-200 font-medium group-hover:text-white">
                                                    {link.label || linkTypeData.label}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* download contact button */}
                        <div className="mt-8">
                            <p className="text-sm text-gray-400 mb-4 font-light">
                                save contact information
                            </p>
                            <button
                                onClick={handleDownloadVCard}
                                className="flex items-center space-x-3 mx-auto px-6 py-3 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-blue-200 rounded-2xl transition-all duration-300 border border-blue-500/30 hover:border-purple-400/50"
                            >
                                <Download className="w-5 h-5" />
                                <span className="font-medium">save contact</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* powered by footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        powered by{' '}
                        <button
                            onClick={() => router.push('/')}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            quikard
                        </button>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default CardDisplayPage;