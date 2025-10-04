const BloodRequest = require('../models/BloodRequest');


exports.createBloodRequest = async (req, res) => {
  try {
    const request = new BloodRequest(req.body);
    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create blood request' });
  }
};


exports.getBloodRequests = async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    let query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    const requests = await BloodRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch blood requests' });
  }
};
