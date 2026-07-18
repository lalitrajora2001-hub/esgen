import type { Metadata } from "next";
import { AuthProvider } from "@/components/tool/AuthProvider";
import { CompanyProvider } from "@/components/tool/CompanyProvider";

export const metadata: Metadata = {
  title: "ESGen Tool",
  // The tool sits behind sign-in; keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CompanyProvider>{children}</CompanyProvider>
    </AuthProvider>
  );
}
