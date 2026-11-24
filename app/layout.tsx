import type { Metadata, Viewport } from "next";

import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/inter/wght.css";
import "leaflet/dist/leaflet.css";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Travel Monkey — reisroutes met een omweg",
    template: "%s | Travel Monkey",
  },
  description:
    "Complete reisroutes met vaste stops, prijzen en tips. Van een week Europa tot drie weken Azië, met praktische informatie per bestemming.",
  keywords: [
    "reisblog",
    "reistips",
    "Bali",
    "reisroute",
    "backpacken",
    "Nusa Penida",
    "Gili Trawangan",
    "Travel Monkey",
  ],
  authors: [{ name: "Mila — Travel Monkey" }],
  publisher: "Travel Monkey",
  creator: "Travel Monkey",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: siteUrl,
    siteName: "Travel Monkey",
    title: "Travel Monkey — reisroutes met een omweg",
    description:
      "Reis verder dan de gebaande paden. Complete routes met stops, prijzen en tips.",
    images: [
      {
        url: "/images/og-travel-monkey.jpg",
        width: 1200,
        height: 630,
        alt: "Travel Monkey — reis verder dan de gebaande paden",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Monkey — reisroutes met een omweg",
    description:
      "Reis verder dan de gebaande paden. Complete routes met stops, prijzen en tips.",
    images: ["/images/og-travel-monkey.jpg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF6EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body id="top" className="min-h-screen bg-shell font-sans text-ink antialiased">
        <a
          href="#inhoud"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-jungle-900 px-5 py-3 text-sm font-semibold text-sand-50 transition-transform focus:translate-y-0"
        >
          Direct naar de inhoud
        </a>
        <SiteHeader />
        <main id="inhoud">{children}</main>
        <SiteFooter />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
