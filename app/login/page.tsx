import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Log in | YourBrand",
  description: "Log in to your account to track orders and shop faster.",
};

export default function LoginPage() {
  return <LoginForm />;
}