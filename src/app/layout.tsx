import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Faraja Ahdaf, AI & Machine Learning Portfolio",
    template: "%s · Faraja Ahdaf",
  },
  description:
    "Exploring applied AI, machine learning, and data analysis through practical experiments, model evaluation, and research-minded builds.",
  keywords: [
    "Faraja Ahdaf",
    "AI Engineer",
    "Machine Learning",
    "Data Analysis",
    "Applied AI",
    "NLP",
    "Transformer",
    "Portfolio",
  ],
  authors: [{ name: "Faraja Ahdaf" }],
  creator: "Faraja Ahdaf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Faraja Ahdaf",
    title: "Faraja Ahdaf, AI & Machine Learning Portfolio",
    description:
      "Applied AI, machine learning, and data analysis experiments by Faraja Ahdaf.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faraja Ahdaf, AI & Machine Learning Portfolio",
    description:
      "Applied AI, machine learning, and data analysis experiments by Faraja Ahdaf.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="bottom-right"
            theme="light"
            toastOptions={{
              style: {
                background: "hsl(var(--card) / 0.95)",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
                backdropFilter: "blur(12px)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
