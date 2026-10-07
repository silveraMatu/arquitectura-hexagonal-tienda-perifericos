'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * false on the server and during hydration, true afterwards.
 *
 * Needed because React may hydrate a Suspense boundary *after* a sibling already filled the
 * TanStack Query cache: rendering cached data on that first pass wouldn't match the server HTML.
 */
export const useHydrated = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
