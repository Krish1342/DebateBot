import "./RoundTabs.css";

const rounds = [
    { key: "opening", label: "Opening" },
    { key: "rebuttal", label: "Rebuttal" },
    { key: "closing", label: "Closing" },
];

function RoundTabs({ currentRound, onRoundChange, completedRounds }) {
    return (
        <div className="round-tabs">
            {rounds.map((round) => (
                <button
                    key={round.key}
                    className={`round-tab ${currentRound === round.key ? "active" : ""} ${completedRounds[round.key] ? "completed" : ""
                        }`}
                    onClick={() => onRoundChange(round.key)}
                >
                    {round.label}
                </button>
            ))}
        </div>
    );
}

export default RoundTabs;
