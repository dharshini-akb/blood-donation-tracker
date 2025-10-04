import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LearnAboutDonation = () => {
  const [activeTab, setActiveTab] = useState('basics');
  const [activeBlood, setActiveBlood] = useState("A+");
  const [isVisible, setIsVisible] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [bloodDropAnimation, setBloodDropAnimation] = useState(false);

  // Animation effects
  useEffect(() => {
    setIsVisible(true);
    const pulseInterval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 3000);
    
    const bloodDropInterval = setInterval(() => {
      setBloodDropAnimation(true);
      setTimeout(() => setBloodDropAnimation(false), 2000);
    }, 4000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(bloodDropInterval);
    };
  }, []);

  const bloodCompatibility = {
    "A+": { receive: ["O+", "O-", "A+", "A-"], donate: ["A+", "AB+"] },
    "O+": { receive: ["O+", "O-"], donate: ["O+", "A+", "B+", "AB+"] },
    "B+": { receive: ["O+", "O-", "B+", "B-"], donate: ["B+", "AB+"] },
    "AB+": { receive: ["Everyone"], donate: ["AB+"] },
    "A-": { receive: ["O-", "A-"], donate: ["A+", "A-", "AB+", "AB-"] },
    "O-": { receive: ["O-"], donate: ["Everyone"] },
    "B-": { receive: ["O-", "B-"], donate: ["B+", "B-", "AB+", "AB-"] },
    "AB-": { receive: ["O-", "A-", "B-", "AB-"], donate: ["AB+", "AB-"] },
  };

  const tabs = [
    { id: 'basics', label: 'Basics', icon: '📚' },
    { id: 'process', label: 'Process', icon: '🩸' },
    { id: 'eligibility', label: 'Eligibility', icon: '✅' },
    { id: 'benefits', label: 'Benefits', icon: '❤️' },
    { id: 'myths', label: 'Myths', icon: '❓' },
    { id: 'faq', label: 'FAQ', icon: '💬' }
  ];

  const content = {
    basics: {
      title: "Blood Donation Basics",
      content: [
        {
          subtitle: "What is Blood Donation?",
          text: "Blood donation is the process of voluntarily giving blood to help others in need. Your donation can save up to three lives and is essential for surgeries, emergencies, and treatments in Erode hospitals.",
          icon: "🩸"
        },
        {
          subtitle: "Types of Blood Donations",
          text: "In Erode, common types of donations are whole blood, platelet donation, plasma donation, and double red cell donation. Each type helps patients differently.",
          icon: "🏥"
        },
        {
          subtitle: "Blood Components",
          text: "Blood has red blood cells (carry oxygen), white blood cells (fight infection), platelets (clotting), and plasma (liquid portion). Hospitals in Erode use each component for different treatments.",
          icon: "🔬"
        }
      ]
    },
    process: {
      title: "The Donation Process",
      content: [
        {
          subtitle: "Before Donation",
          text: "Eat a healthy meal, drink water, and get proper rest before visiting an Erode blood bank. Avoid alcohol and oily foods 24 hours before donation.",
          icon: "🍽️"
        },
        {
          subtitle: "During Donation",
          text: "The process usually takes 8-10 minutes. Around 1 pint of blood is collected under sterile conditions at Erode blood banks.",
          icon: "⏱️"
        },
        {
          subtitle: "After Donation",
          text: "Rest for 10-15 minutes, drink fluids, and avoid heavy work for a day. Eat iron-rich food to recover quickly.",
          icon: "🔄"
        }
      ]
    },
    eligibility: {
      title: "Donor Eligibility",
      content: [
        {
          subtitle: "Basic Requirements",
          text: "In Tamil Nadu, you must be at least 18 years old, weigh 50kg or more, and be healthy to donate blood.",
          icon: "📋"
        },
        {
          subtitle: "Health Conditions",
          text: "People with controlled conditions like diabetes or blood pressure can donate. Some illnesses may temporarily or permanently stop donation.",
          icon: "🏥"
        },
        {
          subtitle: "Medications",
          text: "Most medicines do not stop donation, but some may require a waiting period. Always inform Erode blood bank staff about your medications.",
          icon: "💊"
        }
      ]
    },
    benefits: {
      title: "Benefits of Blood Donation",
      content: [
        {
          subtitle: "Health Benefits",
          text: "Regular donation may reduce excess iron levels and keep your heart healthy. It also helps new blood cell production.",
          icon: "❤️"
        },
        {
          subtitle: "Free Health Checkup",
          text: "Every donor in Erode gets a basic health check — BP, pulse, weight, hemoglobin levels — before donating.",
          icon: "🔍"
        },
        {
          subtitle: "Emotional Benefits",
          text: "Donating blood at Erode hospitals or camps gives you happiness and pride that you are saving someone’s life.",
          icon: "😊"
        }
      ]
    },
    myths: {
      title: "Common Myths Debunked",
      content: [
        {
          subtitle: "Myth: Donating blood is painful",
          text: "Fact: Only a small prick is felt. Erode donors say the process is smooth and painless.",
          icon: "❌"
        },
        {
          subtitle: "Myth: Tattoos stop you from donating",
          text: "Fact: If tattoos are done safely, you can donate after 3 months in Tamil Nadu.",
          icon: "🎨"
        },
        {
          subtitle: "Myth: Blood donation makes you weak",
          text: "Fact: The body replaces blood within 1-2 days. Erode donors can return to normal activities quickly.",
          icon: "💪"
        }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      content: [
        {
          subtitle: "How often can I donate blood?",
          text: "In Erode, you can donate whole blood every 3 months and platelets more frequently if required.",
          icon: "📅"
        },
        {
          subtitle: "Is it safe to donate blood?",
          text: "Yes. All Erode blood banks use sterile, disposable equipment and trained staff.",
          icon: "🛡️"
        },
        {
          subtitle: "What happens to donated blood?",
          text: "Your blood is tested, separated into components, and supplied to hospitals across Erode district.",
          icon: "🚚"
        }
      ]
    }
  };

  const quickFacts = [
    { fact: "Every few minutes", detail: "a patient in Tamil Nadu needs blood" },
    { fact: "1 donation", detail: "can save up to 3 lives in Erode" },
    { fact: "38%", detail: "of Erode’s population is eligible to donate blood" },
    { fact: "Only 3%", detail: "of eligible people in Erode donate blood regularly" },
    { fact: "Many hospital patients", detail: "in Erode need blood transfusions daily" },
    { fact: "Thousands", detail: "of lives are saved each year in Tamil Nadu with blood donations" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bloodDrop {
          0% {
            transform: translateY(-10px) scale(1);
          }
          50% {
            transform: translateY(5px) scale(1.1);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
        
        .blood-drop-animation {
          animation: bloodDrop 2s ease-in-out infinite;
        }
      `}</style>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold text-secondary-800 mb-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Learn About Blood Donation
          </h1>
          <p className={`text-xl text-secondary-600 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Everything you need to know about donating blood in Erode
          </p>
        </div>

        {/* Blood Compatibility Section */}
        <div className={`card mb-8 text-center transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-2xl font-semibold text-secondary-800 mb-6">
            Select Your Blood Type
          </h2>

          {/* Blood Group Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"].map((group, index) => (
              <button
                key={group}
                onClick={() => setActiveBlood(group)}
                className={`px-6 py-3 rounded-lg font-bold border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  activeBlood === group
                    ? "bg-red-600 text-white border-red-600 scale-105 shadow-lg"
                    : "bg-white text-red-600 border-red-600 hover:bg-red-100"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible ? `fadeInUp 0.6s ease-out forwards` : 'none'
                }}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Compatibility Info */}
          {activeBlood && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className={`bg-orange-100 p-6 rounded-lg transition-all duration-500 hover:scale-105 hover:shadow-md ${pulseAnimation ? 'animate-pulse' : ''}`}>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="mr-2">🩸</span>
                    You can take from
                  </h3>
                  <p className="text-xl font-bold text-secondary-800">
                    {bloodCompatibility[activeBlood].receive.join(", ")}
                  </p>
                </div>
                <div className={`bg-blue-100 p-6 rounded-lg transition-all duration-500 hover:scale-105 hover:shadow-md ${pulseAnimation ? 'animate-pulse' : ''}`}>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="mr-2">❤️</span>
                    You can give to
                  </h3>
                  <p className="text-xl font-bold text-secondary-800">
                    {bloodCompatibility[activeBlood].donate.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className={`relative transition-all duration-500 ${bloodDropAnimation ? 'blood-drop-animation' : ''}`}>
                  <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <div className="text-6xl">🩸</div>
                  </div>
                  {bloodDropAnimation && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  )}
                </div>
                <p className="text-red-600 font-medium text-center">
                  One Blood Donation can save up to{" "}
                  <span className="font-bold text-2xl animate-pulse">Three Lives</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Facts */}
        <div className={`card mb-8 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-2xl font-semibold text-secondary-800 mb-6 text-center">
            Quick Facts About Blood Donation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickFacts.map((item, index) => (
              <div 
                key={index} 
                className={`text-center p-4 bg-primary-50 rounded-lg transition-all duration-500 hover:scale-105 hover:shadow-lg hover:bg-primary-100 ${
                  pulseAnimation ? 'animate-pulse' : ''
                }`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: isVisible ? `fadeInUp 0.6s ease-out forwards` : 'none'
                }}
              >
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {item.fact}
                </div>
                <div className="text-secondary-700">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`card mb-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-md ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white scale-105 shadow-md'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible ? `fadeInUp 0.6s ease-out forwards` : 'none'
                }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={`card transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-secondary-800 mb-2">
              {content[activeTab].title}
            </h2>
            <div className="w-20 h-1 bg-primary-600 rounded animate-pulse"></div>
          </div>

          <div className="space-y-8">
            {content[activeTab].content.map((item, index) => (
              <div 
                key={index} 
                className="border-l-4 border-primary-200 pl-6 transition-all duration-500 hover:border-primary-400 hover:bg-primary-50 p-4 rounded-r-lg"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: isVisible ? `fadeInLeft 0.6s ease-out forwards` : 'none'
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`text-3xl transition-all duration-300 hover:scale-110 ${pulseAnimation ? 'animate-bounce' : ''}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                      {item.subtitle}
                    </h3>
                    <p className="text-secondary-700 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`card bg-primary-600 text-white text-center transition-all duration-1000 delay-1400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h3 className="text-2xl font-bold mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Now that you know more about blood donation in Erode, consider becoming a donor and saving lives.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block"
            >
              Become a Donor
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>


        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearnAboutDonation;
