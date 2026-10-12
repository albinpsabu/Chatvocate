
function DocumentList({
  documents,
  selectedDocumentId,
  onSelect,
  search,
  loading,
}) {
  const filteredDocuments = documents.filter((document) =>
    (document.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section id="documents" className="mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="section-title mb-1">Your documents</h5>
          <p className="small text-secondary mb-0">
            Select a file to view its details.
          </p>
        </div>

        <span className="badge rounded-pill text-bg-primary">
          {documents.length} files
        </span>
      </div>

      {loading && (
        <div className="small text-secondary py-3">
          <span className="spinner-border spinner-border-sm me-2"></span>
          Loading documents...
        </div>
      )}

      {!loading && filteredDocuments.length === 0 && (
        <div className="empty-state rounded-3 p-4 text-center">
          <i className="bi bi-folder2-open fs-2"></i>
          <p className="mb-0 mt-2 text-secondary">
            No documents found. Upload a PDF to get started.
          </p>
        </div>
      )}

      <div className="row g-3">
        {filteredDocuments.map((document) => (
          <div className="col-6 col-xl-6" key={document.id}>
            <button
              type="button"
              className={`document-card card w-100 h-100 text-start ${
                selectedDocumentId === document.id ? "selected" : ""
              }`}
              onClick={() => onSelect(document)}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between mb-3">
                  <span className="pdf-icon">
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                  </span>

                  {selectedDocumentId === document.id && (
                    <i className="bi bi-check-circle-fill text-primary"></i>
                  )}
                </div>

                <div
                  className="document-title text-truncate"
                  title={document.title}
                >
                  {document.title}
                </div>

                <div className="small text-secondary mt-2">
                  {document.file
                    ? document.file.split("/").pop()
                    : "PDF document"}
                </div>

                <div className="mt-3">
                  <span
                    className={`badge ${
                      document.processed
                        ? "text-bg-success"
                        : "text-bg-secondary"
                    }`}
                  >
                    {document.processed ? "Text processed" : "Processing"}
                  </span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DocumentList;
