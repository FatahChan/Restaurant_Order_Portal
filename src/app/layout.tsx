import "@/styles/globals.css";
import { env } from "@/env";
import { Permanent_Marker } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

const font = Permanent_Marker({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  preload: true,
});

export const metadata = {
  title: `${env.NEXT_PUBLIC_STORE_NAME} - Order Portal`,
  description: `Order Portal for ${env.NEXT_PUBLIC_STORE_NAME}, order your favorite food here!`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${font.className}`}>
      <Providers>
        <body>{children}</body>
      </Providers>
      <Toaster />
    </html>
  );
}
