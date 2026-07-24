"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchIsAdmin } from "@/lib/brsr/pro";
import { AdminPortal } from "@/components/admin/AdminPortal";

/** /app/admin is reachable by URL directly, so it re-checks admin status
 *  itself rather than trusting only the nav link being hidden. */
export default function AdminPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const admin = await fetchIsAdmin();
      if (cancelled) return;
      setAllowed(admin);
      setChecked(true);
      if (!admin) router.replace("/app");
    })();
    return () => { cancelled = true; };
  }, [router]);

  if (!checked) return <p className="text-sm text-text-muted">Checking access...</p>;
  if (!allowed) return null;
  return <AdminPortal />;
}
