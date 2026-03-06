import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import TeamRegistration from "./pages/TeamRegistration";
import TeamDashboard from "./pages/TeamDashboard";
import RiddleScreen from "./pages/RiddleScreen";
import HuntScanner from "./pages/HuntScanner.tsx";
import Leaderboard from "./pages/Leaderboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<TeamRegistration />} />
          <Route path="/dashboard" element={<TeamDashboard />} />
          <Route path="/riddle" element={<RiddleScreen />} />
          <Route path="/scanner" element={<HuntScanner />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
