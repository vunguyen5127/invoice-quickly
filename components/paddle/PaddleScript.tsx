'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Paddle?: any
  }
}

export default function PaddleScript() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Paddle) {
      const script = document.createElement('script')
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
      script.async = true
      
      const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox';
      const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

      script.onload = () => {
        if (window.Paddle && paddleToken) {
          window.Paddle.Environment.set(paddleEnv);
          window.Paddle.Initialize({ 
            token: paddleToken,
          });
          console.log(`[Paddle] Initialized via PaddleScript: ${paddleEnv}`);
        } else if (!paddleToken) {
          console.error("[Paddle] Missing NEXT_PUBLIC_PADDLE_CLIENT_TOKEN");
        }
      }
      document.head.appendChild(script)
    }
  }, [])

  return null
}
