import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Opportunia — Plateforme de matching d\'opportunités',
    short_name: 'Opportunia',
    description: 'Trouvez les stages, bourses, concours et emplois qui correspondent à votre profil étudiant.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1e',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
