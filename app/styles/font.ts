// src/styles/fonts.ts
import { Inter, Roboto_Mono, Geist } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});


export const geist = Geist({
    subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
})