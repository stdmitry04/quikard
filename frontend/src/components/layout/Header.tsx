import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="relative backdrop-blur-xl bg-black/40 border-b border-white/5 shadow-2xl">
            <div className="max-w-6xl mx-auto px-6 py-8 text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    QuiKard
                </h1>
                <p className="text-gray-400 text-lg">
                    Create your digital business card within <span className="font-bold">1 minute</span> • no signup required
                </p>
            </div>
        </header>
    );
};