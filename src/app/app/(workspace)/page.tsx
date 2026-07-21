"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullLoader } from "@/components/tool/AppStates";
import { workspaceHomePath } from "@/lib/tool/workspaceDest";

/** The workspace root sends users to whichever module they picked at sign-in. */
export default function WorkspaceHome() {
  const router = useRouter();
  useEffect(() => {
    router.replace(workspaceHomePath());
  }, [router]);
  return <FullLoader label="Opening your workspace" />;
}
