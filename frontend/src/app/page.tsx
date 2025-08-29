'use client'

import React, { useState } from 'react';
import { SocialLink } from '@/types';
import { useFormData } from '@/hooks/useFormData';
import { LINK_TYPES } from '@/constants/linkTypes';

// component imports
import { Header } from '@/components/layout/Header';
import { FormContainer } from '@/components/form/FormContainer';
import { ProfilePictureUpload } from '@/components/form/ProfilePictureUpload';
import { PersonalInfoForm } from '@/components/form/PersonalInfoForm';
import { LinksManager } from '@/components/links/LinksManager';
import { BusinessCardPreview } from '@/components/preview/BusinessCardPreview';
import { GradientButton } from '@/components/ui/GradientButton';

const QuiKard: React.FC = () => {
  const { formData, handleInputChange, handleImageUpload } = useFormData();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreateCard = async (): Promise<void> => {
    setIsCreating(true);

    // simulate api call or processing time
    try {
      // here you would typically:
      // 1. validate all form data
      // 2. generate QR code
      // 3. save to database
      // 4. create shareable link

      console.log('creating card with:', {
        formData,
        links,
        timestamp: new Date().toISOString()
      });

      // simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // success feedback could go here
      alert('Business card created successfully!');

    } catch (error) {
      console.error('Error creating business card:', error);
      alert('Error creating business card. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid = (): boolean => {
    return !!(
        formData.firstName.trim() ||
        formData.lastName.trim() ||
        formData.email.trim() ||
        formData.phone.trim()
    );
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-gray-100 relative">
        {/* background ambient lighting elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-600/5 to-purple-700/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-600/5 to-blue-700/5 rounded-full blur-3xl" />
        </div>

        <Header />

        <main className="max-w-6xl mx-auto px-6 py-16 relative">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* form section */}
            <section aria-label="Business card information form">
              <div className="space-y-10">
                <FormContainer>
                  <ProfilePictureUpload
                      profilePicture={formData.profilePicture}
                      onImageUpload={handleImageUpload}
                  />

                  <PersonalInfoForm
                      formData={formData}
                      onInputChange={handleInputChange}
                  />

                  <LinksManager
                      links={links}
                      onLinksChange={setLinks}
                      linkTypes={LINK_TYPES}
                  />
                </FormContainer>

                <GradientButton
                    onClick={handleCreateCard}
                    className="w-full"
                >
                  {isCreating ? 'Creating Your Card...' : 'Create My Digital Business Card'}
                </GradientButton>

                {!isFormValid() && (
                    <p className="text-center text-gray-400 text-sm">
                      Fill in at least one field to create your business card
                    </p>
                )}
              </div>
            </section>

            {/* preview section */}
            <aside
                className="lg:sticky lg:top-8"
                aria-label="Business card preview"
            >
              <BusinessCardPreview
                  formData={formData}
                  links={links}
              />
            </aside>
          </div>
        </main>
      </div>
  );
};

export default QuiKard;