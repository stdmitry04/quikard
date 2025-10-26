import React from 'react';
import {QRCodeSVG } from 'qrcode.react';

type QRCodePlaceholderProps = {
    seed?: string;
}

export const QRCodePlaceholder: React.FC<QRCodePlaceholderProps> = ({
                                                                        seed = 'my-seed',
                                                                    }) => {
    return (
        <div className="mt-8 text-center relative z-10">
            <p className="text-sm text-gray-400 mb-4 font-light">
                Scannable QR code for instant access
            </p>
            <div
                className="p-3 w-36 h-36 mx-auto backdrop-blur-sm bg-black/30 rounded-3xl border border-dashed border-white/20 flex items-center justify-center shadow-lg"
                role="img"
                aria-label="QR code placeholder - will be generated with actual business card data"
            >
                <QRCodeSVG value="" size={120} bgColor="#0f0f15" fgColor="#e5e7eb" />;
            </div>
        </div>
    );
};