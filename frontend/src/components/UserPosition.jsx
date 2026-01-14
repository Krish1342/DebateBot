import { useState } from "react";
import { Send, ChevronRight } from "lucide-react";
import "./UserPosition.css";

const ROUND_LABELS = {
    opening: "Opening Statement",
    rebuttal: "Rebuttal Statement",
    closing: "Closing Statement",
};

function UserPosition({ currentRound, arguments: userArgs, onSubmit, onNextRound, canAdvance }) {
    const [inputText, setInputText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSubmit(inputText.trim());
            setInputText("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="user-position">
            <div className="position-header">
                <h2 className="position-title">Your Position</h2>
                <p className="position-subtitle">Craft your argument with clarity and precision</p>
            </div>

            <div className="position-content">
                {/* Existing arguments for this round */}
                {userArgs.map((arg, index) => (
                    <div key={arg.id} className="statement-card">
                        <div className="statement-header">
                            <span className="statement-label">{ROUND_LABELS[currentRound]}</span>
                            <span className="statement-preview">Preview</span>
                        </div>
                        <div className="statement-content">
                            <span className="point-label">Point {index + 1}</span>
                            <p className="statement-text">{arg.text}</p>
                        </div>
                    </div>
                ))}

                {/* Input area */}
                <div className="input-area">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Compose your argument here. Press Enter for new points..."
                            className="argument-input"
                            rows={4}
                        />
                        <div className="input-footer">
                            <span className="round-indicator">{ROUND_LABELS[currentRound].split(" ")[0]} Round</span>
                            <div className="input-actions">
                                {canAdvance && (
                                    <button type="button" className="next-round-btn" onClick={onNextRound}>
                                        Next Round
                                        <ChevronRight size={18} />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="submit-argument-btn"
                                    disabled={!inputText.trim()}
                                >
                                    Submit Argument
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserPosition;
