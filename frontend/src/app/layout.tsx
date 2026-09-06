import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniCompass — Study Abroad & Application Planning Platform",
  description: "Personalized study-abroad decision and application planning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F7F8FC] text-[#152033] min-h-screen">
        {children}
      </body>
    </html>
  );
}
