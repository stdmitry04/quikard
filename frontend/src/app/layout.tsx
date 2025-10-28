import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import "../styles/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    maximumScale: 1,
    userScalable: false,
}

export const metadata: Metadata = {
  title: "QuiKard",
  icons: {
    icon: '/Q.png',
    apple: '/Q.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
        <meta name="theme-color" content="#0f0f15"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
        <title>QuiKard</title>
    </head>
    <body style={{backgroundColor: '#0f0f15', margin: 0, padding: 0}}>
    <div
        id="app-scroll"
        style={{
            minHeight: '100vh',
            // minHeight: '-webkit-fill-available',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'none',
            backgroundColor: "#0f0f15"
        }}
    >
        {children}
    </div>
    </body>
    </html>
  );
}
