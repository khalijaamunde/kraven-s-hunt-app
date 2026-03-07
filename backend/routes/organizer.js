import express from 'express';
import Team from '../models/Team.js';
import Riddle from '../models/Riddle.js';
import Organizer from '../models/Organizer.js';

const router = express.Router();

// Register a new organizer
router.post('/register', async (req, res) => {
    try {
        const { organizerName, email, password, contact } = req.body;

        const existingOrganizer = await Organizer.findOne({ email });
        if (existingOrganizer) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const organizer = new Organizer({
            organizerName,
            email,
            password,
            contact
        });

        await organizer.save();
        res.status(201).json({ message: 'Registration successful', organizer });
    } catch (error) {
        res.status(500).json({ message: 'Error registering organizer', error: error.message });
    }
});

// Login organizer
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const organizer = await Organizer.findOne({ email });
        if (!organizer) {
            return res.status(404).json({ message: 'Organizer not found with this email' });
        }

        if (organizer.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.json({ message: 'Login successful', organizer });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

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

        // Define active as having interacted in the last 5 minutes
        const activeTimeLimit = new Date(Date.now() - 5 * 60 * 1000);
        const activeTeams = await Team.countDocuments({ lastActive: { $gte: activeTimeLimit } });

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
