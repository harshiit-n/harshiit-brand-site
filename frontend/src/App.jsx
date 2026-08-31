import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import HowItWorks from "./components/HowItWorks";
import Vision from "./components/Vision";
import Newsletter from "./components/Newsletter";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ServicesPage from "./components/ServicesPage";
import BlogPage from "./components/BlogPage";
import AdminBlogPage from "./components/AdminBlogPage";
import ScrollToHash from "./components/ScrollToHash";
import SectionIndex from "./components/SectionIndex";

const HOME_SECTIONS = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "how-it-works", label: "How I Work" },
  { id: "vision", label: "Vision" },
  { id: "contact", label: "Contact" },
];

function HomePage() {
  return (
    <>
      <SectionIndex sections={HOME_SECTIONS} />
      <Hero />
      <About />
      <HowItWorks />
      <Vision />
      <Newsletter />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="min-h-screen">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/admin/blog" element={<AdminBlogPage />} />
            <Route path="/videos" element={<Navigate to="/blog" replace />} />
            <Route path="/admin/videos" element={<Navigate to="/admin/blog" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
