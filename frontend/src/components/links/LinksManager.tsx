import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { LinksManagerProps, SocialLink } from '@/types';
import { LinkItem } from './LinkItem';
import { AddLinkForm } from './AddLinkForm';

export const LinksManager: React.FC<LinksManagerProps> = ({
                                                              links,
                                                              onLinksChange,
                                                              linkTypes
                                                          }) => {
    const [showLinkInput, setShowLinkInput] = useState<boolean>(false);

    const addLink = (newLink: SocialLink): void => {
        const updatedLinks = [...links, newLink];
        console.log('📝 Links array updated:', updatedLinks);
        onLinksChange(updatedLinks);
    };

    const removeLink = (id: number): void => {
        onLinksChange(links.filter(link => link.id !== id));
    };

    const toggleLinkInput = (): void => {
        setShowLinkInput(!showLinkInput);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-300">
                    Social Links
                </label>
                {links.length > 0 && (
                    <span className="text-xs text-gray-500">
            {links.length} link{links.length !== 1 ? 's' : ''}
          </span>
                )}
            </div>

            {/* existing links */}
            <div className="space-y-0">
                {links.map((link) => (
                    <LinkItem key={link.id} link={link} onRemove={removeLink} />
                ))}
            </div>

            {/* add link button */}
            {!showLinkInput && (
                <button
                    onClick={toggleLinkInput}
                    className="flex items-center justify-center space-x-2 w-full text-blue-400 hover:text-blue-300 transition-all duration-300 backdrop-blur-sm bg-transparent rounded-2xl px-6 py-4 border border-blue-500/30 hover:border-blue-400/50 hover:bg-blue-500/5 mt-3"
                    type="button"
                >
                    <Plus className="w-5 h-5" aria-hidden="true" />
                    <span className="font-medium">Add Social Link</span>
                </button>
            )}

            {/* link input form */}
            {showLinkInput && (
                <AddLinkForm
                    linkTypes={linkTypes}
                    onAdd={addLink}
                    onCancel={() => setShowLinkInput(false)}
                />
            )}
        </div>
    );
};