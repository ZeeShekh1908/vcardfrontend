import { useAuth } from "./AuthContext";
import { logout } from "./firebase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import t1 from "./img/t1.png";
import t2 from "./img/t2.png";
import t3 from "./img/t3.png";

const templates = [t1, t2, t3];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardData, setCardData] = useState({
    logo: null,
    name: "",
    designation: "",
    company: "",
    phone: "",
    email: "",
    website: "",
  });
  const [generatedCard, setGeneratedCard] = useState(null);
  const [showSocialMedia, setShowSocialMedia] = useState(false); // State to toggle social media sharing window
  const [saved, setSaved] = useState(false); // State to manage save message

  // Automatically switch templates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % templates.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCreateCard = () => {
    setGeneratedCard({ ...cardData, template: templates[currentIndex] });
  };

  const handleDownload = (type) => {
    const input = document.getElementById("visiting-card");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      if (type === "pdf") {
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 120, 70);
        pdf.save("visiting_card.pdf");
      } else if (type === "image") {
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "visiting_card.png";
        link.click();
      }
    });
  };

  const handleSave = () => {
    setSaved(true); // Set save message
    setTimeout(() => setSaved(false), 3000); // Hide message after 3 seconds
  };

  // Handle template selection
  const handleTemplateSelect = (index) => {
    setCurrentIndex(index);
    setShowForm(true); // After selecting a template, show the form
    setShowTemplateSelection(false); // Hide template selection
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardData({ ...cardData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle share action
  const handleShare = (platform) => {
    alert(`Sharing your card on ${platform}!`);
    setShowSocialMedia(false); // Close social media suggestions after share
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      {!showForm && (
        <div className="navbar">
          <h2>Dashboard</h2>
          <ul>
            <li onClick={() => navigate("/dashboard")}>🏠 Home</li>
            <li onClick={() => navigate("/profile")}>👤 Profile</li>
            <li onClick={handleLogout} className="logout">🚪 Logout</li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <h2>Welcome to the Dashboard</h2>

        <h3>Choose a Template</h3>
        <div className="carousel">
          <img
            src={templates[currentIndex]}
            alt={`Template ${currentIndex + 1}`}
            className="carousel-image"
          />
        </div>

        <h3>How It Works?</h3>
        <ul>
          <li>Choose your template</li>
          <li>Customize it according to your needs</li>
          <li>Download your creation</li>
          <li>Save and access later in your profile</li>
        </ul>

        <h3>Or Create Your Own</h3>
        <button className="create-template-button" onClick={() => setShowTemplateSelection(true)}>
          Create Your Own Card
        </button>

        {showTemplateSelection && (
          <div className="template-selection">
            <h3>Select a Template</h3>
            <div className="templates">
              {templates.map((template, index) => (
                <div key={index} className="template-option">
                  <img
                    src={template}
                    alt={`Template ${index + 1}`}
                    className="template-img"
                    onClick={() => handleTemplateSelect(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <div className="form">
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Designation"
              onChange={(e) => setCardData({ ...cardData, designation: e.target.value })}
            />
            <input
              type="text"
              placeholder="Company"
              onChange={(e) => setCardData({ ...cardData, company: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Website"
              onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </div>
        )}

        {generatedCard && (
          <div>
            <h3>Your Visiting Card</h3>
            <div id="visiting-card" className="visiting-card">
              <img
                src={generatedCard.template}
                alt="Selected Template"
                className="card-template"
              />
              {generatedCard.logo && (
                <img
                  src={generatedCard.logo}
                  alt="Logo"
                  className="card-logo"
                />
              )}
              <div className="card-details">
                <h4>{generatedCard.name}</h4>
                <p>{generatedCard.designation}</p>
                <p>{generatedCard.company}</p>
                <p>📞 {generatedCard.phone}</p>
                <p>✉️ {generatedCard.email}</p>
                <p>🌐 {generatedCard.website}</p>
              </div>
            </div>
            <div className="download-options">
              <button onClick={() => handleDownload("image")}>Download Image</button>
              <button onClick={() => handleDownload("pdf")}>Download PDF</button>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowSocialMedia(true)}>Share</button>
            </div>
          </div>
        )}

        {saved && <div className="saved-message">Image saved successfully!</div>}

        {showSocialMedia && (
          <div className="social-media-options">
            <h4>Share your card:</h4>
            <button onClick={() => handleShare('Facebook')}>Facebook</button>
            <button onClick={() => handleShare('Twitter')}>Twitter</button>
            <button onClick={() => handleShare('LinkedIn')}>LinkedIn</button>
            <button onClick={() => setShowSocialMedia(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
