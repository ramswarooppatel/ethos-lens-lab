import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scan, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Upload", path: "/upload" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Reports", path: "/reports" },
    { name: "Community", path: "/community" },
    { name: "Analytics", path: "/analytics" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Scan className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
              <div className="absolute inset-0 blur-lg bg-primary/30 group-hover:bg-accent/30 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Ethos<span className="text-gradient">Lens</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={location.pathname === link.path ? "glass" : "ghost"}
                  size="sm"
                  className={
                    location.pathname === link.path
                      ? "border-primary/50"
                      : ""
                  }
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Profile Button */}
          <div className="hidden md:block">
            <Link to="/profile">
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === link.path ? "glass" : "ghost"}
                    className="w-full justify-start"
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start">
                  Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
