import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import "../css/editStory.css";

const EditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================================
  // Constants
  // ================================
  const MAX_IMAGE_SIZE = 5; // MB
  const MAX_VIDEO_SIZE = 100; // MB
  const MAX_GALLERY_IMAGES = 20;
  const MAX_VIDEOS = 5;

  // ================================
  // Loading States
  // ================================
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ================================
  // Story
  // ================================
  const [story, setStory] = useState(null);

  // ================================
  // Basic Information
  // ================================
  const [coupleName, setCoupleName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // ================================
  // Existing Cover
  // ================================
  const [existingCover, setExistingCover] = useState(null);

  // ================================
  // New Cover
  // ================================
  const [newCover, setNewCover] = useState(null);
  const [newCoverPreview, setNewCoverPreview] = useState("");
  const [newCoverInfo, setNewCoverInfo] = useState(null);

  // ================================
  // Existing Gallery Images
  // ================================
  const [existingImages, setExistingImages] = useState([]);

  // IDs of existing images that admin wants to remove
  const [removeImages, setRemoveImages] = useState([]);

  // ================================
  // New Gallery Images
  // ================================
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // ================================
  // Existing Videos
  // ================================
  const [existingVideos, setExistingVideos] = useState([]);

  // IDs of existing videos that admin wants to remove
  const [removeVideos, setRemoveVideos] = useState([]);

  // ================================
  // New Videos
  // ================================
  const [newVideos, setNewVideos] = useState([]);
  const [newVideoPreviews, setNewVideoPreviews] = useState([]);

  // ================================
  // Toast Configuration
  // ================================
  const toastConfig = {
    autoClose: 3000,
    position: "top-right",
  };

  // ================================
  // Fetch Story
  // ================================
  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/api/story/${id}`);

      if (res.data.success) {
        const data = res.data.story;

        setStory(data);

        // Basic fields
        setCoupleName(data.coupleName || "");
        setWeddingDate(
          data.weddingDate
            ? new Date(data.weddingDate).toISOString().split("T")[0]
            : "",
        );
        setLocation(data.location || "");
        setDescription(data.description || "");

        // Existing media
        setExistingCover(data.coverImage || null);
        setExistingImages(data.images || []);
        setExistingVideos(data.videos || []);
      }
    } catch (error) {
      console.error("Error fetching story:", error);

      toast.error(
        error.response?.data?.message || "Failed to load wedding story",
        toastConfig,
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Handle New Cover Image
  // ================================
  const handleNewCover = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.", toastConfig);
      e.target.value = "";
      return;
    }

    const sizeInMB = file.size / 1024 / 1024;

    if (sizeInMB > MAX_IMAGE_SIZE) {
      toast.error(
        `Cover image must be less than ${MAX_IMAGE_SIZE} MB.`,
        toastConfig,
      );
      e.target.value = "";
      return;
    }

    if (newCoverPreview) {
      URL.revokeObjectURL(newCoverPreview);
    }

    const preview = URL.createObjectURL(file);

    setNewCover(file);
    setNewCoverPreview(preview);

    const img = new Image();

    img.onload = () => {
      const orientation =
        img.width > img.height
          ? "Landscape"
          : img.width < img.height
            ? "Portrait"
            : "Square";

      setNewCoverInfo({
        size: sizeInMB.toFixed(2),
        width: img.width,
        height: img.height,
        orientation,
      });
    };

    img.src = preview;

    e.target.value = "";
  };

  // ================================
  // Remove New Cover
  // ================================
  const removeNewCover = () => {
    if (newCoverPreview) {
      URL.revokeObjectURL(newCoverPreview);
    }

    setNewCover(null);
    setNewCoverPreview("");
    setNewCoverInfo(null);
  };

  // ================================
  // Remove Existing Gallery Image
  // ================================
  const handleRemoveExistingImage = (publicId) => {
    setExistingImages((prev) =>
      prev.filter((image) => image.public_id !== publicId),
    );

    setRemoveImages((prev) => {
      if (prev.includes(publicId)) {
        return prev;
      }

      return [...prev, publicId];
    });
  };

  // ================================
  // Undo Existing Gallery Image Removal
  // ================================
  const handleUndoExistingImage = (image) => {
    setExistingImages((prev) => {
      const alreadyExists = prev.some(
        (item) => item.public_id === image.public_id,
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, image];
    });

    setRemoveImages((prev) => prev.filter((id) => id !== image.public_id));
  };

  // ================================
  // Handle New Gallery Images
  // ================================
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const remainingSlots =
      MAX_GALLERY_IMAGES - existingImages.length - newImages.length;

    if (remainingSlots <= 0) {
      toast.error(
        `Maximum ${MAX_GALLERY_IMAGES} gallery images allowed.`,
        toastConfig,
      );
      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(
        `Only ${remainingSlots} more image(s) can be added.`,
        toastConfig,
      );
    }

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.warning(`${file.name} is not an image file.`, toastConfig);
        return false;
      }

      const sizeInMB = file.size / 1024 / 1024;

      if (sizeInMB > MAX_IMAGE_SIZE) {
        toast.warning(
          `${file.name} exceeds ${MAX_IMAGE_SIZE} MB.`,
          toastConfig,
        );
        return false;
      }

      return true;
    });

    const newPreviews = validFiles.map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...validFiles]);

    setNewImagePreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  // ================================
  // Remove New Gallery Image
  // ================================
  const removeNewImage = (index) => {
    const item = newImagePreviews[index];

    if (item?.preview) {
      URL.revokeObjectURL(item.preview);
    }

    setNewImages((prev) => prev.filter((_, i) => i !== index));

    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ================================
  // Remove Existing Video
  // ================================
  const handleRemoveExistingVideo = (publicId) => {
    setExistingVideos((prev) =>
      prev.filter((video) => video.public_id !== publicId),
    );

    setRemoveVideos((prev) => {
      if (prev.includes(publicId)) {
        return prev;
      }

      return [...prev, publicId];
    });
  };

  // ================================
  // Undo Existing Video Removal
  // ================================
  const handleUndoExistingVideo = (video) => {
    setExistingVideos((prev) => {
      const alreadyExists = prev.some(
        (item) => item.public_id === video.public_id,
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, video];
    });

    setRemoveVideos((prev) => prev.filter((id) => id !== video.public_id));
  };

  // ================================
  // Add New Videos
  // ================================
  const handleNewVideos = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const remainingSlots =
      MAX_VIDEOS - existingVideos.length - newVideos.length;

    if (remainingSlots <= 0) {
      toast.error(`Maximum ${MAX_VIDEOS} videos allowed.`, toastConfig);

      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(
        `Only ${remainingSlots} more video(s) can be added.`,
        toastConfig,
      );
    }

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("video/")) {
        toast.warning(`${file.name} is not a video file.`, toastConfig);

        return false;
      }

      const sizeInMB = file.size / 1024 / 1024;

      if (sizeInMB > MAX_VIDEO_SIZE) {
        toast.warning(
          `${file.name} exceeds ${MAX_VIDEO_SIZE} MB.`,
          toastConfig,
        );

        return false;
      }

      return true;
    });

    const previews = validFiles.map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      preview: URL.createObjectURL(file),
    }));

    setNewVideos((prev) => [...prev, ...validFiles]);

    setNewVideoPreviews((prev) => [...prev, ...previews]);

    e.target.value = "";
  };

  // ================================
  // Remove New Video
  // ================================
  const removeNewVideo = (index) => {
    const item = newVideoPreviews[index];

    if (item?.preview) {
      URL.revokeObjectURL(item.preview);
    }

    setNewVideos((prev) => prev.filter((_, i) => i !== index));

    setNewVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ================================
  // Total Media Count
  // ================================
  const totalImages = existingImages.length + newImages.length;

  const totalVideos = existingVideos.length + newVideos.length;

  // ================================
  // Total New Upload Size
  // ================================
  const totalNewImageSize = newImagePreviews
    .reduce((total, image) => total + Number(image.size), 0)
    .toFixed(2);

  const totalNewVideoSize = newVideoPreviews
    .reduce((total, video) => total + Number(video.size), 0)
    .toFixed(2);

  // ================================
  // Submit Update
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coupleName.trim()) {
      toast.error("Couple name is required.", toastConfig);
      return;
    }

    if (!weddingDate) {
      toast.error("Wedding date is required.", toastConfig);
      return;
    }

    if (!location.trim()) {
      toast.error("Location is required.", toastConfig);
      return;
    }

    if (totalImages > MAX_GALLERY_IMAGES) {
      toast.error(
        `Maximum ${MAX_GALLERY_IMAGES} gallery images allowed.`,
        toastConfig,
      );
      return;
    }

    if (totalVideos > MAX_VIDEOS) {
      toast.error(`Maximum ${MAX_VIDEOS} videos allowed.`, toastConfig);
      return;
    }

    try {
      setSaving(true);
      setUploadProgress(0);

      const token = localStorage.getItem("adminToken");

      const formData = new FormData();

      // ================================
      // Basic Information
      // ================================

      formData.append("coupleName", coupleName.trim());

      formData.append("weddingDate", weddingDate);

      formData.append("location", location.trim());

      formData.append("description", description.trim());

      // ================================
      // New Cover
      // ================================

      if (newCover) {
        formData.append("coverImage", newCover);
      }

      // ================================
      // Images To Remove
      // ================================

      if (removeImages.length > 0) {
        formData.append("removeImages", JSON.stringify(removeImages));
      }

      // ================================
      // New Gallery Images
      // ================================

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      // ================================
      // Videos To Remove
      // ================================

      if (removeVideos.length > 0) {
        formData.append("removeVideos", JSON.stringify(removeVideos));
      }

      // ================================
      // New Videos
      // ================================

      newVideos.forEach((video) => {
        formData.append("videos", video);
      });

      // ================================
      // API Request
      // ================================

      const res = await axios.put(
        `https://stories-by-sd.vercel.app/api/story/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );

              setUploadProgress(progress);
            }
          },
        },
      );

      if (res.data.success) {
        toast.success("Wedding Story Updated Successfully!", toastConfig);

        setUploadProgress(100);

        setTimeout(() => {
          navigate("/admin/stories");
        }, 800);
      }
    } catch (error) {
      console.error("Update story error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update wedding story.",
        toastConfig,
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // Loading Screen
  // ================================
  if (loading) {
    return (
      <AdminLayout>
        <div className="edit-story-loading_editStory">
          Loading Wedding Story...
        </div>
      </AdminLayout>
    );
  }

  // ================================
  // Story Not Found
  // ================================
  if (!story) {
    return (
      <AdminLayout>
        <div className="edit-story-loading_editStory">
          <h2>Wedding Story Not Found</h2>

          <button
            type="button"
            className="back-story-btn_editStory"
            onClick={() => navigate("/admin/stories")}
          >
            Back to Stories
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="edit-story-container_editStory">
        {/* ================================
            HEADER
        ================================= */}

        <div className="edit-story-header_editStory">
          <div>
            <h1>Edit Wedding Story</h1>
            <p>Update the wedding story, images and videos.</p>
          </div>

          <button
            type="button"
            className="back-story-btn_editStory"
            onClick={() => navigate("/admin/stories")}
            disabled={saving}
          >
            ← Back to Stories
          </button>
        </div>

        <form className="edit-story-form_editStory" onSubmit={handleSubmit}>
          {/* ================================
              BASIC INFORMATION
          ================================= */}

          <section className="edit-section_editStory">
            <div className="section-heading_editStory">
              <h2>Basic Information</h2>
              <p>Update the wedding details.</p>
            </div>

            <div className="edit-form-grid_editStory">
              <div className="edit-form-group_editStory">
                <label htmlFor="coupleName_editStory">
                  Couple Name
                  <span className="required_editStory">*</span>
                </label>

                <input
                  id="coupleName_editStory"
                  type="text"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  placeholder="e.g. Rahul ❤️ Priya"
                  maxLength={100}
                  disabled={saving}
                />
              </div>

              <div className="edit-form-group_editStory">
                <label htmlFor="weddingDate_editStory">
                  Wedding Date
                  <span className="required_editStory">*</span>
                </label>

                <input
                  id="weddingDate_editStory"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="edit-form-group_editStory full-width_editStory">
                <label htmlFor="location_editStory">
                  Location
                  <span className="required_editStory">*</span>
                </label>

                <input
                  id="location_editStory"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  maxLength={200}
                  disabled={saving}
                />
              </div>

              <div className="edit-form-group_editStory full-width_editStory">
                <label htmlFor="description_editStory">Description</label>

                <textarea
                  id="description_editStory"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the beautiful story..."
                  rows={5}
                  maxLength={1000}
                  disabled={saving}
                />

                <small className="char-count_editStory">
                  {description.length}/1000 characters
                </small>
              </div>
            </div>
          </section>

          {/* ================================
              COVER IMAGE
          ================================= */}

          <section className="edit-section_editStory">
            <div className="section-heading_editStory">
              <h2>Cover Image</h2>
              <p>Replace the existing cover image if required.</p>
            </div>

            <div className="cover-edit-wrapper_editStory">
              {/* Current Cover */}

              <div className="current-cover_editStory">
                <h3>Current Cover</h3>

                {existingCover?.url ? (
                  <img src={existingCover.url} alt={coupleName} />
                ) : (
                  <div className="no-media_editStory">No cover image</div>
                )}
              </div>

              {/* New Cover */}

              <div className="new-cover_editStory">
                <h3>New Cover</h3>

                <input
                  type="file"
                  id="newCover_editStory"
                  accept="image/*"
                  onChange={handleNewCover}
                  disabled={saving}
                  hidden
                />

                <label
                  htmlFor="newCover_editStory"
                  className="upload-box_editStory"
                >
                  {newCoverPreview ? (
                    <img src={newCoverPreview} alt="New cover preview" />
                  ) : (
                    <>
                      <span className="upload-icon_editStory">📸</span>

                      <strong>Select New Cover</strong>

                      <small>JPG, PNG or WebP</small>
                    </>
                  )}
                </label>

                {newCoverInfo && (
                  <div className="media-info_editStory">
                    <span>Size: {newCoverInfo.size} MB</span>

                    <span>
                      Dimensions: {newCoverInfo.width} × {newCoverInfo.height}px
                    </span>

                    <span>Orientation: {newCoverInfo.orientation}</span>
                  </div>
                )}

                {newCover && newCoverInfo?.orientation !== "Landscape" && (
                  <div className="upload-warning_editStory">
                    ⚠ Landscape cover images are recommended for better display.
                  </div>
                )}

                {newCover && (
                  <button
                    type="button"
                    className="remove-new-btn_editStory"
                    onClick={removeNewCover}
                    disabled={saving}
                  >
                    Remove New Cover
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ================================
              EXISTING GALLERY
          ================================= */}

          <section className="edit-section_editStory">
            <div className="section-heading_editStory">
              <h2>Existing Gallery Images</h2>

              <p>Remove images you no longer want in this wedding story.</p>
            </div>

            {existingImages.length === 0 ? (
              <div className="empty-media_editStory">
                No existing gallery images.
              </div>
            ) : (
              <div className="edit-gallery-grid_editStory">
                {existingImages.map((image) => (
                  <div
                    className="edit-media-card_editStory"
                    key={image.public_id}
                  >
                    <img src={image.url} alt="" />

                    <button
                      type="button"
                      className="media-remove-btn_editStory"
                      onClick={() => handleRemoveExistingImage(image.public_id)}
                      disabled={saving}
                    >
                      ×
                    </button>

                    <div className="media-card-footer_editStory">
                      Existing Image
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Removed Images */}

            {removeImages.length > 0 && (
              <div className="removed-media-notice_editStory">
                ⚠ {removeImages.length} image(s) marked for deletion.
                <br />
                They will be deleted from Cloudinary and MongoDB when you save
                the changes.
              </div>
            )}
          </section>

          {/* ================================
              ADD NEW GALLERY
          ================================= */}

          <section className="edit-section_editStory">
            <div className="section-heading_editStory">
              <h2>Add New Gallery Images</h2>

              <p>You can add new images without removing existing ones.</p>
            </div>

            <div className="gallery-upload-area_editStory">
              <input
                type="file"
                id="newGalleryImages_editStory"
                accept="image/*"
                multiple
                onChange={handleNewImages}
                disabled={
                  saving ||
                  existingImages.length + newImages.length >= MAX_GALLERY_IMAGES
                }
                hidden
              />

              <label
                htmlFor="newGalleryImages_editStory"
                className="upload-box_editStory gallery-upload-box_editStory"
              >
                <span className="upload-icon_editStory">🖼️</span>

                <strong>Add Gallery Images</strong>

                <small>
                  {existingImages.length + newImages.length}/
                  {MAX_GALLERY_IMAGES} images
                </small>

                <small>Maximum {MAX_IMAGE_SIZE} MB per image</small>
              </label>
            </div>

            {newImagePreviews.length > 0 && (
              <div className="new-images-wrapper_editStory">
                <h3>New Images</h3>

                <div className="edit-gallery-grid_editStory">
                  {newImagePreviews.map((item, index) => (
                    <div
                      className="edit-media-card_editStory new-media-card_editStory"
                      key={`${item.name}-${index}`}
                    >
                      <img src={item.preview} alt={item.name} />

                      <button
                        type="button"
                        className="media-remove-btn_editStory"
                        onClick={() => removeNewImage(index)}
                        disabled={saving}
                      >
                        ×
                      </button>

                      <div className="media-card-footer_editStory">
                        <span>{item.name}</span>

                        <span>{item.size} MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ================================
              EXISTING VIDEOS
          ================================= */}

          <section className="edit-section_editStory">
            <div className="section-heading_editStory">
              <h2>Existing Videos</h2>

              <p>
                Remove videos that you no longer want in this wedding story.
              </p>
            </div>

            {existingVideos.length === 0 ? (
              <div className="empty-media_editStory">No existing videos.</div>
            ) : (
              <div className="edit-video-grid_editStory">
                {existingVideos.map((video) => (
                  <div
                    className="edit-video-card_editStory"
                    key={video.public_id}
                  >
                    <video controls preload="metadata">
                      <source src={video.url} type="video/mp4" />
                    </video>

                    <button
                      type="button"
                      className="media-remove-btn_editStory"
                      onClick={() => handleRemoveExistingVideo(video.public_id)}
                      disabled={saving}
                    >
                      ×
                    </button>

                    <div className="media-card-footer_editStory">
                      Existing Video
                    </div>
                  </div>
                ))}
              </div>
            )}

            {removeVideos.length > 0 && (
              <div className="removed-media-notice_editStory">
                ⚠ {removeVideos.length} video(s) marked for deletion.
                <br />
                They will be deleted from Cloudinary and MongoDB when you save
                the changes.
              </div>
            )}
          </section>

          {/* ================================
              ADD NEW VIDEOS
          ================================= */}

          <section className="edit-section_editStory">
            <div className="section-heading_editStory">
              <h2>Add New Videos</h2>

              <p>Add additional wedding videos to this story.</p>
            </div>

            <div className="gallery-upload-area_editStory">
              <input
                type="file"
                id="newVideos_editStory"
                accept="video/*"
                multiple
                onChange={handleNewVideos}
                disabled={
                  saving ||
                  existingVideos.length + newVideos.length >= MAX_VIDEOS
                }
                hidden
              />

              <label
                htmlFor="newVideos_editStory"
                className="upload-box_editStory gallery-upload-box_editStory"
              >
                <span className="upload-icon_editStory">🎥</span>

                <strong>Add Wedding Videos</strong>

                <small>
                  {existingVideos.length + newVideos.length}/{MAX_VIDEOS} videos
                </small>

                <small>Maximum {MAX_VIDEO_SIZE} MB per video</small>
              </label>
            </div>

            {newVideoPreviews.length > 0 && (
              <div className="new-images-wrapper_editStory">
                <h3>New Videos</h3>

                <div className="edit-video-grid_editStory">
                  {newVideoPreviews.map((video, index) => (
                    <div
                      className="edit-video-card_editStory new-media-card_editStory"
                      key={`${video.name}-${index}`}
                    >
                      <video controls preload="metadata">
                        <source src={video.preview} type={video.file.type} />
                      </video>

                      <button
                        type="button"
                        className="media-remove-btn_editStory"
                        onClick={() => removeNewVideo(index)}
                        disabled={saving}
                      >
                        ×
                      </button>

                      <div className="media-card-footer_editStory">
                        <span>{video.name}</span>

                        <span>{video.size} MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ================================
              UPLOAD SUMMARY
          ================================= */}

          <section className="edit-summary_editStory">
            <div className="summary-item_editStory">
              <span>Gallery Images</span>

              <strong>
                {totalImages}/{MAX_GALLERY_IMAGES}
              </strong>
            </div>

            <div className="summary-item_editStory">
              <span>Videos</span>

              <strong>
                {totalVideos}/{MAX_VIDEOS}
              </strong>
            </div>

            <div className="summary-item_editStory">
              <span>New Images Size</span>

              <strong>{totalNewImageSize} MB</strong>
            </div>

            <div className="summary-item_editStory">
              <span>New Videos Size</span>

              <strong>{totalNewVideoSize} MB</strong>
            </div>
          </section>

          {/* ================================
              UPLOAD PROGRESS
          ================================= */}

          {saving && (
            <div className="edit-upload-progress_editStory">
              <div className="progress-header_editStory">
                <span>Updating Wedding Story...</span>

                <strong>{uploadProgress}%</strong>
              </div>

              <div className="progress-track_editStory">
                <div
                  className="progress-fill_editStory"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* ================================
              ACTION BUTTONS
          ================================= */}

          <div className="edit-story-actions_editStory">
            <button
              type="button"
              className="cancel-edit-btn_editStory"
              onClick={() => navigate("/admin/stories")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-story-btn_editStory"
              disabled={saving}
            >
              {saving ? `Updating... ${uploadProgress}%` : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditStory;
