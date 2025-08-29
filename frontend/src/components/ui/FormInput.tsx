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
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full px-5 py-4 backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-${focusColor}/30 focus:border-${focusColor}/30 text-gray-100 placeholder-gray-500 shadow-lg transition-all duration-300`}
                placeholder={placeholder}
                autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
            />
        </div>
    );
};