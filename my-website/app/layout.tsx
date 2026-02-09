import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

export const metadata: Metadata = {
  title: "JHOM FOODS - Premium Quality Meat & Seafood",
  description: "Sustainably sourced, expertly selected, traceable from farm to table. Experience premium quality meat and seafood delivered to your doorstep.",
  keywords: "meat, seafood, sustainable, traceable, quality, organic, farm to table, Bangalore",
  openGraph: {
    title: "JHOM FOODS - Premium Quality Meat & Seafood",
    description: "Sustainably sourced, expertly selected, traceable from farm to table.",
    type: "website",
    locale: "en_IN",
    siteName: "JHOM FOODS",
  },
  twitter: {
    card: "summary_large_image",
    title: "JHOM FOODS - Premium Quality Meat & Seafood",
    description: "Sustainably sourced, expertly selected, traceable from farm to table.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


