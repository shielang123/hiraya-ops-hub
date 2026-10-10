import "./globals.css";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata = {
  title: "Hiraya Ops Hub",
  description: "Staff operations for Hiraya Farm Resort",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
