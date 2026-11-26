import type { Metadata } from "next";
import { Fraunces, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", style: ["normal", "italic"] });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
    title: "FairShare",
    description: "Rotating who pays, without the awkwardness.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${fraunces.variable} ${dm.variable} ${caveat.variable}`}>
            <body>{children}</body>
        </html>
    );
}