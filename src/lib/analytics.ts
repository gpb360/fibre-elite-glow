// Google Analytics 4 configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not found')
    return
  }

  // Load gtag script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // Initialize gtag
  const script2 = document.createElement('script')
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `
  document.head.appendChild(script2)
}

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: title || document.title,
    page_location: url,
  })
}

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// E-commerce tracking
export const trackPurchase = (transactionId: string, items: any[], value: number) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      category: 'Health Supplements',
      price: item.price,
      quantity: item.quantity,
    })),
  })
}

export const trackAddToCart = (item: any) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      category: 'Health Supplements',
      price: item.price,
      quantity: 1,
    }],
  })
}

export const trackRemoveFromCart = (item: any) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', 'remove_from_cart', {
    currency: 'USD',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      category: 'Health Supplements',
      price: item.price,
      quantity: item.quantity,
    }],
  })
}

export const trackBeginCheckout = (items: any[], value: number) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: value,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      category: 'Health Supplements',
      price: item.price,
      quantity: item.quantity,
    })),
  })
}

export const trackViewItem = (item: any) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return

  window.gtag('event', 'view_item', {
    currency: 'USD',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      category: 'Health Supplements',
      price: item.price,
    }],
  })
}