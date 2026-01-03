import { useState } from "react";
import "./ArgumentCard.css";

function ArgumentCard({ stage, summary, fullText, side }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`argument-card ${side} ${isExpanded ? "expanded" : ""}`}>
      <div className="card-header">
        <span className={`stage-label ${side}`}>{stage}</span>
        <span className={`status-dot ${side}`}></span>
      </div>

      <div className="card-content">
        <p className="argument-text">{isExpanded ? fullText : summary}</p>
      </div>

      <button
        className={`read-more-btn ${side}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Read full argument"}
        <span className="arrow">{isExpanded ? "↑" : "→"}</span>
      </button>
    </div>
  );
}

export default ArgumentCard;
