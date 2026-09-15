import Page from "@/app/reset-password/page";
import { InterceptedAuth } from "@/components/AuthModal";
export { metadata } from "@/app/reset-password/page";

export default function ModalPage(props: { searchParams: Promise<{ token?: string | string[] }> }) {
  return <InterceptedAuth><Page {...props} /></InterceptedAuth>;
}
