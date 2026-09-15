import { getSession } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import OrderHistory from "@/components/OrderHistory";

export default async function AccountPage() {
  const user = await getSession();
  return user ? <OrderHistory userId={user.id} firstname={user.firstname} /> : <LoginForm />;
}
