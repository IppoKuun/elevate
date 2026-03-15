import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "ELEVATE",
    template: "%s | ELEVATE",
  },
  description:
    "ELEVATE est une plateforme de cours en ligne orientee pratique pour progresser plus vite et debloquer des contenus premium.",
  applicationName: "ELEVATE",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: appUrl,
    siteName: "ELEVATE",
    title: "ELEVATE",
    description:
      "Plateforme de cours en ligne orientee pratique avec catalogue public et espace apprenant.",
    images: [
      {
        url: `${appUrl}/Nexus.png`,
        width: 1200,
        height: 630,
        alt: "ELEVATE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELEVATE",
    description:
      "Plateforme de cours en ligne orientee pratique avec catalogue public et espace apprenant.",
    images: [`${appUrl}/Nexus.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
