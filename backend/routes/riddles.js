import express from 'express';
import Riddle from '../models/Riddle.js';

const router = express.Router();

// Get riddle for a specific stage
router.get('/:stage', async (req, res) => {
    try {
        // Only return text and hint, not the targetCode
        const riddle = await Riddle.findOne({ stageNumber: req.params.stage }).select('-targetCode -_id');
        if (!riddle) return res.status(404).json({ message: 'Riddle not found for this stage' });

        res.json(riddle);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching riddle', error: error.message });
    }
});

// Get all riddles for organizers
router.get('/', async (req, res) => {
    try {
        const riddles = await Riddle.find().sort({ stageNumber: 1 });
        res.json(riddles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching riddles', error: error.message });
    }
});

// Update a riddle
router.put('/:stage', async (req, res) => {
    try {
        const { stage } = req.params;
        const { text, hint, targetCode } = req.body;

        const updatedRiddle = await Riddle.findOneAndUpdate(
            { stageNumber: stage },
            { text, hint, targetCode },
            { new: true } // return the updated document
        );

        if (!updatedRiddle) {
            return res.status(404).json({ message: 'Riddle not found' });
        }

        res.json(updatedRiddle);
    } catch (error) {
        res.status(500).json({ message: 'Error updating riddle', error: error.message });
    }
});

export default router;
