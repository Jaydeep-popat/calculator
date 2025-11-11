import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculator — Glass UI",
  description: "A beautiful glass morphism calculator with basic, scientific, and currency converter modes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
