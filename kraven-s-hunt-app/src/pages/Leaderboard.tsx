import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Crown, Shield, Skull } from "lucide-react";

import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";

const getRankStyle = (rank: number) => {
  if (rank === 1) return "border-gold/50 bg-gold/10";
  if (rank === 2) return "border-muted-foreground/30 bg-muted/30";
  if (rank === 3) return "border-crimson/30 bg-crimson/10";
  return "border-border bg-card/50";
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-gold" />;
  if (rank === 2) return <Shield className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Skull className="w-5 h-5 text-crimson" />;
  return <span className="text-sm text-muted-foreground font-display font-bold">{rank}</span>;
};

const getRankLabel = (rank: number, badge?: string) => {
  if (!badge) return null;
  const colors: Record<string, string> = {
    Alpha: "text-gold",
    Apex: "text-muted-foreground",
    Predator: "text-crimson",
  };
  return <span className={`text-[10px] tracking-[0.2em] uppercase ${colors[badge]}`}>{badge}</span>;
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/organizer/leaderboard`)
      .then(res => res.json())
      .then(data => {
        setTeams(data.map((t: any, i: number) => ({
          rank: i + 1,
          name: t.teamName,
          points: t.points,
          time: t.currentStage + " stages",
          badge: i === 0 ? "Alpha" : (i === 1 ? "Apex" : (i === 2 ? "Predator" : ""))
        })));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-hunter-gradient flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 pt-6 pb-4">
        <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-gold transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
          <Trophy className="w-5 h-5 text-gold mx-auto mb-1" />
          <h2 className="font-display text-lg text-gold tracking-wider">Pack Ranking</h2>
        </div>
        <div className="w-6" />
      </div>

      {/* Team List */}
      <div className="flex-1 px-4 pb-6 space-y-2">
        {teams.map((team, i) => (
          <motion.div
            key={team.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getRankStyle(team.rank)}`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {getRankIcon(team.rank)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-body font-semibold text-foreground truncate">{team.name}</p>
                {getRankLabel(team.rank, team.badge)}
              </div>
              <p className="text-xs text-muted-foreground">{team.time}</p>
            </div>

            <div className="text-right">
              <p className={`font-display font-bold text-lg ${team.rank === 1 ? "text-gold" : team.rank === 3 ? "text-crimson" : "text-foreground"}`}>
                {team.points}
              </p>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">pts</p>
            </div>

            {/* Animated rank indicator for top 3 */}
            {team.rank <= 3 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-1.5 h-1.5 rounded-full ${team.rank === 1 ? "bg-gold" : team.rank === 2 ? "bg-muted-foreground" : "bg-crimson"
                  }`}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
