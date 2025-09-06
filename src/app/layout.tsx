import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBarOld from "@/components/NavBarOld";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/NavBar";
import { auth } from "../auth";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DrWhere",
    template: "%s - DrWhere",
  },
  description: "Finding the best medical care for you",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className} min-w-[350px]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            {/* <NavBarOld /> */}

            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
