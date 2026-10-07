import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** Inline error banner for failed actions (the data on screen is still valid). */
const Alert: React.FC<AlertProps> = ({ children, action, className = '' }) => (
  <div
    role="alert"
    className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 ${className}`}
  >
    <svg className="w-5 h-5 shrink-0 text-surface-card" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
    <p className="flex-1 text-[14px] leading-snug text-text-primary">{children}</p>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default Alert;
