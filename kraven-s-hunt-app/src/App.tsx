import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import TeamRegistration from "./pages/TeamRegistration";
import OrganizerRegistration from "./pages/OrganizerRegistration";
import Login from "./pages/Login";
import TeamDashboard from "./pages/TeamDashboard";
import RiddleScreen from "./pages/RiddleScreen";
import HuntScanner from "./pages/HuntScanner.tsx";
import Leaderboard from "./pages/Leaderboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageRiddles from "./pages/ManageRiddles";

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
          <Route path="/organizer-register" element={<OrganizerRegistration />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Team Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRole="team"><TeamDashboard /></ProtectedRoute>} />
          <Route path="/riddle" element={<ProtectedRoute allowedRole="team"><RiddleScreen /></ProtectedRoute>} />
          <Route path="/scanner" element={<ProtectedRoute allowedRole="team"><HuntScanner /></ProtectedRoute>} />

          {/* Protected Organizer Route */}
          <Route path="/organizer" element={<ProtectedRoute allowedRole="organizer"><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/organizer/riddles" element={<ProtectedRoute allowedRole="organizer"><ManageRiddles /></ProtectedRoute>} />

          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
