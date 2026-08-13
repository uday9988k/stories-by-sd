import React from "react";
import Footer from "./footer";
import "./about.css";
import aboutImg from "./images/marriage_2.jpg";
import aboutUS from "./images/aboutus.jpg";

const About = () => {
  return (
    <>
      {/* Hero Image */}
      <section
        className="about-hero"
        style={{ backgroundImage: `url(${aboutImg})` }}
      >
        <div className="about-overlay"></div>
      </section>

      {/* About Content */}
      <section className="about-content">
        <span className="about-tag">ABOUT STORIES BY SD</span>
        <h1>
          Capturing Moments,
          <br />
          Creating Memories
        </h1>
        <div className="about-story">
          <div className="about-image">
            <img src={aboutUS} alt="About Stories By SD" />
          </div>

          <div className="about-text">
            <h2>Our Story</h2>

            <p>
              <strong>Stories By SD</strong> is a creative photography studio
              based in <strong>Gadwal</strong>, dedicated to capturing life's
              most precious moments with authenticity, creativity, and timeless
              artistry.
            </p>

            <p>
              Backed by{" "}
              <strong>over four years of professional experience</strong>
              and a passionate team of photographers, we specialize in weddings,
              maternity, newborn, kids, family portraits, and traditional
              ceremonies.
            </p>

            <p>
              Every smile, every blessing, and every celebration deserves to be
              remembered. Our storytelling approach combines natural emotions,
              artistic composition, and attention to detail to create
              photographs that families will cherish for generations.
            </p>

            <p>
              We proudly serve <strong>Gadwal</strong> and surrounding regions,
              delivering timeless memories through elegant photography and
              cinematic storytelling.
            </p>

            <blockquote>
              "Every frame tells a story. Every story lives forever."
            </blockquote>
          </div>
        </div>{" "}
      </section>

      <Footer />
    </>
  );
};

export default About;
