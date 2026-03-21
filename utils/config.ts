/**
 * Application Configuration Manager
 * Centralizes all process.env access with validation and strong typing.
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

  readonly openai: { readonly apiKey?: string };
  readonly cron: { readonly secret?: string };
}

// Helper to fetch private env vars with validation
function getEnv(key: string, required = true, defaultValue = ""): string {
  const value = process.env[key];
  if (!value && required && !defaultValue && process.env.NODE_ENV === "production") {
    throw new Error(`CRITICAL: Missing mandatory environment variable: ${key}`);
  }
  return value || defaultValue;
}

const nodeEnv = (process.env.NODE_ENV as Environment) || "development";

export const config: Config = {
  env: nodeEnv,
  isDev: nodeEnv === "development",
  isProd: nodeEnv === "production",
  isTest: nodeEnv === "test",

  // NEXT_PUBLIC_ variables must be accessed statically for Next.js inlining
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),

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
      proMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || "",
      proYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY || "",
    },
  },

  mailer: {
    domain: getEnv("MAILER_DOMAIN", false, "smtp-relay.brevo.com"),
    port: parseInt(getEnv("MAILER_PORT", false, "587"), 10),
    username: getEnv("MAILER_USERNAME", false),
    password: getEnv("MAILER_PASSWORD", false),
  },

  openai: { apiKey: getEnv("OPENAI_API_KEY", false) },
  cron: { secret: getEnv("CRON_SECRET", false) },
} as const;

// Quick Validation for Production
if (config.isProd && (!config.supabase.url || !config.supabase.anonKey)) {
  console.error("❌ CRITICAL: Supabase credentials missing in production environment!");
}

export default config;
