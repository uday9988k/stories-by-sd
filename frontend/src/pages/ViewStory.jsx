import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ViewStory.css";

const ViewStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Story
  // ==========================================

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`http://localhost:8080/api/story/${id}`);

      if (response.data.success) {
        setStory(response.data.story);
      } else {
        setError("Wedding story not found.");
      }
    } catch (err) {
      console.error("Error fetching story:", err);

      setError(
        err.response?.data?.message || "Unable to load this wedding story.",
      );
    } finally {
      setLoading(false);
    }
  };

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
  // Loading
  // ==========================================

  if (loading) {
    return (
      <main className="viewStoryLoading_OurStories">
        <div className="viewStoryLoadingContent_OurStories">
          <div className="viewStorySpinner_OurStories"></div>

          <p className="viewStoryLoadingText_OurStories">
            Loading wedding story...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error || !story) {
    return (
      <main className="viewStoryError_OurStories">
        <div className="viewStoryErrorContent_OurStories">
          <span className="viewStoryErrorIcon_OurStories">♡</span>

          <h1 className="viewStoryErrorTitle_OurStories">Story Not Found</h1>

          <p className="viewStoryErrorMessage_OurStories">
            {error ||
              "The wedding story you're looking for could not be found."}
          </p>

          <button
            type="button"
            className="viewStoryBackButton_OurStories"
            onClick={() => navigate("/OurStories")}
          >
            ← Back to Our Stories
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="viewStoryPage_OurStories">
      {/* ======================================
          COVER / HERO
      ======================================= */}

      <section
        className="viewStoryHero_OurStories"
        style={{
          backgroundImage: `url(${story.coverImage?.url})`,
        }}
      >
        <div className="viewStoryHeroOverlay_OurStories"></div>

        <div className="viewStoryHeroContent_OurStories">
          <span className="viewStoryHeroLabel_OurStories">WEDDING STORY</span>

          <div className="viewStoryHeroDivider_OurStories"></div>

          <h1 className="viewStoryCoupleName_OurStories">{story.coupleName}</h1>

          <div className="viewStoryMeta_OurStories">
            <span className="viewStoryLocation_OurStories">
              {story.location}
            </span>

            <span className="viewStoryDot_OurStories">•</span>

            <span className="viewStoryDate_OurStories">
              {formatDate(story.weddingDate)}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="viewStoryBackTopButton_OurStories"
          onClick={() => navigate("/OurStories")}
        >
          ← Our Stories
        </button>
      </section>

      {/* ======================================
          STORY INFORMATION
      ======================================= */}

      <section className="viewStoryInfoSection_OurStories">
        <div className="viewStoryInfoInner_OurStories">
          <span className="viewStoryInfoLabel_OurStories">THE STORY</span>

          <h2 className="viewStoryInfoTitle_OurStories">{story.coupleName}</h2>

          {story.description && (
            <p className="viewStoryDescription_OurStories">
              {story.description}
            </p>
          )}

          <div className="viewStoryInfoDivider_OurStories"></div>

          <div className="viewStoryInfoDetails_OurStories">
            <div className="viewStoryInfoItem_OurStories">
              <span className="viewStoryInfoItemLabel_OurStories">
                LOCATION
              </span>

              <span className="viewStoryInfoItemValue_OurStories">
                {story.location}
              </span>
            </div>

            <div className="viewStoryInfoItem_OurStories">
              <span className="viewStoryInfoItemLabel_OurStories">
                WEDDING DATE
              </span>

              <span className="viewStoryInfoItemValue_OurStories">
                {formatDate(story.weddingDate)}
              </span>
            </div>

            <div className="viewStoryInfoItem_OurStories">
              <span className="viewStoryInfoItemLabel_OurStories">
                PHOTOGRAPHS
              </span>

              <span className="viewStoryInfoItemValue_OurStories">
                {story.images?.length || 0}
              </span>
            </div>

            <div className="viewStoryInfoItem_OurStories">
              <span className="viewStoryInfoItemLabel_OurStories">VIDEOS</span>

              <span className="viewStoryInfoItemValue_OurStories">
                {story.videos?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          GALLERY
      ======================================= */}

      {story.images?.length > 0 && (
        <section className="viewStoryGallerySection_OurStories">
          <div className="viewStorySectionHeader_OurStories">
            <span className="viewStorySectionLabel_OurStories">MOMENTS</span>

            <h2 className="viewStorySectionTitle_OurStories">
              The Celebration
            </h2>
          </div>

          <div className="viewStoryGalleryGrid_OurStories">
            {story.images.map((image, index) => (
              <div
                className="viewStoryGalleryItem_OurStories"
                key={image.public_id || `${image.url}-${index}`}
              >
                <img
                  className="viewStoryGalleryImage_OurStories"
                  src={image.url}
                  alt={`${story.coupleName} wedding moment ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================
          VIDEOS
      ======================================= */}

      {story.videos?.length > 0 && (
        <section className="viewStoryVideosSection_OurStories">
          <div className="viewStorySectionHeader_OurStories">
            <span className="viewStorySectionLabel_OurStories">FILMS</span>

            <h2 className="viewStorySectionTitle_OurStories">
              Moments in Motion
            </h2>
          </div>

          <div className="viewStoryVideosGrid_OurStories">
            {story.videos.map((video, index) => (
              <div
                className="viewStoryVideoItem_OurStories"
                key={video.public_id || `${video.url}-${index}`}
              >
                <video
                  className="viewStoryVideo_OurStories"
                  controls
                  preload="metadata"
                  playsInline
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================
          BACK TO STORIES
      ======================================= */}

      <section className="viewStoryEndSection_OurStories">
        <div className="viewStoryEndLine_OurStories"></div>

        <span className="viewStoryEndLabel_OurStories">STORIES BY SD</span>

        <h2 className="viewStoryEndTitle_OurStories">
          Every moment tells a story.
        </h2>

        <button
          type="button"
          className="viewStoryEndButton_OurStories"
          onClick={() => navigate("/OurStories")}
        >
          Explore More Stories
          <span className="viewStoryEndArrow_OurStories">→</span>
        </button>
      </section>
    </main>
  );
};

export default ViewStory;
