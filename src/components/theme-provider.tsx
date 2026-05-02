'use client';

import { ThemeProvider as NextThemes } from 'next-themes';
import * as React from 'react';

export const PALETTES = ['light', 'sand', 'dark', 'mid', 'deep', 'slate'] as const;
export type Palette = (typeof PALETTES)[number];

export const LIGHT_PALETTES: Palette[] = ['light', 'sand'];
export const DARK_PALETTES: Palette[] = ['dark', 'mid', 'deep', 'slate'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={[...PALETTES]}
      value={{
        light: 'light',
        sand: 'sand',
        dark: 'dark',
        mid: 'mid',
        deep: 'deep',
        slate: 'slate',
      }}
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}
