import express from 'express';
import Team from '../models/Team.js';
import Riddle from '../models/Riddle.js';

const router = express.Router();

// Register a new team
router.post('/register', async (req, res) => {
    try {
        const { teamName, email, password, member1, member2, member3, member4, contact } = req.body;

        // Filter out empty members
        const members = [member1, member2, member3, member4].filter(m => m && m.trim() !== '');

        const existingTeam = await Team.findOne({ teamName });
        if (existingTeam) {
            return res.status(400).json({ message: 'Team name already exists' });
        }

        if (email) {
            const existingEmail = await Team.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already registered' });
            }
        }

        const team = new Team({
            teamName,
            email,
            password,
            members,
            contact,
        });

        await team.save();
        res.status(201).json({ message: 'Registration successful', team });
    } catch (error) {
        res.status(500).json({ message: 'Error registering team', error: error.message });
    }
});

// Get team details
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching team', error: error.message });
    }
});

// Login team
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const team = await Team.findOne({ email });
        if (!team) {
            return res.status(404).json({ message: 'Team not found with this email' });
        }

        if (team.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.json({ message: 'Login successful', team });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Scan target to complete stage
router.post('/:id/scan', async (req, res) => {
    try {
        const { scannedCode } = req.body;
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const currentRiddle = await Riddle.findOne({ stageNumber: team.currentStage });
        if (!currentRiddle) {
            return res.status(404).json({ message: 'Current stage riddle not found' });
        }

        if (scannedCode.toLowerCase().trim() === currentRiddle.targetCode.toLowerCase().trim()) {
            // Correct scan!
            team.currentStage += 1;
            team.points += 100; // Award 100 points per stage
            team.lastActive = new Date();
            await team.save();

            res.json({ success: true, message: 'Stage cleared!', team });
        } else {
            res.status(400).json({ success: false, message: 'Invalid target code' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying scan', error: error.message });
    }
});

// Skip stage
router.post('/:id/skip', async (req, res) => {
    try {
        const { type } = req.body; // 'trail' or 'penalty'
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        if (type === 'trail') {
            if (team.trailSkipUsed) {
                return res.status(400).json({ message: 'Trail skip already used' });
            }
            team.trailSkipUsed = true;
        } else if (type === 'penalty') {
            team.points -= 50; // Deduct 50 points
        } else {
            return res.status(400).json({ message: 'Invalid skip type' });
        }

        team.currentStage += 1;
        team.lastActive = new Date();
        await team.save();

        res.json({ success: true, message: 'Stage skipped', team });
    } catch (error) {
        res.status(500).json({ message: 'Error skipping stage', error: error.message });
    }
});

export default router;
