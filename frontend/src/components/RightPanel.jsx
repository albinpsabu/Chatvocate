
function RightPanel({ document, messages }) {
  const latestMessage = [...messages].reverse().find(
    (message) => message.sources?.length
  );

  const sources = latestMessage?.sources || [];

  return (
    <aside className="right-panel p-3">
      <section className="card panel-card mb-3">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Document details</h6>

          {document ? (
            <>
              <div className="d-flex align-items-start gap-2 mb-3">
                <span className="pdf-icon">
                  <i className="bi bi-file-earmark-pdf-fill"></i>
                </span>

                <div className="flex-grow-1 min-w-0">
                  <div className="small fw-semibold text-break">
                    {document.title}
                  </div>
                  <div className="small text-secondary mt-1">
                    Document ID: {document.id}
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <span>File status</span>
                <span className="text-success">
                  {document.processed ? "Text processed" : "Pending"}
                </span>
              </div>

              <hr className="panel-divider" />

              <div className="small text-secondary">
                Processing status does not necessarily indicate that vector
                indexing has completed.
              </div>
            </>
          ) : (
            <p className="small text-secondary mb-0">
              Upload or select a document to see its details.
            </p>
          )}
        </div>
      </section>

      <section className="card panel-card" id="sources">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0">Answer sources</h6>
            <span className="badge text-bg-primary">{sources.length}</span>
          </div>

          {sources.length === 0 ? (
            <div className="source-empty text-center py-3">
              <i className="bi bi-journal-text fs-2"></i>
              <p className="small text-secondary mt-2 mb-0">
                Sources will appear here when an answer includes references.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {sources.map((source, index) => (
                <div
                  className="source-card rounded-3 p-3"
                  key={`${source.source}-${index}`}
                >
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-file-earmark-text source-file-icon"></i>

                    <div className="min-w-0">
                      <div className="small fw-semibold text-break">
                        {source.document_title || "Legal document"}
                      </div>

                      <div className="small text-secondary mt-1">
                        {source.page_number != null
                          ? `Page ${source.page_number}`
                          : "Page not specified"}
                      </div>
                    </div>
                  </div>

                  <p className="small text-secondary mt-3 mb-0 source-excerpt">
                    {source.excerpt}
                  </p>

                  <div className="small text-secondary mt-2">
                    Source {source.source}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="privacy-card rounded-3 p-3 mt-3">
        <i className="bi bi-shield-lock me-2"></i>
        <strong className="small">Privacy reminder</strong>
        <p className="small text-secondary mt-2 mb-0">
          Use appropriate access controls and document isolation before
          deploying a public multi-user service.
        </p>
      </div>
    </aside>
  );
}

export default RightPanel;
