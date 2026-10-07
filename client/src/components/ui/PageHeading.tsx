import React from 'react';

interface PageHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  /** Short text shown to the right on md+ (below the title on mobile). */
  aside?: React.ReactNode;
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
}

/** Section heading from the template's bento section: eyebrow + big Manrope title (+ aside copy). */
const PageHeading: React.FC<PageHeadingProps> = ({ eyebrow, title, aside, as: Heading = 'h1', id, className = '' }) => (
  <div className={`flex flex-col md:flex-row justify-between md:items-end gap-6 ${className}`}>
    <div>
      <p className="text-[11px] uppercase tracking-[0.4em] text-text-secondary font-semibold mb-4">{eyebrow}</p>
      <Heading
        id={id}
        className="font-display text-[clamp(2rem,5vw,4rem)] text-text-primary leading-none tracking-tight"
        style={{ fontWeight: 800 }}
      >
        {title}
      </Heading>
    </div>
    {aside && <div className="text-[15px] text-text-secondary max-w-xs leading-relaxed">{aside}</div>}
  </div>
);

/** The accent word of a heading ("Control.", "carrito."). */
export const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: 'var(--accent-orchid)' }}>{children}</span>
);

export default PageHeading;
