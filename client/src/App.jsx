import { useState } from "react";
import UploadFile from "./components/UploadFile";
import DownloadFile from "./components/DownloadFile";

function App() {
  const [activeMode, setActiveMode] = useState("upload");

  return (
    <div className="app">
      <main className="card">
        <header className="header">
          <div className="brand-mark" aria-hidden="true">S</div>
          <h1>SecureDrop</h1>
          <p>Secure temporary file sharing</p>
        </header>
        <div className="mode-switch" role="tablist" aria-label="File sharing mode">
          <button className={activeMode === "upload" ? "mode-button active" : "mode-button"} onClick={() => setActiveMode("upload")} role="tab" aria-selected={activeMode === "upload"} type="button">Upload File</button>
          <button className={activeMode === "download" ? "mode-button active" : "mode-button"} onClick={() => setActiveMode("download")} role="tab" aria-selected={activeMode === "download"} type="button">Download File</button>
        </div>
        <section className="mode-content" key={activeMode}>
          {activeMode === "upload" ? <UploadFile /> : <DownloadFile />}
        </section>
      </main>
    </div>
  );
}

export default App;