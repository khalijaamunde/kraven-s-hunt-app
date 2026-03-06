import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Camera, CheckCircle, AlertTriangle, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";

type ScanState = "scanning" | "capturing" | "analyzing" | "success" | "failure";

const HuntScanner = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<ScanState>("scanning");
    const [scanInput, setScanInput] = useState("");
    const pointsEarned = 100;

    const handleCapture = async () => {
        if (!scanInput.trim()) return;
        setState("capturing");
        setTimeout(() => setState("analyzing"), 800);

        const stored = localStorage.getItem("huntTeam");
        if (!stored) {
            setTimeout(() => setState("failure"), 2000);
            return;
        }
        const team = JSON.parse(stored);

        try {
            const res = await fetch(`${API_BASE_URL}/teams/${team._id}/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scannedCode: scanInput })
            });
            const data = await res.json();

            setTimeout(() => {
                if (data.success) {
                    localStorage.setItem("huntTeam", JSON.stringify(data.team));
                    setState("success");
                } else {
                    setState("failure");
                }
            }, 2000);
        } catch (e) {
            console.error(e);
            setTimeout(() => setState("failure"), 2000);
        }
    };

    const handleRetry = () => setState("scanning");

    return (
        <div className="min-h-screen bg-hunter-black flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-6 pb-4 relative z-20">
                <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-gold transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <p className="font-display text-sm text-gold tracking-wider">Hunt Scanner</p>
                <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-crimson transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Camera Preview Area */}
            <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-hunter-black via-forest-deep/40 to-hunter-black" />

                {/* Scanning Grid */}
                <div className="absolute inset-0 z-10 opacity-10">
                    <div className="w-full h-full" style={{
                        backgroundImage: `
              linear-gradient(hsl(var(--crimson) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--crimson) / 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px',
                    }} />
                </div>

                {/* Animated scanning grid sweep */}
                {(state === "scanning" || state === "capturing") && (
                    <motion.div
                        className="absolute inset-0 z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-full h-full" style={{
                            backgroundImage: `
                linear-gradient(hsl(var(--crimson) / 0.2) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--crimson) / 0.2) 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px',
                        }} />
                    </motion.div>
                )}

                {/* Targeting Frame */}
                <AnimatePresence mode="wait">
                    {(state === "scanning" || state === "capturing") && (
                        <motion.div
                            key="frame"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-72 h-72 z-10"
                        >
                            {/* Corner targeting brackets */}
                            {[
                                "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                                "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                                "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
                            ].map((pos, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        boxShadow: [
                                            "0 0 10px hsl(0 75% 45% / 0.4)",
                                            "0 0 25px hsl(0 75% 45% / 0.7)",
                                            "0 0 10px hsl(0 75% 45% / 0.4)",
                                        ],
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                    className={`absolute w-12 h-12 border-crimson ${pos}`}
                                />
                            ))}

                            {/* Scanning line */}
                            <div className="absolute inset-0 overflow-hidden">
                                <motion.div
                                    animate={{ y: [0, 288] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-0.5 bg-gradient-to-r from-transparent via-crimson to-transparent shadow-[0_0_15px_hsl(0_75%_45%/0.8)]"
                                />
                            </div>

                            {/* Center crosshair */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Crosshair className="w-10 h-10 text-crimson/50" />
                                </motion.div>
                            </div>

                            {/* Pulse effect during capture */}
                            {state === "capturing" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.3, 0.8] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="absolute inset-0 border-2 border-crimson rounded-lg"
                                />
                            )}
                        </motion.div>
                    )}

                    {/* Analyzing State */}
                    {state === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="z-10 text-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 mx-auto mb-6 border-2 border-crimson/30 border-t-crimson rounded-full"
                            />
                            <motion.p
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="font-display text-lg text-crimson tracking-wider"
                            >
                                Scanning…
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-xs text-muted-foreground/60 mt-2 tracking-widest uppercase"
                            >
                                Analyzing environment…
                            </motion.p>
                        </motion.div>
                    )}

                    {/* Success State */}
                    {state === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="z-10 text-center px-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-gold/50 bg-gold/10 flex items-center justify-center glow-gold"
                            >
                                <CheckCircle className="w-10 h-10 text-gold" />
                            </motion.div>
                            <h2 className="font-display text-2xl text-gold-gradient font-bold mb-2">Target Confirmed</h2>
                            <p className="text-foreground/70 font-body mb-4">"You have found the prey."</p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-card/80 border border-gold/20 rounded-lg p-4 mb-6"
                            >
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Points Earned</p>
                                <p className="font-display text-3xl text-gold font-bold">+{pointsEarned}</p>
                                <p className="text-xs text-muted-foreground mt-1">Stage Cleared</p>
                            </motion.div>
                            <Button variant="hunt" size="xl" className="w-full" onClick={() => navigate("/riddle")}>
                                Unlock Next Hunt
                            </Button>
                        </motion.div>
                    )}

                    {/* Failure State */}
                    {state === "failure" && (
                        <motion.div
                            key="failure"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="z-10 text-center px-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-crimson/50 bg-crimson/10 flex items-center justify-center glow-crimson"
                            >
                                <AlertTriangle className="w-10 h-10 text-crimson" />
                            </motion.div>
                            <h2 className="font-display text-2xl text-crimson font-bold mb-2">Wrong Target</h2>
                            <p className="text-foreground/70 font-body mb-6">"This is not your prey."</p>
                            <Button variant="crimson" size="xl" className="w-full" onClick={handleRetry}>
                                Continue Hunting
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom area */}
            <div className="relative z-20 px-6 pb-8">
                {state === "scanning" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <p className="font-display text-lg text-crimson text-center tracking-wider mb-2 animate-flicker">
                            Hunt the Mark.
                        </p>
                        <p className="text-xs text-muted-foreground/50 text-center mb-4 tracking-widest uppercase">
                            Aim at the target object
                        </p>
                        <Input
                            value={scanInput}
                            onChange={(e) => setScanInput(e.target.value)}
                            placeholder="Enter Target Code (e.g. MAIN_GATE)"
                            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 mb-3 text-center uppercase"
                        />
                        <Button variant="crimson" size="xl" className="w-full" onClick={handleCapture} disabled={!scanInput.trim()}>
                            <Camera className="w-5 h-5 mr-2" />
                            Capture Target
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default HuntScanner;