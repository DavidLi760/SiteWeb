import Page from "@/app/signup/page";
import { InterceptedAuth } from "@/components/AuthModal";

export default function ModalPage() {
  return <InterceptedAuth><Page /></InterceptedAuth>;
}
