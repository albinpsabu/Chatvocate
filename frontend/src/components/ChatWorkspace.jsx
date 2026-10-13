
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function ChatWorkspace({ document, messages, onAsk, loading }) {
  const [question, setQuestion] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState("");

  const suggestions = [
    {
      icon: "bi-file-text",
      title: "Summarize this document",
      prompt: "Summarize this document and list its key points.",
    },
    {
      icon: "bi-search",
      title: "Find important details",
      prompt: "What are the most important details in this document?",
    },
    {
      icon: "bi-lightbulb",
      title: "Explain a concept",
      prompt: "Explain the main concepts in this document simply.",
    },
    {
      icon: "bi-list-check",
      title: "Extract key points",
      prompt: "List the key facts, dates, and important information.",
    },
  ];

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    setQuestion("");
    setPendingQuestion(trimmedQuestion);

    try {
      await onAsk(trimmedQuestion);
    } finally {
      setPendingQuestion("");
    }
  }

  function handleSuggestion(prompt) {
    setQuestion(prompt);
  }

  const showWelcome =
    messages.length === 0 && !pendingQuestion;

  return (
    <section className="chat-workspace">
      {/* Conversation messages */}
      <div className="chat-conversation">
        {showWelcome ? (
          <div className="chat-welcome-screen">
            <div className="chat-welcome-icon">
              <i className="bi bi-stars"></i>
            </div>

            <h1>
              What would you like to know?
            </h1>

            <p>
              Ask questions about your documents and get answers
              supported by relevant source passages.
            </p>

            {document ? (
              <div className="active-document-pill">
                <i className="bi bi-file-earmark-pdf"></i>
                <span>{document.title}</span>
                <i className="bi bi-check-circle-fill"></i>
              </div>
            ) : (
              <div className="welcome-upload-hint">
                <i className="bi bi-paperclip me-2"></i>
                Upload a PDF to get started.
              </div>
            )}

            <div className="chat-suggestions">
              {suggestions.map((item) => (
                <button
                  type="button"
                  className="chat-suggestion"
                  key={item.title}
                  onClick={() => handleSuggestion(item.prompt)}
                  disabled={!document || loading}
                >
                  <i className={`bi ${item.icon}`}></i>

                  <span>{item.title}</span>

                  <i className="bi bi-arrow-up-right suggestion-arrow"></i>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-message-list">
            {messages.map((message, index) => (
              <article
                className="chat-message-pair"
                key={message.id || index}
              >
                {/* User message */}
                <div className="chat-user-message">
                  <div className="chat-user-avatar">G</div>

                  <div className="chat-user-text">
                    {message.question}
                  </div>
                </div>

                {/* Assistant answer or error */}
                <div className="chat-assistant-message">
                  <div className="chat-assistant-avatar">
                    <i className="bi bi-stars"></i>
                  </div>

                  <div className="chat-assistant-content">
                    <div className="chat-assistant-label">
                      Chatvocate
                    </div>

                    {message.error ? (
                      <div className="alert alert-danger py-2">
                        {message.error}
                      </div>
                    ) : (
                      <>
                        <div className="chat-answer-markdown">
                          <ReactMarkdown>
                            {message.answer || ""}
                          </ReactMarkdown>
                        </div>

                        {message.sources?.length > 0 && (
                          <div className="chat-answer-sources">
                            <div className="sources-heading">
                              <i className="bi bi-journal-text me-2"></i>
                              Sources
                              <span className="sources-count">
                                {message.sources.length}
                              </span>
                            </div>

                            <div className="source-chips">
                              {message.sources.map((source, sourceIndex) => (
                                <a
                                  key={`${source.source}-${sourceIndex}`}
                                  className="source-chip"
                                  href={`#source-${message.id || index}-${source.source}`}
                                  title={source.excerpt || ""}
                                >
                                  <i className="bi bi-file-earmark-text"></i>

                                  <span>
                                    {source.document_title || "Document"}
                                    {source.page_number != null
                                      ? ` · Page ${source.page_number}`
                                      : ""}
                                  </span>
                                </a>
                              ))}
                            </div>

                            <div className="source-details-list">
                              {message.sources.map((source, sourceIndex) => (
                                <details
                                  className="source-detail"
                                  id={`source-${message.id || index}-${source.source}`}
                                  key={`${source.source}-${sourceIndex}`}
                                >
                                  <summary>
                                    <span>
                                      <i className="bi bi-file-text me-2"></i>
                                      Source {source.source}
                                      {source.page_number != null
                                        ? ` · Page ${source.page_number}`
                                        : ""}
                                    </span>

                                    <i className="bi bi-chevron-down"></i>
                                  </summary>

                                  <div className="source-detail-content">
                                    <div className="source-document-title">
                                      {source.document_title || "Document"}
                                    </div>

                                    <p>
                                      {source.excerpt ||
                                        "No excerpt is available."}
                                    </p>
                                  </div>
                                </details>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {/* Show the new question while waiting for Django/OpenAI */}
            {pendingQuestion && (
              <article className="chat-message-pair">
                <div className="chat-user-message">
                  <div className="chat-user-avatar">G</div>

                  <div className="chat-user-text">
                    {pendingQuestion}
                  </div>
                </div>

                <div className="chat-assistant-message">
                  <div className="chat-assistant-avatar">
                    <i className="bi bi-stars"></i>
                  </div>

                  <div className="chat-assistant-content">
                    <div className="chat-assistant-label">
                      Chatvocate
                    </div>

                    <div className="chat-loading">
                      <span className="spinner-grow spinner-grow-sm"></span>
                      <span>
                        Searching documents and preparing an answer...
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            <div className="chat-bottom-anchor"></div>
          </div>
        )}
      </div>

      {/* Message composer */}
      <div className="chat-composer-area">
        <form
          className="chat-composer-form"
          onSubmit={handleSubmit}
        >
          <textarea
            className="chat-message-input"
            placeholder={
              document
                ? "Ask anything about your document..."
                : "Upload a PDF to begin..."
            }
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            rows={1}
            disabled={!document || loading}
            aria-label="Ask a question"
          />

          <div className="chat-composer-toolbar">
            <div className="composer-left">
              <span className="composer-context">
                <i className="bi bi-file-earmark-text me-1"></i>

                {document
                  ? document.title
                  : "No document selected"}
              </span>
            </div>

            <div className="composer-right">
              <span className="composer-hint">
                Enter to send · Shift + Enter for a new line
              </span>

              <button
                type="submit"
                className="chat-send-button"
                disabled={
                  !document || !question.trim() || loading
                }
                aria-label="Send question"
                title="Send message"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <i className="bi bi-arrow-up"></i>
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="chat-disclaimer">
          Chatvocate can make mistakes. Verify important information
          against your original document.
        </p>
      </div>
    </section>
  );
}

export default ChatWorkspace;
