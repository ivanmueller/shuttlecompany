import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/content/legal-page";

export const metadata: Metadata = legalMetadata("privacy");

export default function Page() {
  return <LegalPage id="privacy" />;
}
