import ArgumentCard from "./ArgumentCard";
import "./DebateSide.css";

function DebateSide({ side, title, badge, data }) {
  const stages = [
    { key: "opening", label: "OPENING ARGUMENT" },
    { key: "rebuttal", label: "REBUTTAL" },
    { key: "closing", label: "CLOSING ARGUMENT" },
  ];

  return (
    <div className={`debate-side ${side}`}>
      <div className="side-header">
        <span className={`badge ${side}`}>{badge}</span>
        <h2 className={`side-title ${side}`}>{title}</h2>
      </div>

      <div className="arguments-list">
        {stages.map((stage) => (
          <ArgumentCard
            key={stage.key}
            stage={stage.label}
            summary={data[stage.key].summary}
            fullText={data[stage.key].full}
            side={side}
          />
        ))}
      </div>
    </div>
  );
}

export default DebateSide;
