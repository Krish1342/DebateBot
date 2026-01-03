import { useState } from "react";
import "./DebateInput.css";

function DebateInput({ onSubmit }) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  const sampleTopics = [
    "Should we accelerate artificial intelligence development?",
    "Is social media more harmful than beneficial to society?",
    "Should space exploration be prioritized over solving Earth's problems?",
    "Is remote work better than working in an office?",
  ];

  return (
    <div className="debate-input-container">
      <form onSubmit={handleSubmit} className="debate-form">
        <div className="input-wrapper">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a debate topic..."
            className="topic-input"
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 150) + "px";
            }}
          />
          <button type="submit" className="start-btn" disabled={!topic.trim()}>
            Start Debate
          </button>
        </div>
      </form>

      <div className="sample-topics">
        <p className="sample-label">Or try one of these topics:</p>
        <div className="topics-grid">
          {sampleTopics.map((sampleTopic, index) => (
            <button
              key={index}
              className="sample-topic-btn"
              onClick={() => setTopic(sampleTopic)}
            >
              {sampleTopic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DebateInput;
