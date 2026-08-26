import { Link, useLocation } from "react-router-dom";
import { logout } from "../api/authApi";
import "../css/SeaparkNavCss.css";

import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Units",
    path: "/units",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
  {
    label: "Planning",
    path: "/planning",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Reports",
    path: "/reports",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "Admin",
    path: "/admin",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const SignOutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function SeaparkNav() {
  const [user, setuser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    setuser(auth?.user);
  }, [auth]);

  const location = useLocation();

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className={`hamburger-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="nav-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Navigation */}
      <nav className={`sp-nav ${isOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sp-brand">
          <div className="sp-brand-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12c2-4 6-4 8 0s6 4 8 0" />
              <path d="M2 17c2-4 6-4 8 0s6 4 8 0" />
              <path d="M2 7c2-4 6-4 8 0s6 4 8 0" />
            </svg>
          </div>

          <div className="sp-brand-text">
            <span className="sp-brand-name">Seapark LSS</span>
            <span className="sp-brand-sub">Filtration Ops</span>
          </div>
        </div>

        {/* Nav items */}
        <div className="sp-nav-list">
          {navItems.map(({ label, path, icon }) => {
            // Reports is only visible for supervisors and admins
            if (
              label === "Reports" &&
              user?.rol !== "supervisor" &&
              user?.rol !== "admin"
            ) {
              return null;
            }

            // Admin is only visible for admins
            if (label === "Admin" && user?.rol !== "admin") {
              return null;
            }

            return (
              <Link
                key={label}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`sp-nav-item${
                  location.pathname === path ? " active" : ""
                }`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sp-footer">
          <div className="sp-user">
            <span className="sp-user-name">{user?.naam || "User"}</span>

            <span className="sp-user-role">{user?.rol || ""}</span>
          </div>

          <button className="sp-signout" onClick={() => logout()}>
            <SignOutIcon />
            Sign out
          </button>
        </div>
      </nav>
    </>
  );
}
