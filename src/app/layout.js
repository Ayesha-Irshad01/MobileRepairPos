import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppearanceProvider } from "@/context/AppearanceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Repair POS",
  description: "Mobile repair shop management system",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/*
          Runs before any React hydration to apply dark/accent class from
          localStorage — prevents flash of wrong theme on hard refresh.
          strategy="beforeInteractive" injects this into the HTML <head>
          before any other scripts.
        */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('app_appearance');if(s){var p=JSON.parse(s);if(p.theme==='Dark')document.documentElement.classList.add('dark');var m={Green:'accent-green',Purple:'accent-purple',Orange:'accent-orange'};var c=m[p.accentColor];if(c)document.documentElement.classList.add(c);}}catch(e){}})();`,
          }}
        />
        <AppearanceProvider>
          {children}
        </AppearanceProvider>
      </body>
    </html>
  );
}
