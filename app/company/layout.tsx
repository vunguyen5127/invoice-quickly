import { AuthGuard } from "@/components/auth-guard";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50/10 dark:bg-zinc-950">
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
