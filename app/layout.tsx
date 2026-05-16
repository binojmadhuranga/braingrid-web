import type { Metadata } from "next";
import ReduxProvider from "@/redux/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrainGrid",
  description: "BrainGrid authentication portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
