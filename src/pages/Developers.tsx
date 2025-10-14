import TeamCards from '../components/ui/TeamCards';

export default function Developers() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-primary/5 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Our Development Team
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Get to know the brilliant minds behind our innovative solutions. 
              Our diverse team of developers, designers, and engineers work together 
              to create exceptional digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Building the future, one line of code at a time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Cards Section */}
      <TeamCards />

      {/* Developer Quote & Code Section */}
      <section className="py-16 sm:py-20  relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Quote Section */}
            <div className="text-center lg:text-left">
              <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-6">
                <blockquote className="text-xl sm:text-2xl font-light text-white leading-relaxed italic">
                  "Code is poetry written in logic, where every function tells a story and every algorithm dances with elegance."
                </blockquote>
                <cite className="block mt-4 text-primary font-semibold not-italic">
                  — Our Development Philosophy
                </cite>
              </div>
              <p className="text-gray-300 text-lg">
                We believe in writing code that's not just functional, but beautiful. Every line we write is crafted with care, tested with rigor, and deployed with confidence.
              </p>
            </div>

            {/* Code Snippet Section */}
            <div className="space-y-6">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-700/50 border-b border-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">ethoslens-api.js</span>
                </div>
                <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto">
{`const ethosLens = {
  analyze: async (data) => {
    const insights = await processData(data);
    return {
      patterns: insights.patterns,
      ethics: evaluateEthics(insights),
      recommendations: generateRecommendations(insights)
    };
  },

  // Magic happens here ✨
  transform: (input) => input
    .map(x => x * Math.PI)
    .filter(x => x > 42)
    .reduce((a, b) => a ^ b, 0)
};

// Deploy to production 🚀
export default ethosLens;`}
                </pre>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-700/50 border-b border-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">neural-net.py</span>
                </div>
                <pre className="p-4 text-sm font-mono text-blue-400 overflow-x-auto">
{`import torch
import torch.nn as nn

class EthosNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(784, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 10),
            nn.Softmax(dim=1)
        )

    def forward(self, x):
        return self.layers(x)

# Because why not? 🤖
model = EthosNet()
print("AI Ethics Model Ready!")`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
   
 </div>
);
}
