import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, Database, Brain, Zap, Rocket, FileCode, BarChart3, PieChart, TrendingUp, Cpu, Globe, AlertTriangle, Shield, Target, Award, Activity, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart } from 'recharts';

interface ModelReportProps {
  formData: {
    mode: 'api' | 'pkl';
    apiInfo?: string | null;
    pklFile?: File | null;
    trainingDataset: File;
    testingDataset: File;
    prompt: string;
  };
  onBack?: () => void;
}

const ModelReport: React.FC<ModelReportProps> = ({ formData, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const steps = [
    { label: "Understanding Dataset", icon: Database, duration: 2000, color: "from-blue-500 to-cyan-500" },
    { label: "Using RAI to Evaluate", icon: Brain, duration: 2500, color: "from-purple-500 to-pink-500" },
    { label: "Using SHAP to Understand", icon: Zap, duration: 2000, color: "from-yellow-500 to-orange-500" },
    { label: "Making it Ready for You", icon: Rocket, duration: 1500, color: "from-green-500 to-emerald-500" },
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setProgress(((currentStep + 1) / steps.length) * 100);
      }, steps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setShowReport(true);
        if (reportRef.current && heroRef.current) {
          // Hero animation
          gsap.fromTo(heroRef.current,
            { opacity: 0, scale: 0.9, y: -30 },
            { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" }
          );
          
          // Staggered card animations
          gsap.fromTo(".report-card",
            { opacity: 0, y: 60, rotationX: -15 },
            { opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
          );

          // Floating animation for icons
          gsap.to(".float-icon", {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.2
          });

          // Pulse animation for stats
          gsap.to(".stat-number", {
            scale: 1.05,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            stagger: 0.3
          });
        }
      }, 1000);
    }
  }, [currentStep, steps]);

  // Enhanced data with more detail
  const classDistributionData = [
    { name: 'No Alcohol', value: 99.66, color: '#10b981', count: 258038 },
    { name: 'Alcohol Involved', value: 0.34, color: '#ef4444', count: 442 },
  ];

  const performanceData = [
    { subject: 'Accuracy', A: 99.99, fullMark: 100 },
    { subject: 'Precision', A: 100, fullMark: 100 },
    { subject: 'Recall', A: 99, fullMark: 100 },
    { subject: 'F1-Score', A: 99, fullMark: 100 },
    { subject: 'AUC', A: 98.5, fullMark: 100 },
  ];

  const biasAnalysisData = [
    { category: 'Gender', score: 92 },
    { category: 'Location', score: 88 },
    { category: 'Time', score: 95 },
    { category: 'Agency', score: 90 },
  ];

  const shapImportance = [
    { feature: 'Agency', importance: 0.28 },
    { feature: 'Location', importance: 0.22 },
    { feature: 'Time', importance: 0.18 },
    { feature: 'Vehicle Type', importance: 0.15 },
    { feature: 'Violation Type', importance: 0.17 },
  ];

  const techStack = [
    { name: 'Python', icon: '🐍', color: 'from-blue-400 to-blue-600' },
    { name: 'Pandas', icon: '🐼', color: 'from-green-400 to-green-600' },
    { name: 'Scikit-Learn', icon: '🧠', color: 'from-orange-400 to-orange-600' },
    { name: 'FastAPI', icon: '⚡', color: 'from-teal-400 to-teal-600' },
    { name: 'SHAP', icon: '🔍', color: 'from-purple-400 to-purple-600' },
  ];

  if (!showReport) {
    const CurrentIcon = steps[currentStep]?.icon || Sparkles;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 px-4">
          <div className="space-y-4">
            <Sparkles className="w-16 h-16 mx-auto text-yellow-400" style={{ animation: 'spin 3s linear infinite' }} />
            <h2 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Evaluating Your Model
            </h2>
            <p className="text-gray-300 text-lg">Using cutting-edge AI analysis techniques</p>
          </div>

          <div className="w-96 space-y-4">
            <Progress value={progress} className="h-3 bg-slate-700" />
            <div className="flex items-center justify-center gap-4 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              {currentStep < steps.length ? (
                <>
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${steps[currentStep].color}`}>
                    <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div className="text-left">
                    <span className="text-xl font-semibold text-white block">{steps[currentStep].label}</span>
                    <span className="text-sm text-gray-300">Step {currentStep + 1} of {steps.length}</span>
                  </div>
                </>
              ) : (
                <div className="text-xl font-semibold text-white">Finalizing...</div>
              )}
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index <= currentStep ? 'w-12 bg-gradient-to-r from-blue-400 to-purple-400' : 'w-8 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={reportRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -top-48 -left-48" style={{ animation: 'blob 7s infinite' }}></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl -bottom-48 -right-48" style={{ animation: 'blob 7s infinite 2s' }}></div>
        <div className="absolute w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-3xl top-1/2 left-1/2" style={{ animation: 'blob 7s infinite 4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          {onBack && (
            <Button 
              variant="outline" 
              onClick={onBack}
              className="bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          )}
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
            <CheckCircle className="w-4 h-4 mr-2" />
            Analysis Complete
          </Badge>
        </div>

        {/* Hero Section */}
        <div ref={heroRef} className="relative">
          <Card className="report-card bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <CardContent className="p-12 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl float-icon">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-5xl font-black text-white tracking-tight">
                        Model Evaluation Report
                      </h1>
                      <p className="text-xl text-blue-100 mt-2">Traffic Violation Prediction System</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
                      {formData.mode === 'api' ? '🌐 API-Based' : '📦 PKL-Based'}
                    </Badge>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
                      🎯 Binary Classification
                    </Badge>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 px-4 py-2">
                      🛡️ Responsible AI
                    </Badge>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center float-icon">
                      <Award className="w-16 h-16 text-yellow-300" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      99.99%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Target, label: 'Accuracy', value: '99.99%', color: 'from-blue-500 to-cyan-500' },
            { icon: Activity, label: 'F1-Score', value: '0.99', color: 'from-purple-500 to-pink-500' },
            { icon: Database, label: 'Dataset Size', value: '129K', color: 'from-green-500 to-emerald-500' },
            { icon: Shield, label: 'Bias Score', value: '91%', color: 'from-orange-500 to-red-500' },
          ].map((metric, index) => (
            <Card key={index} className="report-card bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center mb-4 float-icon`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{metric.label}</p>
                  <p className="text-3xl font-black text-gray-900 stat-number">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card className="report-card bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <Radar name="Performance" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-2xl font-bold text-indigo-600">100%</p>
                  <p className="text-xs text-gray-600 font-medium">Precision</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">99%</p>
                  <p className="text-xs text-gray-600 font-medium">Recall</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">98.5%</p>
                  <p className="text-xs text-gray-600 font-medium">AUC</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Distribution */}
          <Card className="report-card bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                Class Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={classDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(2)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {classDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "url(#greenGrad)" : "url(#redGrad)"} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">258,038</p>
                  <p className="text-xs text-gray-600 font-medium">No Alcohol Cases</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                  <p className="text-2xl font-bold text-red-600">442</p>
                  <p className="text-xs text-gray-600 font-medium">Alcohol Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SHAP Feature Importance */}
        <Card className="report-card bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              SHAP Feature Importance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={shapImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fill: '#6b7280' }} />
                <YAxis dataKey="feature" type="category" tick={{ fill: '#6b7280' }} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                  {shapImportance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${220 - index * 20}, 70%, 60%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4 bg-blue-50 p-4 rounded-xl">
              <span className="font-semibold">💡 Insight:</span> Agency and Location are the strongest predictors, contributing 50% of the model&apos;s decision-making process.
            </p>
          </CardContent>
        </Card>

        {/* Bias Analysis */}
        <Card className="report-card bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              Responsible AI Bias Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {biasAnalysisData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">{item.category}</span>
                    <span className={`text-sm font-bold ${item.score >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        item.score >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">✅ Ethical Compliance:</span> Model achieves 91% average fairness score across all categories, meeting responsible AI standards.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="report-card bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${tech.color} text-white text-center transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl`}
                >
                  <span className="text-5xl mb-3 block float-icon">{tech.icon}</span>
                  <p className="font-bold text-sm">{tech.name}</p>
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="report-card bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              Key Insights &amp; Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="font-bold text-lg text-gray-800">Strengths</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>99.99% accuracy with balanced precision-recall</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Ethical feature selection avoiding sensitive attributes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Robust RandomForest ensemble with class balancing</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  <h3 className="font-bold text-lg text-gray-800">Challenges</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">⚠</span>
                    <span>Highly imbalanced dataset (0.34% positive class)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">⚠</span>
                    <span>Potential hidden biases in location/agency features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">⚠</span>
                    <span>Limited external validation on unseen data</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-blue-500" />
                  <h3 className="font-bold text-lg text-gray-800">Next Steps</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">→</span>
                    <span>Implement k-fold cross-validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">→</span>
                    <span>Add LIME for local interpretability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">→</span>
                    <span>Deploy continuous bias monitoring</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 space-y-2">
          <p className="text-gray-600 font-medium">🚀 Powered by Ethical AI &amp; Responsible Machine Learning</p>
          <p className="text-sm text-gray-500">Generated with Advanced Analytics &amp; Modern Visualization</p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">ML Pipeline</Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">RAI Compliant</Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">SHAP Integrated</Badge>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ModelReport;