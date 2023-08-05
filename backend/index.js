const express = require('express');
const app = express();
const port = 8080; // You can use any port number you prefer
const cors = require('cors');

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://satendraraj:ohhello@cluster0.sj549jp.mongodb.net/goose?retryWrites=true&w=majority';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDB();

// Assuming you have a MongoDB collection named "users"
const roomCollection = client.db('goose').collection('room');


const goose = ['Maxwell', 'Gander'];

const mockGameState = {
    you: 0,
    state: "0_RIDDLEAWAIT_1_RIDDLEAWAIT",
    results: [
        {
            round: 1, riddles: [
                { by: 0, to: 1, riddle: "riddle1", answer: "answer", guess: ["guess1", "guerss1"], winner: null },
                { by: 0, to: 1, riddle: "riddle1", answer: "answer", guess: ["guess1", "guerss1"], winner: null },
            ]
        }
    ]
}

const round_states = [
    'NO_PLAYER',
    'NO_RIDDLE', // start adding your riddle
    '0_RIDDLE',
    '1_RIDDLE',
    '0_RIDDLE_1_RIDDLE', // start gussing
    '0_WON',
    '1_WON',
    'GAME_OVER'
]

const axios = require('axios');

const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

const convertRiddle = async (riddle) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You will give an riddle in 50 words which will be over complicated explanation of an object or word.' },
            { role: 'user', content: riddle }
        ]
    };

    const res = await axios.post(apiUrl, data, { headers });
    console.log(res);
    return res.data.choices[0].message.content;
}

const addRiddle = async (roomData, to, from, riddle) => {
    const convertedRiddle = await convertRiddle(riddle);
    roomData.results[roomData.results.length - 1].riddles.push({
        from, to, riddle: convertedRiddle, answer: riddle, guess: [], winner: null
    });
    const len = roomData.results[roomData.results.length - 1].riddles.length;
    if (len == 1) {
        roomData.state = from + '_RIDDLE';
    } else if (len == 2) {
        roomData.state = '0_RIDDLE_1_RIDDLE';
    }
    await roomCollection.updateOne({ _id: roomData._id }, { $set: { ...roomData } });
    return roomData;
}

const addGuess = async (roomData, role, guess) => {
    if (roomData.state !== '0_RIDDLE_1_RIDDLE') {
        return { error: "All Riddles addition awaits" };
    } else {
        const lastRound = roomData.results[roomData.results.length - 1];
        const riddles = lastRound.riddles;
        for (let riddle of riddles) {
            if (riddle.to == role) {
                riddle.guess.push(guess);
                if (riddle.answer === guess) {
                    riddle.winner = role;
                    roomData.state = role + '_WON';
                }
            }
        }
    }
    await roomCollection.updateOne({ _id: roomData._id }, { $set: { ...roomData } });
    return roomData;
}

const moveToNextRound = async (roomData) => {
    if (roomData.results.length == 5) {
        roomData.state = 'GAME_OVER';
        await roomCollection.updateOne({ _id: roomData._id }, { $set: { ...roomData } });
        return roomData;
    }
    roomData.state = 'NO_RIDDLE';
    roomData.results.push({
        round: roomData.results.length + 1,
        riddles: []
    });
    await roomCollection.updateOne({ _id: roomData._id }, { $set: { ...roomData } });
    return roomData;
}

// Route to fetch all users
app.get('/api/room', async (req, res) => {
    try {
        const rooms = await roomCollection.find().toArray();
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to create a new user
app.post('/api/room', async (req, res) => {
    try {
        const { id } = req.body;
        const { username } = req.body;
        const exist = await roomCollection.findOne({ _id: id });
        if (exist) {
            // Gander
            //check if player already in room
            if (exist.players.includes(username)) {
                res.json({ ...exist, you: 0});
                return;
            }
            exist.state = round_states[1];
            exist.players.push(username);
            await roomCollection.updateOne({ _id: id }, { $set: { ...exist } });
            res.json({ ...exist, you: 1 });
        } else {
            // Maxwell
            const roomData = {
                _id: id,
                state: round_states[0],
                results: [
                    {
                        round: 1, riddles: []
                    }
                ],
                players:[username]
            }
            const result = await roomCollection.insertOne({ ...roomData });
            res.json({ roomData, you: 0 });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// add riddle
app.post('/api/riddle', async (req, res) => {
    const { role } = req.body;
    const { room } = req.body;
    const { riddle } = req.body;
    const roomData = await roomCollection.findOne({ _id: room });
    if (!roomData) {
        res.json({ "error": "Room Not Found" });
        return;
    }
    res.json(await addRiddle(roomData, !role, role, riddle));
});

// add answer
app.post('/api/guess', async (req, res) => {
    const { role } = req.body;
    const { room } = req.body;
    const { guess } = req.body;
    const roomData = await roomCollection.findOne({ _id: room });
    if (!roomData) {
        res.json({ "error": "Room Not Found" });
        return;
    }
    res.json(await addGuess(roomData, role, guess));
})

// refresh state
app.post('/api/refresh', async (req, res) => {
    const { room } = req.body;
    const roomData = await roomCollection.findOne({ _id: room });
    if (!roomData) {
        res.json({ "error": "Room Not Found" });
        return;
    }
    res.json(roomData);
})

// move to next round
app.post('/api/next', async (req, res) => {
    const { room } = req.body;
    const roomData = await roomCollection.findOne({ _id: room });
    if (!roomData) {
        res.json({ "error": "Room Not Found" });
        return;
    }
    res.json(await moveToNextRound(roomData));
})

