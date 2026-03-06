import express from 'express';
import Team from '../models/Team.js';
import Riddle from '../models/Riddle.js';

const router = express.Router();

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const teams = await Team.find()
            .sort({ points: -1, currentStage: -1 })
            .select('teamName points currentStage');

        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
    }
});

// Get general stats for dashboard
router.get('/stats', async (req, res) => {
    try {
        const totalTeams = await Team.countDocuments();

        // Define active as having interacted in the last 15 minutes
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const activeTeams = await Team.countDocuments({ lastActive: { $gte: fifteenMinsAgo } });

        // Determine total stages dynamically or hardcode it (assuming 15 from UI)
        const totalStages = 15;
        const completedTeams = await Team.countDocuments({ currentStage: { $gt: totalStages } });

        res.json({
            totalTeams,
            activeTeams,
            completedTeams
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

export default router;
