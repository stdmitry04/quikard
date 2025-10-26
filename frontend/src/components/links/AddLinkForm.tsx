import React, { useState, ChangeEvent } from 'react';
import { AddLinkFormProps } from '@/types';

export const AddLinkForm: React.FC<AddLinkFormProps> = ({
                                                            linkTypes,
                                                            onAdd,
                                                            onCancel
                                                        }) => {
    const [newLinkType, setNewLinkType] = useState<string>('custom');
    const [newLinkInput, setNewLinkInput] = useState<string>('');
    const [isInputValid, setIsInputValid] = useState<boolean>(true);

    const getSelectedLinkType = () => linkTypes.find(type => type.value === newLinkType);

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateUsername = (username: string): boolean => {
        // Basic validation: no spaces, no special chars except dash, underscore, dot
        // This ensures NO full URLs can be stored (rejects /, :, etc.)
        return /^[a-zA-Z0-9._-]+$/.test(username.trim());
    };

    const handleAdd = (): void => {
        const trimmedInput = newLinkInput.trim();

        if (!trimmedInput) {
            return;
        }

        const linkTypeData = getSelectedLinkType();
        if (!linkTypeData) return;

        let urlValue: string;

        // If this link type has a URL template, store just the username
        if (linkTypeData.urlTemplate) {
            if (!validateUsername(trimmedInput)) {
                setIsInputValid(false);
                return;
            }
            // Store just the username/ID, not the full URL
            urlValue = trimmedInput;

            // Extra safety check: ensure we're not accidentally storing a URL
            if (urlValue.includes('://') || urlValue.includes('//') || urlValue.includes('/')) {
                console.error('❌ Attempted to store full URL instead of username:', urlValue);
                setIsInputValid(false);
                return;
            }
        } else {
            // For custom links, validate and store as full URL
            if (!validateUrl(trimmedInput)) {
                setIsInputValid(false);
                return;
            }
            urlValue = trimmedInput;
        }

        const newLink = {
            id: Date.now(),
            type: newLinkType,
            url: urlValue, // Store username for templated links, full URL for custom
            ...linkTypeData
        };

        console.log('➕ Adding link:', newLink);
        console.log('   - Has urlTemplate:', !!linkTypeData.urlTemplate);
        console.log('   - Storing url value:', urlValue);

        onAdd(newLink);
        setNewLinkInput('');
        setIsInputValid(true);
        onCancel();
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setNewLinkType(e.target.value);
        setNewLinkInput(''); // Clear input when switching types
        setIsInputValid(true);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        console.log('🔤 Input changed:', value);
        setNewLinkInput(value);

        // Reset validation error when user starts typing
        if (!isInputValid && value.trim()) {
            setIsInputValid(true);
        }
    };

    const handleCancel = (): void => {
        setNewLinkInput('');
        setIsInputValid(true);
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
                        style={{
                            appearance: "none",
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "calc(100% - 5px) center", // 👈 move arrow 30px left
                            backgroundSize: "1rem",
                        }}
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
                        {getSelectedLinkType()?.urlTemplate ? 'Username / ID' : 'URL'}
                    </label>
                    <input
                        id="link-url-input"
                        type={getSelectedLinkType()?.urlTemplate ? 'text' : 'url'}
                        value={newLinkInput}
                        onChange={handleInputChange}
                        placeholder={getSelectedLinkType()?.placeholder || 'https://...'}
                        className={`w-full px-4 py-3 backdrop-blur-sm bg-black/40 border rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            isInputValid
                                ? 'border-white/10 focus:ring-blue-400/30 focus:border-blue-400/30'
                                : 'border-red-400/50 focus:ring-red-400/30 focus:border-red-400/50'
                        }`}
                        aria-invalid={!isInputValid}
                        aria-describedby={!isInputValid ? "url-error" : undefined}
                    />
                    {!isInputValid && (
                        <p id="url-error" className="text-red-400 text-sm mt-1">
                            {getSelectedLinkType()?.urlTemplate
                                ? 'Please enter only your username (not the full URL). Only letters, numbers, dots, dashes, and underscores are allowed.'
                                : 'Please enter a valid URL (e.g., https://example.com)'}
                        </p>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleAdd}
                        disabled={!newLinkInput.trim()}
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