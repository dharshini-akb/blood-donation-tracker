const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  patientName: { type: String, required: true, trim: true },
  bloodGroup: { type: String, required: true, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  location: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  urgency: { type: String, enum: ["normal", "urgent", "emergency"], default: "normal" },
  additionalInfo: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
