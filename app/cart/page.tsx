import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "My Cart | YourBrand" };

export default function CartPage() {
  return (
    <>
      <Header />
      <CartView />
      <Footer />
    </>
  );
}