import DebateSide from "./DebateSide";
import "./DebateArena.css";

function DebateArena({ data }) {
  return (
    <div className="debate-arena">
      <div className="debate-columns">
        <DebateSide
          side="proposition"
          title="For Acceleration"
          badge="PROPOSITION"
          data={data.proposition}
        />

        <div className="divider"></div>

        <DebateSide
          side="opposition"
          title="Against Acceleration"
          badge="OPPOSITION"
          data={data.opposition}
        />
      </div>
    </div>
  );
}

export default DebateArena;
