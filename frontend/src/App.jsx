
import { useCallback, useEffect, useRef, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import UploadPanel from "./components/UploadPanel";
import DocumentList from "./components/DocumentList";
import ChatWorkspace from "./components/ChatWorkspace";
import RightPanel from "./components/RightPanel";

import {
  getDocuments,
  uploadDocument,
  askQuestion,
} from "./services/api";

function App() {
  // Shared file input used by the sidebar and upload panel.
  const inputActionRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [messages, setMessages] = useState([]);

  const [search, setSearch] = useState("");
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  // Normalize ordinary and paginated Django REST responses.
  function normalizeDocumentList(data) {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    return [];
  }

  // Load documents already stored in Django.
  const loadDocuments = useCallback(async () => {
    setLoadingDocuments(true);
    setError("");

    try {
      const data = await getDocuments();
      const list = normalizeDocumentList(data);

      setDocuments(list);

      setSelectedDocument((current) => {
        if (current) {
          const updatedDocument = list.find(
            (item) => String(item.id) === String(current.id)
          );

          if (updatedDocument) {
            return updatedDocument;
          }
        }

        return list[0] || null;
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load documents. Make sure the Django backend is running."
      );
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Upload a PDF through the Django document endpoint.
  async function handleUpload(file) {
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const uploadedDocument = await uploadDocument(file);

      // Refresh the list from the backend after uploading.
      const data = await getDocuments();
      const list = normalizeDocumentList(data);

      setDocuments(list);

      const newDocument = list.find(
        (item) => String(item.id) === String(uploadedDocument.id)
      );

      setSelectedDocument(newDocument || uploadedDocument);
      setMessages([]);
      setChatKey((current) => current + 1);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Document upload failed. Check the backend and try again."
      );
    } finally {
      setUploading(false);
    }
  }

  // Send a question to the Django chat endpoint.
  async function handleAsk(question) {
    if (!question.trim() || sending) return;

    setSending(true);
    setError("");

    try {
      const data = await askQuestion(question);

      const newMessage = {
        id: `${Date.now()}-${Math.random()}`,
        question: data.question || question,
        answer: data.answer || "",
        sources: Array.isArray(data.sources) ? data.sources : [],
      };

      setMessages((current) => [...current, newMessage]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        "Unable to get an answer. Please check your connection and try again.";

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-${Math.random()}`,
          question,
          error: errorMessage,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  // Start a fresh conversation without deleting documents.
  function handleNewChat() {
    setMessages([]);
    setError("");
    setChatKey((current) => current + 1);
  }

  // Open the file picker shared with UploadPanel.
  function handleUploadButton() {
    if (!uploading) {
      inputActionRef.current?.click();
    }
  }

  // Select a document and clear the previous conversation.
  function handleDocumentSelect(document) {
    setSelectedDocument(document);
    setMessages([]);
    setChatKey((current) => current + 1);
  }

  return (
    <div className="app-shell">
      {/* Mobile navigation overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left sidebar */}
      <div
        className={`sidebar-wrap ${
          mobileMenuOpen ? "sidebar-open" : ""
        }`}
      >
        <Sidebar
          onUpload={handleUploadButton}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main workspace */}
      <main className="main-content">
        <Topbar
          search={search}
          setSearch={setSearch}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <div className="container-fluid dashboard-container">
          {/* Error messages */}
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show mt-3"
              role="alert"
            >
              {error}

              <button
                type="button"
                className="btn-close"
                aria-label="Dismiss"
                onClick={() => setError("")}
              />
            </div>
          )}

          {/* Document upload */}
          <UploadPanel
            onUpload={handleUpload}
            uploading={uploading}
            inputActionRef={inputActionRef}
          />

          {/* Uploaded document library */}
          <DocumentList
            documents={documents}
            selectedDocumentId={selectedDocument?.id}
            onSelect={handleDocumentSelect}
            search={search}
            loading={loadingDocuments}
          />

          {/* Current backend limitation */}
          <div className="alert alert-warning small mt-4" role="note">
            <i className="bi bi-info-circle me-2"></i>
            Document-specific retrieval is still being implemented.
            Answers may currently use passages from the shared ChromaDB
            collection rather than exclusively from the selected document.
          </div>

          {/* Chat and answer citations */}
          <ChatWorkspace
            key={chatKey}
            document={selectedDocument}
            messages={messages}
            onAsk={handleAsk}
            loading={sending}
          />
        </div>
      </main>

      {/* Right panel: document details and answer sources */}
      <RightPanel
        document={selectedDocument}
        messages={messages}
      />
    </div>
  );
}

export default App;
