
import { useState } from "react";

function ChatWorkspace({
  document,
  messages,
  onAsk,
  loading,
}) {
  const [question, setQuestion] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    setQuestion("");
    await onAsk(trimmedQuestion);
  }

  const suggestions = [
    {
      icon: "bi-file-text",
      title: "Summarize this document",
      prompt: "Summarize the document and identify its key points.",
    },
    {
      icon: "bi-search",
      title: "Find key information",
      prompt: "What are the most important points in this document?",
    },
    {
      icon: "bi-lightbulb",
      title: "Explain a concept",
      prompt: "Explain the main concepts in this document.",
    },
    {
      icon: "bi-list-check",
      title: "Extract key points",
      prompt: "List the key facts and important details in this document.",
    },
  ];

  return (
    <section id="chat" className="chat-workspace card mt-4">
      <div className="card-header chat-header d-flex align-items-center gap-3">
        <span className="pdf-icon">
          <i className="bi bi-file-earmark-text"></i>
        </span>

        <div className="flex-grow-1 min-w-0">
          <div className="fw-semibold text-truncate">
            {document?.title || "Choose a document"}
          </div>
          <div className="small text-secondary">
            Document Q&A
          </div>
        </div>

        <span className="badge rounded-pill text-bg-secondary">
          Public
        </span>
      </div>

      <div className="card-body chat-body">
        {messages.length === 0 ? (
          <div className="chat-welcome text-center">
            <div className="assistant-icon mx-auto mb-3">
              <i className="bi bi-stars"></i>
            </div>

            <h4 className="section-title">
              What would you like to know?
            </h4>

            <p className="text-secondary small mx-auto welcome-description">
              Ask a question about your documents or choose one of the
              suggestions below.
            </p>

            <div className="row g-2 mt-4 text-start">
              {suggestions.map((item) => (
                <div className="col-12 col-sm-6" key={item.title}>
                  <button
                    className="suggestion-card w-100 text-start"
                    onClick={() => setQuestion(item.prompt)}
                    disabled={!document || loading}
                  >
                    <i className={`bi ${item.icon} me-2`}></i>
                    {item.title}
                    <i className="bi bi-arrow-up-right ms-auto"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((message, index) => (
              <div className="mb-4" key={message.id || index}>
                <div className="d-flex justify-content-end mb-3">
                  <div className="user-bubble">
                    {message.question}
                  </div>
                </div>

                {message.error ? (
                  <div className="alert alert-danger py-2 small">
                    {message.error}
                  </div>
                ) : (
                  <div className="assistant-message">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="assistant-icon small-assistant-icon">
                        <i className="bi bi-stars"></i>
                      </span>
                      <strong className="small">Chatvocate AI</strong>
                    </div>

                    <div className="answer-text">
                      {message.answer || "No answer was returned."}
                    </div>

                    {message.sources?.length > 0 && (
                      <div className="mt-3">
                        <div className="small fw-semibold mb-2">
                          Supporting sources
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                          {message.sources.map((source, sourceIndex) => (
                            <span
                              className="source-chip"
                              key={`${source.source}-${sourceIndex}`}
                              title={source.excerpt}
                            >
                              <i className="bi bi-file-earmark-text me-1"></i>
                              {source.document_title || "Document"}
                              {source.page_number != null
                                ? ` · Page ${source.page_number}`
                                : ""}
                            </span>
                          ))}
                        </div>

                        <div className="source-excerpts mt-3">
                          {message.sources.map((source, sourceIndex) => (
                            <details
                              className="source-detail"
                              key={`${source.source}-${sourceIndex}`}
                            >
                              <summary>
                                Source {source.source}
                                {source.page_number != null
                                  ? ` — Page ${source.page_number}`
                                  : ""}
                              </summary>

                              <p className="small text-secondary mt-2 mb-0">
                                {source.excerpt}
                              </p>
                            </details>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="d-flex align-items-center gap-2 small text-secondary py-3">
            <span className="spinner-border spinner-border-sm"></span>
            Searching the indexed documents and generating an answer...
          </div>
        )}
      </div>

      <div className="card-footer composer-footer">
        <form className="chat-composer d-flex align-items-center gap-2" onSubmit={handleSubmit}>
          <i className="bi bi-chat-left-text text-secondary"></i>

          <input
            className="form-control border-0 shadow-none"
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={
              document
                ? "Ask a question about your documents..."
                : "Upload or select a document first"
            }
            disabled={!document || loading}
            aria-label="Your question"
          />

          <button
            className="btn btn-primary send-button"
            type="submit"
            disabled={!document || !question.trim() || loading}
            aria-label="Send question"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="bi bi-arrow-up"></i>
            )}
          </button>
        </form>

        <p className="text-center text-secondary small mt-2 mb-0">
          AI-generated answers may contain errors. Verify important information
          against the source document.
        </p>
      </div>
    </section>
  );
}

export default ChatWorkspace;
