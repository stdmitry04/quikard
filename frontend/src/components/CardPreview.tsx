import React from 'react'
import { CardData } from '@/types/'

interface CardPreviewProps {
    cardData: CardData
}

export default function CardPreview({ cardData }: CardPreviewProps) {
    const getCardStyle = () => {
        switch (cardData.style) {
            case 'gradient':
                return 'bg-gradient-to-br from-purple-600/20 to-pink-600/20'
            case 'dark':
                return 'bg-gray-900/50'
            default:
                return ''
        }
    }

    const hasContacts = cardData.email || cardData.phone || cardData.linkedin || cardData.website

    return (
        <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Live Preview</h2>

            <div className={`card-preview ${getCardStyle()} animate-float`}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                            {cardData.name || 'Your Name'}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {cardData.title || 'Your Title'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {cardData.company || 'Company'}
                        </p>
                    </div>

                    <div className="avatar-container">
                        {cardData.avatar ? (
                            <img
                                src={cardData.avatar}
                                alt="Avatar"
                                className="w-16 h-16 rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {hasContacts && (
                    <div className="flex flex-wrap gap-2">
                        {cardData.email && (
                            <span className="contact-pill">
                <span className="text-xs">📧</span> {cardData.email}
              </span>
                        )}
                        {cardData.phone && (
                            <span className="contact-pill">
                <span className="text-xs">📱</span> {cardData.phone}
              </span>
                        )}
                        {cardData.linkedin && (
                            <span className="contact-pill">
                <span className="text-xs">💼</span> LinkedIn
              </span>
                        )}
                        {cardData.website && (
                            <span className="contact-pill">
                <span className="text-xs">🌐</span> {cardData.website}
              </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}