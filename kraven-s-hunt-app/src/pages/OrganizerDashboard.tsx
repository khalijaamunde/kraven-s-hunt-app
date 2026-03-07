import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Activity, CheckCircle, FileText, Eye, Trophy, MapPin, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from "react";

const targetObjects = [
  { stage: 1, object: "Main Gate", status: "active" },
  { stage: 2, object: "Library Entrance", status: "active" },
  { stage: 3, object: "Clock Tower", status: "active" },
  { stage: 4, object: "Fountain", status: "active" },
  { stage: 5, object: "Auditorium", status: "pending" },
  { stage: 6, object: "Sports Complex", status: "pending" },
  { stage: 7, object: "Cafeteria", status: "pending" },
  { stage: 8, object: "Admin Block", status: "pending" },
];

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({ totalTeams: 0, activeTeams: 0, completedTeams: 0 });

  useEffect(() => {
    fetch(`${API_BASE_URL}/organizer/stats`)
      .then(res => res.json())
      .then(data => setStatsData(data))
      .catch(console.error);
  }, []);

  const stats = [
    { label: "Total Teams", value: statsData.totalTeams, icon: Users, color: "text-gold" },
    { label: "Active Now", value: statsData.activeTeams, icon: Activity, color: "text-crimson" },
    { label: "Completed", value: statsData.completedTeams, icon: CheckCircle, color: "text-forest" },
  ];

  return (
    <div className="min-h-screen bg-hunter-gradient flex flex-col px-5 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-gold transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-xs text-crimson tracking-[0.3em] uppercase mb-1">Control Center</p>
          <h1 className="font-display text-xl text-gold-gradient font-bold tracking-wide">
            Hunter's Control
          </h1>
        </div>
        <div className="w-6" />
      </div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="bg-card rounded-lg border border-border p-4 text-center"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-foreground font-display">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Target Object Management */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-lg border border-border p-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gold" />
          <h3 className="font-display text-sm text-gold tracking-wider">Target Object Management</h3>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {targetObjects.map((target) => (
            <div key={target.stage} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center">
                  <span className="text-xs text-gold font-display font-bold">{target.stage}</span>
                </div>
                <p className="text-sm text-foreground font-semibold">{target.object}</p>
              </div>
              <span className={`text-[10px] uppercase tracking-wider ${target.status === "active" ? "text-gold" : "text-muted-foreground/50"}`}>
                {target.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-lg border border-border p-4 mb-6"
      >
        <h3 className="font-display text-sm text-gold tracking-wider mb-3">Live Activity</h3>
        <div className="space-y-2">
          {[
            { team: "Night Stalkers", action: "Scanned Clock Tower — Stage 8 Cleared", time: "2m ago" },
            { team: "Shadow Pack", action: "Scanning at Library Entrance", time: "5m ago" },
            { team: "Blood Hounds", action: "Viewing Riddle 6", time: "7m ago" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm text-foreground font-semibold">{activity.team}</p>
                <p className="text-xs text-muted-foreground">{activity.action}</p>
              </div>
              <span className="text-[10px] text-muted-foreground/60">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <Button variant="hunt" size="lg" className="w-full">
          <FileText className="w-4 h-4 mr-2" />
          Manage 15 Riddles
        </Button>
        <Button variant="crimson" size="lg" className="w-full">
          <Eye className="w-4 h-4 mr-2" />
          Monitor Live Progress
        </Button>
        <Button variant="huntOutline" size="lg" className="w-full" onClick={() => navigate("/leaderboard")}>
          <Trophy className="w-4 h-4 mr-2" />
          View Alpha Ranking
        </Button>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50 hover:text-crimson transition-colors uppercase tracking-wider mt-2 w-full py-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </motion.div>
    </div>
  );
};

export default OrganizerDashboard;
