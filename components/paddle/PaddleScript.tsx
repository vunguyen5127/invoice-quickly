'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Paddle?: any
  }
}

export default function PaddleScript() {
  useEffect(() => {
    // Determine environment and token
    const env = (process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox') as 'sandbox' | 'live';
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!token) {
      console.warn("[PaddleScript] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is missing. Paddle will not be initialized.");
      return;
    }

    const initializePaddle = () => {
      if (window.Paddle && typeof window.Paddle.Initialize === 'function') {
        window.Paddle.Environment.set(env);
        window.Paddle.Initialize({ token });
        console.log(`[PaddleScript] Successfully initialized in ${env} mode.`);
      }
    };

    // If script is already loaded by another component or layout
    if (window.Paddle) {
      initializePaddle();
    } else {
      // Load script dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = initializePaddle;
      script.onerror = () => console.error("[PaddleScript] Failed to load Paddle.js script.");
      document.head.appendChild(script);
    }
  }, []);

  return null
}
