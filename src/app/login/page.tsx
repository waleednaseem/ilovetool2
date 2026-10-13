import AuthForm from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to ConvertPDF.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-12">
      <AuthForm mode="login" />
    </main>
  );
}
