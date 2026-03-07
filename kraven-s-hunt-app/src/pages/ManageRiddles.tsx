import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit3, Save, X, Plus } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Riddle {
    stageNumber: number;
    text: string;
    hint: string;
    targetCode: string;
}

const ManageRiddles = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [riddles, setRiddles] = useState<Riddle[]>([]);
    const [editingStage, setEditingStage] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Riddle>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRiddles();
    }, []);

    const fetchRiddles = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/riddles`);
            const data = await res.json();
            setRiddles(data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch riddles", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (riddle: Riddle) => {
        setEditingStage(riddle.stageNumber);
        setEditForm({
            text: riddle.text,
            hint: riddle.hint,
            targetCode: riddle.targetCode
        });
    };

    const handleCancel = () => {
        setEditingStage(null);
        setEditForm({});
    };

    const handleSave = async (stage: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/riddles/${stage}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });

            if (!res.ok) throw new Error("Failed to update riddle");

            toast({ title: "Success", description: `Stage ${stage} updated successfully` });
            setEditingStage(null);
            fetchRiddles();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-hunter-gradient flex flex-col px-5 py-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button onClick={() => navigate("/organizer")} className="text-muted-foreground hover:text-gold transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 text-center">
                    <p className="text-xs text-crimson tracking-[0.3em] uppercase mb-1">Editor</p>
                    <h1 className="font-display text-xl text-gold-gradient font-bold tracking-wide">
                        Manage Riddles
                    </h1>
                </div>
                <div className="w-6" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pb-12">
                {isLoading ? (
                    <p className="text-center text-muted-foreground">Loading riddles...</p>
                ) : riddles.length === 0 ? (
                    <div className="text-center text-muted-foreground bg-card p-6 rounded-lg border border-border">
                        No riddles found. (Requires manual seed)
                    </div>
                ) : (
                    riddles.map((riddle) => (
                        <motion.div
                            key={riddle.stageNumber}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card rounded-lg border border-border p-4"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center">
                                        <span className="text-sm text-gold font-display font-bold">{riddle.stageNumber}</span>
                                    </div>
                                    <h3 className="font-display font-semibold text-lg text-foreground">Stage {riddle.stageNumber}</h3>
                                </div>
                                {editingStage !== riddle.stageNumber ? (
                                    <button onClick={() => handleEdit(riddle)} className="text-muted-foreground hover:text-gold p-1">
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button onClick={handleCancel} className="text-muted-foreground hover:text-crimson p-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {editingStage === riddle.stageNumber ? (
                                <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gold/80 uppercase tracking-wider">Riddle Text</Label>
                                        <Textarea
                                            value={editForm.text || ''}
                                            onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                                            className="bg-background border-border min-h-[100px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gold/80 uppercase tracking-wider">Hint</Label>
                                        <Input
                                            value={editForm.hint || ''}
                                            onChange={(e) => setEditForm({ ...editForm, hint: e.target.value })}
                                            className="bg-background border-border"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gold/80 uppercase tracking-wider">Target Code</Label>
                                        <Input
                                            value={editForm.targetCode || ''}
                                            onChange={(e) => setEditForm({ ...editForm, targetCode: e.target.value })}
                                            className="bg-background border-border font-mono text-crimson"
                                        />
                                    </div>
                                    <Button
                                        variant="hunt"
                                        className="w-full mt-2"
                                        onClick={() => handleSave(riddle.stageNumber)}
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 mt-2 pl-11">
                                    <div>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Text</span>
                                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{riddle.text}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Hint</span>
                                        <p className="text-sm text-muted-foreground italic">{riddle.hint}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Target Code</span>
                                        <code className="text-xs text-crimson bg-crimson/10 px-2 py-1 rounded border border-crimson/20">
                                            {riddle.targetCode}
                                        </code>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageRiddles;
