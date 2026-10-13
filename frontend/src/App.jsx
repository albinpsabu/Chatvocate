
import { useCallback, useEffect, useRef, useState } from "react";

import Sidebar from "./components/Sidebar";
import DocumentList from "./components/DocumentList";
import ChatWorkspace from "./components/ChatWorkspace";

import {
  getDocuments,
  uploadDocument,
  askQuestion,
} from "./services/api";

function normalizeDocuments(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function App() {
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load documents saved in Django.
  const loadDocuments = useCallback(async () => {
    setLoadingDocuments(true);

    try {
      const data = await getDocuments();
      const list = normalizeDocuments(data);

      setDocuments(list);

      setSelectedDocument((current) => {
        if (current) {
          return (
            list.find(
              (item) => String(item.id) === String(current.id)
            ) || list[0] || null
          );
        }

        return list[0] || null;
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not load documents. Check whether Django is running."
      );
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Upload a PDF to the Django backend.
  async function handleUpload(file) {
    if (!file || uploading) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF document.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadDocument(file);

      const data = await getDocuments();
      const list = normalizeDocuments(data);

      setDocuments(list);

      const newDocument =
        list.find(
          (item) => String(item.id) === String(uploaded.id)
        ) ||
        list.find((item) => item.title === uploaded.title) ||
        uploaded;

      setSelectedDocument(newDocument);
      setMessages([]);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  // Ask a question through the existing Django chat endpoint.
  async function handleAsk(question) {
    if (!question.trim() || sending) return;

    setSending(true);
    setError("");

    try {
      const data = await askQuestion(question);

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()}`,
          question: data.question || question,
          answer: data.answer || "",
          sources: Array.isArray(data.sources) ? data.sources : [],
        },
      ]);
    } catch (err) {
      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()}`,
          question,
          error:
            err.response?.data?.detail ||
            "Unable to get an answer. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setError("");
    setMobileMenuOpen(false);
  }

  function handleSelectDocument(document) {
    setSelectedDocument(document);
    setMessages([]);
    setMobileMenuOpen(false);
  }

  return (
    <div className="chatvocate-app">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="chat-mobile-overlay"
          aria-label="Close sidebar"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left navigation */}
      <div
        className={`chat-sidebar-container ${
          mobileMenuOpen ? "mobile-sidebar-open" : ""
        }`}
      >
        <Sidebar
          onUpload={() => fileInputRef.current?.click()}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main conversation workspace */}
      <main className="chat-main">
        <header className="chat-topbar d-flex align-items-center justify-content-between px-3 px-lg-4">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn chat-mobile-menu"
              aria-label="Open sidebar"
              onClick={() => setMobileMenuOpen(true)}
            >
              <i className="bi bi-list fs-5"></i>
            </button>

            <span className="chat-topbar-title">Chatvocate</span>
            <i className="bi bi-chevron-down small text-secondary"></i>
          </div>

          <button
            type="button"
            className="btn chat-upload-button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <i className="bi bi-paperclip me-2"></i>
            )}
            <span>Upload PDF</span>
          </button>

          {/* Shared PDF picker for the sidebar and header */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                handleUpload(file);
              }

              event.target.value = "";
            }}
          />
        </header>

        <div className="chat-page-content">
          <div className="chat-center-column">
            {error && (
              <div className="alert alert-danger small" role="alert">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
                <button
                  type="button"
                  className="btn-close ms-2"
                  aria-label="Dismiss"
                  onClick={() => setError("")}
                />
              </div>
            )}

            {/* Compact document selector */}
            <details className="document-library" id="documents">
              <summary>
                <span>
                  <i className="bi bi-folder2-open me-2"></i>
                  My documents
                </span>

                <span className="document-library-count">
                  {loadingDocuments ? "Loading..." : documents.length}
                </span>
              </summary>

              <div className="document-library-content">
                <div className="mb-3">
                  <input
                    type="search"
                    className="form-control document-search"
                    placeholder="Find a document..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search documents"
                  />
                </div>

                <DocumentList
                  documents={documents}
                  selectedDocumentId={selectedDocument?.id}
                  onSelect={handleSelectDocument}
                  search={search}
                  loading={loadingDocuments}
                />
              </div>
            </details>

            {/* Selected file status */}
            {selectedDocument && (
              <div className="selected-document-bar">
                <i className="bi bi-file-earmark-pdf"></i>

                <div className="selected-document-info">
                  <span className="selected-document-label">
                    CURRENT DOCUMENT
                  </span>

                  <strong title={selectedDocument.title}>
                    {selectedDocument.title}
                  </strong>
                </div>

                <span
                  className={`document-status ${
                    selectedDocument.processed ? "status-ready" : ""
                  }`}
                >
                  <i className="bi bi-circle-fill me-1"></i>
                  {selectedDocument.processed
                    ? "Processed"
                    : "Pending"}
                </span>
              </div>
            )}

            {/* Conversation and composer */}
            <ChatWorkspace
              document={selectedDocument}
              messages={messages}
              onAsk={handleAsk}
              loading={sending}
            />

            <p className="chat-privacy-note">
              <i className="bi bi-info-circle me-1"></i>
              AI responses can contain errors. Verify important information
              against the original document.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
