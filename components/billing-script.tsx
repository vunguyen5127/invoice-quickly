'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Paddle?: any
  }
}

import config from "@/utils/config";

/**
 * Conditionally loads the billing provider's client-side script.
 * - Paddle: loads paddle.js and initializes the overlay checkout SDK.
 * - Lemon Squeezy: no client-side script needed (uses redirect checkout).
 */
export default function BillingScript() {
  useEffect(() => {
    // Only load Paddle.js if Paddle is the active billing provider
    if (config.billingProvider !== "paddle") return;

    const { env, clientToken: token } = config.paddle;

    if (!token) return;

    const initializePaddle = () => {
      if (window.Paddle && typeof window.Paddle.Initialize === 'function') {
        window.Paddle.Environment.set(env);
        window.Paddle.Initialize({ token });
      }
    };

    if (window.Paddle) {
      initializePaddle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = initializePaddle;
      script.onerror = () => console.error("[BillingScript] Failed to load Paddle.js script.");
      document.head.appendChild(script);
    }
  }, []);

  return null
}
