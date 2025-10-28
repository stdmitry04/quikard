import React from 'react';
import { BusinessCardPreviewProps } from '@/types';
import { ContactInfo } from './ContactInfo';
import { SocialLinks } from './SocialLinks';
import { Download } from 'lucide-react';
import { downloadVCard } from '@/utils/vcard';
import Image from 'next/image'

export const BusinessCardPreview: React.FC<BusinessCardPreviewProps> = ({
                                                                            formData,
                                                                            links
                                                                        }) => {
    const displayName = formData.firstName || formData.lastName
        ? `${formData.firstName || ''} ${formData.lastName || ''}`.trim()
        : 'John Doe';

    const displayPhone = formData.phone || '+1 (555) 123-4567';
    const displayEmail = formData.email || 'john.doe@example.com';

    const handleDownloadPreview = async (): Promise<void> => {
        // Create a CardData-like object from the preview data
        const previewCardData = {
            firstName: formData.firstName || 'John',
            lastName: formData.lastName || 'Doe',
            email: formData.email || null,
            phone: formData.phone || null,
            profilePicture: formData.profilePicture,
            links: links.map(link => ({
                type: link.type,
                url: link.url,
                label: link.label
            })),
            createdAt: new Date().toISOString(),
            qrCodeUrl: null
        };

        await downloadVCard(previewCardData);
    };

    const isFormFilled = formData.firstName || formData.lastName || formData.email || formData.phone;

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
                            <Image
                                src={formData.profilePicture || ""}
                                alt={`Profile picture of ${displayName}`}
                                width={112}
                                height={112}
                                className="w-28 h-28 rounded-full mx-auto object-cover border border-white/20 shadow-2xl"
                                unoptimized={formData.profilePicture.startsWith('data:image/')}
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

            {/* Download Contact Button */}
            <div className="mt-8 text-center relative z-10">
                <p className="text-sm text-gray-400 mb-4 font-light">
                    Preview your contact information
                </p>
                <button
                    onClick={handleDownloadPreview}
                    disabled={!isFormFilled}
                    className="flex items-center space-x-3 mx-auto px-6 py-3 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-blue-200 rounded-2xl transition-all duration-300 border border-blue-500/30 hover:border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500/20 disabled:hover:to-purple-500/20 disabled:hover:border-blue-500/30"
                    title={!isFormFilled ? 'Fill in some information to download' : 'Download contact information'}
                >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Download Contact</span>
                </button>
                {!isFormFilled && (
                    <p className="text-xs text-gray-500 mt-2">
                        Fill in at least one field to enable download
                    </p>
                )}
            </div>
        </div>
    );
};