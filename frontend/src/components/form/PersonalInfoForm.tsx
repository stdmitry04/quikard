import React from 'react';
import { PersonalInfoFormProps } from '@/types';
import { FormInput } from '../ui/FormInput';

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
                                                                      formData,
                                                                      onInputChange
                                                                  }) => {
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // If the value doesn't start with "+1 ", ensure it does
        if (!value.startsWith('+1 ')) {
            // If user is deleting and tries to remove "+1 ", keep it
            if (value.length < 3) {
                value = '+1 ';
            } else if (!value.startsWith('+1')) {
                value = '+1 ' + value;
            }
        }

        onInputChange('phone', value);
    };

    return (
        <div className="space-y-8">
            {/* name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => onInputChange('firstName', e.target.value)}
                    placeholder="John"
                />
                <FormInput
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => onInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                />
            </div>

            {/* contact fields */}
            <FormInput
                label="Phone Number"
                type="tel"
                value={formData.phone || '+1 '}
                onChange={handlePhoneChange}
                placeholder="+1 (555) 123-4567"
                focusColor="green-400"
            />

            <FormInput
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                placeholder="john.doe@example.com"
                focusColor="purple-400"
            />
        </div>
    );
};