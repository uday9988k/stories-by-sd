import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";
import "../css/dashboard.css";

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/story");

      if (res.data.success) {
        setStories(res.data.stories);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalStories = stories.length;

  const totalPhotos = stories.reduce(
    (sum, story) => sum + (story.images?.length || 0),
    0,
  );

  const totalVideos = stories.reduce(
    (sum, story) => sum + (story.videos?.length || 0),
    0,
  );

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>{totalStories}</h2>
            <p>Wedding Stories</p>
          </div>

          <div className="dashboard-card">
            <h2>{totalPhotos}</h2>
            <p>Total Photos</p>
          </div>

          <div className="dashboard-card">
            <h2>{totalVideos}</h2>
            <p>Total Videos</p>
          </div>
        </div>

        <div className="recent-stories">
          <h2>Recent Wedding Stories</h2>

          {loading ? (
            <p>Loading...</p>
          ) : stories.length === 0 ? (
            <p>No Wedding Stories Found.</p>
          ) : (
            <div className="story-grid">
              {stories.slice(0, 4).map((story) => (
                <div className="story-card" key={story._id}>
                  <img src={story.coverImage.url} alt={story.coupleName} />

                  <div className="story-info">
                    <h3>{story.coupleName}</h3>

                    <p>{story.location}</p>

                    <span>📷 {story.images.length} Photos</span>

                    <span>🎥 {story.videos.length} Videos</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
