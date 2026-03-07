import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Crosshair, LogIn } from "lucide-react";
import jungleBg from "@/assets/jungle-bg.png";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${jungleBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-4"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-gold/40 flex items-center justify-center bg-forest-deep/50 glow-gold">
            <Crosshair className="w-10 h-10 text-gold" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="font-display text-4xl sm:text-5xl font-bold text-gold-gradient leading-tight tracking-wide"
        >
          The Kraven's
          <br />
          Hunt
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-4 text-lg text-muted-foreground font-body tracking-widest uppercase"
        >
          "Only the Worthy Will Survive."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 flex flex-col gap-4 w-full"
        >
          <Button
            variant="hunt"
            size="xl"
            onClick={() => navigate("/register")}
            className="w-full"
          >
            <Shield className="w-5 h-5 mr-2" />
            Enter the Hunt
          </Button>

          <Button
            variant="huntOutline"
            size="lg"
            onClick={() => navigate("/organizer-register")}
            className="w-full"
          >
            <Crosshair className="w-4 h-4 mr-2" />
            Hunter's Control
          </Button>

          <Button
            variant="huntOutline"
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full border-crimson/30 text-crimson hover:bg-crimson/10 hover:border-crimson/50"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Hunter Login
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 text-xs text-muted-foreground tracking-[0.3em] uppercase"
        >
          The hunt begins now
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
