'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function ClientMetadata() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <Script 
        async 
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5519024554738216" 
        crossOrigin="anonymous" 
        strategy="afterInteractive"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://invoice-quickly.com/#organization",
              "name": "Invoice-Quickly",
              "url": "https://invoice-quickly.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://invoice-quickly.com/logo.svg",
                "width": "512",
                "height": "512"
              },
              "description": "Free online invoice generator. Create and download professional PDF invoices for free — no signup, no watermark.",
              "brand": {
                "@type": "Brand",
                "name": "Invoice-Quickly"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Invoice-Quickly — Free Invoice Generator",
              "description": "The fastest free online invoice generator. Create professional PDF invoices in seconds with no signup and no watermark.",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Any",
              "url": "https://invoice-quickly.com",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "2847"
              }
            }
          ]),
        }}
      />
    </>
  )
}
