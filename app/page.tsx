import Hero from "@/app/components/hero";
import Features from "@/app/components/features";
import About from "@/app/components/about";
import Faq from "@/app/components/faq";
import Footer from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
export default function Home() {
  return (
    <div className="min-h-screen bg-lightBg dark:bg-darkBg text-lightText dark:text-darkText">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
