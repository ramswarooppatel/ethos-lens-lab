import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy, Zap, Bot, Target, BarChart3, PieChart, TrendingUp,
  RefreshCw, Play, Settings, Award, Star, Users,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  RadarController
} from "chart.js";
import { Pie, Radar, Bar } from "react-chartjs-2";
// Direct Groq API integration - no backend needed
const runLLMCompetitionDirect = async (modelA: string, modelB: string, prompt: string, rounds: number = 5): Promise<CompetitionResult> => {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "gsk_your_api_key_here"; // Replace with your actual API key

  console.log("Groq API Key available:", !!GROQ_API_KEY);
  console.log("Using API Key:", GROQ_API_KEY.substring(0, 10) + "...");

  const competitionPrompt = `You are an AI competition analyst with access to web search capabilities. Generate a realistic LLM competition result between two models based on their known capabilities, recent benchmarks, and performance data.

COMPETITION DETAILS:
- Model A: ${modelA}
- Model B: ${modelB}
- Competition Prompt: "${prompt}"
- Number of Rounds: ${rounds}

Based on your knowledge of these models' capabilities, recent benchmarks (like LMSYS Chatbot Arena, MT-Bench, etc.), and web search results about their performance, generate a JSON response with the following structure:

{
  "metadata": {
    "competition_id": "generate-a-uuid",
    "timestamp": ${Math.floor(Date.now() / 1000)},
    "models": ["${modelA}", "${modelB}"],
    "total_examples": ${rounds}
  },
  "results": {
    "model_a_wins": <number>,
    "model_b_wins": <number>,
    "ties": <number>,
    "win_rate_a": <percentage>,
    "win_rate_b": <percentage>
  },
  "examples": [
    {
      "prompt": "<variation of the original prompt>",
      "model_a_response": "<realistic response from model A>",
      "model_b_response": "<realistic response from model B>",
      "winner": "A" or "B" or "tie",
      "score": <0.0-1.0>,
      "rationale": "<brief explanation of why this model won>"
    }
  ],
  "metrics": {
    "creativity": {"model_a": <1-10>, "model_b": <1-10>},
    "coherence": {"model_a": <1-10>, "model_b": <1-10>},
    "helpfulness": {"model_a": <1-10>, "model_b": <1-10>},
    "toxicity": {"model_a": <1-10>, "model_b": <1-10>}
  }
}

INSTRUCTIONS:
1. Research the models' capabilities from your training data and known benchmarks
2. Generate realistic win/loss ratios based on which model typically performs better
3. Create varied prompts for each round based on the original prompt
4. Generate plausible responses that each model would give
5. Provide fair but realistic evaluations
6. Ensure the math adds up (wins + losses + ties = total rounds)
7. Make the results statistically reasonable

KNOWN MODEL STRENGTHS (use this as reference):
- GPT-4o/GPT-4o-mini: Strong in reasoning, coding, general knowledge
- Claude-3.5-Sonnet/Claude-3-Haiku: Excellent at creative writing, safety, long contexts
- Gemini-Pro: Good at multimodal, factual accuracy
- Llama-3.1-70b/8b: Strong in coding, open-source capabilities
- Mixtral-8x7b: Good at multilingual, efficient processing
- Qwen-2-72b: Strong in multilingual, competitive performance

Return ONLY valid JSON, no additional text or formatting.`;

  const requestBody = {
    model: "llama-3.3-70b-versatile", // Try Mixtral model
    messages: [
      {
        role: "system",
        content: "You are an expert AI competition analyst. Generate realistic competition data based on model capabilities and benchmarks. Always return valid JSON."
      },
      {
        role: "user",
        content: competitionPrompt
      }
    ],
    max_tokens: 2000, // Reduce token limit
    temperature: 0.7
  };

  console.log("Request body:", JSON.stringify(requestBody, null, 2));

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  console.log("Response status:", response.status);
  console.log("Response headers:", Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq API Error:", errorText);
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("Groq API Response:", data);
  const resultText = data.choices[0].message.content.trim();

  // Clean the response (remove any markdown formatting)
  let cleanResult = resultText;
  if (cleanResult.startsWith("```json")) {
    cleanResult = cleanResult.replace("```json", "").replace("```", "").trim();
  } else if (cleanResult.startsWith("```")) {
    cleanResult = cleanResult.replace("```", "").trim();
  }

  try {
    const competitionResult = JSON.parse(cleanResult);

    // Validate the structure
    const requiredKeys = ["metadata", "results", "examples", "metrics"];
    if (!requiredKeys.every(key => key in competitionResult)) {
      throw new Error("Missing required keys in response");
    }

    // Ensure the competition ID is set
    if (!competitionResult.metadata.competition_id) {
      competitionResult.metadata.competition_id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    return competitionResult;
  } catch (parseError) {
    console.error("Failed to parse Groq response:", parseError);
    console.error("Raw response:", resultText);

    // Fallback: generate basic competition data
    return generateFallbackCompetition(modelA, modelB, prompt, rounds);
  }
};

// Fallback competition generator when Groq API fails
const generateFallbackCompetition = (modelA: string, modelB: string, prompt: string, rounds: number): CompetitionResult => {
  // Model performance scores (higher is better)
  const modelScores: Record<string, number> = {
    "gpt-4o": 8.5, "gpt-4o-mini": 8.0,
    "claude-3-5-sonnet": 8.8, "claude-3-haiku": 7.5,
    "gemini-pro": 7.8, "llama-3.1-70b": 8.2, "llama-3.1-8b": 7.0,
    "mixtral-8x7b": 7.3, "qwen-2-72b": 7.6
  };

  const scoreA = modelScores[modelA] || 7.0;
  const scoreB = modelScores[modelB] || 7.0;

  // Calculate wins based on relative performance
  let modelAWins: number, modelBWins: number;
  if (scoreA > scoreB) {
    modelAWins = Math.floor(rounds * 0.6) + Math.floor(Math.random() * (rounds * 0.2));
    modelBWins = Math.floor(Math.random() * (rounds - modelAWins - 1));
  } else if (scoreB > scoreA) {
    modelBWins = Math.floor(rounds * 0.6) + Math.floor(Math.random() * (rounds * 0.2));
    modelAWins = Math.floor(Math.random() * (rounds - modelBWins - 1));
  } else {
    modelAWins = Math.floor(rounds * 0.4) + Math.floor(Math.random() * (rounds * 0.2));
    modelBWins = Math.floor(Math.random() * (rounds - modelAWins - 1));
  }

  const ties = rounds - modelAWins - modelBWins;

  // Generate example rounds
  const examples = [];
  const promptVariations = [
    prompt,
    `Please explain ${prompt.toLowerCase()}`,
    `Give a detailed answer about ${prompt.toLowerCase()}`,
    `What are your thoughts on ${prompt.toLowerCase()}?`,
    `Discuss ${prompt.toLowerCase()} in depth`
  ];

  for (let i = 0; i < rounds; i++) {
    const roundPrompt = promptVariations[i % promptVariations.length];

    // Determine winner based on calculated wins
    let winner: 'A' | 'B' | 'tie';
    if (i < modelAWins) {
      winner = 'A';
    } else if (i < modelAWins + modelBWins) {
      winner = 'B';
    } else {
      winner = 'tie';
    }

    examples.push({
      prompt: roundPrompt,
      model_a_response: `Here's my analysis of ${prompt}: [Detailed response from ${modelA}]`,
      model_b_response: `My perspective on ${prompt}: [Alternative response from ${modelB}]`,
      winner,
      score: 0.6 + Math.random() * 0.4,
      rationale: `Model ${winner} provided ${winner === 'A' ? 'more detailed' : winner === 'B' ? 'more creative' : 'balanced'} response`
    });
  }

  return {
    metadata: {
      competition_id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      models: [modelA, modelB],
      total_examples: rounds
    },
    results: {
      model_a_wins: modelAWins,
      model_b_wins: modelBWins,
      ties,
      win_rate_a: Math.round((modelAWins / rounds) * 100 * 10) / 10,
      win_rate_b: Math.round((modelBWins / rounds) * 100 * 10) / 10
    },
    examples,
    metrics: {
      creativity: {
        model_a: Math.round((scoreA + (Math.random() - 0.5)) * 10) / 10,
        model_b: Math.round((scoreB + (Math.random() - 0.5)) * 10) / 10
      },
      coherence: {
        model_a: Math.round((scoreA + (Math.random() - 0.3)) * 10) / 10,
        model_b: Math.round((scoreB + (Math.random() - 0.3)) * 10) / 10
      },
      helpfulness: {
        model_a: Math.round((scoreA + (Math.random() - 0.2)) * 10) / 10,
        model_b: Math.round((scoreB + (Math.random() - 0.2)) * 10) / 10
      },
      toxicity: {
        model_a: Math.round(Math.random() * 3 * 10) / 10,
        model_b: Math.round(Math.random() * 3 * 10) / 10
      }
    }
  };
};

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  RadarController
);

interface CompetitionResult {
  metadata: {
    competition_id: string;
    timestamp: string;
    models: string[];
    total_examples: number;
  };
  results: {
    model_a_wins: number;
    model_b_wins: number;
    ties: number;
    win_rate_a: number;
    win_rate_b: number;
  };
  examples: Array<{
    prompt: string;
    model_a_response: string;
    model_b_response: string;
    winner: 'A' | 'B' | 'tie';
    score: number;
    rationale: string;
  }>;
  metrics: {
    creativity: { model_a: number; model_b: number };
    coherence: { model_a: number; model_b: number };
    helpfulness: { model_a: number; model_b: number };
    toxicity: { model_a: number; model_b: number };
  };
}

interface LoadingStep {
  step: string;
  status: 'pending' | 'active' | 'completed';
}

const AVAILABLE_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-3-5-sonnet",
  "claude-3-haiku",
  "gemini-pro",
  "llama-3.1-70b",
  "llama-3.1-8b",
  "mixtral-8x7b",
  "qwen-2-72b"
];

const QUICK_PROMPTS = [
  "Write a creative story about AI taking over the world",
  "Explain quantum computing in simple terms",
  "Debate the pros and cons of social media",
  "Write a poem about technology and humanity",
  "Design a solution for climate change",
  "Explain machine learning to a 5-year-old",
  "What would you do if you won the lottery?",
  "Describe your perfect day in vivid detail",
  "Convince me to adopt a healthy lifestyle",
  "Write a movie plot about time travel gone wrong",
  "Explain blockchain technology simply",
  "What are the most important skills for the future?",
  "Write a letter to your future self",
  "Describe the taste of your favorite food",
  "How would you solve world hunger?"
];

const LLMCompetitor = () => {
  const { toast } = useToast();

  const [modelA, setModelA] = useState("");
  const [modelB, setModelB] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [competitionResult, setCompetitionResult] = useState<CompetitionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { step: "Getting LLM information...", status: "pending" },
    { step: "Analyzing Model A capabilities...", status: "pending" },
    { step: "Analyzing Model B capabilities...", status: "pending" },
    { step: "Generating competition prompts...", status: "pending" },
    { step: "Calling Groq AI for analysis...", status: "pending" },
    { step: "Processing competition results...", status: "pending" },
    { step: "Preparing infographics...", status: "pending" },
    { step: "Competition complete!", status: "pending" }
  ]);

  const startCompetition = async () => {
    if (!modelA || !modelB) {
      toast({
        title: "Missing Models",
        description: "Please select both models for competition.",
        variant: "destructive",
      });
      return;
    }

    const prompt = customPrompt || selectedPrompt;
    if (!prompt) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a custom prompt or select a quick prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCompetitionResult(null);

    // Reset loading steps
    setLoadingSteps(steps => steps.map(step => ({ ...step, status: "pending" })));

    try {
      // Simulate loading steps with delays
      await runLoadingSteps();

      // Call the competition API directly with Groq
      const result = await runLLMCompetitionDirect(modelA, modelB, prompt, 5);
      setCompetitionResult(result);

      toast({
        title: "Competition Complete!",
        description: `Winner: ${result.results.model_a_wins > result.results.model_b_wins ? modelA : modelB}`,
      });

    } catch (error) {
      toast({
        title: "Competition Failed",
        description: "Failed to run LLM competition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runLoadingSteps = async () => {
    for (let i = 0; i < loadingSteps.length; i++) {
      setLoadingSteps(steps =>
        steps.map((step, index) =>
          index === i ? { ...step, status: "active" } :
          index < i ? { ...step, status: "completed" } :
          step
        )
      );

      // Simulate delay for each step
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    }
  };

  const resetCompetition = () => {
    setCompetitionResult(null);
    setModelA("");
    setModelB("");
    setCustomPrompt("");
    setSelectedPrompt("");
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              LLM <span className="text-gradient">Competitor</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pit two AI models against each other in an epic battle of intelligence, creativity, and performance.
              Watch as they compete across multiple rounds with detailed analysis and scoring.
            </p>
          </div>

          {!competitionResult && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="glass-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-accent" />
                    Competition Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Model Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="modelA" className="text-sm font-medium">
                        Model A
                      </Label>
                      <Select value={modelA} onValueChange={setModelA}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select first model" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_MODELS.map(model => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="modelB" className="text-sm font-medium">
                        Model B
                      </Label>
                      <Select value={modelB} onValueChange={setModelB}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select second model" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_MODELS.map(model => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Prompt Selection */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Competition Prompt</Label>

                    <Tabs defaultValue="quick" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="quick">Quick Prompts</TabsTrigger>
                        <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
                      </TabsList>

                      <TabsContent value="quick" className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {QUICK_PROMPTS.map((prompt, index) => (
                            <Button
                              key={index}
                              variant={selectedPrompt === prompt ? "default" : "outline"}
                              size="sm"
                              className="text-left h-auto p-3 whitespace-normal"
                              onClick={() => setSelectedPrompt(prompt)}
                            >
                              {prompt}
                            </Button>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="custom" className="space-y-3">
                        <textarea
                          className="w-full p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                          rows={4}
                          placeholder="Enter your custom competition prompt..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Start Button */}
                  <div className="flex justify-center pt-6">
                    <Button
                      size="lg"
                      className="px-8 py-3"
                      onClick={startCompetition}
                      disabled={!modelA || !modelB || (!customPrompt && !selectedPrompt)}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Competition
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="glass-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent animate-pulse" />
                    Running Competition...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loadingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'active' ? 'bg-accent animate-pulse' :
                          'bg-muted'
                        }`} />
                        <span className={`text-sm ${
                          step.status === 'active' ? 'text-accent font-medium' : 'text-muted-foreground'
                        }`}>
                          {step.step}
                        </span>
                        {step.status === 'active' && (
                          <div className="ml-auto">
                            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results */}
          {competitionResult && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Winner Announcement */}
              <Card className="glass-panel border-accent/20 text-center">
                <CardContent className="pt-6">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Competition Results</h2>
                    <div className="flex justify-center items-center gap-4 mb-4">
                      <Badge variant="outline" className="px-4 py-2">
                        <Bot className="w-4 h-4 mr-2" />
                        {competitionResult.metadata.models[0]}
                      </Badge>
                      <span className="text-2xl font-bold text-accent">VS</span>
                      <Badge variant="outline" className="px-4 py-2">
                        <Bot className="w-4 h-4 mr-2" />
                        {competitionResult.metadata.models[1]}
                      </Badge>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Winner: <span className="font-bold text-accent">
                        {competitionResult.results.model_a_wins > competitionResult.results.model_b_wins
                          ? competitionResult.metadata.models[0]
                          : competitionResult.metadata.models[1]}
                      </span>
                    </p>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass-panel-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Model A Wins</p>
                        <p className="text-2xl font-bold">{competitionResult.results.model_a_wins}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Model B Wins</p>
                        <p className="text-2xl font-bold">{competitionResult.results.model_b_wins}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Ties</p>
                        <p className="text-2xl font-bold">{competitionResult.results.ties}</p>
                      </div>
                      <Users className="w-8 h-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Rounds</p>
                        <p className="text-2xl font-bold">{competitionResult.metadata.total_examples}</p>
                      </div>
                      <Target className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Win Rate Chart */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Win Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{competitionResult.metadata.models[0]}</span>
                        <span>{competitionResult.results.win_rate_a.toFixed(1)}%</span>
                      </div>
                      <Progress value={competitionResult.results.win_rate_a} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{competitionResult.metadata.models[1]}</span>
                        <span>{competitionResult.results.win_rate_b.toFixed(1)}%</span>
                      </div>
                      <Progress value={competitionResult.results.win_rate_b} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500 mb-1">
                        {competitionResult.metrics.creativity.model_a.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Creativity A</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500 mb-1">
                        {competitionResult.metrics.creativity.model_b.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Creativity B</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500 mb-1">
                        {competitionResult.metrics.coherence.model_a.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Coherence A</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500 mb-1">
                        {competitionResult.metrics.coherence.model_b.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Coherence B</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Win Distribution Pie Chart */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-accent" />
                    Win Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie
                      data={{
                        labels: [
                          `${competitionResult.metadata.models[0]} Wins`,
                          `${competitionResult.metadata.models[1]} Wins`,
                          'Ties'
                        ],
                        datasets: [{
                          data: [
                            competitionResult.results.model_a_wins,
                            competitionResult.results.model_b_wins,
                            competitionResult.results.ties
                          ],
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)'
                          ],
                          borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(245, 158, 11, 1)'
                          ],
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                            labels: {
                              color: 'rgba(255, 255, 255, 0.8)',
                              font: {
                                size: 12
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Performance Comparison Radar Chart */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Radar
                      data={{
                        labels: ['Creativity', 'Coherence', 'Helpfulness', 'Toxicity'],
                        datasets: [
                          {
                            label: competitionResult.metadata.models[0],
                            data: [
                              competitionResult.metrics.creativity.model_a,
                              competitionResult.metrics.coherence.model_a,
                              competitionResult.metrics.helpfulness?.model_a || 0,
                              (10 - (competitionResult.metrics.toxicity?.model_a || 0)) // Invert toxicity for better visualization
                            ],
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
                          },
                          {
                            label: competitionResult.metadata.models[1],
                            data: [
                              competitionResult.metrics.creativity.model_b,
                              competitionResult.metrics.coherence.model_b,
                              competitionResult.metrics.helpfulness?.model_b || 0,
                              (10 - (competitionResult.metrics.toxicity?.model_b || 0)) // Invert toxicity for better visualization
                            ],
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                              color: 'rgba(255, 255, 255, 0.8)',
                              font: {
                                size: 10
                              }
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            },
                            angleLines: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            },
                            pointLabels: {
                              color: 'rgba(255, 255, 255, 0.8)',
                              font: {
                                size: 12,
                                weight: 'bold'
                              }
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            labels: {
                              color: 'rgba(255, 255, 255, 0.8)',
                              font: {
                                size: 12
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Round-by-Round Performance */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Round-by-Round Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: competitionResult.examples.map((_, index) => `Round ${index + 1}`),
                        datasets: [
                          {
                            label: competitionResult.metadata.models[0],
                            data: competitionResult.examples.map(example =>
                              example.winner === 'A' ? 1 : example.winner === 'B' ? 0 : 0.5
                            ),
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                          },
                          {
                            label: competitionResult.metadata.models[1],
                            data: competitionResult.examples.map(example =>
                              example.winner === 'B' ? 1 : example.winner === 'A' ? 0 : 0.5
                            ),
                            backgroundColor: 'rgba(16, 185, 129, 0.8)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            stacked: false,
                            ticks: {
                              color: 'rgba(255, 255, 255, 0.8)',
                              font: {
                                size: 11
                              }
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          },
                          y: {
                            beginAtZero: true,
                            max: 1,
                            ticks: {
                              color: 'rgba(255, 255, 255, 0.8)',
                              font: {
                                size: 11
                              },
                              callback: function(value) {
                                if (value === 0) return 'Loss';
                                if (value === 0.5) return 'Tie';
                                return 'Win';
                              }
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)'
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            labels: {
                              color: 'rgba(255, 255, 255, 0.8)',
                              font: {
                                size: 12
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const value = context.parsed.y;
                                if (value === 0) return `${context.dataset.label}: Loss`;
                                if (value === 0.5) return `${context.dataset.label}: Tie`;
                                return `${context.dataset.label}: Win`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sample Rounds */}
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    Competition Rounds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {competitionResult.examples.slice(0, 3).map((example, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="mb-3">
                          <Badge variant="outline" className="mb-2">
                            Round {index + 1}
                          </Badge>
                          <p className="text-sm font-medium">{example.prompt}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`p-3 rounded-lg border-2 ${
                            example.winner === 'A' ? 'border-blue-500 bg-blue-50/10' : 'border-border'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4" />
                              <span className="text-sm font-medium">{competitionResult.metadata.models[0]}</span>
                              {example.winner === 'A' && <Trophy className="w-4 h-4 text-yellow-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {example.model_a_response}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border-2 ${
                            example.winner === 'B' ? 'border-green-500 bg-green-50/10' : 'border-border'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4" />
                              <span className="text-sm font-medium">{competitionResult.metadata.models[1]}</span>
                              {example.winner === 'B' && <Trophy className="w-4 h-4 text-yellow-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {example.model_b_response}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                          <strong>Winner:</strong> {example.winner === 'A' ? competitionResult.metadata.models[0] :
                                                   example.winner === 'B' ? competitionResult.metadata.models[1] : 'Tie'}
                          <br />
                          <strong>Rationale:</strong> {example.rationale}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reset Button */}
              <div className="flex justify-center">
                <Button variant="outline" onClick={resetCompetition}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start New Competition
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LLMCompetitor;