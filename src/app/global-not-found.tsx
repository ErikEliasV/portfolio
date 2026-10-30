import type { Metadata } from "next";
import "./globals.css";
import { geistMono, silkscreen } from "./fonts";
import { GlobalNotFoundClient } from "@/components/not-found/GlobalNotFoundClient";

export const metadata: Metadata = {
  title: "404 · Erik Elias",
};

// 404 de qualquer endereço sem rota (no GitHub Pages vira o out/404.html)
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`dark ${geistMono.variable} ${silkscreen.variable}`}>
      <body className="font-mono antialiased bg-ink text-fg min-h-[100dvh]">
        <GlobalNotFoundClient />
      </body>
    </html>
  );
}
