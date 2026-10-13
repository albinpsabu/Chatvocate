
function Sidebar({ onUpload, onNewChat }) {
  return (
    <aside className="sidebar d-flex flex-column p-3">
      {/* Brand */}
      <div className="sidebar-brand d-flex align-items-center justify-content-between mb-4">
        <a
          href="#chat"
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
          <span className="sidebar-brand-icon">
            <i className="bi bi-stars"></i>
          </span>

          <span className="sidebar-brand-name">Chatvocate</span>
        </a>

        <button
          type="button"
          className="btn sidebar-icon-button"
          aria-label="Toggle sidebar"
          title="Sidebar"
        >
          <i className="bi bi-layout-sidebar"></i>
        </button>
      </div>

      {/* New chat */}
      <button
        type="button"
        className="sidebar-action d-flex align-items-center gap-3"
        onClick={onNewChat}
      >
        <i className="bi bi-plus-circle"></i>
        <span>New chat</span>
      </button>

      {/* Upload document */}
      <button
        type="button"
        className="sidebar-action d-flex align-items-center gap-3"
        onClick={onUpload}
      >
        <i className="bi bi-paperclip"></i>
        <span>Upload document</span>
      </button>

      {/* Document library */}
      <a
        href="#documents"
        className="sidebar-action d-flex align-items-center gap-3 text-decoration-none"
      >
        <i className="bi bi-folder2-open"></i>
        <span>My documents</span>
      </a>

      {/* Recent chats placeholder */}
      <div className="sidebar-history mt-4">
        <div className="sidebar-section-label mb-2">
          Recent
        </div>

        <div className="sidebar-empty-history">
          <i className="bi bi-chat-left-text me-2"></i>
          Your conversations will appear here.
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer mt-auto pt-3">
        <div className="sidebar-footer-card d-flex align-items-center gap-2">
          <div className="sidebar-user-avatar">G</div>

          <div className="flex-grow-1">
            <div className="sidebar-user-name">Guest workspace</div>
            <div className="sidebar-user-status">
              Public access
            </div>
          </div>

          <i className="bi bi-three-dots"></i>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
