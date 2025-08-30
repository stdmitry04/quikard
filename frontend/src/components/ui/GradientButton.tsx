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
                    background: transparent;
                    backdrop-filter: blur(20px) saturate(200%);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    outline: none;
                    box-shadow:
                        /* soft outer glow */
                            0 8px 32px rgba(0, 0, 0, 0.12),
                            0 4px 16px rgba(0, 0, 0, 0.08),
                                /* subtle inner highlights */
                            inset 0 1px 2px rgba(255, 255, 255, 0.25),
                            inset 0 -1px 1px rgba(0, 0, 0, 0.05),
                                /* colored inner glow */
                            inset 0 0 20px rgba(96, 165, 250, 0.03),
                            inset 0 0 40px rgba(196, 181, 253, 0.02);
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .glass-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: inherit;
                    background: linear-gradient(145deg,
                    rgba(255, 255, 255, 0.05) 0%,
                    rgba(255, 255, 255, 0.02) 30%,
                    rgba(96, 165, 250, 0.01) 60%,
                    rgba(196, 181, 253, 0.01) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }

                .glass-button::after {
                    content: '';
                    position: absolute;
                    top: 1px;
                    left: 1px;
                    right: 1px;
                    height: 50%;
                    background: linear-gradient(180deg,
                    rgba(255, 255, 255, 0.08) 0%,
                    rgba(255, 255, 255, 0.01) 100%);
                    border-radius: 2rem 2rem 1rem 1rem;
                    pointer-events: none;
                    opacity: 0.6;
                }

                .glass-button:hover {
                    background: transparent;
                    border-color: rgba(255, 255, 255, 0.25);
                    box-shadow:
                        /* enhanced outer glow */
                            0 12px 48px rgba(0, 0, 0, 0.15),
                            0 8px 24px rgba(0, 0, 0, 0.1),
                                /* stronger inner highlights */
                            inset 0 1px 3px rgba(255, 255, 255, 0.3),
                            inset 0 -1px 2px rgba(0, 0, 0, 0.08),
                                /* enhanced colored glow */
                            inset 0 0 30px rgba(96, 165, 250, 0.08),
                            inset 0 0 60px rgba(196, 181, 253, 0.05),
                            inset 0 0 80px rgba(244, 114, 182, 0.03);
                    transform: translateY(-1px);
                }

                .glass-button:hover::before {
                    opacity: 0.4;
                }

                .glass-button:hover::after {
                    opacity: 0.8;
                    background: linear-gradient(180deg,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0.02) 100%);
                }

                .glass-button:active {
                    transform: translateY(0px) scale(0.98);
                    transition: all 0.1s ease;
                }

                /* smooth text rendering */
                .button-text {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }
            `}</style>

            <button
                onClick={onClick}
                className={`glass-button text-white font-medium py-4 px-8 rounded-full transition-all duration-500 relative overflow-hidden ${className}`}
                type="button"
            >
                <span className="button-text relative z-10 text-base tracking-wide">{children}</span>
            </button>
        </>
    );
};