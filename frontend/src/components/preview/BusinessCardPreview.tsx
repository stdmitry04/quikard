import React from 'react';
import { BusinessCardPreviewProps } from '@/types';
import { ContactInfo } from './ContactInfo';
import { SocialLinks } from './SocialLinks';
import { QRCodePlaceholder } from './QRCodePlaceholder';

export const BusinessCardPreview: React.FC<BusinessCardPreviewProps> = ({
                                                                            formData,
                                                                            links
                                                                        }) => {
    const displayName = formData.firstName || formData.lastName
        ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
        : 'John Doe';

    const displayPhone = formData.phone || '+1 (555) 123-4567';
    const displayEmail = formData.email || 'john.doe@example.com';

    return (
        <div className="backdrop-blur-xl bg-black/20 rounded-3xl p-10 border border-white/5 shadow-2xl relative overflow-hidden">
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <h3 className="text-2xl font-light mb-8 text-gray-100 relative z-10 text-center">
                Live Preview
            </h3>

            {/* business card */}
            <div className="backdrop-blur-md bg-gradient-to-br from-black/40 to-black/60 rounded-3xl p-10 border border-white/10 shadow-2xl relative z-10 overflow-hidden">
                {/* inner subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-purple-500/[0.02] to-pink-500/[0.02] pointer-events-none" />

                <div className="text-center relative z-10">
                    {/* profile picture */}
                    <div className="mb-8">
                        {formData.profilePicture ? (
                            <img
                                src={formData.profilePicture}
                                alt={`Profile picture of ${displayName}`}
                                className="w-28 h-28 rounded-full mx-auto object-cover border border-white/20 shadow-2xl"
                            />
                        ) : (
                            <div
                                className="w-28 h-28 rounded-full mx-auto backdrop-blur-sm bg-black/40 border border-dashed border-white/20 flex items-center justify-center shadow-xl"
                                role="img"
                                aria-label="No profile picture uploaded"
                            >
                                <span className="text-gray-500 text-xs">No Photo</span>
                            </div>
                        )}
                    </div>

                    {/* name */}
                    <h4 className="text-3xl font-light text-gray-100 mb-6 tracking-wide">
                        {displayName}
                    </h4>

                    <ContactInfo
                        phone={displayPhone}
                        email={displayEmail}
                    />

                    <SocialLinks links={links} />
                </div>
            </div>

            <QRCodePlaceholder />
        </div>
    );
};