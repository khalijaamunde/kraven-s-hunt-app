import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crosshair, Timer, Lightbulb, SkipForward, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import clawTexture from "@/assets/claw-texture.png";
import { API_BASE_URL } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RiddleScreen = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [riddleData, setRiddleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(3600);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [trailSkipUsed, setTrailSkipUsed] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [showPenaltySkipDialog, setShowPenaltySkipDialog] = useState(false);
  const [showSkipAnimation, setShowSkipAnimation] = useState(false);
  const [showDeductAnimation, setShowDeductAnimation] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("huntTeam");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTeam(parsed);
      setTrailSkipUsed(parsed.trailSkipUsed || false);

      // Fetch riddle
      fetch(`${API_BASE_URL}/riddles/${parsed.currentStage || 1}`)
        .then(res => res.json())
        .then(data => {
          setRiddleData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
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

  const handleRevealHint = () => {
    setShowHintDialog(false);
    setHintRevealed(true);
  };

  const handleSkipApiCall = async (type: string) => {
    if (!team || !team._id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${team._id}/skip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("huntTeam", JSON.stringify(data.team));
        setTeam(data.team);
        if (type === 'trail') setTrailSkipUsed(true);
        // Refresh page or go back to dashboard to see next stage
        setTimeout(() => navigate("/dashboard"), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrailSkip = () => {
    setShowSkipDialog(false);
    setShowSkipAnimation(true);
    handleSkipApiCall('trail');
  };

  const handlePenaltySkip = () => {
    setShowPenaltySkipDialog(false);
    setShowDeductAnimation(true);
    handleSkipApiCall('penalty');
  };

  if (loading) {
    return <div className="min-h-screen bg-hunter-gradient flex items-center justify-center text-gold font-display">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-hunter-gradient flex flex-col relative overflow-hidden">
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${clawTexture})` }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-6 pb-4">
        <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-gold transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-xs text-gold/70 tracking-[0.3em] uppercase">Stage</p>
          <p className="font-display text-lg text-gold font-bold">{team?.currentStage || 1} of 15</p>
        </div>
        <div className="flex items-center gap-1 text-crimson">
          <Timer className="w-4 h-4 animate-pulse-glow" />
          <span className="font-display text-sm font-bold">{formatTime(time)}</span>
        </div>
      </div>

      {/* Riddle Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-card/80 border border-gold/20 rounded-xl p-6 max-w-sm w-full backdrop-blur-sm"
        >
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border border-gold/30 flex items-center justify-center">
            <span className="font-display text-gold text-sm font-bold">{team?.currentStage || 1}</span>
          </div>

          <p className="text-center text-foreground text-lg font-body leading-relaxed tracking-wide whitespace-pre-line">
            {riddleData?.text || "Find the mark where shadows meet..."}
          </p>

          <div className="mt-4 flex justify-center">
            <div className="flex gap-1">
              {Array.from({ length: 15 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < 4 ? "bg-gold" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>

          {/* Hint Card */}
          <AnimatePresence>
            {hintRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-gold/5 border border-gold/20 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-gold" />
                  <span className="text-xs text-gold uppercase tracking-wider font-display">Hunter's Insight</span>
                </div>
                <p className="text-sm text-foreground/80 font-body">
                  {riddleData?.hint || "Look closely at the architecture."}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-2 tracking-wider uppercase">Hint revealed</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Lifelines Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 max-w-sm w-full space-y-2"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-display">Lifelines</p>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
              Trail Skip: <span className={trailSkipUsed ? "text-crimson" : "text-gold"}>{trailSkipUsed ? "Used" : "Available"}</span>
            </p>
          </div>

          {/* Hint Button */}
          {!hintRevealed && (
            <Button
              variant="huntOutline"
              size="default"
              className="w-full text-sm"
              onClick={() => setShowHintDialog(true)}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Reveal Hint
            </Button>
          )}

          {/* Trail Skip or Penalty Skip */}
          {!trailSkipUsed ? (
            <Button
              variant="huntOutline"
              size="default"
              className="w-full text-sm"
              onClick={() => setShowSkipDialog(true)}
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Use Trail Skip
            </Button>
          ) : (
            <Button
              variant="huntOutline"
              size="default"
              className="w-full text-sm border-crimson/30 text-crimson hover:bg-crimson/10"
              onClick={() => setShowPenaltySkipDialog(true)}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Skip This Hunt
            </Button>
          )}
        </motion.div>
      </div>

      {/* Track button */}
      <div className="relative z-10 px-6 pb-6">
        <Button
          variant="crimson"
          size="xl"
          className="w-full"
          onClick={() => navigate("/scanner")}
        >
          <Crosshair className="w-5 h-5 mr-2" />
          Scan Target
        </Button>
      </div>
      {/* Hint Confirmation Dialog */}
      <AlertDialog open={showHintDialog} onOpenChange={setShowHintDialog}>
        <AlertDialogContent className="bg-card border-gold/20 max-w-[90vw]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-gold">Hunter's Insight</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/70">
              Reveal a hint for the current riddle. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-muted-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-gold text-hunter-black hover:bg-gold-light" onClick={handleRevealHint}>
              Reveal Hint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Trail Skip Confirmation Dialog */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent className="bg-card border-gold/20 max-w-[90vw]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-gold">Trail Skip</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/70">
              Using Trail Skip will skip this hunt without losing points. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-muted-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-gold text-hunter-black hover:bg-gold-light" onClick={handleTrailSkip}>
              Use Trail Skip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Penalty Skip Confirmation Dialog */}
      <AlertDialog open={showPenaltySkipDialog} onOpenChange={setShowPenaltySkipDialog}>
        <AlertDialogContent className="bg-card border-crimson/30 max-w-[90vw]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-crimson">Skip With Penalty</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/70">
              Trail Skip has already been used. Skipping this hunt will deduct points. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-muted-foreground">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-crimson text-foreground hover:bg-crimson/80" onClick={handlePenaltySkip}>
              Skip This Hunt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Skip Animation Overlay */}
      <AnimatePresence>
        {showSkipAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-hunter-black/90 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              <SkipForward className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="font-display text-2xl text-gold-gradient font-bold mb-2">The Hunt Moves Forward.</h2>
              <p className="text-muted-foreground text-sm">No points deducted</p>
            </motion.div>
          </motion.div>
        )}

        {showDeductAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-hunter-black/90 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center"
            >
              <motion.p
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6 }}
                className="font-display text-4xl text-crimson font-bold mb-2"
              >
                -50
              </motion.p>
              <p className="font-display text-lg text-crimson/70">Points Deducted</p>
              <p className="text-muted-foreground text-sm mt-2">Moving to next stage…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiddleScreen;
