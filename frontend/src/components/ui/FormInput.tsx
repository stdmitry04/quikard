import React from 'react';
import { FormInputProps } from '@/types';

export const FormInput: React.FC<FormInputProps> = ({
                                                        label,
                                                        type = "text",
                                                        value,
                                                        onChange,
                                                        placeholder,
                                                        focusColor = "blue-400"
                                                    }) => {
    const isFilled = value && value.trim().length > 0;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full px-5 py-4 backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl focus:outline-none text-gray-100 placeholder-gray-500 shadow-lg transition-all duration-300 autofill:bg-black/40 autofill:text-gray-100 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0.4)] ${
                    !isFilled ? `focus:ring-2 focus:ring-${focusColor}/30 focus:border-${focusColor}/30` : ''
                }`}
                placeholder={placeholder}
                autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
            />
        </div>
    );
};