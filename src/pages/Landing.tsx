import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Scan, Upload, BarChart3, Users, Shield, Zap } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Models & Datasets",
      description: "Drag-and-drop AI models and datasets for instant bias detection and fairness analysis.",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "View detailed fairness metrics, demographic parity, and predictive equality scores.",
    },
    {
      icon: Users,
      title: "Community-Driven Audits",
      description: "Collaborate with experts and citizens to review and discuss AI ethics.",
    },
    {
      icon: Shield,
      title: "Transparency Reports",
      description: "Generate detailed transparency reports with AI-powered summaries.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Logo Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Scan className="w-20 h-20 text-primary animate-glow" />
                <div className="absolute inset-0 blur-2xl bg-primary/40" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              A lens to see the{" "}
              <span className="text-gradient">unseen ethics</span> of AI
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Crowd-sourced bias detection and fairness auditing platform.
              Analyze AI models and datasets for ethical compliance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/upload">
                <Button variant="hero" size="lg">
                  <Zap className="w-5 h-5" />
                  Start Auditing
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" size="lg">
                  <BarChart3 className="w-5 h-5" />
                  Explore Bias Reports
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="text-gradient">EthosLens?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform for detecting AI bias and ensuring fairness in machine learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-panel-hover p-6 rounded-2xl"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 glow-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-12 rounded-3xl text-center max-w-3xl mx-auto border-primary/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to audit your AI models?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the community of researchers, developers, and citizens building ethical AI together.
            </p>
            <Link to="/upload">
              <Button variant="hero" size="lg">
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
