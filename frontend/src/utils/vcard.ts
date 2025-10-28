import { CardData } from '@/types';
import { LINK_TYPES } from '@/constants/linkTypes';

/**
 * Converts an image URL to base64 format
 */
async function imageUrlToBase64(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Failed to convert image to base64:', error);
        return null;
    }
}

/**
 * Generates a vCard (VCF) file content from card data
 * Includes name, email, phone, and social media links as URLs
 */
export async function generateVCard(cardData: CardData): Promise<string> {
    const lines: string[] = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${cardData.firstName} ${cardData.lastName}`,
        `N:${cardData.lastName};${cardData.firstName};;;`,
    ];

    // Add email if present
    if (cardData.email) {
        lines.push(`EMAIL:${cardData.email}`);
    }

    // Add phone if present
    if (cardData.phone) {
        lines.push(`TEL:${cardData.phone}`);
    }

    // Add profile picture if present (as PHOTO field with base64 encoding)
    if (cardData.profilePicture) {
        let profilePictureData = cardData.profilePicture;

        // If it's a URL (not base64), convert it to base64
        if (!profilePictureData.startsWith('data:image/')) {
            // Construct full URL if it's a relative path
            const imageUrl = profilePictureData.startsWith('http')
                ? profilePictureData
                : `${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8000'}/uploads/${profilePictureData}`;

            const base64Image = await imageUrlToBase64(imageUrl);
            if (base64Image) {
                profilePictureData = base64Image;
            }
        }

        // Now process the base64 data
        if (profilePictureData.startsWith('data:image/')) {
            // Extract the image type and base64 data
            const matches = profilePictureData.match(/^data:image\/([^;]+);base64,(.+)$/);

            if (matches) {
                const imageType = matches[1].toUpperCase(); // e.g., JPEG, PNG
                const base64Data = matches[2];

                // Use ENCODING=b for embedded base64 (VCF 3.0 format)
                // Split long base64 strings into multiple lines (max 75 chars per line per VCF spec)
                const base64Lines = base64Data.match(/.{1,75}/g) || [base64Data];
                const formattedBase64 = base64Lines.join('\r\n '); // Continue lines with space

                lines.push(`PHOTO;ENCODING=b;TYPE=${imageType}:${formattedBase64}`);
            } else {
                // Fallback to URI value if format doesn't match
                lines.push(`PHOTO;VALUE=URI:${profilePictureData}`);
            }
        }
    }

    // Add social links as URL fields with labels
    if (cardData.links && cardData.links.length > 0) {
        cardData.links.forEach(link => {
            const linkTypeData = LINK_TYPES.find(lt => lt.value === link.type);
            const label = linkTypeData?.label || link.label || 'Link';

            // Build full URL if template exists, otherwise use URL as-is
            const fullUrl = linkTypeData?.urlTemplate
                ? linkTypeData.urlTemplate.replace('{id}', link.url)
                : link.url;

            // Add URL with type label
            lines.push(`URL;TYPE=${label}:${fullUrl}`);
        });
    }

    lines.push('END:VCARD');

    return lines.filter(Boolean).join('\r\n');
}

/**
 * Triggers download of vCard file for the given card data
 */
export async function downloadVCard(cardData: CardData): Promise<void> {
    const vCardContent = await generateVCard(cardData);

    // Create blob and download
    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cardData.firstName}_${cardData.lastName}_contact.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
