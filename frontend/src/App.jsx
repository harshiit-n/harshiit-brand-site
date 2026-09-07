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
import AdminTrackingPage from "./components/AdminTrackingPage";
import ScrollToHash from "./components/ScrollToHash";
import SectionIndex from "./components/SectionIndex";
import ConsentBanner from "./components/ConsentBanner";
import RouteAnalytics from "./components/RouteAnalytics";
import { AttributionProvider } from "./lib/attribution";

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
    <AttributionProvider>
      <BrowserRouter>
        <RouteAnalytics />
        <ScrollToHash />
        <div className="min-h-screen">
          <Nav />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/admin/blog" element={<AdminBlogPage />} />
              <Route path="/admin/tracking" element={<AdminTrackingPage />} />
              <Route path="/videos" element={<Navigate to="/blog" replace />} />
              <Route path="/admin/videos" element={<Navigate to="/admin/blog" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ConsentBanner />
      </BrowserRouter>
    </AttributionProvider>
  );
}
