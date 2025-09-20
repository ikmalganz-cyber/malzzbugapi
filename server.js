import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(process.cwd(), "users.json");

// Helper: baca/tulis users
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ✅ Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const found = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!found) return res.status(401).json({ error: "Username/Password salah" });
  res.json(found);
});

// ✅ Ambil semua user
app.get("/users", (req, res) => {
  res.json(readUsers());
});

// ✅ Tambah user
app.post("/users", (req, res) => {
  const { username, password, role, exp } = req.body;
  const users = readUsers();
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "Username sudah ada" });
  }
  const newUser = { username, password, role, exp };
  users.push(newUser);
  writeUsers(users);
  res.json(newUser);
});

// ✅ Hapus user
app.delete("/users/:username", (req, res) => {
  let users = readUsers();
  users = users.filter((u) => u.username !== req.params.username);
  writeUsers(users);
  res.json({ success: true });
});

// ✅ Root test
app.get("/", (req, res) => {
  res.send("API Malzz Crash ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
