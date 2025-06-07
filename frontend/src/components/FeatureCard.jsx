import React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import "./FeatureCard.css";

// Status color mapping for pill
const statusClass = {
  Planned: "planned",
  "In Progress": "in-progress",
  Done: "done",
};

function FeatureCard({ feature, onVote, voted = false }) {
  // Mock status and votes for realism if not present
  const {
    id,
    title,
    description,
    votes = Math.floor(Math.random() * 60 + 20), // mock 20-80
    category,
    createdAt,
    status = ["Planned", "In Progress", "Done"][id % 3] // mock status by id
  } = feature;

  // Safely parse the date, handling both string and Date objects
  const parsedDate =
    typeof createdAt === "string" ? parseISO(createdAt) : new Date(createdAt);

  return (
    <div className="feature-card animate-fade-in" tabIndex={0}>
      <div className="feature-votes">
        <button
          className={`vote-button${voted ? " voted" : ""}`}
          onClick={() => !voted && onVote(id)}
          aria-label={
            voted ? `You already voted for ${title}` : `Vote for ${title}`
          }
          title={voted ? "You have already voted" : "Vote for this feature"}
          disabled={voted}
        >
          <svg
            className="vote-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={voted ? "#1a3266" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
          <span className="vote-count">{votes}</span>
        </button>
      </div>
      <div className="feature-content">
        <h3 className="feature-title">{title}</h3>
        <span className={`status-pill ${statusClass[status] || ""}`}>{status}</span>
        {description && <p className="feature-description">{description}</p>}
        <div className="feature-meta">
          {category && <span className="feature-category">{category}</span>}
          <span className="feature-date">
            {!isNaN(parsedDate)
              ? formatDistanceToNow(parsedDate, { addSuffix: true })
              : "recently"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FeatureCard;
