const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ----------------- MongoDB Connection -----------------
mongoose.connect("mongodb://localhost:27017/medilink")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// ----------------- Schemas -----------------

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
}, { collection: "users" });

const User = mongoose.model("User", userSchema);

// Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  experience: String,
  fee: String,
  contact: String,
  email: String,
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  userId: String,
  doctorId: String,
  doctorName: String,
  patientName: String,
  date: String,
  time: String,
  contact: String,
  notes: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// ----------------- Routes -----------------

// Default route
app.get("/", (req, res) => {
  res.send("MediLink Backend Running 🚀");
});

// ----------------- User Routes -----------------

// Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "Registered successfully", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Registration failed" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
    res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ----------------- Doctor Routes -----------------

// Get all doctors
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Error fetching doctors" });
  }
});

// Add doctor (admin)
app.post("/api/doctors", async (req, res) => {
  try {
    const doc = new Doctor(req.body);
    await doc.save();
    res.json({ message: "Doctor added", doctor: doc });
  } catch (err) {
    res.status(500).json({ error: "Error adding doctor" });
  }
});

// ----------------- Appointment Routes -----------------

// Get appointments (optional user filter)
app.get("/api/appointments", async (req, res) => {
  try {
    const { userId } = req.query; // ?userId=123
    const filter = userId ? { userId } : {};
    const appointments = await Appointment.find(filter);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Error fetching appointments" });
  }
});

// Book appointment
// Create Appointment
app.post("/api/appointments", async (req,res)=>{
  try{
    const { userId, doctorId, doctorName, patientName, date, time, contact, notes } = req.body;
    // Removed the login check so userId is optional
    const appointment = new Appointment({ userId, doctorId, doctorName, patientName, date, time, contact, notes });
    await appointment.save();
    res.json({message:"Appointment booked successfully", appointment});
  } catch(err){ 
    console.error(err);
    res.status(500).json({error:"Error booking appointment"}) 
  }
});


// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
