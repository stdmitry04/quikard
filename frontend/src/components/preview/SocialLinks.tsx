import React from 'react';
import { SocialLinksProps } from '@/types';

export const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
    if (links.length === 0) return null;

    // Helper function to build full URL from username and template
    const buildDisplayUrl = (url: string, urlTemplate?: string): string => {
        // If no template, URL is already complete (custom link)
        if (!urlTemplate) {
            return url;
        }
        // Build full URL from template and username
        return urlTemplate.replace('{id}', url);
    };

    return (
        <div className="flex flex-wrap justify-center gap-3">
            {links.map((link) => (
                <a
                    key={link.id}
                    href={buildDisplayUrl(link.url, link.urlTemplate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 backdrop-blur-sm bg-black/30 rounded-2xl px-4 py-3 border border-white/10 shadow-lg hover:border-white/20 transition-all duration-300 hover:scale-105"
                    aria-label={`Visit ${link.label} profile`}
                >
                    <link.icon
                        className={`w-5 h-5 ${link.color}`}
                        aria-hidden="true"
                    />
                    <span className="text-sm text-gray-200 font-medium">
            {link.label}
          </span>
                </a>
            ))}
        </div>
    );
};