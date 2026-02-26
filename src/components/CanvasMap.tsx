import React from 'react';

export function CanvasMap({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full min-h-screen pt-12 pb-32 px-4 md:px-8 bg-[var(--bg-color)] transition-colors duration-500 z-10">
            {/* Hand-dotted background grid - Fixed so it looks like it stays still while scrolling */}
            <div
                className="fixed inset-0 pointer-events-none opacity-40 transition-opacity duration-500 -z-10"
                style={{
                    backgroundImage: 'radial-gradient(var(--grid-color) 2px, transparent 2px)',
                    backgroundSize: '30px 30px',
                }}
            />

            {/* SVG Data trails connecting the Canvas sections */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ minHeight: '800px' }}>
                    {/* Main bus line */}
                    <path
                        d="M 100 250 Q 300 300 500 250 T 900 300"
                        fill="none"
                        stroke="var(--cpu-stroke)"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        className="transition-colors duration-500"
                    />
                    {/* Branching line to cores */}
                    <path
                        d="M 500 250 Q 600 400 700 350 T 900 450"
                        fill="none"
                        stroke="var(--cpu-stroke)"
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        className="transition-colors duration-500"
                    />
                </svg>
            </div>

            <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
                {children}
            </div>
        </div>
    );
}
