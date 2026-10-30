import { Geist_Mono, Silkscreen } from "next/font/google";

// Usadas pelo layout de [locale] e pela 404 global (que não passa pelo layout)
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-silkscreen",
});
