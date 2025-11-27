// src/components/Header.jsx
import React from "react";
const avatarUrl = "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png";

export default function Header({ onSearch }) {
  const avatars = [avatarUrl, avatarUrl, avatarUrl];
  return (
    <header className="board-header">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="board-title">Board</div>

        <div className="avatar-stack" style={{ marginLeft: 10 }}>
          {avatars.map((a, i) => (
            <img
              key={i}
              src={a}
              alt="av"
              className="avatar"
              style={{ marginLeft: i === 0 ? 0 : -10 }}
            />
          ))}
          <div className="avatar plus" title="+3">
            +3
          </div>
        </div>
      </div>

      <div className="header-actions">
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21l-4.35-4.35"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            placeholder="Search board"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <button className="px-3 py-2 rounded-md" aria-label="Share">
          Share
        </button>
        <button className="px-3 py-2 rounded-md" aria-label="Filter">
          Filter
        </button>
        <button className="px-3 py-2 rounded-md" aria-label="More">
          More
        </button>
      </div>
    </header>
  );
}
