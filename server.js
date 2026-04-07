const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dental_clinic";

app.use(express.json());

// ✅ نخلي السيرفر يقرأ الملفات من نفس المجلد
app.use(express.static(__dirname));

// اتصال MongoDB (لو فشل ما يوقف الموقع)
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  age: Number,
  notes: String
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

// API
app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "Dental Clinic App" });
});

app.get("/api/patients", async (req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.json(patients);
});

app.post("/api/patients", async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: "Failed to create patient" });
  }
});

app.delete("/api/patients/:id", async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
});

// ✅ أهم سطر (يحّل المشكلة)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
