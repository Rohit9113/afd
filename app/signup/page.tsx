import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | YourBrand",
  description: "Join us for pure, traditional foods delivered to your door.",
};

export default function SignupPage() {
  return <SignupForm />;
}