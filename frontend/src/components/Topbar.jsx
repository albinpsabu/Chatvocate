
function Topbar({ search, setSearch, onMenuClick }) {
  return (
    <header className="topbar d-flex align-items-center gap-3 px-3 px-lg-4">
      <button
        className="btn btn-outline-secondary mobile-menu"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <i className="bi bi-list"></i>
      </button>

      <div className="global-search d-flex align-items-center gap-2 px-3">
        <i className="bi bi-search text-secondary"></i>

        <input
          type="search"
          className="form-control border-0 shadow-none"
          placeholder="Search documents..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search documents"
        />
      </div>

      <div className="d-none d-sm-flex align-items-center gap-2 ms-auto">
        <span className="status-dot"></span>
        <span className="small text-secondary">Workspace ready</span>
      </div>

      <div className="guest-avatar">G</div>
    </header>
  );
}

export default Topbar;
