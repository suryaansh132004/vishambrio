import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BookingsProvider } from "@/context/BookingsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DevRibbon from "@/components/DevRibbon";
import BookingsDrawer from "@/components/BookingsDrawer";
import ProfileDrawer from "@/components/ProfileDrawer";
import BookingWizardDrawer from "@/components/booking-wizard/BookingWizardDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vishambrio Cabs | Sustainable Himachal",
  description: "Eco-friendly, affordable, and reliable electric cabs for urban and rural commuters navigating the peaks.",
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} antialiased bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed`}
      >
        <AuthProvider>
          <BookingsProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <BookingsDrawer />
            <ProfileDrawer />
            <BookingWizardDrawer />
            <DevRibbon />
          </BookingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
