import { Linkedin, Instagram, Twitter, Globe, Link } from 'lucide-react';
import { LinkType } from '../types';

export const LINK_TYPES: LinkType[] = [
    {
        value: 'linkedin',
        label: 'LinkedIn',
        icon: Linkedin,
        color: 'text-blue-400',
        urlTemplate: 'https://linkedin.com/in/{id}',
        placeholder: 'your-username'
    },
    {
        value: 'instagram',
        label: 'Instagram',
        icon: Instagram,
        color: 'text-pink-400',
        urlTemplate: 'https://instagram.com/{id}',
        placeholder: 'your-username'
    },
    {
        value: 'twitter',
        label: 'Twitter',
        icon: Twitter,
        color: 'text-sky-400',
        urlTemplate: 'https://twitter.com/{id}',
        placeholder: 'your-username'
    },
    {
        value: 'website',
        label: 'Website',
        icon: Globe,
        color: 'text-green-400',
        urlTemplate: 'https://{id}',
        placeholder: 'example.com'
    },
    {
        value: 'custom',
        label: 'Custom',
        icon: Link,
        color: 'text-purple-400'
        // No urlTemplate - user enters full URL
    }
];