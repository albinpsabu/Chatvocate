
import { useState } from "react";

function UploadPanel({ onUpload, uploading, inputActionRef }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(fileList) {
    const file = fileList?.[0];

    if (!file) return;

    // Validate the selected file.
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF document.");
      return;
    }

    if (file.size === 0) {
      setError("The selected file is empty.");
      return;
    }

    setError("");
    onUpload(file);
  }

  function handleFileInputChange(event) {
    handleFiles(event.target.files);

    // Allow the same file to be selected again.
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);

    if (uploading) return;

    handleFiles(event.dataTransfer.files);
  }

  return (
    <section className="upload-panel card border-0">
      <div className="card-body p-4 p-lg-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <span className="section-eyebrow">
              <i className="bi bi-stars me-2"></i>
              DOCUMENT INTELLIGENCE
            </span>

            <h1 className="hero-title mt-3">
              Your documents.
              <br />
              <span>Answers that make sense.</span>
            </h1>

            <p className="text-secondary mt-3 mb-4">
              Upload a document, ask questions about its content,
              and explore AI-generated answers supported by
              relevant source passages.
            </p>

            {/* Shared file input used by both upload buttons. */}
            <input
              ref={inputActionRef}
              type="file"
              accept=".pdf,application/pdf"
              hidden
              disabled={uploading}
              onChange={handleFileInputChange}
            />

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => inputActionRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading document...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-arrow-up me-2"></i>
                  Upload a PDF
                </>
              )}
            </button>

            <div className="small text-secondary mt-3">
              <i className="bi bi-shield-check me-1"></i>
              PDF files supported
            </div>

            {error && (
              <div
                className="alert alert-danger small mt-3 mb-0"
                role="alert"
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}
          </div>

          <div className="col-lg-4 d-none d-lg-flex justify-content-center">
            <div className="upload-art">
              <i className="bi bi-file-earmark-pdf"></i>
              <i className="bi bi-stars upload-art-star"></i>
            </div>
          </div>
        </div>

        {/* Drag-and-drop upload area */}
        <div
          className={`drop-zone mt-4 text-center p-4 rounded-3 ${
            dragging ? "drop-zone-active" : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();

            if (!uploading) {
              setDragging(true);
            }
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setDragging(false);
            }
          }}
          onDrop={handleDrop}
          aria-label="Drop a PDF document here"
        >
          <i className="bi bi-inbox fs-3"></i>

          <div className="mt-2 fw-semibold">
            {dragging
              ? "Drop your PDF here"
              : "Drag and drop your document"}
          </div>

          <div className="small text-secondary mt-1">
            Or click Upload a PDF to browse your files
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadPanel;
