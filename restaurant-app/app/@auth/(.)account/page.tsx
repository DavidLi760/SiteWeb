import Page from "@/app/account/page";
import { InterceptedAuth } from "@/components/AuthModal";

export default function ModalPage() {
  return <InterceptedAuth><Page /></InterceptedAuth>;
}
