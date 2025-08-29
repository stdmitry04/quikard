import { Linkedin, Instagram, Twitter, Globe, Link } from 'lucide-react';
import { LinkType } from '../types';

export const LINK_TYPES: LinkType[] = [
    {
        value: 'linkedin',
        label: 'LinkedIn',
        icon: Linkedin,
        color: 'text-blue-400'
    },
    {
        value: 'instagram',
        label: 'Instagram',
        icon: Instagram,
        color: 'text-pink-400'
    },
    {
        value: 'twitter',
        label: 'Twitter',
        icon: Twitter,
        color: 'text-sky-400'
    },
    {
        value: 'website',
        label: 'Website',
        icon: Globe,
        color: 'text-green-400'
    },
    {
        value: 'custom',
        label: 'Custom',
        icon: Link,
        color: 'text-purple-400'
    }
];