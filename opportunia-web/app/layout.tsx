import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { Navbar } from '@/components/navbar/Navbar'
import { PwaRegister } from '@/components/pwa/PwaRegister'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1329' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Opportunia — Le tremplin des opportunités pour étudiants (Togo & Afrique)',
  description:
    'Opportunia connecte les étudiants et jeunes diplômés du Togo et de la sous-région avec les stages, bourses, concours et emplois adaptés à leur profil et leurs ambitions.',
  keywords: ['stages Lomé', 'bourses Togo', 'premier emploi Afrique', 'étudiants Togo', 'opportunités Togo', 'orientation professionnelle'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Opportunia',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Opportunia — Campus & Avenir',
    description: 'Ne cherche plus au hasard. Trouve les opportunités qui correspondent à ton parcours.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light" className="h-full light" suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('opp_theme');
                  if (saved === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased overflow-x-hidden">
        <Navbar />
        <main className="flex-1">{children}</main>
        <PwaRegister />
      </body>
    </html>
  )
}
