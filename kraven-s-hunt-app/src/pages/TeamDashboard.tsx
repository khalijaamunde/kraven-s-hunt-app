import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Crosshair, Trophy, Timer, Target, LogOut } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";

const TeamDashboard = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>({ _id: "", teamName: "Shadow Pack", currentStage: 1, points: 0 });
  const [time, setTime] = useState(3600); // 1 hour countdown

  useEffect(() => {
    const stored = localStorage.getItem("huntTeam");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTeam(parsed);

      if (parsed._id) {
        fetch(`${API_BASE_URL}/teams/${parsed._id}`)
          .then(res => res.json())
          .then(data => {
            if (data && data._id) {
              setTeam(data);
              localStorage.setItem("huntTeam", JSON.stringify(data));
            }
          })
          .catch(console.error);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const currentStage = team.currentStage || 1;
  const totalStages = 15;
  const points = team.points || 0;
  const progress = (currentStage / totalStages) * 100;

  return (
    <div className="min-h-screen bg-hunter-gradient flex flex-col px-5 py-6">
      {/* Team Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase mb-1">Your Pack</p>
        <h1 className="font-display text-2xl text-gold-gradient font-bold tracking-wide">
          {team.teamName}
        </h1>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <Target className="w-5 h-5 text-gold mx-auto mb-1" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Stage</p>
          <p className="text-xl font-bold text-foreground font-display">{currentStage}/{totalStages}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <Trophy className="w-5 h-5 text-gold mx-auto mb-1" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Points</p>
          <p className="text-xl font-bold text-foreground font-display">{points}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3 text-center">
          <Timer className="w-5 h-5 text-crimson mx-auto mb-1 animate-pulse-glow" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
          <p className="text-xl font-bold text-crimson font-display">{formatTime(time)}</p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex justify-between text-xs text-muted-foreground mb-2 uppercase tracking-wider">
          <span>Hunt Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
            className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full relative"
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gold-light animate-pulse-glow rounded-full" />
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3 flex-1"
      >
        <Button
          variant="hunt"
          size="xl"
          className="w-full"
          onClick={() => navigate("/riddle")}
        >
          <Eye className="w-5 h-5 mr-2" />
          View Current Riddle
        </Button>

        <Button
          variant="crimson"
          size="xl"
          className="w-full"
          onClick={() => navigate("/scanner")}
        >
          <Crosshair className="w-5 h-5 mr-2" />
          Scan Target
        </Button>

        <Button
          variant="huntOutline"
          size="lg"
          className="w-full"
          onClick={() => navigate("/leaderboard")}
        >
          <Trophy className="w-5 h-5 mr-2" />
          Alpha Ranking
        </Button>
      </motion.div>

      {/* Bottom */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <p className="text-[10px] text-muted-foreground/40 tracking-[0.4em] uppercase">
          Hunt {currentStage} of {totalStages} • Stay Sharp
        </p>

        <button
          onClick={() => { localStorage.removeItem("huntTeam"); navigate("/"); }}
          className="flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-crimson transition-colors uppercase tracking-wider"
        >
          <LogOut className="w-8 h-8" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default TeamDashboard;
