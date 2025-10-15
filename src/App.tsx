import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import PublicHub from "./pages/PublicHub";
import Developers from "./pages/Developers";
import JailbreakArena from "./pages/JailbreakArena";
import LearningHub from "./pages/LearningHub";
import DatasetAnalysis from "./pages/DatasetAnalysis";
import LLMCompetitor from "./pages/LLMCompetitor";
import { AuthProvider } from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/developers" element={<Developers />} />
                <Route path="/arena" element={<ProtectedRoute><JailbreakArena /></ProtectedRoute>} />
                <Route path="/hub" element={<PublicHub />} />
                <Route path="/learn" element={<LearningHub />} />
                <Route path="/analysis" element={<ProtectedRoute><DatasetAnalysis /></ProtectedRoute>} />
                <Route path="/competitor" element={<ProtectedRoute><LLMCompetitor /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
