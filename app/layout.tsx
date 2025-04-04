import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootLayout } from "@/components/root-layout";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - FeedForward",
    default: "FeedForward",
  },
  description: "FeedForward hjelper deg med å samle inn, analysere og handle på tilbakemeldinger effektivt. Skap bedre produkter og tjenester gjennom meningsfulle brukerinnsikter.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        role="application"
        aria-label="FeedForward applikasjon"
      >
        <Providers>
          <RootLayout>{children}</RootLayout>
        </Providers>
      </body>
    </html>
  );
}
