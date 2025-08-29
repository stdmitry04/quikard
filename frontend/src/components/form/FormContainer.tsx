import React from 'react';
import { FormContainerProps } from '@/types';

export const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
    return (
        <div className="backdrop-blur-xl bg-black/20 rounded-3xl p-10 border border-white/5 shadow-2xl relative overflow-hidden">
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <h2 className="text-2xl font-light mb-8 text-gray-100 relative z-10 text-center">
                Your Information
            </h2>

            <div className="space-y-8 relative z-10">
                {children}
            </div>
        </div>
    );
};