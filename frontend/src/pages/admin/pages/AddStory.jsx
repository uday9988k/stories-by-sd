import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import "../css/addStory.css";

const AddStory = () => {
  const navigate = useNavigate();

  // Constants for validation
  const MAX_IMAGE_SIZE = 5; // MB
  const MAX_VIDEO_SIZE = 100; // MB
  const MAX_GALLERY_IMAGES = 20;
  const MAX_VIDEOS = 5;

  // Form states
  const [coupleName, setCoupleName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Cover image states
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverInfo, setCoverInfo] = useState(null);

  // Gallery states
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);

  // Video states
  const [videos, setVideos] = useState([]);
  const [videoPreview, setVideoPreview] = useState([]);

  // UI states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessSummary, setShowSuccessSummary] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Refs for drag and drop
  const galleryDropRef = useRef(null);
  const videoDropRef = useRef(null);

  // Toast configuration
  const toastConfig = {
    autoClose: 3000,
    position: "top-right",
  };

  // Check if form has data
  const hasFormData = () => {
    return (
      coupleName || coverImage || galleryImages.length > 0 || videos.length > 0
    );
  };

  // Clean up object URLs on unmount or when files change
  useEffect(() => {
    return () => {
      // Revoke cover preview
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }

      // Revoke gallery previews
      galleryPreview.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });

      // Revoke video previews
      videoPreview.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [coverPreview, galleryPreview, videoPreview]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasFormData()) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [coupleName, coverImage, galleryImages, videos]);

  // Handle Cancel with confirmation
  const handleCancel = () => {
    if (hasFormData()) {
      setShowCancelDialog(true);
    } else {
      navigate("/admin/stories");
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    // Clean up
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    galleryPreview.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });
    videoPreview.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });
    navigate("/admin/stories");
  };

  // Handle Cover Image
  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file", toastConfig);
      return;
    }

    // Validate file size
    const sizeInMB = file.size / 1024 / 1024;
    if (sizeInMB > MAX_IMAGE_SIZE) {
      toast.error(
        `Cover image must be less than ${MAX_IMAGE_SIZE}MB`,
        toastConfig,
      );
      e.target.value = "";
      return;
    }

    // Revoke old preview if exists
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));

    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setCoverInfo({
        size: sizeInMB.toFixed(2),
        width: img.width,
        height: img.height,
        orientation:
          img.width > img.height
            ? "Landscape"
            : img.width < img.height
              ? "Portrait"
              : "Square",
        type: file.type,
        name: file.name,
        isWebP: file.type === "image/webp",
        extension: getFileExtension(file.name),
      });
    };
    img.src = URL.createObjectURL(file);
  };

  // Check for duplicate files
  const isDuplicateFile = (file, existingFiles) => {
    return existingFiles.some(
      (existing) =>
        existing.name === file.name &&
        existing.size === file.size &&
        existing.type === file.type,
    );
  };

  // Get file extension
  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  // Handle Gallery Images
  const handleGalleryImages = (files) => {
    const fileArray = Array.from(files);

    // Check maximum number of images
    if (galleryImages.length + fileArray.length > MAX_GALLERY_IMAGES) {
      toast.error(`Maximum ${MAX_GALLERY_IMAGES} images allowed`, toastConfig);
      return;
    }

    // Filter valid files
    const validFiles = [];
    const duplicateFiles = [];

    fileArray.forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.warning(`${file.name} is not an image file`, toastConfig);
        return;
      }

      // Check file size
      const sizeInMB = file.size / 1024 / 1024;
      if (sizeInMB > MAX_IMAGE_SIZE) {
        toast.warning(
          `${file.name} exceeds ${MAX_IMAGE_SIZE}MB limit`,
          toastConfig,
        );
        return;
      }

      // Check for duplicates
      if (isDuplicateFile(file, galleryImages)) {
        duplicateFiles.push(file.name);
        return;
      }

      validFiles.push(file);
    });

    if (duplicateFiles.length > 0) {
      toast.warning(
        `${duplicateFiles.join(", ")} already selected`,
        toastConfig,
      );
    }

    if (validFiles.length === 0) {
      return;
    }

    // Process each valid file to get dimensions
    const previews = [];
    let processedCount = 0;

    validFiles.forEach((file) => {
      const img = new Image();
      img.onload = () => {
        const previewData = {
          file,
          preview: URL.createObjectURL(file),
          size: (file.size / 1024 / 1024).toFixed(2),
          name: file.name,
          width: img.width,
          height: img.height,
          orientation:
            img.width > img.height
              ? "Landscape"
              : img.width < img.height
                ? "Portrait"
                : "Square",
          type: file.type,
          extension: getFileExtension(file.name),
          isWebP: file.type === "image/webp",
        };
        previews.push(previewData);
        processedCount++;

        // When all images are processed, update state
        if (processedCount === validFiles.length) {
          setGalleryImages((prev) => [...prev, ...validFiles]);
          setGalleryPreview((prev) => [...prev, ...previews]);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle Gallery Upload (click)
  const handleGalleryUpload = (e) => {
    if (e.target.files.length > 0) {
      handleGalleryImages(e.target.files);
      e.target.value = "";
    }
  };

  // Handle Gallery Drop
  const handleGalleryDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      handleGalleryImages(e.dataTransfer.files);
    }
  };

  const handleGalleryDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle Videos
  const handleVideos = (files) => {
    const fileArray = Array.from(files);

    // Check maximum number of videos
    if (videos.length + fileArray.length > MAX_VIDEOS) {
      toast.error(`Maximum ${MAX_VIDEOS} videos allowed`, toastConfig);
      return;
    }

    // Filter valid files
    const validFiles = [];
    const duplicateFiles = [];

    fileArray.forEach((file) => {
      // Check file type
      if (!file.type.startsWith("video/")) {
        toast.warning(`${file.name} is not a video file`, toastConfig);
        return;
      }

      // Check file size
      const sizeInMB = file.size / 1024 / 1024;
      if (sizeInMB > MAX_VIDEO_SIZE) {
        toast.warning(
          `${file.name} exceeds ${MAX_VIDEO_SIZE}MB limit`,
          toastConfig,
        );
        return;
      }

      // Check for duplicates
      if (isDuplicateFile(file, videos)) {
        duplicateFiles.push(file.name);
        return;
      }

      validFiles.push(file);
    });

    if (duplicateFiles.length > 0) {
      toast.warning(
        `${duplicateFiles.join(", ")} already selected`,
        toastConfig,
      );
    }

    if (validFiles.length === 0) {
      return;
    }

    // Process each valid file to get duration
    const previews = [];
    let processedCount = 0;

    validFiles.forEach((file) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const durationString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        const previewData = {
          file,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          preview: URL.createObjectURL(file),
          duration: durationString,
          durationSeconds: duration,
          type: file.type,
          extension: getFileExtension(file.name),
        };
        previews.push(previewData);
        processedCount++;

        if (processedCount === validFiles.length) {
          setVideos((prev) => [...prev, ...validFiles]);
          setVideoPreview((prev) => [...prev, ...previews]);
        }
      };
      video.src = URL.createObjectURL(file);
    });
  };

  // Handle Video Upload (click)
  const handleVideoUpload = (e) => {
    if (e.target.files.length > 0) {
      handleVideos(e.target.files);
      e.target.value = "";
    }
  };

  // Handle Video Drop
  const handleVideoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      handleVideos(e.dataTransfer.files);
    }
  };

  const handleVideoDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Remove Gallery Image
  const removeGalleryImage = (index) => {
    // Revoke object URL to prevent memory leak
    if (galleryPreview[index]?.preview) {
      URL.revokeObjectURL(galleryPreview[index].preview);
    }

    const images = [...galleryImages];
    const preview = [...galleryPreview];

    images.splice(index, 1);
    preview.splice(index, 1);

    setGalleryImages(images);
    setGalleryPreview(preview);
  };

  // Remove Video
  const removeVideo = (index) => {
    // Revoke object URL to prevent memory leak
    if (videoPreview[index]?.preview) {
      URL.revokeObjectURL(videoPreview[index].preview);
    }

    const list = [...videos];
    const preview = [...videoPreview];

    list.splice(index, 1);
    preview.splice(index, 1);

    setVideos(list);
    setVideoPreview(preview);
  };

  // Calculate Total Upload Size
  const totalImageSize = galleryPreview
    .reduce((sum, img) => sum + Number(img.size), 0)
    .toFixed(2);

  const totalVideoSize = videoPreview
    .reduce((sum, video) => sum + Number(video.size), 0)
    .toFixed(2);

  const totalSize = (Number(totalImageSize) + Number(totalVideoSize)).toFixed(
    2,
  );

  // Reset Form
  const resetForm = () => {
    // Revoke all object URLs
    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }
    galleryPreview.forEach((item) => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });
    videoPreview.forEach((item) => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });

    setCoupleName("");
    setWeddingDate("");
    setLocation("");
    setDescription("");
    setCoverImage(null);
    setCoverPreview("");
    setCoverInfo(null);
    setGalleryImages([]);
    setGalleryPreview([]);
    setVideos([]);
    setVideoPreview([]);
    setUploadProgress(0);
    setUploadStatus("");
  };

  // Submit Story
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!coupleName.trim() || !weddingDate || !location.trim()) {
      toast.error("Please fill all required fields.", toastConfig);
      return;
    }

    if (!coverImage) {
      toast.error("Cover image is required.", toastConfig);
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      setUploadStatus("Preparing files...");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error(
          "Authentication required. Please login again.",
          toastConfig,
        );
        navigate("/admin/login");
        return;
      }

      const formData = new FormData();

      // Append text fields
      formData.append("coupleName", coupleName.trim());
      formData.append("weddingDate", weddingDate);
      formData.append("location", location.trim());
      formData.append("description", description.trim());

      // Append cover image
      formData.append("coverImage", coverImage);

      // Append gallery images
      galleryImages.forEach((image) => {
        formData.append("images", image);
      });

      // Append videos
      videos.forEach((video) => {
        formData.append("videos", video);
      });

      const res = await axios.post(
        "https://stories-by-sd.vercel.app/api/story/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percent);

            // Update status based on progress
            if (percent < 30) {
              setUploadStatus("Uploading images...");
            } else if (percent < 60) {
              setUploadStatus("Uploading videos...");
            } else if (percent < 90) {
              setUploadStatus("Processing files...");
            } else {
              setUploadStatus("Finalizing...");
            }
          },
        },
      );

      if (res.data.success) {
        // Set success data for summary
        setSuccessData({
          coupleName: coupleName.trim(),
          images: galleryPreview.length,
          videos: videoPreview.length,
          totalSize: totalSize,
        });

        setShowSuccessSummary(true);
        toast.success("Wedding Story Created Successfully!", toastConfig);

        // Reset form after showing summary
        resetForm();

        // Navigate after 2.5 seconds
        setTimeout(() => {
          setShowSuccessSummary(false);
          navigate("/admin/stories");
        }, 2500);
      } else {
        toast.error(res.data.message || "Upload failed", toastConfig);
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (error.response) {
        toast.error(
          error.response?.data?.message || "Upload failed. Please try again.",
          toastConfig,
        );

        if (error.response.status === 401) {
          localStorage.removeItem("adminToken");
          setTimeout(() => navigate("/admin/login"), 2000);
        }
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection.",
          toastConfig,
        );
      } else {
        toast.error("An error occurred. Please try again.", toastConfig);
      }
    } finally {
      setLoading(false);
      setUploadStatus("");
      setTimeout(() => setUploadProgress(0), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="add-story-container_addStory">
        <div className="add-story-header_addStory">
          <h1>Add Wedding Story</h1>
          <p className="subtitle_addStory">
            Create a beautiful wedding story for your couples
          </p>
        </div>

        {/* Upload Guidelines */}
        <div className="upload-guidelines_addStory">
          <h3>📸 Upload Guidelines</h3>
          <ul>
            <li>
              Use <strong>WebP</strong> images whenever possible for better
              performance.
            </li>
            <li>
              Landscape cover image is <strong>recommended</strong> for better
              appearance.
            </li>
            <li>Portrait images are also supported.</li>
            <li>
              Maximum <strong>20</strong> gallery images.
            </li>
            <li>
              Maximum <strong>5</strong> videos.
            </li>
            <li>
              Maximum image size: <strong>5 MB</strong>.
            </li>
            <li>
              Maximum video size: <strong>100 MB</strong>.
            </li>
          </ul>
        </div>

        {/* Success Summary Overlay */}
        {showSuccessSummary && successData && (
          <div className="success-summary-overlay_addStory">
            <div className="success-summary_addStory">
              <div className="success-icon_addStory">✓</div>
              <h2>Wedding Story Created!</h2>
              <div className="success-details_addStory">
                <div className="success-item_addStory">
                  <span className="success-label_addStory">Couple:</span>
                  <span className="success-value_addStory">
                    {successData.coupleName}
                  </span>
                </div>
                <div className="success-item_addStory">
                  <span className="success-label_addStory">Images:</span>
                  <span className="success-value_addStory">
                    {successData.images}
                  </span>
                </div>
                <div className="success-item_addStory">
                  <span className="success-label_addStory">Videos:</span>
                  <span className="success-value_addStory">
                    {successData.videos}
                  </span>
                </div>
                <div className="success-item_addStory">
                  <span className="success-label_addStory">Total Size:</span>
                  <span className="success-value_addStory">
                    {successData.totalSize} MB
                  </span>
                </div>
              </div>
              <p className="success-redirect_addStory">
                Redirecting to stories...
              </p>
            </div>
          </div>
        )}

        {/* Cancel Dialog */}
        {showCancelDialog && (
          <div className="modal-overlay_addStory">
            <div className="modal-dialog_addStory">
              <h3>Leave this page?</h3>
              <p>All selected files will be lost.</p>
              <div className="modal-actions_addStory">
                <button
                  className="btn_addStory btn-secondary_addStory"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn_addStory btn-danger_addStory"
                  onClick={confirmCancel}
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-story-form_addStory">
          {/* Basic Information Section */}
          <div className="form-section_addStory">
            <h2>Basic Information</h2>
            <div className="form-row_addStory">
              <div className="form-group_addStory">
                <label htmlFor="coupleName_addStory">
                  Couple Name <span className="required_addStory">*</span>
                </label>
                <input
                  type="text"
                  id="coupleName_addStory"
                  placeholder="e.g., Raj & Priya"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  disabled={loading}
                  className="form-control_addStory"
                  maxLength="100"
                />
              </div>

              <div className="form-group_addStory">
                <label htmlFor="weddingDate_addStory">
                  Wedding Date <span className="required_addStory">*</span>
                </label>
                <input
                  type="date"
                  id="weddingDate_addStory"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  disabled={loading}
                  className="form-control_addStory"
                />
              </div>
            </div>

            <div className="form-group_addStory">
              <label htmlFor="location_addStory">
                Location <span className="required_addStory">*</span>
              </label>
              <input
                type="text"
                id="location_addStory"
                placeholder="e.g., Taj Mahal Palace, Mumbai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                className="form-control_addStory"
                maxLength="200"
              />
            </div>

            <div className="form-group_addStory">
              <label htmlFor="description_addStory">Description</label>
              <textarea
                id="description_addStory"
                placeholder="Tell the beautiful story of this couple..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="form-control_addStory"
                rows="4"
                maxLength="1000"
              />
              <small className="character-count_addStory">
                {description.length}/1000 characters
              </small>
            </div>
          </div>

          {/* Cover Image Section */}
          <div className="form-section_addStory">
            <h2>
              Cover Image <span className="required_addStory">*</span>
            </h2>

            {/* Landscape Warning */}
            {coverInfo && coverInfo.orientation !== "Landscape" && (
              <div className="warning-box_addStory">
                ⚠ Landscape cover image is <strong>recommended</strong> for
                better appearance.
              </div>
            )}

            {/* WebP Recommendation */}
            {coverInfo && !coverInfo.isWebP && (
              <div className="recommendation-box_addStory">
                💡 <strong>{coverInfo.extension.toUpperCase()}</strong>{" "}
                uploaded. Recommendation: Use <strong>WebP</strong> for smaller
                size.
              </div>
            )}

            <div className="cover-image-upload_addStory">
              <div className="upload-area_addStory">
                <input
                  type="file"
                  id="coverImage_addStory"
                  accept="image/*"
                  onChange={handleCoverImage}
                  disabled={loading}
                  className="file-input_addStory"
                />
                <label
                  htmlFor="coverImage_addStory"
                  className="upload-label_addStory"
                >
                  {coverPreview ? (
                    <div className="preview-container_addStory">
                      <img
                        src={coverPreview}
                        alt="Cover Preview"
                        className="cover-preview_addStory"
                      />
                      <span className="change-text_addStory">
                        Click to change
                      </span>
                    </div>
                  ) : (
                    <div className="upload-placeholder_addStory">
                      <span className="upload-icon_addStory">📸</span>
                      <p>Click to upload cover image</p>
                      <small>JPG, PNG, WebP (Max {MAX_IMAGE_SIZE}MB)</small>
                    </div>
                  )}
                </label>
              </div>

              {coverInfo && (
                <div className="cover-info_addStory">
                  <div className="info-item_addStory">
                    <span className="info-label_addStory">File:</span>
                    <span className="info-value_addStory">
                      {coverInfo.name}
                    </span>
                  </div>
                  <div className="info-item_addStory">
                    <span className="info-label_addStory">Format:</span>
                    <span className="info-value_addStory">
                      {coverInfo.type}
                    </span>
                  </div>
                  <div className="info-item_addStory">
                    <span className="info-label_addStory">Size:</span>
                    <span className="info-value_addStory">
                      {coverInfo.size} MB
                    </span>
                  </div>
                  <div className="info-item_addStory">
                    <span className="info-label_addStory">Dimensions:</span>
                    <span className="info-value_addStory">
                      {coverInfo.width} × {coverInfo.height} px
                    </span>
                  </div>
                  <div className="info-item_addStory">
                    <span className="info-label_addStory">Orientation:</span>
                    <span
                      className={`info-value_addStory orientation-${coverInfo.orientation.toLowerCase()}_addStory`}
                    >
                      {coverInfo.orientation}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images Section */}
          <div className="form-section_addStory">
            <h2>Gallery Images</h2>
            <p className="section-help_addStory">
              Add up to {MAX_GALLERY_IMAGES} images (Max {MAX_IMAGE_SIZE}MB
              each)
            </p>

            <div
              className="gallery-upload_addStory"
              ref={galleryDropRef}
              onDrop={handleGalleryDrop}
              onDragOver={handleGalleryDragOver}
            >
              <input
                type="file"
                id="galleryImages_addStory"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={loading || galleryImages.length >= MAX_GALLERY_IMAGES}
                className="file-input_addStory"
              />
              <label
                htmlFor="galleryImages_addStory"
                className="upload-label_addStory secondary_addStory"
              >
                <span className="upload-icon_addStory">🖼️</span>
                <p>Drag Images Here or Click to Upload</p>
                <small>
                  {galleryImages.length}/{MAX_GALLERY_IMAGES} images
                </small>
              </label>
            </div>

            {galleryPreview.length > 0 && (
              <>
                <div className="gallery-grid_addStory">
                  {galleryPreview.map((item, index) => (
                    <div key={index} className="gallery-item_addStory">
                      <img
                        src={item.preview}
                        alt={`Gallery ${index + 1}`}
                        className="gallery-thumbnail_addStory"
                      />
                      <div className="gallery-item-info_addStory">
                        <div className="file-name_addStory">{item.name}</div>
                        <div className="file-details_addStory">
                          <span className="file-detail_addStory">
                            {item.orientation}
                          </span>
                          <span className="file-detail_addStory">
                            {item.width}×{item.height}
                          </span>
                          <span className="file-detail_addStory">
                            {item.size} MB
                          </span>
                          {!item.isWebP && (
                            <span className="file-detail_addStory format-warning_addStory">
                              ⚠️ {item.extension.toUpperCase()}
                            </span>
                          )}
                          {item.isWebP && (
                            <span className="file-detail_addStory format-good_addStory">
                              ✓ WebP
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="remove-btn_addStory"
                        disabled={loading}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="gallery-summary_addStory">
                  <span>Total: {galleryPreview.length} images</span>
                  <span>Total Size: {totalImageSize} MB</span>
                </div>
              </>
            )}
          </div>

          {/* Videos Section */}
          <div className="form-section_addStory">
            <h2>Videos</h2>
            <p className="section-help_addStory">
              Add up to {MAX_VIDEOS} videos (Max {MAX_VIDEO_SIZE}MB each)
            </p>

            <div
              className="video-upload_addStory"
              ref={videoDropRef}
              onDrop={handleVideoDrop}
              onDragOver={handleVideoDragOver}
            >
              <input
                type="file"
                id="videos_addStory"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                disabled={loading || videos.length >= MAX_VIDEOS}
                className="file-input_addStory"
              />
              <label
                htmlFor="videos_addStory"
                className="upload-label_addStory secondary_addStory"
              >
                <span className="upload-icon_addStory">🎬</span>
                <p>Drag Videos Here or Click to Upload</p>
                <small>
                  {videos.length}/{MAX_VIDEOS} videos
                </small>
              </label>
            </div>

            {videoPreview.length > 0 && (
              <>
                <div className="video-grid_addStory">
                  {videoPreview.map((item, index) => (
                    <div key={index} className="video-item_addStory">
                      <video
                        src={item.preview}
                        className="video-thumbnail_addStory"
                        controls
                        preload="metadata"
                      />
                      <div className="video-item-info_addStory">
                        <div className="file-name_addStory">{item.name}</div>
                        <div className="file-details_addStory">
                          <span className="file-detail_addStory">
                            ⏱ {item.duration}
                          </span>
                          <span className="file-detail_addStory">
                            {item.size} MB
                          </span>
                          <span className="file-detail_addStory">
                            {item.extension.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="remove-btn_addStory"
                        disabled={loading}
                        aria-label="Remove video"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="video-summary_addStory">
                  <span>Total: {videoPreview.length} videos</span>
                  <span>Total Size: {totalVideoSize} MB</span>
                </div>
              </>
            )}
          </div>

          {/* Upload Summary */}
          {(galleryPreview.length > 0 || videoPreview.length > 0) && (
            <div className="upload-summary_addStory">
              <h3>Upload Summary</h3>
              <div className="summary-grid_addStory">
                <div className="summary-item_addStory">
                  <span className="summary-label_addStory">Total Files:</span>
                  <span className="summary-value_addStory">
                    {1 + galleryPreview.length + videoPreview.length}
                  </span>
                </div>
                <div className="summary-item_addStory">
                  <span className="summary-label_addStory">Total Size:</span>
                  <span className="summary-value_addStory">{totalSize} MB</span>
                </div>
                <div className="summary-item_addStory">
                  <span className="summary-label_addStory">Images:</span>
                  <span className="summary-value_addStory">
                    {galleryPreview.length}
                  </span>
                </div>
                <div className="summary-item_addStory">
                  <span className="summary-label_addStory">Videos:</span>
                  <span className="summary-value_addStory">
                    {videoPreview.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {loading && (
            <div className="progress-container_addStory">
              <div className="progress-status-text_addStory">
                {uploadStatus}
              </div>
              <div className="progress-bar-wrapper_addStory">
                <div
                  className="progress-bar_addStory"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <span className="progress-text_addStory">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="progress-bar-bg_addStory">
                <div
                  className="progress-bar-fill_addStory"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions_addStory">
            <button
              type="button"
              onClick={handleCancel}
              className="btn_addStory btn-secondary_addStory"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn_addStory btn-primary_addStory"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner_addStory"></span>
                  {uploadProgress < 100
                    ? `${uploadProgress}%`
                    : "Processing..."}
                </>
              ) : (
                "Add Wedding Story"
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddStory;
