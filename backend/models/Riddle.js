import mongoose from 'mongoose';

const riddleSchema = new mongoose.Schema({
    stageNumber: { type: Number, required: true, unique: true },
    text: { type: String, required: true },
    hint: { type: String },
    targetCode: { type: String, required: true }, // The string the scanner expects
});

export default mongoose.model('Riddle', riddleSchema);
