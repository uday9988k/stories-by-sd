// Home.jsx
import React, { useEffect, useState, useCallback } from "react";

import Footer from "./footer.jsx";

import img1 from "./images/Prewedding_1.webp";
import img2 from "./images/Prewedding_2.webp";
import img3 from "./images/Prewedding_3.webp";
import img4 from "./images/Prewedding_4.webp";
import img5 from "./images/Prewedding_5.webp";
import kids1 from "./images/kids/kids.jpg";
import kids2 from "./images/kids/kids_2.jpg";
import kids3 from "./images/kids/kids_3.jpg";
import kids4 from "./images/kids/kids_4.jpg";
import band from "./images/band.jpg";
import wedding1 from "./images/wedding/wedding_1.webp";
import wedding2 from "./images/wedding/wedding_2.webp";
import wedding3 from "./images/wedding/wedding_3.jpg";
import wedding4 from "./images/wedding/wedding_4.webp";
import marriage from "./images/marriage.jpg";
import child from "./images/child_1.jpg";

import "./home.css";

const heroImages = [img1, img2, img3, img4, img5];

const galleryData = {
  kids: [
    { id: 1, src: kids1, alt: "Child laughing joyfully" },
    { id: 2, src: kids2, alt: "Child exploring nature" },
    { id: 3, src: kids3, alt: "Child playing with bubbles" },
    { id: 4, src: kids4, alt: "Child with family" },
  ],
  wedding: [
    { id: 1, src: wedding1, alt: "Wedding ceremony moment" },
    { id: 2, src: wedding2, alt: "Bride and groom portrait" },
    { id: 3, src: wedding3, alt: "Wedding celebration" },
    { id: 4, src: wedding4, alt: "Wedding reception details" },
  ],
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  return (
    <main className="home_home">
      {/* Hero Section */}
      <section className="hero_home" aria-label="Hero banner">
        <div className="hero-slides_home">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`hero-slide_home ${index === currentSlide ? "active_home" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
              aria-hidden={index !== currentSlide}
            />
          ))}
        </div>
        <div className="hero-overlay_home">
          <div
            className={`hero-content_home ${isLoaded ? "fade-in_home" : ""}`}
          >
            <h1 className="hero-title_home">
              <span className="gold-text_home">Satyadeva</span>
            </h1>
            <div className="hero-divider_home">
              <span className="divider-line_home"></span>
              <span className="divider-diamond_home">◆</span>
              <span className="divider-line_home"></span>
            </div>
            <p className="hero-subtitle_home">
              Preserving Life's Precious Moments
            </p>
          </div>
        </div>
        <div className="hero-dots_home">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`dot_home ${index === currentSlide ? "active_home" : ""}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section_home">
        <div className="container_home">
          <div className="quote-content_home">
            <span className="section-tag_home">Our Story</span>
            <h2 className="quote-heading_home">
              Every Moment Has A Story,
              <br />
              Every Story Deserves To Be Remembered
            </h2>
            <div className="section-divider_home"></div>
            <p className="quote-paragraph_home">
              From timeless traditions to life's most cherished milestones,
              <strong className="quote-strong_home"> Stories By SD</strong>{" "}
              preserves every emotion with authenticity and artistry. From
              weddings and family celebrations to maternity, newborn, and
              childhood memories, we transform fleeting moments into timeless
              stories that last forever.
            </p>
            <blockquote className="quote-blockquote_home">
              "Blessed by Tradition, Captured by Stories By SD."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Band Section */}
      <section className="band-section_home" aria-label="Partner brands">
        <div className="band-container_home">
          <div className="band-track_home">
            {[...Array(10)].map((_, i) => (
              <img
                key={i}
                src={band}
                alt="Partner brand showcase"
                className="band-image_home"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Kids Section */}
      <section className="gallery-section_home kids-section_home">
        <div className="container_home">
          <div className="gallery-header_home">
            <span className="section-tag_home">Child Photography</span>
            <h2 className="gallery-heading_home">The Magic of Childhood</h2>
            <p className="gallery-description_home">
              From first smiles to playful adventures, we capture every laugh,
              every hug, and every tiny milestone that makes childhood
              unforgettable.
            </p>
          </div>
          <div className="gallery-grid_home">
            {galleryData.kids.map((item) => (
              <div key={item.id} className="gallery-card_home">
                <div className="card-image-wrapper_home">
                  <img src={item.src} alt={item.alt} loading="lazy" />
                  <div className="card-overlay_home">
                    <span className="card-icon_home">✦</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wedding Section */}
      <section className="gallery-section_home wedding-section_home">
        <div className="container_home">
          <div className="gallery-header_home">
            <span className="section-tag_home">Wedding Photography</span>
            <h2 className="gallery-heading_home">A Story of Forever</h2>
            <p className="gallery-description_home">
              From sacred vows to joyful celebrations, we preserve every
              emotion, every tradition, and every unforgettable moment with
              timeless elegance.
            </p>
          </div>
          <div className="gallery-grid_home">
            {galleryData.wedding.map((item) => (
              <div key={item.id} className="gallery-card_home">
                <div className="card-image-wrapper_home">
                  <img src={item.src} alt={item.alt} loading="lazy" />
                  <div className="card-overlay_home">
                    <span className="card-icon_home">❤</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section_home">
        <div className="services-heading_home fade-up_home">
          <span className="services-label_home">OUR SERVICES</span>
          <h2 className="services-title_home">
            Crafting Memories That Last Forever
          </h2>
          <p className="services-description_home">
            Every photograph is created with creativity, precision, and emotion,
            transforming life's most beautiful moments into timeless works of
            art.
          </p>
        </div>

        {/* Wedding Service */}
        <div className="service-row_home fade-up_home">
          <div className="service-image_home">
            <img src={marriage} alt="Wedding Photography" />
          </div>
          <div className="service-content_home">
            <span className="service-label_home">TRADITIONAL WEDDINGS</span>
            <h3 className="service-heading_home">
              Where Every Ritual Becomes Timeless
            </h3>
            <p className="service-paragraph_home">
              Preserving every sacred ritual, heartfelt blessing, and timeless
              tradition with elegance and artistic excellence. Every emotion,
              smile, and celebration is beautifully documented to become a
              legacy cherished for generations.
            </p>
          </div>
        </div>

        {/* Kids Service */}
        <div className="service-row_home reverse_home fade-up_home">
          <div className="service-content_home">
            <span className="service-label_home">CHILD PHOTOGRAPHY</span>
            <h3 className="service-heading_home">The Magic of Growing Up</h3>
            <p className="service-paragraph_home">
              Childhood is filled with laughter, wonder, and unforgettable
              moments. We capture every smile, every tiny milestone, and every
              joyful adventure to create memories your family will treasure
              forever.
            </p>
          </div>
          <div className="service-image_home">
            <img src={child} alt="Child Photography" />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  );
};

export default Home;
