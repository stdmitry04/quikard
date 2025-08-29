import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { ContactInfoProps } from '@/types';

export const ContactInfo: React.FC<ContactInfoProps> = ({ phone, email }) => {
    if (!phone && !email) return null;

    return (
        <div className="space-y-4 mb-8">
            {phone && (
                <div className="flex items-center justify-center space-x-3 text-gray-200 backdrop-blur-sm bg-black/20 rounded-2xl px-4 py-3 border border-white/10">
                    <Phone
                        className="w-5 h-5 text-green-400 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <a
                        href={`tel:${phone}`}
                        className="text-sm font-medium hover:text-green-400 transition-colors"
                        aria-label={`Call ${phone}`}
                    >
                        {phone}
                    </a>
                </div>
            )}
            {email && (
                <div className="flex items-center justify-center space-x-3 text-gray-200 backdrop-blur-sm bg-black/20 rounded-2xl px-4 py-3 border border-white/10">
                    <Mail
                        className="w-5 h-5 text-blue-400 flex-shrink-0"
                        aria-hidden="true"
                    />
                    <a
                        href={`mailto:${email}`}
                        className="text-sm font-medium hover:text-blue-400 transition-colors"
                        aria-label={`Email ${email}`}
                    >
                        {email}
                    </a>
                </div>
            )}
        </div>
    );
};