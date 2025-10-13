import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Scan, Upload, BarChart3, Users, Shield, Zap, Play, TrendingUp, FileText, Award } from "lucide-react";
import { addModel, addDataset, addReport, incrementStat, getStats, insertDemoData } from "@/lib/localStorage";
import { generateMockModel, generateMockDataset, generateMockReport } from "@/lib/mockData";
import Spline from '@splinetool/react-spline';

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const stats = getStats();

  const handleQuickDemo = () => {
    insertDemoData();
    // Could add a toast or redirect, but for now just insert data
  };

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Circuit Background */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 224, 198, 0.1)" />
              <stop offset="100%" stopColor="rgba(155, 158, 245, 0.1)" />
            </linearGradient>
          </defs>
          {/* Circuit lines */}
          <path d="M0 400 L200 400 L200 200 L400 200" stroke="url(#circuitGradient)" strokeWidth="2" fill="none" className="animate-pulse">
            <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M800 600 L1000 600 L1000 400 L1200 400" stroke="url(#circuitGradient)" strokeWidth="2" fill="none" className="animate-pulse">
            <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="4s" repeatCount="indefinite" />
          </path>
          <circle cx="200" cy="200" r="4" fill="rgba(0, 224, 198, 0.6)" className="animate-ping" />
          <circle cx="1000" cy="400" r="4" fill="rgba(155, 158, 245, 0.6)" className="animate-ping" />
        </svg>
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{ y, opacity, fontFamily: "'Roboto', sans-serif" }}
      >
        {/* Load Roboto from Google Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-2000" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto pt-14 px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] pt-12">
            {/* Left Column - Headlines and CTA */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
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
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                A lens to see the{" "}
                <span className="text-gradient">unseen ethics</span> of AI
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0"
              >
                Crowd-sourced bias detection and fairness auditing platform.
                Analyze AI models and datasets for ethical compliance.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/upload">
                  <Button variant="default" size="lg">
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
                <Button onClick={handleQuickDemo} variant="secondary" size="lg" className="glass-panel-hover">
                  <Play className="w-5 h-5" />
                  Quick Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Spline 3D Model */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative md:pl-12 h-96 lg:h-[500px] w-full"
            >
              <Spline scene="https://prod.spline.design/4U5ZCKdoUeWfoByC/scene.splinecode" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Platform <span className="text-gradient">Impact</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Real-time statistics from our community-driven AI ethics observatory
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass-panel p-6 rounded-2xl text-center"
            >
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{stats.modelsAudited}</div>
              <div className="text-sm text-muted-foreground">Models Audited</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-panel p-6 rounded-2xl text-center"
            >
              <FileText className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">{stats.reportsGenerated}</div>
              <div className="text-sm text-muted-foreground">Reports Generated</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="glass-panel p-6 rounded-2xl text-center"
            >
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{stats.communityPosts}</div>
              <div className="text-sm text-muted-foreground">Community Posts</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-panel p-6 rounded-2xl text-center"
            >
              <Award className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">{Math.round(stats.averageFairnessScore)}%</div>
              <div className="text-sm text-muted-foreground">Avg Fairness Score</div>
            </motion.div>
          </div>
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

      <section className="max-h-max py-24 relative bo rder-rounded-md">
            <Spline scene="https://prod.spline.design/5lOJAClO4qUm5n12/scene.splinecode" />
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
              <Button variant="default" size="lg">
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
