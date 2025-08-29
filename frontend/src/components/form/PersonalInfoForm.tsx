import React from 'react';
import { PersonalInfoFormProps } from '@/types';
import { FormInput } from '../ui/FormInput';

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
                                                                      formData,
                                                                      onInputChange
                                                                  }) => {
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
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
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