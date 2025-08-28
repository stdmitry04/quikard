import React from 'react'

export default function Header() {
    return (
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                </div>
                <h1 className="text-5xl font-black">
                    Quick<span className="gradient-text">Card</span>
                </h1>
            </div>

            <p className="text-xl text-gray-400 mb-4">
                Create your business card in under 60 seconds
            </p>

            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">No login required • Free forever</span>
            </div>
        </div>
    )
}