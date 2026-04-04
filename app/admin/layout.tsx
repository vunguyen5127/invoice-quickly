import { AdminGuard } from "@/components/admin-guard";
import config from "@/utils/config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50/10 dark:bg-zinc-950">
      <AdminGuard adminEmails={config.adminEmails}>{children}</AdminGuard>
    </div>
  );
}
