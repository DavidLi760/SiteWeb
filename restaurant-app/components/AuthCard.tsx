import type { ReactNode } from "react";
import AuthModal from "./AuthModal";

export default function AuthCard({ icon, title, description, children, showAccountLabel = true }: {
  icon: string;
  title: string;
  description: string;
  children: ReactNode;
  showAccountLabel?: boolean;
}) {
  return (
    <AuthModal>
      <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <span aria-hidden="true" className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-800">
          <i className={`fa-solid ${icon}`} />
        </span>
        {showAccountLabel && <p className="text-xs font-semibold uppercase tracking-widest text-lime-700">Votre compte Sushi House</p>}
        <h1 className="mt-3 text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-4 leading-7 text-gray-600">{description}</p>
        {children}
      </div>
    </AuthModal>
  );
}
