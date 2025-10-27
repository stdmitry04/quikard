import React from 'react';
import { Upload } from 'lucide-react';
import { ProfilePictureUploadProps } from '@/types';
import Image from 'next/image'

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
                                                                              profilePicture,
                                                                              onImageUpload
                                                                          }) => {
    return (
        <div className="text-center">
            <label className="block text-sm font-medium text-gray-300 mb-4">
                Profile Picture
            </label>
            <div className="flex flex-col items-center space-y-4">
                {profilePicture ? (
                    <Image
                        src={profilePicture || ""}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border border-white/20 shadow-2xl"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full backdrop-blur-sm bg-black/40 border border-dashed border-white/20 flex items-center justify-center shadow-xl">
                        <Upload className="w-10 h-10 text-gray-500" aria-hidden="true" />
                    </div>
                )}
                <label className="cursor-pointer backdrop-blur-sm bg-transparent hover:bg-white/5 px-6 py-3 rounded-2xl transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 shadow-lg group">
          <span className="text-gray-300 group-hover:text-white transition-colors">
            Choose Photo
          </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className="hidden"
                        aria-label="Upload profile picture"
                    />
                </label>
            </div>
        </div>
    );
};