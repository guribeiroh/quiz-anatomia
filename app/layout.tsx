import './globals.scss';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QuizProvider } from './context/QuizContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quiz Anatomia Sem Medo',
  description: 'Teste seus conhecimentos em anatomia e descubra o curso perfeito para seu aprendizado',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#064e3b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Quiz Anatomia',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#064e3b" />
        <meta name="color-scheme" content="dark" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-[rgb(15,23,25)] to-[rgb(13,17,23)]`}>
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}
