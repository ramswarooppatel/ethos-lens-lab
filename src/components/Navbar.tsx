import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=100",
          scrub: true,
        },
        scale: 0.95,
        borderRadius: "24px",
        margin: "12px auto",
        maxWidth: "1200px",
        padding: "8px 16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Upload", path: "/upload" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Reports", path: "/reports" },
    { name: "Community", path: "/community" },
    { name: "Analytics", path: "/analytics" },
  ];

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div ref={containerRef} className="container mx-auto px-4 py-4 transition-all duration-300">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Scan className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">EthosLens</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant={location.pathname === link.path ? "default" : "ghost"}
                asChild
                size="sm"
              >
                <Link to={link.path}>{link.name}</Link>
              </Button>
            ))}
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  variant={location.pathname === link.path ? "default" : "ghost"}
                  asChild
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to={link.path}>{link.name}</Link>
                </Button>
              ))}
              <Button
                variant="outline"
                asChild
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/profile">Profile</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
