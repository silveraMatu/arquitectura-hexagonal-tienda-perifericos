import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import HeroStats from './HeroStats';

// Base: template/home/components/HeroSection.tsx. Changes: copy in Spanish, real stats,
// Tailwind 3-valid opacity classes (/8, /12 don't exist), AA text colors, reduced motion, and the
// top badge moved into the flow: absolutely positioned at top-36 it overlapped the headline (and the
// eyebrow slid under the fixed header) on any viewport shorter than ~900px.
const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-28 md:pt-32">
      {/* Full-bleed lifestyle photo */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://images.unsplash.com/photo-1589677725642-9b3ebd5ad24b"
          alt="Teclado mecánico 65% con keycaps lavanda y mouse sobre un deskmat oscuro, con luz ambiente violeta"
          fill
          preload
          className="object-cover object-center"
        />

        {/* Multi-layer atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1625] via-[#1A1625]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1625]/60 via-transparent to-[#1A1625]/20" />
        {/* Purple tint wash */}
        <div className="absolute inset-0 bg-[#9B59F0]/[0.08] mix-blend-screen" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-24 w-full">
        <div className="max-w-3xl">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-full px-4 py-2 mb-8 md:mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
              Stock en tiempo real
            </span>
          </div>

          {/* Eyebrow */}
          <p className="text-hero-sub text-text-secondary mb-6 tracking-[0.4em]">
            Periféricos seleccionados · Instrumentos de precisión
          </p>

          {/* Main headline */}
          <h1 className="text-hero text-text-primary mb-8">
            Tu próximo<br />
            <span className="text-orchid-glow" style={{ color: 'var(--accent-orchid)' }}>Setup.</span>
          </h1>

          {/* Subline */}
          <p className="text-[16px] md:text-[18px] text-text-secondary font-light leading-relaxed max-w-md mb-10" style={{ letterSpacing: '0.01em' }}>
            Mouses, teclados, auriculares y monitores para quienes pasan horas
            con las manos sobre el escritorio.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a href="#products" className="btn-unbox text-[12px] px-7 py-3.5">
              Ver catálogo
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-[12px] font-bold uppercase tracking-widest text-text-primary hover:bg-white/[0.08] hover:border-white/30 transition-all duration-200"
            >
              Ver carrito
            </Link>
          </div>
        </div>

        {/* Bottom stats strip */}
        <HeroStats />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-text-secondary" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-text-secondary rotate-90 translate-y-4">Scroll</span>
      </div>
    </section>
  );
};

export default HeroSection;
