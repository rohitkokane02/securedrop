import { useState } from "react";
import UploadFile from "./components/UploadFile";
import DownloadFile from "./components/DownloadFile";

function App() {
  const [activeMode, setActiveMode] = useState("upload");

  return (
    <div className="app">
      <main className="card">
        <header className="header">
          <div className="brand-badge">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h1>SecureDrop</h1>
          <h2 className="header-subtitle">Share files temporarily. No account required.</h2>
          <p className="header-description">
            Upload a file, get a secure OTP, and share it with the recipient.
          </p>

          <div className="steps-bar" aria-label="How SecureDrop works">
            <div className="step-item">
              <span className="step-num">1</span>
              <span className="step-text">Upload</span>
            </div>
            <span className="step-arrow" aria-hidden="true">→</span>
            <div className="step-item">
              <span className="step-num">2</span>
              <span className="step-text">Share OTP</span>
            </div>
            <span className="step-arrow" aria-hidden="true">→</span>
            <div className="step-item">
              <span className="step-num">3</span>
              <span className="step-text">Download</span>
            </div>
          </div>
        </header>

        <div className="mode-switch" role="tablist" aria-label="File sharing mode">
          <button
            className={`mode-button ${activeMode === "upload" ? "active" : ""}`}
            onClick={() => setActiveMode("upload")}
            role="tab"
            aria-selected={activeMode === "upload"}
            type="button"
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload File
          </button>
          <button
            className={`mode-button ${activeMode === "download" ? "active" : ""}`}
            onClick={() => setActiveMode("download")}
            role="tab"
            aria-selected={activeMode === "download"}
            type="button"
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download File
          </button>
        </div>

        <section className="mode-content" key={activeMode}>
          {activeMode === "upload" ? <UploadFile /> : <DownloadFile />}
        </section>
      </main>
    </div>
  );
}

export default App;