import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crosshair, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import clawTexture from "@/assets/claw-texture.png";

const RiddleScreen = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(3600);

  useEffect(() => {
    const interval = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

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
          <p className="font-display text-lg text-gold font-bold">4 of 15</p>
        </div>
        <div className="flex items-center gap-1 text-crimson">
          <Timer className="w-4 h-4 animate-pulse-glow" />
          <span className="font-display text-sm font-bold">{formatTime(time)}</span>
        </div>
      </div>

      {/* Riddle Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-card/80 border border-gold/20 rounded-xl p-8 max-w-sm w-full backdrop-blur-sm"
        >
          <div className="w-10 h-10 mx-auto mb-6 rounded-full border border-gold/30 flex items-center justify-center">
            <span className="font-display text-gold text-sm font-bold">IV</span>
          </div>

          <p className="text-center text-foreground text-lg font-body leading-relaxed tracking-wide">
            "I stand where knowledge sleeps in rows,
            <br />
            Where silence reigns and wisdom grows.
            <br />
            Find the mark where shadows meet,
            <br />
            And claim your conquest at my feet."
          </p>

          <div className="mt-6 flex justify-center">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= 4 ? "bg-gold" : "bg-muted"
                  }`}
                />
              ))}
              {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-muted" />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Track button */}
      <div className="relative z-10 px-6 pb-8">
        <Button
          variant="crimson"
          size="xl"
          className="w-full"
          onClick={() => navigate("/scanner")}
        >
          <Crosshair className="w-5 h-5 mr-2" />
          Track the Prey
        </Button>
      </div>
    </div>
  );
};

export default RiddleScreen;
