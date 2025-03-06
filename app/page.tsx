import Hero from "@/app/components/hero";
import Features from "@/app/components/features";
import About from "@/app/components/about";
import Faq from "@/app/components/faq";
import Footer from "@/app/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
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
