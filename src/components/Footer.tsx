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
            © 2025 EthosLens. Ethical AI for everyone.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
