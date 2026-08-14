// ViewStories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import "../css/stories.css";

const ViewStories = () => {
  const navigate = useNavigate();

  // States
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch Stories
  const fetchStories = async () => {
    try {
      const res = await axios.get("https://stories-by-sd.vercel.app/api/story");

      if (res.data.success) {
        setStories(res.data.stories);
      }
    } catch (error) {
      console.log("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Search Filter
  const filteredStories = stories.filter((story) =>
    story.coupleName.toLowerCase().includes(search.toLowerCase()),
  );

  // Delete Handler
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.delete(
        `https://stories-by-sd.vercel.app/api/story/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        // Refresh stories after deletion
        fetchStories();
        setShowDeleteModal(false);
        setDeleteId(null);
        alert("Story Deleted Successfully!");
      }
    } catch (error) {
      console.log("Error deleting story:", error);
      alert("Failed to delete story. Please try again.");
    }
  };

  // Loading State
  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">Loading Wedding Stories...</div>
      </AdminLayout>
    );
  }

  // Empty State
  if (!loading && filteredStories.length === 0) {
    return (
      <AdminLayout>
        <div className="empty">No Wedding Stories Found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="stories-page">
        {/* Header */}
        <div className="stories-header">
          <input
            type="text"
            placeholder="Search Wedding..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button
            onClick={() => navigate("/admin/stories/add")}
            className="add-story-btn"
          >
            + Add Story
          </button>
        </div>

        {/* Stories Grid */}
        <div className="stories-grid">
          {filteredStories.map((story) => (
            <div className="story-card" key={story._id}>
              <img
                src={
                  story.coverImage?.url || "https://via.placeholder.com/300x240"
                }
                alt={story.coupleName}
                loading="lazy"
              />

              <h3>{story.coupleName}</h3>
              <p className="story-location">{story.location}</p>
              <p className="story-date">
                📅 {new Date(story.weddingDate).toLocaleDateString()}
              </p>
              <p className="story-media">
                📷 {story.images?.length || 0} Photos
              </p>
              <p className="story-media">
                🎥 {story.videos?.length || 0} Videos
              </p>

              <div className="story-actions">
                <button
                  onClick={() => navigate(`/admin/stories/view/${story._id}`)}
                  className="view-btn"
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/admin/stories/edit/${story._id}`)}
                  className="edit-btn"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setDeleteId(story._id);
                    setShowDeleteModal(true);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="delete-modal">
            <div className="delete-box">
              <h2>Delete Wedding Story</h2>
              <p>
                Are you sure you want to delete this wedding story?
                <br />
                <span style={{ fontSize: "14px", color: "#e53935" }}>
                  This action cannot be undone.
                </span>
              </p>
              <div className="delete-buttons">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteId(null);
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button onClick={handleDelete} className="confirm-delete-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewStories;
