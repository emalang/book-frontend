import React from 'react';

export default function HorizontalRail({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <section className="mt-6">
            <h2 className="mb-3 text-xl font-semibold">{title}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth
                        [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {children}
            </div>
        </section>
    );
}