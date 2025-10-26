'use client'

import React, { useState } from 'react';
import { SocialLink } from '@/types';
import { useFormData } from '@/hooks/useFormData';
import { LINK_TYPES } from '@/constants/linkTypes';
import { cardApiService, CreateCardRequest } from '@/api/cardService';
import {useRouter} from "next/navigation";

// component imports
import { Header } from '@/components/layout/Header';
import { FormContainer } from '@/components/form/FormContainer';
import { ProfilePictureUpload } from '@/components/form/ProfilePictureUpload';
import { PersonalInfoForm } from '@/components/form/PersonalInfoForm';
import { LinksManager } from '@/components/links/LinksManager';
import { BusinessCardPreview } from '@/components/preview/BusinessCardPreview';
import { GradientButton } from '@/components/ui/GradientButton';

const QuiKard: React.FC = () => {
  const router = useRouter();
  const { formData, handleInputChange, handleImageUpload } = useFormData();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCreateCard = async (): Promise<void> => {
    setIsCreating(true);
    setError('');

    try {
      // validate that we have at least some data to create a card
      if (!isFormValid()) {
        throw new Error('please fill in at least one field to create your card');
      }

      // prepare the data for the api call
      const cardData: CreateCardRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        profilePicture: formData.profilePicture || undefined,
        links: links.map(link => ({
          type: link.type,
          url: link.url,
          label: link.label
        }))
      };

      // call the fastapi backend to create the card
      const response = await cardApiService.createCard(cardData);

      // redirect to the success page where user can download Apple Wallet pass and copy link
      router.push(`/card/success?slug=${response.slug}`);

    } catch (error) {
      console.error('error creating business card:', error);
      const errorMessage = error instanceof Error ? error.message : 'failed to create card - please try again';
      setError(errorMessage);
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

                {error && (
                    <div className="backdrop-blur-md bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                      <p className="text-center text-red-400 text-sm">
                        {error}
                      </p>
                    </div>
                )}

                {!isFormValid() && !error && (
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