import "./AICounterposition.css";

const ROUND_LABELS = {
    opening: "Opening Response",
    rebuttal: "Rebuttal Response",
    closing: "Closing Response",
};

function AICounterposition({ currentRound, responses, isLoading }) {
    return (
        <div className="ai-counterposition">
            <div className="counter-header">
                <h2 className="counter-title">AI Counterposition</h2>
                <p className="counter-subtitle">Analytical response and counter-arguments</p>
            </div>

            <div className="counter-content">
                {responses.map((response, index) => (
                    <div key={response.id} className="response-card">
                        <div className="response-header">
                            <span className="response-label">{ROUND_LABELS[currentRound]}</span>
                        </div>
                        <div className="response-content">
                            {response.points && response.points.length > 0 ? (
                                response.points.map((point, pIndex) => (
                                    <div key={point.id || pIndex} className="response-point">
                                        <span className="point-label">Point {pIndex + 1}</span>
                                        <p className="response-text">{point.text}</p>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <span className="point-label">Point {index + 1}</span>
                                    <p className="response-text">{response.text}</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="analyzing-indicator">
                        <div className="analyzing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <p className="analyzing-text">Analyzing your argument...</p>
                    </div>
                )}

                {responses.length === 0 && !isLoading && (
                    <div className="empty-state">
                        <p className="empty-text">
                            Submit your argument to receive AI counter-arguments
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AICounterposition;
