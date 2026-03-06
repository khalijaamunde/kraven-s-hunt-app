import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

const TeamRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: "",
    member1: "",
    member2: "",
    member3: "",
    member4: "",
    contact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/teams/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const team = await response.json();
      localStorage.setItem("huntTeam", JSON.stringify(team));
      navigate("/dashboard");
    } catch (error) {
      console.error('Failed to register:', error);
      alert('Registration failed. Please try again or use a different team name.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-hunter-gradient flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 pt-6 pb-2">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-gold transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="flex-1 text-center font-display text-lg text-gold tracking-wider">
          Team Registration
        </h2>
        <div className="w-6" />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="flex-1 px-6 py-6 space-y-5 max-w-md mx-auto w-full"
      >
        <div className="flex items-center justify-center mb-2">
          <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center bg-forest-deep/60">
            <Users className="w-7 h-7 text-gold" />
          </div>
        </div>

        {/* Team Name */}
        <div className="space-y-2">
          <Label className="text-sm text-gold/80 font-body tracking-wider uppercase">Team Name</Label>
          <Input
            value={formData.teamName}
            onChange={(e) => handleChange("teamName", e.target.value)}
            placeholder="Enter your pack name"
            required
            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 focus:ring-gold/20"
          />
        </div>

        {/* Members */}
        {[
          { key: "member1", label: "Alpha (Leader)" },
          { key: "member2", label: "Member 2" },
          { key: "member3", label: "Member 3" },
          { key: "member4", label: "Member 4" },
        ].map((member, i) => (
          <motion.div
            key={member.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="space-y-2"
          >
            <Label className="text-sm text-muted-foreground font-body tracking-wider uppercase">
              {member.label}
            </Label>
            <Input
              value={formData[member.key as keyof typeof formData]}
              onChange={(e) => handleChange(member.key, e.target.value)}
              placeholder="Full name"
              required={i < 2} // Only Alpha and Member 2 are strictly required
              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 focus:ring-gold/20"
            />
          </motion.div>
        ))}

        {/* Contact */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground font-body tracking-wider uppercase">
            Contact Number
          </Label>
          <Input
            value={formData.contact}
            onChange={(e) => handleChange("contact", e.target.value)}
            placeholder="+91 XXXXXXXXXX"
            type="tel"
            required
            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 focus:ring-gold/20"
          />
        </div>

        <div className="pt-4">
          <Button type="submit" variant="hunt" size="xl" className="w-full">
            Register & Begin
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default TeamRegistration;
