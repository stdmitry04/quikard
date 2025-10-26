import { LucideIcon } from 'lucide-react';
import { ChangeEvent } from 'react';

// core data types
export interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    profilePicture: string | null;
}

export interface CardData {
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    profilePicture: string | null;
    links: Array<{
        type: string;
        url: string;
        label: string;
    }>;
    createdAt: string;
    qrCodeUrl: string | null;
}

export interface LinkType {
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
    urlTemplate?: string; // e.g., "https://instagram.com/{id}" - if present, user enters ID instead of full URL
    placeholder?: string; // e.g., "your-username"
}

export interface SocialLink extends LinkType {
    id: number;
    type: string;
    url: string;
}

// component prop types
export interface FormInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    focusColor?: string;
}

export interface GradientButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export interface ProfilePictureUploadProps {
    profilePicture: string | null;
    onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface PersonalInfoFormProps {
    formData: FormData;
    onInputChange: (field: keyof FormData, value: string) => void;
}

export interface LinkItemProps {
    link: SocialLink;
    onRemove: (id: number) => void;
}

export interface AddLinkFormProps {
    linkTypes: LinkType[];
    onAdd: (link: SocialLink) => void;
    onCancel: () => void;
}

export interface LinksManagerProps {
    links: SocialLink[];
    onLinksChange: (links: SocialLink[]) => void;
    linkTypes: LinkType[];
}

export interface ContactInfoProps {
    phone?: string;
    email?: string;
}

export interface SocialLinksProps {
    links: SocialLink[];
}

export interface BusinessCardPreviewProps {
    formData: FormData;
    links: SocialLink[];
}

export interface FormContainerProps {
    children: React.ReactNode;
}

// hook return types
export interface UseFormDataReturn {
    formData: FormData;
    handleInputChange: (field: keyof FormData, value: string) => void;
    handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}