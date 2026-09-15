import type { Metadata } from "next";
import PasswordRecoveryForm from "@/components/PasswordRecoveryForm";
import { validResetToken } from "@/lib/password-reset";

export const metadata: Metadata = {
  title: "Nouveau mot de passe | Sushi House",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ResetPasswordPage({ searchParams }: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  return <PasswordRecoveryForm token={validResetToken(token) ? token : ""} />;
}
