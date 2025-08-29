import React from 'react';
import { GradientButtonProps } from '@/types';

export const GradientButton: React.FC<GradientButtonProps> = ({
                                                                  children,
                                                                  onClick,
                                                                  className = ""
                                                              }) => {
    return (
        <button
            onClick={onClick}
            className={`backdrop-blur-xl bg-transparent hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-pink-500/10 text-white font-semibold py-5 px-10 rounded-3xl transition-all duration-500 transform hover:scale-[1.01] shadow-2xl border-2 border-transparent bg-clip-padding relative overflow-hidden group ${className}`}
            type="button"
        >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 p-[2px]">
                <div className="h-full w-full rounded-3xl bg-black/50 backdrop-blur-xl"></div>
            </div>
            <span className="relative z-10 text-lg">{children}</span>
        </button>
    );
};