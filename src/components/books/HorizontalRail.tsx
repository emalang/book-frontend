import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  fullBleed?: boolean;
};

export default function HorizontalRail({
  children,
  title,
  fullBleed = false,
}: Props) {
  const rail = (
    <div
      className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth
                    [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                    w-full min-h-[260px] items-stretch">
      {children}
    </div>
  );

  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      {fullBleed ? (
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div className="px-4 sm:px-6 lg:px-10">{rail}</div>
        </div>
      ) : (
        rail
      )}
    </section>
  );
}
