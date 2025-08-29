import React, { useState, ChangeEvent } from 'react';
import { AddLinkFormProps } from '@/types';

export const AddLinkForm: React.FC<AddLinkFormProps> = ({
                                                            linkTypes,
                                                            onAdd,
                                                            onCancel
                                                        }) => {
    const [newLinkType, setNewLinkType] = useState<string>('custom');
    const [newLinkUrl, setNewLinkUrl] = useState<string>('');
    const [isUrlValid, setIsUrlValid] = useState<boolean>(true);

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleAdd = (): void => {
        const trimmedUrl = newLinkUrl.trim();

        if (!trimmedUrl) {
            return;
        }

        if (!validateUrl(trimmedUrl)) {
            setIsUrlValid(false);
            return;
        }

        const linkTypeData = linkTypes.find(type => type.value === newLinkType);
        if (linkTypeData) {
            onAdd({
                id: Date.now(),
                type: newLinkType,
                url: trimmedUrl,
                ...linkTypeData
            });
            setNewLinkUrl('');
            setIsUrlValid(true);
            onCancel();
        }
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setNewLinkType(e.target.value);
    };

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const url = e.target.value;
        setNewLinkUrl(url);
        if (!isUrlValid && url.trim()) {
            setIsUrlValid(validateUrl(url.trim()));
        }
    };

    const handleCancel = (): void => {
        setNewLinkUrl('');
        setIsUrlValid(true);
        onCancel();
    };

    return (
        <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-2xl p-6 mt-4 shadow-lg">
            <div className="space-y-4">
                <div>
                    <label htmlFor="link-type-select" className="block text-sm font-medium text-gray-300 mb-2">
                        Platform Type
                    </label>
                    <select
                        id="link-type-select"
                        value={newLinkType}
                        onChange={handleSelectChange}
                        className="w-full px-4 py-3 backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                    >
                        {linkTypes.map(type => (
                            <option key={type.value} value={type.value} className="bg-gray-900">
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="link-url-input" className="block text-sm font-medium text-gray-300 mb-2">
                        URL
                    </label>
                    <input
                        id="link-url-input"
                        type="url"
                        value={newLinkUrl}
                        onChange={handleUrlChange}
                        placeholder="https://..."
                        className={`w-full px-4 py-3 backdrop-blur-sm bg-black/40 border rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            isUrlValid
                                ? 'border-white/10 focus:ring-blue-400/30 focus:border-blue-400/30'
                                : 'border-red-400/50 focus:ring-red-400/30 focus:border-red-400/50'
                        }`}
                        aria-invalid={!isUrlValid}
                        aria-describedby={!isUrlValid ? "url-error" : undefined}
                    />
                    {!isUrlValid && (
                        <p id="url-error" className="text-red-400 text-sm mt-1">
                            Please enter a valid URL (e.g., https://example.com)
                        </p>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleAdd}
                        disabled={!newLinkUrl.trim()}
                        className="flex-1 px-6 py-3 backdrop-blur-sm bg-transparent hover:bg-blue-500/10 rounded-2xl text-blue-400 hover:text-blue-300 font-medium transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                    >
                        Add Link
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 backdrop-blur-sm bg-transparent hover:bg-white/5 rounded-2xl text-gray-400 hover:text-gray-300 font-medium transition-all duration-300 border border-white/20 hover:border-white/30"
                        type="button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};