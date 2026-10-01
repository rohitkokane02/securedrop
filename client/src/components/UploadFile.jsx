import { useState, useRef } from "react";

const API_URL = "http://localhost:5000";

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [duration, setDuration] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [copiedField, setCopiedField] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please choose a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("duration", duration);

    try {
      const response = await fetch(`${API_URL}/api/files/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed. Please try again.");
      }

      if (!data.otp || !data.expiresAt) {
        throw new Error(
          "Upload succeeded but sharing information was not returned"
        );
      }

      setUploadResult({
        otp: data.otp,
        expiresAt: data.expiresAt,
      });
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      setError(
        uploadError.message || "Unable to upload file. Please check server."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyValue = async (field, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField("");
      }, 2000);
    } catch {
      setError("Unable to copy. Please copy the value manually.");
    }
  };

  if (uploadResult) {
    const expirationDate = new Date(uploadResult.expiresAt);
    const formattedTime = expirationDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="success-section" aria-live="polite">
        <div className="success-icon-badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2>Your file is ready</h2>

        <p className="success-instruction">
          Share this OTP with the person who needs the file.
        </p>

        <div className="otp-card">
          <span className="otp-card-label">6-DIGIT OTP</span>
          <div className="otp-display-large">{uploadResult.otp}</div>
          <button
            type="button"
            className="copy-otp-button"
            onClick={() => copyValue("otp", uploadResult.otp)}
          >
            {copiedField === "otp" ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="btn-icon"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="btn-icon"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy OTP
              </>
            )}
          </button>
        </div>

        <div className="expiration-info">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="meta-icon"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Available until {formattedTime} ({duration} mins)</span>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setUploadResult(null);
            setSelectedFile(null);
            setError("");
          }}
        >
          Upload another file
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleUpload}>
      <div className="form-group">
        <label className="form-label" htmlFor="file-input">
          File selection
        </label>

        <div
          className={`dropzone ${isDragOver ? "drag-over" : ""} ${
            selectedFile ? "has-file" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            id="file-input"
            ref={fileInputRef}
            type="file"
            className="hidden-file-input"
            onChange={(e) => handleFileChange(e.target.files[0] || null)}
          />

          {selectedFile ? (
            <div className="selected-file-info">
              <div className="file-icon-badge">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="file-details">
                <span className="selected-file-name">{selectedFile.name}</span>
                <span className="selected-file-size">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
              <button
                type="button"
                className="change-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                title="Remove file"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="dropzone-placeholder">
              <div className="dropzone-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <span className="dropzone-text">
                <strong>Click to browse</strong> or drag & drop a file
              </span>
              <span className="dropzone-hint">Temporary encrypted sharing</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="expiry">
          How long should this file be available?
        </label>
        <div className="select-wrapper">
          <select
            id="expiry"
            className="custom-select"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          >
            <option value="2">2 minutes</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
          </select>
          <svg
            className="select-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {error && (
        <div className="error-alert" role="alert">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="alert-icon"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        className="primary-button"
        type="submit"
        disabled={loading || !selectedFile}
      >
        {loading ? (
          <span className="button-loading">
            <span className="spinner"></span>
            Uploading File...
          </span>
        ) : (
          "Upload File"
        )}
      </button>
    </form>
  );
}

export default UploadFile;