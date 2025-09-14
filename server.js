const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, "data", "videos.json");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Fungsi baca & tulis JSON
function readData() {
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");
  return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
}
function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf-8");
}

// API GET semua video
app.get("/api/videos", (req, res) => {
  res.json(readData());
});

// API Tambah video
app.post("/api/videos", (req, res) => {
  const videos = readData();
  const maxId = videos.length ? Math.max(...videos.map(v => v.id)) : 0;
  const newVideo = { id: maxId + 1, ...req.body };
  videos.push(newVideo);
  writeData(videos);
  res.status(201).json(newVideo);
});

// API Update video
app.put("/api/videos/:id", (req, res) => {
  const videos = readData();
  const id = Number(req.params.id);
  const idx = videos.findIndex(v => v.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  videos[idx] = { ...videos[idx], ...req.body, id };
  writeData(videos);
  res.json(videos[idx]);
});

// API Hapus video
app.delete("/api/videos/:id", (req, res) => {
  let videos = readData();
  const id = Number(req.params.id);
  videos = videos.filter(v => v.id !== id);
  writeData(videos);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
