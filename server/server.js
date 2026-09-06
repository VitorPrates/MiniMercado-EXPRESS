const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample API Endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: "Hello from the Express backend!" });
});

// SERVE REACT IN PRODUCTION
// This directs Express to serve your built React files
app.use(express.static(path.join(__dirname, '../lojaexpress/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../lojaexpress/', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
