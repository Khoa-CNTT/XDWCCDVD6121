import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
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
      <body>
        <Toaster position="top-center" richColors closeButton />
        {children}
      </body>
    </html>
  );
}
