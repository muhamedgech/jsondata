const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataPath = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());

// Helper function to read data from the data.json file
const getData = () => {
    try {
        const jsonData = fs.readFileSync(dataPath);
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
};

// Helper function to write data to the data.json file
const writeData = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error('Error writing data:', error);
    }
};

// Routes
app.get('/music', (req, res) => {
    const musicData = getData().music;
    res.json(musicData);
});

app.post('/music', (req, res) => {
    const musicData = getData();
    const newSong = req.body;
    musicData.music.push(newSong);
    writeData(musicData);
    res.status(201).json(newSong);
});
// Search by name
app.get('/music/searchTerm', (req, res) => {
    const musicData = getData().music;
    const { name } = req.query;
    if (!name) return res.status(400).send('Name parameter is required');
    const filteredSongs = musicData.filter(song => song.name.toLowerCase().includes(name.toLowerCase()));
    res.json(filteredSongs);
});
app.get('/music/:id', (req, res) => {
    const musicData = getData().music;
    const id = req.params.id;
    const song = musicData.find(song => song.id === id);
    if (!song) return res.status(404).send('Song not found');
    res.json(song);
});


app.put('/music/:id', (req, res) => {
    const musicData = getData();
    const id = req.params.id;
    const index = musicData.music.findIndex(song => song.id === id);
    if (index === -1) return res.status(404).send('Song not found');
    musicData.music[index] = req.body;
    writeData(musicData);
    res.json(musicData.music[index]);
});

app.delete('/music/:id', (req, res) => {
    const musicData = getData();
    const id = req.params.id;
    const index = musicData.music.findIndex(song => song.id === id);
    if (index === -1) return res.status(404).send('Song not found');
    const deletedSong = musicData.music.splice(index, 1);
    writeData(musicData);
    res.json(deletedSong[0]);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
