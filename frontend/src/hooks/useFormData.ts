import { useState, ChangeEvent } from 'react';
import { FormData, UseFormDataReturn } from '@/types';

export const useFormData = (): UseFormDataReturn => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        profilePicture: null
    });

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            // validate file size - max 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert('File too large. Please choose an image under 5MB.');
                return;
            }

            // validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setFormData(prev => ({ ...prev, profilePicture: result }));
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    };

    return {
        formData,
        handleInputChange,
        handleImageUpload
    };
};