import React, { useRef, useState } from 'react';
import { CardData } from '@/types/'

interface FormSectionProps {
    cardData: CardData
    updateField: (field: keyof CardData, value: string) => void
    handleAvatarUpload: (file: File) => void
    generateCard: () => void
    isGenerating: boolean
}

export default function FormSection({
                                        cardData,
                                        updateField,
                                        handleAvatarUpload,
                                        generateCard,
                                        isGenerating
                                    }: FormSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileUpload(files[0])
        }
    }

    const handleFileUpload = (file: File) => {
        if (file.type.startsWith('image/')) {
            handleAvatarUpload(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Create Your Card</h2>

            <div className="space-y-5">
                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={cardData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="input-neumorphic"
                    />
                </div>

                {/* Job Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Title
                    </label>
                    <input
                        type="text"
                        placeholder="Product Designer"
                        value={cardData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        className="input-neumorphic"
                    />
                </div>

                {/* Company */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company
                    </label>
                    <input
                        type="text"
                        placeholder="TechCorp Inc."
                        value={cardData.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        className="input-neumorphic"
                    />
                </div>

                {/* Avatar Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Avatar (Optional)
                    </label>
                    <div
                        className={`upload-area ${isDragging ? 'border-blue-400' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {uploadedImage ? (
                            <>
                                <img
                                    src={uploadedImage}
                                    alt="Avatar"
                                    className="w-20 h-20 mx-auto rounded-xl mb-2 object-cover"
                                />
                                <p className="text-xs text-green-400">Image uploaded!</p>
                            </>
                        ) : (
                            <>
                                <svg className="w-12 h-12 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-400 mb-1">
                                    Drop your image here or click to browse
                                </p>
                                <p className="text-xs text-gray-600">PNG, JPG up to 5MB</p>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        />
                    </div>
                </div>

                {/* Social Links */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Contact & Social
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={cardData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className="input-neumorphic"
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={cardData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            className="input-neumorphic"
                        />
                        <input
                            type="text"
                            placeholder="LinkedIn"
                            value={cardData.linkedin}
                            onChange={(e) => updateField('linkedin', e.target.value)}
                            className="input-neumorphic"
                        />
                        <input
                            type="url"
                            placeholder="Website"
                            value={cardData.website}
                            onChange={(e) => updateField('website', e.target.value)}
                            className="input-neumorphic"
                        />
                    </div>
                </div>

                {/* Card Style */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card Style
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => updateField('style', 'minimal')}
                            className={`style-btn ${cardData.style === 'minimal' ? 'neumorphic-pressed text-blue-400' : 'neumorphic'}`}
                        >
                            Minimal
                        </button>
                        <button
                            onClick={() => updateField('style', 'gradient')}
                            className={`style-btn ${cardData.style === 'gradient' ? 'neumorphic-pressed text-purple-400' : 'neumorphic'}`}
                        >
                            Gradient
                        </button>
                        <button
                            onClick={() => updateField('style', 'dark')}
                            className={`style-btn ${cardData.style === 'dark' ? 'neumorphic-pressed text-pink-400' : 'neumorphic'}`}
                        >
                            Dark
                        </button>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generateCard}
                    disabled={isGenerating}
                    className="btn-primary w-full"
                >
                    {isGenerating ? (
                        <span className="animate-pulse">Generating...</span>
                    ) : (
                        'Generate Business Card'
                    )}
                </button>
            </div>
        </div>
    )
}