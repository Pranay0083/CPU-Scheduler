export function FloatingHeader({ title }: { title: string }) {
    return (
        <div className="flex justify-center mb-12 relative z-10 w-full pt-8">
            <div
                className="px-8 py-3 bg-[var(--header-bg)] backdrop-blur-md text-[var(--text-color)] font-architect text-2xl tracking-wider inline-block"
                style={{
                    border: '2px solid currentColor',
                    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                }}
            >
                {title}
            </div>
        </div>
    );
}
