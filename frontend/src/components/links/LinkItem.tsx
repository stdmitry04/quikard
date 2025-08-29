import React from 'react';
import { LinkItemProps } from '@/types';

export const LinkItem: React.FC<LinkItemProps> = ({ link, onRemove }) => {
    return (
        <div className="flex items-center justify-between backdrop-blur-sm bg-black/20 border border-white/10 rounded-2xl p-4 mb-3 shadow-lg">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                <link.icon
                    className={`w-5 h-5 ${link.color} flex-shrink-0`}
                    aria-hidden="true"
                />
                <span className="text-gray-200 font-medium flex-shrink-0">
          {link.label}
        </span>
                <span className="text-gray-500 text-sm truncate">
          {link.url}
        </span>
            </div>
            <button
                onClick={() => onRemove(link.id)}
                className="text-red-400 hover:text-red-300 text-sm transition-colors px-3 py-1 rounded-lg hover:bg-red-500/10 flex-shrink-0 ml-2"
                type="button"
                aria-label={`Remove ${link.label} link`}
            >
                Remove
            </button>
        </div>
    );
};