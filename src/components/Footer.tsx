import { Scan } from "lucide-react";

const Footer = () => {
  return (
    <footer className="glass-panel border-t mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scan className="w-6 h-6 text-primary" />
            <span className="text-sm text-muted-foreground">
              EthosLens — A lens to see the unseen ethics of AI.
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>© 2025 EthosLens. Ethical AI for everyone.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse row-span-2"></div>
                <span className="text-sm">Building the future, one line of code at a time</span>
              </div>
                              <a href="/developers" className="text-sm text-primary hover:underline">Meet the Developers</a>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
