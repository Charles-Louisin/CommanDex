import { Outfit, Chewy } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const chewy = Chewy({
  variable: "--font-chewy",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "CommanDex - Restaurant Management Platform",
  description: "Restaurant platform for orders, tables, and payments",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Viewport and theme-color are now handled by viewport export */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CommanDex" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${outfit.variable} ${chewy.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

