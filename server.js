const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '.')));

app.post('/api/form', (req, res) => {
    console.log('Form data received:', req.body);
    res.status(200).send('Form data received successfully');
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'This is some dummy API data' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
