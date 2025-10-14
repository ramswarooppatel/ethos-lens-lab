import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Search, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-panel p-12 rounded-2xl max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-4 text-gradient">
              404
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Page Not Found
            </h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </Link>

              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => navigate("/")} className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Home</h3>
                <p className="text-sm text-muted-foreground">
                  Return to the main landing page
                </p>
              </button>

              <button onClick={() => navigate("/dashboard")} className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Access your analysis dashboard
                </p>
              </button>

              <button onClick={() => navigate("/arena")} className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Arena</h3>
                <p className="text-sm text-muted-foreground">
                  Test AI models in the jailbreak arena
                </p>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
