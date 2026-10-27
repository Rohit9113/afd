import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileView from "@/components/ProfileView";

export const metadata: Metadata = { title: "My Profile | YourBrand" };

export default function ProfilePage() {
  return (
    <>
      <Header />
      <ProfileView />
      <Footer />
    </>
  );
}