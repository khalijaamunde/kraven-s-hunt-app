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

export default router;
