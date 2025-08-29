import React from 'react';

export const QRCodePlaceholder: React.FC = () => {
    return (
        <div className="mt-8 text-center relative z-10">
            <p className="text-sm text-gray-400 mb-4 font-light">
                Scannable QR code for instant access
            </p>
            <div
                className="w-36 h-36 mx-auto backdrop-blur-sm bg-black/30 rounded-3xl border border-dashed border-white/20 flex items-center justify-center shadow-lg"
                role="img"
                aria-label="QR code placeholder - will be generated with actual business card data"
            >
                <div className="w-24 h-24 backdrop-blur-sm bg-white/10 rounded-2xl grid grid-cols-8 gap-px p-2 shadow-inner">
                    {/* generate qr code pattern with consistent seed for demo */}
                    {Array.from({ length: 64 }).map((_, i) => {
                        // use index-based pattern for consistent appearance
                        const isFilledCell = (i + Math.floor(i / 8)) % 3 !== 0;
                        return (
                            <div
                                key={i}
                                className={`${isFilledCell ? 'bg-white/60' : 'bg-white/10'} rounded-sm`}
                                aria-hidden="true"
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};