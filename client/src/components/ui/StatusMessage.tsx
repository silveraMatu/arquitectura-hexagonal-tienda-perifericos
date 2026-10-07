import React from 'react';

interface StatusMessageProps {
  tone: 'loading' | 'error' | 'empty';
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const ICONS: Record<StatusMessageProps['tone'], React.ReactNode> = {
  loading: (
    <span className="block w-5 h-5 rounded-full border-2 border-accent/30 border-t-accent animate-spin motion-reduce:animate-none" />
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  empty: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
    </svg>
  ),
};

/** Shared loading / error / empty block, styled like the template's bento tiles. */
const StatusMessage: React.FC<StatusMessageProps> = ({ tone, title, description, action, className = '' }) => (
  <div
    role={tone === 'error' ? 'alert' : 'status'}
    aria-live={tone === 'error' ? 'assertive' : 'polite'}
    className={`bg-card-gradient border border-white/10 rounded-[20px] px-6 py-12 md:py-16 flex flex-col items-center text-center ${className}`}
  >
    <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 text-surface-card flex items-center justify-center mb-5" aria-hidden="true">
      {ICONS[tone]}
    </div>
    <p className="font-display text-xl text-text-primary mb-2" style={{ fontWeight: 800 }}>
      {title}
    </p>
    {description && <p className="text-[15px] text-text-secondary max-w-md leading-relaxed">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default StatusMessage;
