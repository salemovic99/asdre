import type { Metadata, Viewport } from "next";
import { Roboto_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GrainOverlay } from "@/components/layout/GrainOverlay";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_TITLE = "ASDRÉ — Designed For Forever";
const SITE_DESCRIPTION =
  "ASDRÉ is a quiet-luxury fashion house inspired by Swiss design and timeless style. Two collections — LÉMAN and RIVIERA — crafted from premium fabrics with uncompromising attention to detail.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "ASDRÉ",
  keywords: [
    "ASDRÉ",
    "quiet luxury",
    "Swiss design",
    "timeless fashion",
    "LÉMAN",
    "RIVIERA",
    "premium fabrics",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: "ASDRÉ",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} ${inter.variable} ${jetbrains.variable} h-full`}
    >
      <head>
        {/* Brittany Signature (logo only) — not on Google Fonts, loaded via CDN. */}
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/brittany-signature"
        />
      </head>
      <body className="relative min-h-full bg-background text-foreground">
        <a
          href="#about"
          className="sr-only rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <GrainOverlay />
      </body>
    </html>
  );
}
