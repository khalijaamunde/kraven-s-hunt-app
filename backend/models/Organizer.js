import mongoose from 'mongoose';

const organizerSchema = new mongoose.Schema({
    organizerName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    contact: { type: String },
    role: { type: String, default: 'organizer' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Organizer', organizerSchema);
