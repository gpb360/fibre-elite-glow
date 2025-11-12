'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = (event: any) => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        if (confirm('A newer version of this web app is available, reload to update?')) {
          wb.addEventListener('controlling', (event) => {
            window.location.reload()
          })
          wb.messageSW({ type: 'SKIP_WAITING' })
        }
      }

      wb.addEventListener('waiting', promptNewVersionAvailable)
      wb.addEventListener('externalwaiting', promptNewVersionAvailable)

      // Add an event listener to detect when the registered
      // service worker has installed but is waiting to activate.
      wb.register()
    } else if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Fallback service worker registration with enhanced error handling
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  if (confirm('A newer version of this web app is available, reload to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((registrationError) => {
          console.warn('SW registration failed: ', registrationError)
          // Don't break the app if SW fails to register
        })
    }
  }, [])

  return null
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    workbox: any
  }
}