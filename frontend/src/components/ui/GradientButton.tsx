import React from 'react';

interface GlassButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const GradientButton: React.FC<GlassButtonProps> = ({
                                                            children,
                                                            onClick,
                                                            className = ""
                                                        }) => {
    return (
        <>
            <style jsx>{`
                .glass-button {
                    position: relative;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(2px) saturate(180%);
                    border: none;
                    outline: none;
                    box-shadow: inset -8px -8px 12px rgba(96, 165, 250, 0.4),
                    //inset 0 12px 40px rgba(196, 181, 253, 0.3);
                    //inset 0 16px 48px rgba(244, 114, 182, 0.2);
                    inset 8px 8px 16px rgba(180, 130, 255, 0.3);

                }

                .glass-button::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2rem;
                    backdrop-filter: blur(1px);
                    box-shadow: inset -10px -8px 0px -11px rgba(255, 255, 255, 1),
                    inset 0px -9px 0px -8px rgba(255, 255, 255, 1);
                    opacity: 0.6;
                    z-index: -1;
                    filter: blur(1px) drop-shadow(10px 4px 6px black) brightness(115%);
                    transition: all 0.3s ease;
                }

                .glass-button:hover::after {
                    opacity: 0.8;
                    background: rgba(255, 255, 255, 0.2);
                }

                .glass-button:hover {
                    background: rgba(255, 255, 255, 0.25);
                    box-shadow: 0 12px 40px rgba(96, 165, 250, 0.5),
                    0 16px 48px rgba(196, 181, 253, 0.4),
                    0 20px 56px rgba(244, 114, 182, 0.3),
                    inset 0 6px 25px rgba(255, 255, 255, 0.4);
                }
            `}</style>

            <button
                onClick={onClick}
                className={`glass-button text-white font-semibold py-5 px-10 rounded-full transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden ${className}`}
                type="button"
            >
                {/* main content with proper z-index so it shows above the pseudo element */}
                <span className="relative z-10 text-lg">{children}</span>
            </button>
        </>
    );
};