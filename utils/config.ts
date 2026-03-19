/**
 * Application Configuration Manager
 *
 * This file centralizes all `process.env` access, providing:
 * - Structured access to environment variables (Config object)
 * - Strong TypeScript types
 * - Default values for optional environment variables
 * - Critical error throwing for missing mandatory variables
 * - Type-safe environment checks (isDev, isProd)
 * 
 * IMPORTANT: Next.js requires static access for NEXT_PUBLIC_ variables
 * to correctly inline them into the client-side bundle.
 */

type Environment = "development" | "production" | "test";

interface Config {
  readonly env: Environment;
  readonly isDev: boolean;
  readonly isProd: boolean;
  readonly isTest: boolean;
  readonly siteUrl: string;

  readonly supabase: {
    readonly url: string;
    readonly anonKey: string;
    readonly serviceRole: string;
  };

  readonly paddle: {
    readonly env: "sandbox" | "live";
    readonly clientToken: string;
    readonly apiKey: string;
    readonly webhookSecret: string;
    readonly prices: {
      readonly proMonthly: string;
      readonly proYearly: string;
    };
  };

  readonly mailer: {
    readonly domain: string;
    readonly port: number;
    readonly username: string;
    readonly password?: string;
  };

  readonly openai: {
    readonly apiKey?: string;
  };

  readonly cron: {
    readonly secret?: string;
  };
}

/**
 * Helper to fetch and validate environment variables (Server-side & private only).
 * Use this only for variables NOT prefixed with NEXT_PUBLIC_.
 */
function getEnv(key: string, required = true, defaultValue = ""): string {
  const value = process.env[key];

  if (!value && required && !defaultValue) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`CRITICAL: Missing required environment variable: ${key}`);
    }
  }

  return value || defaultValue;
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration Object
// ─────────────────────────────────────────────────────────────────────────────

export const config: Config = {
  env: (process.env.NODE_ENV as Environment) || "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",

  // NEXT_PUBLIC_ variables MUST be accessed statically
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },

  paddle: {
    env: (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "live") || "sandbox",
    clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
    apiKey: getEnv("PADDLE_API_KEY", false),
    webhookSecret: getEnv("PADDLE_WEBHOOK_SECRET", false),
    prices: {
      proMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || process.env.PADDLE_PRICE_PRO_MONTHLY || "",
      proYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY || process.env.PADDLE_PRICE_PRO_YEARLY || "",
    },
  },

  mailer: {
    domain: getEnv("MAILER_DOMAIN", false, "smtp-relay.brevo.com"),
    port: parseInt(getEnv("MAILER_PORT", false, "587"), 10),
    username: getEnv("MAILER_USERNAME", false),
    password: getEnv("MAILER_PASSWORD", false),
  },

  openai: {
    apiKey: getEnv("OPENAI_API_KEY", false),
  },

  cron: {
    secret: getEnv("CRON_SECRET", false),
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Individual Exports (Backward Compatibility)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validation Check to ensure core Supabase config is present
 */
if (!config.supabase.url || !config.supabase.anonKey) {
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL: Supabase URL or Anon Key is undefined in the config.");
  }
}

export const {
  supabase: { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, serviceRole: SUPABASE_SERVICE_ROLE_KEY },
  paddle: { 
    env: PADDLE_ENV, 
    apiKey: PADDLE_API_KEY, 
    webhookSecret: PADDLE_WEBHOOK_SECRET, 
    clientToken: PADDLE_CLIENT_TOKEN,
    prices: { proMonthly: PADDLE_PRICE_PRO_MONTHLY, proYearly: PADDLE_PRICE_PRO_YEARLY } 
  },
  mailer: { domain: MAILER_DOMAIN, port: MAILER_PORT, username: MAILER_USERNAME, password: MAILER_PASSWORD },
  cron: { secret: CRON_SECRET },
  siteUrl: SITE_URL
} = config;

export default config;
