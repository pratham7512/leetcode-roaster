const express=require("express")
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const app = express();
const port = 3000;

const API_KEY = 'AIzaSyD4768bpYo-SKeMb9D_speluUxMyFmOgYg';
const genAI = new GoogleGenerativeAI(API_KEY);

app.use(express.static('.'));
app.use(cors())

app.get('/roast', async (req, res) => {
    const { username, intensity } = req.query;

    try {
        const leetCodeStats = await fetchLeetCodeStats(username);
        const roast = await generateRoast(leetCodeStats, intensity);
        res.json({ roast });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate roast' });
    }
});

async function fetchLeetCodeStats(username) {
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    return await response.json();
}

async function generateRoast(stats, intensity) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const prompt = `
    You are a savage and hilarious roast generator for LeetCode users. 
    Based on the provided LeetCode stats, craft a roast that is both brutal and comically entertaining, regardless of how good the stats appear.
    generate roast in plain text add funny emojis in between
    intensity of roast should be ${intensity}
    ### Stats:
    - Total Solved: ${stats.totalSolved}
    - total questions available on platform : ${stats.totalQuestions}
    - Easy Solved: ${stats.easySolved}
    - Medium Solved: ${stats.mediumSolved}
    - Hard Solved: ${stats.hardSolved}
    - Acceptance Rate: ${stats.acceptanceRate}%
    - Ranking: ${stats.ranking}
    `;
    

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

