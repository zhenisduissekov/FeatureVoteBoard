import React, { useState, useEffect } from "react";
import FeatureCard from "./FeatureCard";
import api from "../utils/api";
import "./FeatureList.css";

function FeatureList({
  features = [],
  onVote,
  emptyStateText = "No features yet.",
  votedFeatures = [],
  t = {},
  onCategoryChange,
  selectedCategory = "All",
  categories = ["All"],
  isLoading = false,
}) {
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    onCategoryChange(newCategory);
  };

  // Sort features by vote count (descending)
  const sortedFeatures = React.useMemo(() => {
    return [...features].sort((a, b) => b.votes - a.votes);
  }, [features]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="empty-state loading-state">
        <div className="empty-state-content">
          <div className="loading-spinner"></div>
          <h3>{t.loading || "Loading features..."}</h3>
          <p>
            {t.pleaseWait ||
              "Just a moment while we fetch the latest suggestions."}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state when no features are found
  if (sortedFeatures.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          {selectedCategory === "All" ? (
            <>
              <svg
                width="72"
                height="72"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="empty-state-icon"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>{t.noFeaturesTitle || "No features yet"}</h3>
              {/*<p>{emptyStateText}</p>*/}
              <p className="empty-state-helper">
                {t.beTheFirst || "Be the first to suggest a feature!"}
              </p>
            </>
          ) : (
            <>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="empty-state-icon"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>{t.noFeaturesInCategoryTitle || "No features yet"}</h3>
              <p>
                {t.noFeaturesInCategory ||
                  `There are no features in the "${selectedCategory}" category yet.`}
              </p>
              <p className="empty-state-helper">
                {t.beTheFirst ||
                  "Be the first to suggest a feature in this category!"}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="feature-list-container">
      <div className="feature-list-sidebar">
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="filter-count">
            {features.length} {features.length === 1 ? "item" : "items"}
          </div>
        </div>
      </div>
      <div className="feature-list-main">
        <div className="feature-top-bar">
          {/* <div className="tabs">
            <button className="tab active">Top</button>
            <button className="tab">New</button>
            <button className="tab">Trending</button>
          </div> */}
          {/* <div className="top-actions">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button className="btn-primary">Add Suggestion</button>
          </div> */}
        </div>
        <div className="feature-list">
          {sortedFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onVote={onVote}
              voted={votedFeatures.includes(feature.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureList;
