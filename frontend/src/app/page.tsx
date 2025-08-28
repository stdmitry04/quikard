'use client'

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react'
import CardPreview from '@/components/CardPreview'
import FormSection from '@/components/FormSection'
import Header from '@/components/Header'
import Features from '@/components/Features'
import '@/styles/globals.css'
import { CardData } from '@/types/'

export default function Page() {
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    avatar: null,
    style: 'minimal'
  })

  const [isGenerating, setIsGenerating] = useState(false)

  const updateField = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCardData(prev => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const generateCard = async () => {
    setIsGenerating(true)
    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsGenerating(false)
    // In a real app, this would trigger download or further processing
    alert('Card generated! In a real app, download options would appear here.')
  }

  return (
      <div className="min-h-screen bg-dark relative overflow-x-hidden">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -top-48 -right-48" />
          <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -bottom-48 -left-48" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <Header />

            {/* Main Grid */}
            <div className="grid lg:grid-cols-1 gap-8 items-start">
              <FormSection
                  cardData={cardData}
                  updateField={updateField}
                  handleAvatarUpload={handleAvatarUpload}
                  generateCard={generateCard}
                  isGenerating={isGenerating}
              />

              <div className="space-y-8">
                <CardPreview cardData={cardData} />
                <Features />
              </div>
            </div>

            {/* Footer */}
            <footer className="text-center mt-12 text-sm text-gray-500">
              <p>2024 QuickCard. Create beautiful business cards instantly.</p>
            </footer>
          </div>
        </div>
      </div>
  )
}