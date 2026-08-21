/**
 * Admin layout — auth guard lives in middleware.ts (runs before rendering).
 * This layout is a thin wrapper; it does NOT check auth itself to avoid
 * redirect loops on the /admin/login page.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
