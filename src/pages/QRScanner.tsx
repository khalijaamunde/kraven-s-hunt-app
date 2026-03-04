import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

const QRScanner = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hunter-black flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 relative z-10">
        <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-gold transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <p className="font-display text-sm text-gold tracking-wider">Scan Mark</p>
        <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-crimson transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Camera Preview Mock */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Dark camera background */}
        <div className="absolute inset-0 bg-gradient-to-b from-hunter-black via-forest-deep/40 to-hunter-black" />

        {/* Scanning Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-64 h-64 z-10"
        >
          {/* Corner markers - crimson glow */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-crimson glow-crimson rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-crimson glow-crimson rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-crimson glow-crimson rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-crimson glow-crimson rounded-br-lg" />

          {/* Scanning line */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [0, 256] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-0.5 bg-gradient-to-r from-transparent via-crimson to-transparent shadow-[0_0_10px_hsl(0_75%_45%/0.8)]"
            />
          </div>

          {/* Crosshair center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 relative opacity-30">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-crimson/60" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-crimson/60" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center pb-12"
      >
        <p className="font-display text-lg text-crimson-glow tracking-wider animate-flicker">
          Mark Your Conquest
        </p>
        <p className="text-xs text-muted-foreground/50 mt-2 tracking-widest uppercase">
          Align the QR within the frame
        </p>
      </motion.div>
    </div>
  );
};

export default QRScanner;
