import type { Metadata } from "next";

// Link-preview metadata (WhatsApp/email) for the public supplier page.
export const metadata: Metadata = {
  title: "Supplier data request | ESGEN",
  description:
    "Submit your emissions data securely for your customer's sustainability reporting. Takes about 10 minutes, no account needed.",
  openGraph: {
    title: "Supplier data request | ESGEN",
    description:
      "Submit your emissions data securely for your customer's sustainability reporting. Takes about 10 minutes, no account needed.",
    siteName: "ESGEN",
  },
};

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
