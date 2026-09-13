import { useState } from "react";

const API_URL = "http://localhost:5000";

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [duration, setDuration] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [copiedField, setCopiedField] = useState("");

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
      const response = await fetch(
        `${API_URL}/api/files/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Upload failed"
        );
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
        uploadError.message ||
        "Unable to upload file"
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
      }, 1800);

    } catch {
      setError(
        "Unable to copy. Please copy the value manually."
      );
    }
  };

  if (uploadResult) {
    return (
      <div
        className="success-section"
        aria-live="polite"
      >
        <div
          className="success-icon"
          aria-hidden="true"
        >
          &#10003;
        </div>

        <h2>File ready to share</h2>

        <p className="success-message">
          Share this OTP with the intended recipient.
        </p>

        <div className="share-details">

          {/* OTP */}
          <div className="share-row">
            <div>
              <span className="detail-label">
                OTP
              </span>

              <strong>
                {uploadResult.otp}
              </strong>
            </div>

            <button
              type="button"
              className="copy-button"
              onClick={() =>
                copyValue(
                  "otp",
                  uploadResult.otp
                )
              }
            >
              {copiedField === "otp"
                ? "Copied"
                : "Copy"}
            </button>
          </div>

        </div>

        <p className="expiration">
          Expires{" "}
          {new Date(
            uploadResult.expiresAt
          ).toLocaleString()}
        </p>

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
    <form
      className="form"
      onSubmit={handleUpload}
    >
      <div className="form-group">
        <label htmlFor="file">
          Choose a file
        </label>

        <input
          id="file"
          type="file"
          onChange={(event) =>
            setSelectedFile(
              event.target.files[0] || null
            )
          }
        />

        {selectedFile && (
          <span className="file-name">
            {selectedFile.name}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="expiry">
          File expires after
        </label>

        <select
          id="expiry"
          value={duration}
          onChange={(event) =>
            setDuration(event.target.value)
          }
        >
          <option value="2">
            2 minutes
          </option>

          <option value="5">
            5 minutes
          </option>

          <option value="10">
            10 minutes
          </option>
        </select>
      </div>

      {error && (
        <p
          className="error-message"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        className="primary-button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Uploading..."
          : "Upload File"}
      </button>
    </form>
  );
}

export default UploadFile;