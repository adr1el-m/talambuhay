import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talambuhay Ko",
  description: "My personal journey and story",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning={true} className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
