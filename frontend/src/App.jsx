import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Credentials from "./components/Credentials";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import Vision from "./components/Vision";
import Newsletter from "./components/Newsletter";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Credentials />
        <About />
        <HowItWorks />
        <Testimonials />
        <Vision />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
