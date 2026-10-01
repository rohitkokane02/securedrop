import { useState } from "react";

const API_URL = "http://localhost:5000";

function DownloadFile() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/shares/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: cleanOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const msg = (data.message || "").toLowerCase();
        if (response.status === 410 || msg.includes("expired")) {
          throw new Error("This file has expired and is no longer available.");
        } else if (
          response.status === 401 ||
          msg.includes("invalied") ||
          msg.includes("invalid") ||
          msg.includes("not found")
        ) {
          throw new Error(
            "Invalid OTP. Please check the 6-digit code received from the sender."
          );
        } else {
          throw new Error(data.message || "Unable to verify file.");
        }
      }

      if (!data.downloadUrl) {
        throw new Error("No download URL was returned");
      }

      const downloadLink = document.createElement("a");
      downloadLink.href = data.downloadUrl;
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      setSuccess(
        "Verification successful! Your file download should begin shortly."
      );
      setOtp("");
    } catch (verifyError) {
      console.error("Verification error:", verifyError);
      setError(verifyError.message || "Unable to verify file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="download-container">
      <div className="download-header">
        <h2>Download a shared file</h2>
        <p className="download-subtitle">
          Enter the 6-digit OTP you received from the sender.
        </p>
      </div>

      <form className="form" onSubmit={handleVerify}>
        <div className="form-group">
          <label htmlFor="otp" className="form-label sr-only">
            6-Digit OTP
          </label>

          <div className="otp-input-wrapper">
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              placeholder="000000"
              maxLength={6}
              className="otp-input-large"
              aria-describedby="otp-hint"
            />
          </div>
          <span id="otp-hint" className="input-hint">
            Enter all 6 numerical digits
          </span>
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

        {success && (
          <div className="success-alert" role="status">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="alert-icon"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <span className="button-loading">
              <span className="spinner"></span>
              Verifying OTP...
            </span>
          ) : (
            "Verify & Download"
          )}
        </button>
      </form>
    </div>
  );
}

export default DownloadFile;