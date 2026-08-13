import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import "../css/viewStory.css";

const ViewStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const res = await axios.get(`/api/story/${id}`);

      if (res.data.success) {
        setStory(res.data.story);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="story-loading">Loading Wedding Story...</div>
      </AdminLayout>
    );
  }

  if (!story) {
    return (
      <AdminLayout>
        <div className="story-loading">Story Not Found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="viewStory">
        {/* HERO */}

        <section
          className="storyHero"
          style={{
            backgroundImage: `url(${story.coverImage.url})`,
          }}
        >
          <div className="storyOverlay">
            <button
              className="backButton"
              onClick={() => navigate("/admin/stories")}
            >
              ← Back
            </button>

            <button
              className="editButton"
              onClick={() => navigate(`/admin/stories/edit/${story._id}`)}
            >
              Edit Story
            </button>

            <div className="heroContent">
              <h1>{story.coupleName}</h1>

              <p>📍 {story.location}</p>

              <p>
                📅{" "}
                {new Date(story.weddingDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <p className="heroDescription">{story.description}</p>
            </div>
          </div>
        </section>

        {/* INFORMATION */}

        <section className="storyInfo">
          <h2>Wedding Information</h2>

          <div className="infoGrid">
            <div className="infoCard">
              <h4>Story ID</h4>
              <p>{story._id}</p>
            </div>

            <div className="infoCard">
              <h4>Couple Name</h4>
              <p>{story.coupleName}</p>
            </div>

            <div className="infoCard">
              <h4>Location</h4>
              <p>{story.location}</p>
            </div>

            <div className="infoCard">
              <h4>Wedding Date</h4>
              <p>{new Date(story.weddingDate).toLocaleDateString("en-IN")}</p>
            </div>

            <div className="infoCard">
              <h4>Gallery Images</h4>
              <p>{story.images.length}</p>
            </div>

            <div className="infoCard">
              <h4>Videos</h4>
              <p>{story.videos.length}</p>
            </div>

            <div className="infoCard">
              <h4>Created At</h4>
              <p>{new Date(story.createdAt).toLocaleString()}</p>
            </div>

            <div className="infoCard">
              <h4>Updated At</h4>
              <p>{new Date(story.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}

        <section className="descriptionSection">
          <h2>Description</h2>

          <p>{story.description}</p>
        </section>

        {/* GALLERY */}

        <section className="gallerySection">
          <h2>Gallery Images</h2>

          <div className="galleryGrid">
            {story.images.length === 0 ? (
              <p>No Images Uploaded</p>
            ) : (
              story.images.map((image) => (
                <img
                  key={image.public_id}
                  src={image.url}
                  alt=""
                  className="galleryImage"
                />
              ))
            )}
          </div>
        </section>

        {/* VIDEOS */}

        <section className="videoSection">
          <h2>Videos</h2>

          <div className="videoGrid">
            {story.videos.length === 0 ? (
              <p>No Videos Uploaded</p>
            ) : (
              story.videos.map((video) => (
                <video key={video.public_id} controls className="storyVideo">
                  <source src={video.url} type="video/mp4" />
                </video>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default ViewStory;
