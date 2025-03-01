




// 


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());

// const corsOptions = {
//   origin: '*', // Your React app's URL
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
// };
// app.use(cors(corsOptions));


require('dotenv').config(); 

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const User = mongoose.model("User", UserSchema);

// API Route to Post User Details
app.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newUser = new User({ name, email, phone, message });
    await newUser.save();
    res.status(201).json({ message: "User data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
