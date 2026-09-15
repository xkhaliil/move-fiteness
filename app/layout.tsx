import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MOVE! — Find someone to move with",
  description:
    "MOVE! helps you find people nearby to run, play, and train with in Barcelona.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
