const mongoose = require("mongoose");

const bloodCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  city: String,
  phone: String,
  email: String,
  hours: String,
});

module.exports = mongoose.model("BloodCenter", bloodCenterSchema);
