import { MotionConfig } from "motion/react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import TrackRecord from "./components/TrackRecord";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Philosophy />
        <Testimonials />
        <TrackRecord />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
