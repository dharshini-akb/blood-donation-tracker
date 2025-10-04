import React, { useState } from "react";
import { Link } from "react-router-dom";

const BloodCenterDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);

  // New states for donor info
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ✅ Real Erode Blood Centers
  const bloodCenters = [
    {
      id: 1,
      name: "Erode Government Hospital Blood Bank",
      city: "Erode",
      address: "Perundurai Road, Erode, Tamil Nadu 638011",
      phone: "+91 424 226 4545",
      email: "erodeghbloodbank@gmail.com",
      hours: "24/7",
      mapLink:
        "https://www.google.com/maps/dir/?api=1&destination=Erode+Government+Hospital",
      services: ["Whole Blood", "Platelets", "Plasma", "Emergency Supply"],
      rating: 4.7,
    },
    {
      id: 2,
      name: "Indian Red Cross Society Blood Bank",
      city: "Erode",
      address: "Red Cross Building, Periyar Nagar, Erode, TN 638009",
      phone: "+91 424 225 5550",
      email: "redcrossbloodbankerode@gmail.com",
      hours: "Mon-Sat: 9AM-6PM",
      mapLink:
        "https://www.google.com/maps/dir/?api=1&destination=Indian+Red+Cross+Society+Erode",
      services: ["Whole Blood", "Platelets", "Plasma", "Apheresis"],
      rating: 4.8,
    },
    {
      id: 3,
      name: "Kongu Hospital Blood Bank",
      city: "Erode",
      address: "Mettur Road, Erode, TN 638011",
      phone: "+91 424 229 4022",
      email: "konguhospitalbloodbank@gmail.com",
      hours: "Mon-Sat: 8AM-8PM",
      mapLink:
        "https://www.google.com/maps/dir/?api=1&destination=Kongu+Hospital+Erode",
      services: ["Whole Blood", "Platelets", "Plasma"],
      rating: 4.6,
    },
    {
      id: 4,
      name: "Velavan Hospital Blood Bank",
      city: "Erode",
      address: "Perundurai Road, Erode, TN 638012",
      phone: "+91 424 227 9888",
      email: "velavanhospitalbloodbank@gmail.com",
      hours: "24/7",
      mapLink:
        "https://www.google.com/maps/dir/?api=1&destination=Velavan+Hospital+Erode",
      services: ["Whole Blood", "Platelets", "Emergency Supply"],
      rating: 4.7,
    },
    {
      id: 5,
      name: "Lotus Hospital Blood Bank",
      city: "Erode",
      address: "Karungalpalayam, Erode, TN 638003",
      phone: "+91 424 229 2299",
      email: "lotusbloodbankerode@gmail.com",
      hours: "Mon-Sat: 8AM-8PM",
      mapLink:
        "https://www.google.com/maps/dir/?api=1&destination=Lotus+Hospital+Erode",
      services: ["Whole Blood", "Platelets", "Plasma"],
      rating: 4.6,
    },
  ];

  const filteredCenters = bloodCenters.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || center.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const handleScheduleClick = (center) => {
    setSelectedCenter(center);
    setShowScheduleForm(true);
  };

  const handleConfirm = async () => {
    if (!donorName || !donorEmail || !date || !time) {
      alert("Please fill all the fields before confirming.");
      return;
    }

    const donationData = {
      centerId: selectedCenter.id,
      centerName: selectedCenter.name,
      donorName,
      donorEmail,
      date,
      time,
    };

    try {
      const res = await fetch("http://localhost:5001/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setShowScheduleForm(false);
        setDonorName("");
        setDonorEmail("");
        setDate("");
        setTime("");
      } else {
        alert(data.error || "Failed to schedule donation");
      }
    } catch (err) {
      alert("Error connecting to server!");
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4" style={{ marginTop: "100px" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-red-700 mb-3">
            Erode Blood Bank Directory
          </h1>
          <p className="text-lg text-gray-700">
            Find trusted blood banks in Erode and schedule your donation easily.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md flex-1"
          />
        </div>

        {/* Blood Centers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="border border-gray-200 shadow-lg rounded-lg p-5"
            >
              <h3 className="text-xl font-semibold text-red-600">
                {center.name}
              </h3>
              <p className="text-gray-700">{center.address}</p>
              <p className="text-gray-600">📞 {center.phone}</p>
              <p className="text-gray-600">✉️ {center.email}</p>
              <p className="text-gray-500 mb-2">Hours: {center.hours}</p>
              <div className="flex gap-3">
                <a
                  href={center.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Get Directions
                </a>
                <button
                  onClick={() => handleScheduleClick(center)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Schedule Donation
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Donation Form */}
        {showScheduleForm && selectedCenter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                Schedule Donation at {selectedCenter.name}
              </h2>
              <input
                type="text"
                placeholder="Your Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="px-4 py-2 bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link to="/" className="text-red-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BloodCenterDirectory;
