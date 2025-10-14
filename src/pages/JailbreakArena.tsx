import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Trophy,
  Target,
  Shield,
  Users,
  TrendingUp,
  Clock,
  Star,
  Lock,
  Unlock,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Medal,
  Award,
  Flame,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  points: number;
  timeLimit: number; // in seconds
  attempts: number;
  successRate: number;
  unlocked: boolean;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  challengesCompleted: number;
  rank: number;
}

interface GameSession {
  currentChallenge: Challenge | null;
  timeRemaining: number;
  attempts: number;
  score: number;
  streak: number;
  isActive: boolean;
}

const JailbreakArena = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("challenges");
  const [gameSession, setGameSession] = useState<GameSession>({
    currentChallenge: null,
    timeRemaining: 0,
    attempts: 0,
    score: 0,
    streak: 0,
    isActive: false
  });
  const [player, setPlayer] = useState<Player>({
    id: 'player1',
    name: 'You',
    avatar: '🎯',
    score: 1250,
    streak: 3,
    challengesCompleted: 8,
    rank: 15
  });

  // Mock challenges data
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Basic Prompt Injection',
      description: 'Try to bypass content filters using simple prompt manipulation techniques.',
      difficulty: 'easy',
      category: 'Prompt Engineering',
      points: 100,
      timeLimit: 300,
      attempts: 45,
      successRate: 78,
      unlocked: true
    },
    {
      id: '2',
      title: 'Role-Playing Jailbreak',
      description: 'Convince the AI to role-play as an unrestricted character.',
      difficulty: 'medium',
      category: 'Social Engineering',
      points: 200,
      timeLimit: 600,
      attempts: 32,
      successRate: 65,
      unlocked: true
    },
    {
      id: '3',
      title: 'Code Execution Bypass',
      description: 'Find ways to execute code despite safety restrictions.',
      difficulty: 'hard',
      category: 'Technical',
      points: 350,
      timeLimit: 900,
      attempts: 18,
      successRate: 42,
      unlocked: true
    },
    {
      id: '4',
      title: 'Multi-Turn Conversation Attack',
      description: 'Gradually manipulate the AI through extended conversation.',
      difficulty: 'expert',
      category: 'Advanced',
      points: 500,
      timeLimit: 1200,
      attempts: 8,
      successRate: 25,
      unlocked: false
    },
    {
      id: '5',
      title: 'Context Window Exploitation',
      description: 'Exploit token limits and context windows for jailbreak.',
      difficulty: 'expert',
      category: 'Technical',
      points: 600,
      timeLimit: 1500,
      attempts: 5,
      successRate: 20,
      unlocked: false
    },
    {
      id: '6',
      title: 'Adversarial Suffix Attack',
      description: 'Use carefully crafted suffixes to override model behavior.',
      difficulty: 'hard',
      category: 'Technical',
      points: 400,
      timeLimit: 800,
      attempts: 12,
      successRate: 33,
      unlocked: true
    }
  ];

  // Mock leaderboard data
  const leaderboard: Player[] = [
    { id: '1', name: 'AI_Hunter', avatar: '🏆', score: 2850, streak: 12, challengesCompleted: 24, rank: 1 },
    { id: '2', name: 'PromptMaster', avatar: '🧠', score: 2720, streak: 8, challengesCompleted: 22, rank: 2 },
    { id: '3', name: 'SecurityBuster', avatar: '🔓', score: 2580, streak: 15, challengesCompleted: 20, rank: 3 },
    { id: '4', name: 'CodeNinja', avatar: '🥷', score: 2410, streak: 6, challengesCompleted: 19, rank: 4 },
    { id: '5', name: 'EthicalHacker', avatar: '🛡️', score: 2350, streak: 9, challengesCompleted: 18, rank: 5 },
    { id: 'player1', name: 'You', avatar: '🎯', score: 1250, streak: 3, challengesCompleted: 8, rank: 15 }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-orange-400 bg-orange-400/10';
      case 'expert': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const startChallenge = (challenge: Challenge) => {
    if (!challenge.unlocked) {
      toast({
        title: "Challenge Locked",
        description: "Complete easier challenges to unlock this one.",
        variant: "destructive"
      });
      return;
    }

    setGameSession({
      currentChallenge: challenge,
      timeRemaining: challenge.timeLimit,
      attempts: 0,
      score: 0,
      streak: player.streak,
      isActive: true
    });

    toast({
      title: "Challenge Started!",
      description: `You have ${challenge.timeLimit / 60} minutes to complete this challenge.`,
    });
  };

  const simulateChallengeResult = useCallback((success: boolean) => {
    if (!gameSession.currentChallenge) return;

    const newScore = success ? gameSession.currentChallenge.points : 0;
    const newStreak = success ? gameSession.streak + 1 : 0;

    setPlayer(prev => ({
      ...prev,
      score: prev.score + newScore,
      streak: newStreak,
      challengesCompleted: success ? prev.challengesCompleted + 1 : prev.challengesCompleted
    }));

    setGameSession(prev => ({
      ...prev,
      isActive: false,
      score: newScore,
      streak: newStreak
    }));

    toast({
      title: success ? "Challenge Completed!" : "Challenge Failed",
      description: success
        ? `You earned ${newScore} points! Current streak: ${newStreak}`
        : "Better luck next time. Keep practicing!",
      variant: success ? "default" : "destructive"
    });
  }, [gameSession.currentChallenge, gameSession.streak, toast]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameSession.isActive && gameSession.timeRemaining > 0) {
      interval = setInterval(() => {
        setGameSession(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (gameSession.timeRemaining === 0 && gameSession.isActive) {
      simulateChallengeResult(false);
    }
    return () => clearInterval(interval);
  }, [gameSession.isActive, gameSession.timeRemaining, simulateChallengeResult]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl mb-8"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-red-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Jailbreak <span className="text-gradient">Arena</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Test your skills against AI models. Find vulnerabilities, earn points, and climb the leaderboard.
                Remember: This is for educational purposes only.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setActiveTab("challenges")}
                  className="w-full sm:w-auto"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start Playing
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setActiveTab("leaderboard")}
                  className="w-full sm:w-auto"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  View Leaderboard
                </Button>
              </div>
            </motion.div>

            {/* Player Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-primary">{player.score.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-accent">{player.streak}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-400">{player.challengesCompleted}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-yellow-400">#{player.rank}</div>
                <div className="text-sm text-muted-foreground">Global Rank</div>
              </div>
            </motion.div>
          </div>

          {/* Active Challenge */}
          {gameSession.isActive && gameSession.currentChallenge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-6 rounded-2xl mb-8 border-2 border-primary/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{gameSession.currentChallenge.title}</h2>
                  <p className="text-muted-foreground">{gameSession.currentChallenge.description}</p>
                </div>
                <Badge className={getDifficultyColor(gameSession.currentChallenge.difficulty)}>
                  {gameSession.currentChallenge.difficulty.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.floor(gameSession.timeRemaining / 60)}:{(gameSession.timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{gameSession.attempts}</div>
                  <div className="text-sm text-muted-foreground">Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{gameSession.currentChallenge.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="default"
                  onClick={() => simulateChallengeResult(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Success
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => simulateChallengeResult(false)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Failed
                </Button>
              </div>
            </motion.div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 bg-slate-800/50 border border-slate-700 mb-8">
              <TabsTrigger value="challenges" className="text-xs sm:text-sm">Challenges</TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-xs sm:text-sm">Leaderboard</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs sm:text-sm hidden lg:inline-flex">Statistics</TabsTrigger>
            </TabsList>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className={`glass-panel-hover transition-all duration-300 ${
                      challenge.unlocked ? 'hover:border-primary/50' : 'opacity-60'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{challenge.title}</CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {challenge.description}
                            </p>
                          </div>
                          {challenge.unlocked ? (
                            <Unlock className="w-5 h-5 text-green-400 ml-2 flex-shrink-0" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-medium text-primary">
                              {challenge.points} pts
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Attempts</div>
                              <div className="font-medium">{challenge.attempts}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Success Rate</div>
                              <div className="font-medium">{challenge.successRate}%</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {Math.floor(challenge.timeLimit / 60)} min limit
                          </div>

                          <Button
                            className="w-full"
                            variant={challenge.unlocked ? "default" : "secondary"}
                            disabled={!challenge.unlocked}
                            onClick={() => startChallenge(challenge)}
                          >
                            {challenge.unlocked ? (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start Challenge
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Locked
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Global Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((playerData, index) => (
                      <motion.div
                        key={playerData.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                          playerData.id === player.id
                            ? 'bg-primary/20 border border-primary/50'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankIcon(playerData.rank)}
                          </div>
                          <div className="text-2xl">{playerData.avatar}</div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{playerData.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {playerData.challengesCompleted} challenges • {playerData.streak} streak
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {playerData.score.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">points</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Success Rate</span>
                        <span className="font-medium">62%</span>
                      </div>
                      <Progress value={62} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg. Time</span>
                        <span className="font-medium">8.5 min</span>
                      </div>
                      <Progress value={75} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Best Streak</span>
                        <span className="font-medium">15</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      Challenge Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Prompt Engineering</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Social Engineering</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Technical</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Advanced</span>
                        <span className="font-medium">5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">1,247</div>
                        <div className="text-sm text-muted-foreground">Active Players</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent">8,932</div>
                        <div className="text-sm text-muted-foreground">Total Challenges</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">73%</div>
                        <div className="text-sm text-muted-foreground">Avg Success Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default JailbreakArena;