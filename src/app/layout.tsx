import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";

// Fontes auto-hospedadas (sem dependência do Google Fonts no build).
// Corpo: Nunito — sans arredondada, amigável
const nunito = localFont({
  src: "../fonts/nunito.woff2",
  variable: "--font-nunito",
  display: "swap",
  weight: "200 1000",
});

// Títulos: Fraunces — serifada suave, com itálico "torto" e charmoso
const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces.woff2", style: "normal" },
    { path: "../fonts/fraunces-italic.woff2", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  weight: "100 900",
});

// Manuscrito: Caveat — como o "Siomara Acessórios" escrito à mão nos cartões
const caveat = localFont({
  src: "../fonts/caveat.woff2",
  variable: "--font-caveat",
  display: "swap",
  weight: "400 700",
});

// Caligrafia: Great Vibes — o "𝒯𝓇𝒶𝓃𝓈𝒻𝑜𝓇𝓂𝒶𝓃𝒹𝑜" da bio do Instagram, mas em texto real
const greatVibes = localFont({
  src: "../fonts/great-vibes.woff2",
  variable: "--font-greatvibes",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Siomara Acessórios — Pulseiras & acessórios personalizados",
    template: "%s · Siomara Acessórios",
  },
  description:
    "Siomara Acessórios — pulseiras de casal, pulseiras com nome, fios de telemóvel, porta-chaves e terços personalizados, feitos à mão em Angola.",
  keywords: [
    "Siomara Acessórios",
    "pulseiras personalizadas",
    "pulseiras de casal",
    "fio de telemóvel",
    "artesanato",
    "Angola",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${nunito.variable} ${fraunces.variable} ${caveat.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
