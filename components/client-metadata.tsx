'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function ClientMetadata() {
  const [isMounted, setIsMounted] = useState(false)
  const [showAds, setShowAds] = useState(true)

  useEffect(() => {
    setIsMounted(true)

    // Check if user is a Pro subscriber — hide ads if so
    const checkPlan = async () => {
      if (!supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return // Not logged in — show ads

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', session.user.id)
        .single()

      if (sub && sub.plan === 'pro' && (sub.status === 'active' || sub.status === 'canceled')) {
        setShowAds(false)
      }
    }

    checkPlan()
  }, [])

  if (!isMounted) return null

  return (
    <>
      {/* AdSense — only for free users */}
      {showAds && (
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5519024554738216" 
          crossOrigin="anonymous" 
        />
      )}
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
