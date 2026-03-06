import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Riddle from './models/Riddle.js';

dotenv.config();

const riddles = [
    {
        stageNumber: 1,
        text: "Where the hunt begins, shadows start to fall. Find the iron gates that welcome one and all.",
        hint: "Think about the main entrance to the campus.",
        targetCode: "MAIN_GATE"
    },
    {
        stageNumber: 2,
        text: "Coffee brews and students chatter, find the place where meals matter.",
        hint: "Look for the central cafeteria.",
        targetCode: "CAFE_CENTRAL"
    },
    {
        stageNumber: 3,
        text: "Time stands still above the square, look up high to find it there.",
        hint: "The tall structure with a clock.",
        targetCode: "CLOCK_TOWER"
    },
    {
        stageNumber: 4,
        text: "I stand where knowledge sleeps in rows,\nWhere silence reigns and wisdom grows.\nFind the mark where shadows meet,\nAnd claim your conquest at my feet.",
        hint: "Look for the place where students gather knowledge in quiet rows — the largest building of learning on campus.",
        targetCode: "LIBRARY_ENTRANCE"
    },
    {
        stageNumber: 5,
        text: "Water flows but river none, sparkling under midday sun.",
        hint: "The structural water feature near the admin block.",
        targetCode: "MAIN_FOUNTAIN"
    }
];

// Add generic riddles up to stage 15
for (let i = 6; i <= 15; i++) {
    riddles.push({
        stageNumber: i,
        text: `This is a mysterious riddle for stage ${i}. Solve it if you dare!`,
        hint: `Generic hint for stage ${i}`,
        targetCode: `TARGET_${i}`
    });
}

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(async () => {
        console.log('Connected to MongoDB. Clearing existing riddles...');
        await Riddle.deleteMany({});

        console.log('Seeding new riddles...');
        await Riddle.insertMany(riddles);

        console.log('Seeding complete!');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Error:', err);
        mongoose.connection.close();
    });
