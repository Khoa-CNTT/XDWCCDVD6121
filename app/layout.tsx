import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Hady Shop",
  description: "Tiệm váy cưới Hady uy tín nhất Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center">{children}</body>
    </html>
  );
}
