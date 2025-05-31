const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const NOTES_FILE = path.join(__dirname, 'notes.json');

app.use(express.json());
app.use(express.static(__dirname)); // phục vụ file tĩnh (HTML, JS, CSS)

function readNotes() {
    if (!fs.existsSync(NOTES_FILE)) return [];
    return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
}

function writeNotes(notes) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf8');
}

// API lấy danh sách ghi chú
app.get('/api/notes', (req, res) => {
    res.json(readNotes());
});

// API thêm ghi chú mới
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    if (!title || !title.trim() || !content || !content.trim()) {
        return res.status(400).json({ error: 'Tiêu đề và nội dung không hợp lệ' });
    }
    const notes = readNotes();
    notes.unshift({ title: title.trim(), content: content.trim() });
    writeNotes(notes);
    res.json({ success: true });
});

// API sắp xếp ghi chú
app.post('/api/sort', (req, res) => {
    const order = req.body;

    if (!Array.isArray(order)) {
        return res.status(400).json({ error: 'Invalid order format' });
    }

    writeNotes(order);
    res.json({ success: true });
});

// API tải file notes.json
app.get('/api/download', (req, res) => {
    res.download(NOTES_FILE, 'notes.json');
});

// Trả về view cho trang index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Trả về view cho trang view (ví dụ: /view)
app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'view.html'));
});

// Trả về view cho trang thêm mới ghi chú
app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'add.html'));
});

// Trả về view cho trang sắp xếp ghi chú
app.get('/sort', (req, res) => {
    res.sendFile(path.join(__dirname, 'sort.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 