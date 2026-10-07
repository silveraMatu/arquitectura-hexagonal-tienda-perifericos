'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { cartUnitCount, useCart } from '@/hooks/useCart';
import { useHydrated } from '@/hooks/useHydrated';

const NAV_ITEMS = [
  { label: 'Tienda', href: '/' },
  { label: 'Carrito', href: '/cart' },
];

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: cart } = useCart();
  const unitCount = useHydrated() ? cartUnitCount(cart) : 0;
  const cartLabel = `Ver carrito, ${unitCount} ${unitCount === 1 ? 'producto' : 'productos'}`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    // Sync on mount: a reload mid-page must not start with the transparent header.
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu on navigation and on Escape.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 motion-reduce:transition-none ${
        solid ? 'nav-blur bg-bg-primary/80 border-b border-white/5 py-3' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Peripheral — inicio">
          <AppLogo size={28} text="Peripheral" className="text-text-primary" />
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Principal"
          className="hidden md:flex items-center gap-1 bg-bg-primary/40 backdrop-blur-md border border-white/[0.08] rounded-full px-2 py-1.5"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className="px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-white/[0.08] aria-[current=page]:text-text-primary transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/cart" className="btn-unbox text-[11px]" aria-label={cartLabel}>
            Ver carrito
            {unitCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-white text-accent-dim text-[10px] leading-5 text-center tracking-normal">
                {unitCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2.5 bg-white/[0.08] border border-white/10 rounded-full text-text-primary"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Menú móvil"
          className="md:hidden mt-2 mx-4 bg-bg-secondary border border-white/10 rounded-2xl p-4 space-y-1"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className="block px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
