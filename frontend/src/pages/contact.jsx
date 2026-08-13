import React, { useState } from "react";
import axios from "axios";
import "./contact.css";
import Footer from "./footer.jsx";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Phone validation
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/contact", {
        name: formData.name.trim(),
        location: formData.location.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      });

      if (response.data.success) {
        alert("Thank you for contacting Stories By SD!");

        setFormData({
          name: "",
          location: "",
          phone: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="contactSection_contactUs">
        <div className="contactCard_contactUs">
          {/* Brand */}
          <span className="miniTitle_contactUs">STORIES BY SD</span>

          {/* Heading */}
          <h1 className="heading_contactUs">GET IN TOUCH</h1>

          {/* Description */}
          <p className="subHeading_contactUs">
            We'd love to hear your story and capture your most cherished
            memories.
          </p>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="form_contactUs">
            {/* Name */}
            <div className="inputGroup_contactUs">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                maxLength="100"
                required
              />
            </div>

            {/* Location */}
            <div className="inputGroup_contactUs">
              <input
                type="text"
                name="location"
                placeholder="Your Location"
                value={formData.location}
                onChange={handleChange}
                maxLength="150"
                required
              />
            </div>

            {/* Phone */}
            <div className="inputGroup_contactUs">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                inputMode="numeric"
                pattern="[0-9]{10}"
                required
              />
            </div>

            {/* Message */}
            <div className="inputGroup_contactUs">
              <textarea
                rows="5"
                name="message"
                placeholder="Tell us about your event..."
                value={formData.message}
                onChange={handleChange}
                maxLength="2000"
                required
              />
            </div>

            {/* Submit */}
            <button
              className="button_contactUs"
              type="submit"
              disabled={loading}
            >
              {loading ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
