import { useState } from "react";
import { Target, TrendingUp, Lightbulb, RefreshCw, Quote } from "lucide-react";
import "./Scoring.css";

function Scoring() {
    const [argumentText, setArgumentText] = useState("");
    const [topicText, setTopicText] = useState("");
    const [targetScore, setTargetScore] = useState(80);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [attemptHistory, setAttemptHistory] = useState([]);
    const [error, setError] = useState(null);

    const handleAnalyzeArgument = async () => {
        if (!argumentText.trim() || !topicText.trim()) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8000/api/score-argument", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    argument: argumentText,
                    topic: topicText,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze argument");
            }

            const data = await response.json();
            setResults(data);

            // Add to history
            setAttemptHistory(prev => [...prev, {
                score: Math.round(data.argumentStrength * 100),
                timestamp: new Date().toLocaleTimeString(),
            }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleTryAgain = () => {
        setResults(null);
    };

    const handleNewArgument = () => {
        setResults(null);
        setArgumentText("");
        setAttemptHistory([]);
    };

    const scoreReached = results && (results.argumentStrength * 100 >= targetScore);

    return (
        <div className="scoring-container">
            <div className="scoring-content">
                <h1 className="scoring-title">Debate Training</h1>
                <p className="scoring-subtitle">
                    Improve your argumentation with AI-powered feedback
                </p>

                {/* Training Mode - Input */}
                {!results ? (
                    <div className="training-section">
                        <div className="target-score-card">
                            <div className="target-header">
                                <Target size={18} />
                                <span>Target Score: {targetScore}%</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                value={targetScore}
                                onChange={(e) => setTargetScore(parseInt(e.target.value))}
                                className="target-slider"
                            />
                        </div>

                        <div className="training-input-area">
                            <div className="input-group">
                                <label>Debate Topic</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Should AI be regulated by governments?"
                                    value={topicText}
                                    onChange={(e) => setTopicText(e.target.value)}
                                    className="topic-input"
                                />
                            </div>

                            <div className="input-group">
                                <label>Your Argument</label>
                                <textarea
                                    placeholder="Write your argument here..."
                                    value={argumentText}
                                    onChange={(e) => setArgumentText(e.target.value)}
                                    className="argument-textarea"
                                    rows={6}
                                />
                            </div>

                            <button
                                className="primary-btn"
                                onClick={handleAnalyzeArgument}
                                disabled={!argumentText.trim() || !topicText.trim() || isAnalyzing}
                            >
                                {isAnalyzing ? "Analyzing..." : "Analyze My Argument"}
                            </button>
                        </div>

                        {attemptHistory.length > 0 && (
                            <div className="history-section">
                                <span className="history-title">Attempts: </span>
                                {attemptHistory.map((a, i) => (
                                    <span key={i} className={`history-badge ${a.score >= targetScore ? 'success' : ''}`}>
                                        #{i + 1}: {a.score}%
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Results Section */
                    <div className="results-section">
                        <div className="results-header">
                            <button className="secondary-btn" onClick={handleTryAgain}>
                                <RefreshCw size={16} /> Revise
                            </button>
                            <button className="secondary-btn" onClick={handleNewArgument}>
                                New Topic
                            </button>
                        </div>

                        {/* Main Score */}
                        <div className={`main-score-card ${scoreReached ? "success" : ""}`}>
                            <div className="main-score-value">
                                {Math.round(results.argumentStrength * 100)}%
                            </div>
                            <div className="main-score-label">
                                {scoreReached ? "🎉 Target Reached!" : `Target: ${targetScore}%`}
                            </div>
                        </div>

                        {/* Strongest & Weakest */}
                        <div className="feedback-grid">
                            {results.strongestPoint && (
                                <div className="feedback-card good">
                                    <div className="feedback-label">
                                        <TrendingUp size={16} /> Strongest Point
                                    </div>
                                    <p>"{results.strongestPoint}"</p>
                                </div>
                            )}
                            {results.weakestPoint && (
                                <div className="feedback-card improve">
                                    <div className="feedback-label">
                                        <Lightbulb size={16} /> Needs Work
                                    </div>
                                    <p>"{results.weakestPoint}"</p>
                                </div>
                            )}
                        </div>

                        {/* Metrics with Inline Feedback */}
                        <div className="metrics-section">
                            <h3>Score Breakdown</h3>

                            <div className="metric-row">
                                <div className="metric-header-row">
                                    <span className="metric-name">Coherence</span>
                                    <span className="metric-score">{(results.coherence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div className="metric-fill coherence" style={{ width: `${results.coherence * 100}%` }}></div>
                                </div>
                                {results.coherenceReason && (
                                    <p className="metric-reason"><Quote size={12} /> {results.coherenceReason}</p>
                                )}
                            </div>

                            <div className="metric-row">
                                <div className="metric-header-row">
                                    <span className="metric-name">Relevance</span>
                                    <span className="metric-score">{(results.relevance * 100).toFixed(0)}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div className="metric-fill relevance" style={{ width: `${results.relevance * 100}%` }}></div>
                                </div>
                                {results.relevanceReason && (
                                    <p className="metric-reason"><Quote size={12} /> {results.relevanceReason}</p>
                                )}
                            </div>

                            <div className="metric-row">
                                <div className="metric-header-row">
                                    <span className="metric-name">Evidence</span>
                                    <span className="metric-score">{(results.evidenceStrength * 100).toFixed(0)}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div className="metric-fill evidence" style={{ width: `${results.evidenceStrength * 100}%` }}></div>
                                </div>
                                {results.evidenceReason && (
                                    <p className="metric-reason"><Quote size={12} /> {results.evidenceReason}</p>
                                )}
                            </div>

                            {results.fallacyPenalty > 0.05 && (
                                <div className="metric-row fallacy">
                                    <div className="metric-header-row">
                                        <span className="metric-name">Fallacy Penalty</span>
                                        <span className="metric-score penalty">-{(results.fallacyPenalty * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="metric-bar">
                                        <div className="metric-fill fallacy" style={{ width: `${results.fallacyPenalty * 100}%` }}></div>
                                    </div>
                                    {results.fallacyReason && (
                                        <p className="metric-reason"><Quote size={12} /> {results.fallacyReason}</p>
                                    )}
                                    {results.details?.fallaciesDetected?.length > 0 && (
                                        <div className="fallacy-tags">
                                            {results.details.fallaciesDetected.map((f, i) => (
                                                <span key={i} className="fallacy-tag">{f}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="scoring-error">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Scoring;
