import Page from "@/app/forgot-password/page";
import { InterceptedAuth } from "@/components/AuthModal";

export default function ModalPage() {
  return <InterceptedAuth><Page /></InterceptedAuth>;
}
