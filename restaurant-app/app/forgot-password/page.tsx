import type { Metadata } from "next";
import PasswordRecoveryForm from "@/components/PasswordRecoveryForm";

export const metadata: Metadata = { title: "Mot de passe oublié | Sushi House" };

export default function ForgotPasswordPage() {
  return <PasswordRecoveryForm />;
}
