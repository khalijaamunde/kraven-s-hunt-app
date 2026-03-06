import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true, unique: true },
    members: [{ type: String }],
    contact: { type: String },
    currentStage: { type: Number, default: 1 },
    points: { type: Number, default: 0 },
    trailSkipUsed: { type: Boolean, default: false },
    startTime: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
});

export default mongoose.model('Team', teamSchema);
