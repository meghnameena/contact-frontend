import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");

  const getLocation = () => {
  if (!navigator.geolocation) {
    setLocationStatus("Location is not supported by your browser ❌");
    return;
  }

  setLocationStatus("Getting your location...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setLocation({
        latitude,
        longitude,
      });

      setLocationStatus("Location captured successfully! 📍");
    },
    (error) => {
      console.error("Location Error:", error);

      setLocationStatus(
        "Unable to get location. Please allow location permission."
      );
    }
  );
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch( "https://contact-backend-remo.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        ...formData,
        locationUrl: location
          ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
          : "",
}),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Message sent successfully! ✅");

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus(result.message || "Something went wrong! ❌");
      }
    } catch (error) {
      console.error("Contact Error:", error);
      setStatus("Server error. Please try again. ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <p>Have a question? Send us a message.</p>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name</label>

          <input type="text"name="name"value={formData.name}onChange={handleChange} placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label>Email</label>

          <input type="email"name="email"value={formData.email}onChange={handleChange}placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Phone</label>

          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}  placeholder="Enter your phone"
            required
          />
        </div>

        <div>
          <label>Subject</label>

          <input type="text"  name="subject"  value={formData.subject} onChange={handleChange}  placeholder="Enter subject"
            required
          />
        </div>

        <div>
          <label>Message</label>

          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Enter your message" rows="5"
            required
          ></textarea>
        </div>

        <div className="location-box">
        <button
          type="button"
          onClick={getLocation}
          className="location-btn"
        >
          📍 Share My Location
        </button>

        {locationStatus && (
          <p className="location-status">{locationStatus}</p>
        )}

        {location && (
          <p className="location-coordinates">
            📍 Location captured
          </p>
        )}
      </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>

      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default Contact;