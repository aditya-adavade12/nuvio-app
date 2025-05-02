import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuvio - Stay Creative",
  description: "Nuvio is a simple web app to write notes, draw ideas, and organize your thoughts in one private, searchable space. Stay creative and focused with Nuvio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
