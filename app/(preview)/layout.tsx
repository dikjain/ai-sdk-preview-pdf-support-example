import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { AppContextProvider } from "../context/context";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "PDF Support Preview",
  description: "Experimental preview of PDF support with the AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body>
        <AppContextProvider>
          <ThemeProvider attribute="class" enableSystem forcedTheme="dark">
            <Toaster position="top-center" richColors />
            {children}
          </ThemeProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
