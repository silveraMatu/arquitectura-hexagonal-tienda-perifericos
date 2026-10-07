'use client';

import { useEffect, useRef } from 'react';

const SELECTOR = '.reveal, .stagger-children';

/**
 * The template's scroll reveal (.reveal / .stagger-children → .visible), extracted so it also
 * picks up content that mounts after data loads: pass something that changes when it does.
 */
export function useReveal<T extends HTMLElement>(trigger?: unknown) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = [root, ...Array.from(root.querySelectorAll<HTMLElement>(SELECTOR))].filter((el) =>
      el.matches(SELECTOR),
    );

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [trigger]);

  return ref;
}
