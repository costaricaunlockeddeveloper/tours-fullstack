import { Manrope, Work_Sans, Kalam } from "next/font/google";

import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "./providers";
import NextTopLoader from "nextjs-toploader";

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--body-color-font',
});

const work_sans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--body-color-font',
});

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--heading-font',
});

export const metadata = {
  title: {
    absolute: '',
    default: 'Costa Rica Unlocked - Travel & Tour Agency NextJS Template',
    template: '%s | Costa Rica Unlocked - Travel & Tour Agency NextJS Template',
  },
  description: 'Costa Rica Unlocked - Travel & Tour Agency NextJS Template',
  openGraph: {
    title: 'Costa Rica Unlocked - Travel & Tour Agency NextJS Template',
    description: 'Costa Rica Unlocked - Travel & Tour Agency NextJS Template',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="author" content="Themeservices" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${manrope.variable} ${work_sans.variable} ${kalam.variable}`}>
        <Providers>
          <AuthProvider>
            <NextTopLoader color="#5750F1" showSpinner={false} />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
