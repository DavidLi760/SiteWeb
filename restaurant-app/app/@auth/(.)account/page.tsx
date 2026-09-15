import { getSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import OrderHistory from "@/components/OrderHistory";
import AuthModal, { InterceptedAuth } from "@/components/AuthModal";

export default async function ModalPage() {
  const user = await getSession();
  return <InterceptedAuth>{user ? <AuthModal><OrderHistory userId={user.id} firstname={user.firstname} /></AuthModal> : <LoginForm />}</InterceptedAuth>;
}
