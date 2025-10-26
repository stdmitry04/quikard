import { CardData } from '@/types';
import { LINK_TYPES } from '@/constants/linkTypes';

/**
 * Generates a vCard (VCF) file content from card data
 * Includes name, email, phone, and social media links as URLs
 */
export function generateVCard(cardData: CardData): string {
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

    // Add profile picture if present (as PHOTO field)
    if (cardData.profilePicture) {
        lines.push(`PHOTO;VALUE=URI:${cardData.profilePicture}`);
    }

    // Add social links as URL fields with labels
    if (cardData.links && cardData.links.length > 0) {
        cardData.links.forEach(link => {
            const linkTypeData = LINK_TYPES.find(lt => lt.value === link.type);
            const label = linkTypeData?.label || link.label || 'Link';

            // Add URL with type label
            lines.push(`URL;TYPE=${label}:${link.url}`);
        });
    }

    lines.push('END:VCARD');

    return lines.filter(Boolean).join('\r\n');
}

/**
 * Triggers download of vCard file for the given card data
 */
export function downloadVCard(cardData: CardData): void {
    const vCardContent = generateVCard(cardData);

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
