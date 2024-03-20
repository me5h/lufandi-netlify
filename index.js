const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;
const clients = [];

// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// In your /events endpoint:
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const sendImageUrl = (url) => {
        res.write(`data: ${JSON.stringify({ url })}\n\n`);
    };

    // Add this client's send function to the array
    clients.push(sendImageUrl);

    // Keep the connection open by sending a comment every 30 seconds
    const keepAlive = setInterval(() => {
        res.write(': keep-alive\n\n');
    }, 30000);

    // Remove this client's send function when connection is closed
    req.on('close', () => {
        clearInterval(keepAlive);
        const index = clients.indexOf(sendImageUrl);
        if (index > -1) {
            clients.splice(index, 1);
        }
    });
});

// In your /update-image endpoint, iterate over all clients to send the image URL
app.post('/update-image', (req, res) => {
    const { url } = req.body;
    clients.forEach(send => send(url));
    res.status(200).send('Image URL updated');
});

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    // You can replace the file path according to your needs
    res.status(200).json({ filePath: `/uploads/${file.filename}` });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
