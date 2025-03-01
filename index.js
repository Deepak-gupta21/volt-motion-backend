require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ✅ Apply CORS Middleware First
app.use(cors({
  origin: "https://voltmotion.netlify.app",  // Allow only this frontend
  methods: ["GET", "POST", "OPTIONS"],        // Ensure OPTIONS is allowed
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

// ✅ Handle Preflight (OPTIONS) Requests Manually
app.options("*", (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://voltmotion.netlify.app");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// ✅ Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ✅ User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const User = mongoose.model("User", UserSchema);

// ✅ API Route to Post User Details
app.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newUser = new User({ name, email, phone, message });
    await newUser.save();
    
    // ✅ Send CORS Headers in Response
    res.set("Access-Control-Allow-Origin", "https://voltmotion.netlify.app");
    res.set("Access-Control-Allow-Credentials", "true");
    
    res.status(201).json({ message: "User data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
