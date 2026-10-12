
function Sidebar({ onUpload, onNewChat }) {
  return (
    <aside className="sidebar d-flex flex-column p-3">
      <a
        href="#workspace"
        className="brand d-flex align-items-center gap-2 text-decoration-none mb-4"
      >
        <span className="brand-icon">
          <i className="bi bi-stars"></i>
        </span>

        <span>
          <strong className="brand-name d-block">Chatvocate</strong>
          <small className="text-secondary">DOCUMENT AI</small>
        </span>
      </a>

      <button
        className="btn btn-primary w-100 mb-4"
        onClick={onNewChat}
      >
        <i className="bi bi-plus-lg me-2"></i>
        New conversation
      </button>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="nav nav-pills flex-column gap-2">
        <a className="nav-link active" href="#chat">
          <i className="bi bi-chat-dots me-2"></i>
          AI Chat
        </a>

        <button
          className="nav-link text-start"
          onClick={onUpload}
        >
          <i className="bi bi-cloud-arrow-up me-2"></i>
          Upload documents
        </button>

        <a className="nav-link" href="#documents">
          <i className="bi bi-folder2-open me-2"></i>
          My documents
        </a>

        <a className="nav-link" href="#sources">
          <i className="bi bi-journal-text me-2"></i>
          Sources
        </a>
      </nav>

      <div className="sidebar-bottom mt-auto">
        <div className="sidebar-info rounded-3 p-3">
          <i className="bi bi-shield-check fs-4"></i>

          <h6 className="mt-2">Answers with context</h6>

          <p className="small text-secondary mb-0">
            Explore your documents through AI-powered search and answers.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 pt-3">
          <div className="guest-avatar">G</div>

          <div>
            <div className="small fw-semibold">Guest workspace</div>
            <div className="small text-secondary">Public access</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
