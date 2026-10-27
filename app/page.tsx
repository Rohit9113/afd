import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductSection from "@/components/ProductSection";
import Tagline from "@/components/Tagline";
import Experience from "@/components/Experience";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { bestSellers} from "@/data/products";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Categories />
        <ProductSection title="Most Loved Picks" products={bestSellers} href="/collections/best-sellers" />
        <Tagline />
        <Experience />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
