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
      setError("OTP is required");
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/shares/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: cleanOtp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to verify file"
        );
      }

      if (!data.downloadUrl) {
        throw new Error(
          "No download URL was returned"
        );
      }

      const downloadLink =
        document.createElement("a");

      downloadLink.href = data.downloadUrl;
      downloadLink.target = "_blank";
      downloadLink.rel = "noopener noreferrer";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      setSuccess(
        "Verification successful. Your download should begin shortly."
      );

      setOtp("");

    } catch (verifyError) {
      console.error(
        "Verification error:",
        verifyError
      );

      setError(
        verifyError.message ||
        "Unable to verify file"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="form"
      onSubmit={handleVerify}
    >
      <div className="form-group">
        <label htmlFor="otp">
          OTP
        </label>

        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(event) =>
            setOtp(
              event.target.value.replace(/\D/g, "")
            )
          }
          placeholder="Enter 6-digit OTP"
          maxLength={6}
        />
      </div>

      {error && (
        <p
          className="error-message"
          role="alert"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          className="success-text"
          role="status"
        >
          {success}
        </p>
      )}

      <button
        className="primary-button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Verifying..."
          : "Verify & Download"}
      </button>
    </form>
  );
}

export default DownloadFile;