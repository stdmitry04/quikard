'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Copy, Check, Download, AlertCircle, ExternalLink } from 'lucide-react';

const CardSuccessPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [copied, setCopied] = useState<boolean>(false);

    const slug = searchParams?.get('slug');
    const cardUrl = slug ? `${window.location.origin}/card/${slug}` : '';

    useEffect(() => {
        // Redirect if no slug provided
        if (!slug) {
            router.push('/');
        }
    }, [slug, router]);

    const handleCopyLink = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(cardUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    const handleDownloadWalletPass = (): void => {
        // TODO: Implement Apple Wallet pass download
        // This will be implemented when backend supports .pkpass generation
        console.log('Download Apple Wallet pass for slug:', slug);
        alert('Apple Wallet pass download will be implemented soon!');
    };

    const handleViewCard = (): void => {
        router.push(`/card/${slug}`);
    };

    if (!slug) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-gray-100 relative">
            {/* background ambient lighting */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-green-600/5 to-emerald-700/5 rounded-full blur-3xl" />
                <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-600/5 to-pink-700/5 rounded-full blur-3xl" />
            </div>

            <main className="max-w-3xl mx-auto px-6 py-16 relative">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                        <Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-4xl font-light text-gray-100 mb-4 tracking-wide">
                        Card Created Successfully!
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Your digital business card is ready to share
                    </p>
                </div>

                {/* Warning Banner */}
                <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 flex items-start space-x-4">
                    <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-amber-300 font-medium mb-2">Important: One-Time Access</h3>
                        <p className="text-amber-200/80 text-sm">
                            This is the only time you can download your Apple Wallet pass.
                            Make sure to save it before leaving this page. The link to your card will always be available.
                        </p>
                    </div>
                </div>

                {/* Main Actions Card */}
                <div className="backdrop-blur-xl bg-black/20 rounded-3xl p-10 border border-white/5 shadow-2xl mb-8">
                    {/* Card Link Section */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Your Card Link
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={cardUrl}
                                readOnly
                                className="flex-1 px-4 py-3 backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/30 font-mono text-sm"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center space-x-2 px-6 py-3 backdrop-blur-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-2xl transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/5 my-8"></div>

                    {/* Download Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-200 mb-4">
                            Download Options
                        </h3>

                        {/* Apple Wallet Button */}
                        <button
                            onClick={handleDownloadWalletPass}
                            className="w-full flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-black/30 hover:bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10">
                                    <Download className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-medium">Add to Apple Wallet</p>
                                    <p className="text-gray-400 text-sm">Download .pkpass file</p>
                                </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                        </button>

                        <p className="text-gray-500 text-xs text-center mt-4">
                            The Apple Wallet pass can only be downloaded from this page
                        </p>
                    </div>
                </div>

                {/* View Card Button */}
                <div className="text-center">
                    <button
                        onClick={handleViewCard}
                        className="px-8 py-4 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white rounded-2xl transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 font-medium"
                    >
                        View Your Card
                    </button>
                    <p className="text-gray-500 text-sm mt-4">
                        You can view and share your card anytime
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => router.push('/')}
                        className="text-gray-400 hover:text-gray-200 transition-colors text-sm"
                    >
                        Create another card
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CardSuccessPage;
