import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scan, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
} from "@/components/ui/drawer";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Upload", path: "/upload" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Reports", path: "/reports" },
    { name: "Community", path: "/community" },
    { name: "Analytics", path: "/analytics" },
    { name: "Arena", path: "/arena" },
    { name: "Public Hub", path: "/hub" },
  ];

  return (
    <nav className={`fixed top-0 z-50 glass-panel border-b transition-all duration-300 ${
      isScrolled ? 'left-1/2 transform -translate-x-1/2 w-full max-w-6xl mt-2 md:mt-4 shadow-2xl rounded-lg bg-background/95 backdrop-blur-md' : 'left-0 right-0'
    }`}>
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
          <div className="hidden text-white md:flex items-center gap-1">
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
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <DrawerContent className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r">
              <DrawerHeader className="border-b pb-4">
                <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative">
                    <Scan className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                    <div className="absolute inset-0 blur-lg bg-primary/30 group-hover:bg-accent/30 transition-all duration-300" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">
                    Ethos<span className="text-gradient">Lens</span>
                  </span>
                </Link>
              </DrawerHeader>
              <div className="flex flex-col h-full">
                <div className="flex-1 px-4 py-4 space-y-2">
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
                  {isAuthenticated ? (
                    <Button variant="outline" className="w-full justify-start" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      Logout
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="px-4 py-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Developed by DND
                  </p>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
