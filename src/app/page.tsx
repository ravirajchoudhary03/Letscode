import { GalaxyBackground } from "@/components/GalaxyBackground";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Metrics } from "@/components/Metrics";
import { UseCases } from "@/components/UseCases";
import { Footer } from "@/components/Footer";
import { FloatingParticlesBackground } from "@/components/FloatingParticlesBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <GalaxyBackground />
      <Navbar />
      <Hero />
      <Features />
      <Metrics />
      <UseCases />
      <Footer />
    </main>
  );
}
