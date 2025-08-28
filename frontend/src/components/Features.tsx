import React from 'react'

const features = [
    {
        icon: '⚡',
        title: 'Lightning Fast',
        description: 'Under 60 seconds'
    },
    {
        icon: '🎨',
        title: '3 Styles',
        description: 'Modern designs'
    },
    {
        icon: '📱',
        title: 'Responsive',
        description: 'Works everywhere'
    },
    {
        icon: '💎',
        title: 'Free Forever',
        description: 'No hidden costs'
    }
]

export default function Features() {
    return (
        <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="neumorphic rounded-2xl p-4 text-center hover:scale-105 transition-transform"
                >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <div className="text-sm font-semibold">{feature.title}</div>
                    <div className="text-xs text-gray-500">{feature.description}</div>
                </div>
            ))}
        </div>
    )
}