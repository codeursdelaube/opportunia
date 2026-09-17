import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/navbar/Navbar'
import { PwaRegister } from '@/components/pwa/PwaRegister'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Opportunia — Trouvez les opportunités qui vous correspondent',
  description:
    'Opportunia analyse votre profil étudiant et vous recommande les stages, bourses, concours et emplois qui correspondent à vos compétences et ambitions.',
  keywords: ['stages', 'bourses', 'emploi', 'étudiants', 'Togo', 'opportunités', 'matching'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Opportunia',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Opportunia',
    description: 'Les opportunités existent. Trouvez celles qui vous correspondent.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="opportunia" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('opp_theme');
                  if (saved === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.classList.add('light');
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
