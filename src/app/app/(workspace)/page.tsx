"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullLoader } from "@/components/tool/AppStates";

/** The tool is BRSR-focused: the workspace root sends users to the BRSR module. */
export default function WorkspaceHome() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/brsr");
  }, [router]);
  return <FullLoader label="Opening your BRSR workspace" />;
}
