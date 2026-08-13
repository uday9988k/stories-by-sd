import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OurStories.css";

const OurStories = () => {
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Wedding Stories
  // ==========================================

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/story");

      if (response.data.success) {
        setStories(response.data.stories || []);
      } else {
        setError("Unable to load wedding stories.");
      }
    } catch (err) {
      console.error("Error fetching wedding stories:", err);

      setError(
        err.response?.data?.message || "Unable to load wedding stories.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Latest Story
  // ==========================================

  const latestStory = stories.length > 0 ? stories[0] : null;

  // ==========================================
  // Remaining Stories
  // ==========================================

  const remainingStories = stories.length > 1 ? stories.slice(1) : [];

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================
  // View Story
  // ==========================================

  const handleViewStory = (id) => {
    navigate(`/OurStories/${id}`);
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <main className="storiesLoading_OurStories">
        <div className="storiesLoadingContent_OurStories">
          <div className="loadingSpinner_OurStories"></div>

          <p className="loadingText_OurStories">Loading our stories...</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <main className="storiesError_OurStories">
        <div className="storiesErrorContent_OurStories">
          <h2 className="errorTitle_OurStories">Something went wrong</h2>

          <p className="errorMessage_OurStories">{error}</p>

          <button
            type="button"
            className="retryButton_OurStories"
            onClick={fetchStories}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // No Stories
  // ==========================================

  if (!latestStory) {
    return (
      <main className="storiesEmpty_OurStories">
        <div className="storiesEmptyContent_OurStories">
          <span className="emptyIcon_OurStories">♡</span>

          <h2 className="emptyTitle_OurStories">Our Stories</h2>

          <p className="emptyMessage_OurStories">
            Beautiful wedding stories are coming soon.
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // Main Page
  // ==========================================

  return (
    <main className="ourStoriesPage_OurStories">
      {/* ======================================
          HERO / LATEST STORY
      ======================================= */}

      <section
        className="featuredStory_OurStories"
        style={{
          backgroundImage: `url(${latestStory.coverImage?.url})`,
        }}
      >
        {/* Dark Overlay */}

        <div className="featuredOverlay_OurStories"></div>

        {/* Hero Content */}

        <div className="featuredContent_OurStories">
          <span className="featuredLabel_OurStories">LATEST STORY</span>

          <div className="featuredDivider_OurStories"></div>

          <h1 className="featuredCoupleName_OurStories">
            {latestStory.coupleName}
          </h1>

          <div className="featuredDetails_OurStories">
            <span className="featuredLocation_OurStories">
              {latestStory.location}
            </span>

            <span className="featuredDot_OurStories">•</span>

            <span className="featuredDate_OurStories">
              {formatDate(latestStory.weddingDate)}
            </span>
          </div>

          <button
            type="button"
            className="featuredButton_OurStories"
            onClick={() => handleViewStory(latestStory._id)}
          >
            <span className="featuredButtonText_OurStories">
              View Our Story
            </span>

            <span className="featuredButtonArrow_OurStories">→</span>
          </button>
        </div>

        {/* Scroll Indicator */}

        <button
          type="button"
          className="scrollIndicator_OurStories"
          onClick={() => {
            document.getElementById("allStories_OurStories")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          aria-label="Scroll to stories"
        >
          <span className="scrollText_OurStories">SCROLL TO EXPLORE</span>

          <span className="scrollArrow_OurStories">↓</span>
        </button>
      </section>

      {/* ======================================
          REMAINING STORIES
      ======================================= */}

      {remainingStories.length > 0 && (
        <section
          id="allStories_OurStories"
          className="allStoriesSection_OurStories"
        >
          {/* Section Heading */}

          <div className="storiesSectionHeader_OurStories">
            <span className="storiesSmallLabel_OurStories">
              WEDDING STORIES
            </span>

            <h2 className="storiesSectionTitle_OurStories">
              Moments worth remembering
            </h2>

            <p className="storiesSectionDescription_OurStories">
              Explore the beautiful celebrations, emotions and memories we've
              had the privilege of capturing.
            </p>
          </div>

          {/* Cards */}

          <div className="storiesGrid_OurStories">
            {remainingStories.map((story) => (
              <article className="storyCard_OurStories" key={story._id}>
                {/* Image */}

                <div className="storyCardImageWrapper_OurStories">
                  <img
                    className="storyCardImage_OurStories"
                    src={story.coverImage?.url}
                    alt={story.coupleName || "Wedding story"}
                    loading="lazy"
                  />

                  <div className="storyCardOverlay_OurStories"></div>

                  <button
                    type="button"
                    className="storyCardViewButton_OurStories"
                    onClick={() => handleViewStory(story._id)}
                  >
                    View Story
                    <span className="storyCardArrow_OurStories">→</span>
                  </button>
                </div>

                {/* Card Details */}

                <div className="storyCardDetails_OurStories">
                  <h3 className="storyCardTitle_OurStories">
                    {story.coupleName}
                  </h3>

                  <div className="storyCardMeta_OurStories">
                    <span className="storyCardLocation_OurStories">
                      {story.location}
                    </span>

                    <span className="storyCardDot_OurStories">•</span>

                    <span className="storyCardDate_OurStories">
                      {formatDate(story.weddingDate)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ======================================
          END SECTION
      ======================================= */}

      <section className="storiesEndSection_OurStories">
        <div className="storiesEndLine_OurStories"></div>

        <span className="storiesEndLabel_OurStories">STORIES BY SD</span>

        <h2 className="storiesEndTitle_OurStories">
          Every love story is unique.
        </h2>

        <p className="storiesEndText_OurStories">
          We're here to preserve yours forever.
        </p>
      </section>
    </main>
  );
};

export default OurStories;
