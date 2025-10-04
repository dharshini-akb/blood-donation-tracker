const BloodCenter = require('../models/BloodCenter');

exports.getCenters = async (req, res) => {
  try {
    const centers = await BloodCenter.find();
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addCenter = async (req, res) => {
  try {
    const center = new BloodCenter(req.body);
    await center.save();
    res.status(201).json(center);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.searchCenters = async (req, res) => {
  try {
    const { query } = req.query;
    const centers = await BloodCenter.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { city: new RegExp(query, 'i') }
      ]
    });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
