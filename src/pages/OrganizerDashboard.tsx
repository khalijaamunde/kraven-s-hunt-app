import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Activity, CheckCircle, FileText, Eye, Trophy } from "lucide-react";

const stats = [
  { label: "Total Teams", value: 24, icon: Users, color: "text-gold" },
  { label: "Active Now", value: 18, icon: Activity, color: "text-crimson" },
  { label: "Completed", value: 6, icon: CheckCircle, color: "text-forest" },
];

const OrganizerDashboard = () => {
  const navigate = useNavigate();

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
            { team: "Night Stalkers", action: "Completed Stage 8", time: "2m ago" },
            { team: "Shadow Pack", action: "Scanned QR at Stage 4", time: "5m ago" },
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
      </motion.div>
    </div>
  );
};

export default OrganizerDashboard;
