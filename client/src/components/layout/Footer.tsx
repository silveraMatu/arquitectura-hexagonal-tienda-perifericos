import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <AppLogo size={24} text="Peripheral" className="text-text-secondary" />

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {[
            { label: 'Tienda', href: '/' },
            { label: 'Carrito', href: '/cart' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-[12px] text-text-muted font-medium uppercase tracking-widest">
          © 2026 Peripheral — Hecho para tu forma de jugar
        </p>
      </div>
    </footer>
  );
};

export default Footer;