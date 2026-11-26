import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LG Event-Target — 3D Sovereign Capital Screener & Conference Diligence",
  description: "Institutional screening engine for 417 presenting and screened companies across the LG Event and OTC volume screener cohort. Forensic liquidity, negative working capital, 2-year financing flows, S-3/ATM shelves, and C-suite CRM outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/v10-responsive.css" />
      </head>
      <body className="min-h-screen antialiased selection:bg-[#f5d378] selection:text-[#070a10]">
        {children}
        <script src="/v10-suite.js" defer></script>
      </body>
    </html>
  );
}
