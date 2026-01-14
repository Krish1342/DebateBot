import { useState } from "react";
import { Upload, FileText, MessageSquare, Target, TrendingUp, Lightbulb, RefreshCw } from "lucide-react";
import "./Scoring.css";

function Scoring() {
    const [activeTab, setActiveTab] = useState("training");
    const [selectedFile, setSelectedFile] = useState(null);
    const [argumentText, setArgumentText] = useState("");
    const [topicText, setTopicText] = useState("");
    const [targetScore, setTargetScore] = useState(80);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [attemptHistory, setAttemptHistory] = useState([]);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            setError(null);
        } else {
            setError("Please select a valid PDF file");
        }
    };

    const handleAnalyzeDocument = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        setTimeout(() => {
            setResults({
                coherence: 0.78,
                relevance: 0.85,
                evidenceStrength: 0.72,
                fallacyPenalty: 0.15,
                argumentStrength: 0.76,
                details: {
                    sentenceCount: 12,
                    evidenceCount: 4,
                    fallaciesDetected: ["Appeal to Authority"],
                }
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    const handleAnalyzeArgument = async () => {
        if (!argumentText.trim() || !topicText.trim()) return;

        setIsAnalyzing(true);
        setError(null);
        setFeedback(null);

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

            // Get AI feedback if score is below target
            if (data.argumentStrength * 100 < targetScore) {
                await getImprovementFeedback(data);
            } else {
                setFeedback({
                    type: "success",
                    message: "Congratulations! You've reached your target score!",
                    tips: []
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getImprovementFeedback = async (scores) => {
        try {
            const response = await fetch("http://localhost:8000/api/get-feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    argument: argumentText,
                    topic: topicText,
                    scores: scores,
                    target_score: targetScore,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setFeedback(data);
            } else {
                // Fallback feedback
                setFeedback(generateLocalFeedback(scores));
            }
        } catch (err) {
            setFeedback(generateLocalFeedback(scores));
        }
    };

    const generateLocalFeedback = (scores) => {
        const tips = [];
        const currentScore = Math.round(scores.argumentStrength * 100);
        const gap = targetScore - currentScore;

        if (scores.coherence < 0.75) {
            tips.push({
                metric: "Coherence",
                tip: "Connect your ideas more clearly. Use transition words like 'therefore', 'however', 'furthermore' between sentences."
            });
        }
        if (scores.relevance < 0.8) {
            tips.push({
                metric: "Relevance",
                tip: "Stay focused on the topic. Make sure each point directly addresses the debate motion."
            });
        }
        if (scores.evidenceStrength < 0.7) {
            tips.push({
                metric: "Evidence",
                tip: "Add specific examples, statistics, or expert citations to support your claims."
            });
        }
        if (scores.fallacyPenalty > 0.1) {
            tips.push({
                metric: "Logic",
                tip: `Avoid logical fallacies${scores.details.fallaciesDetected.length > 0 ? `: ${scores.details.fallaciesDetected.join(", ")}` : ""}. Focus on evidence-based reasoning.`
            });
        }

        return {
            type: "improvement",
            message: `You need ${gap} more points to reach your target. Focus on these areas:`,
            tips: tips.length > 0 ? tips : [{
                metric: "General",
                tip: "Try adding more depth to your arguments and strengthening your evidence."
            }]
        };
    };

    const resetTraining = () => {
        setResults(null);
        setFeedback(null);
        setArgumentText("");
    };

    const resetAll = () => {
        setResults(null);
        setFeedback(null);
        setSelectedFile(null);
        setArgumentText("");
        setTopicText("");
        setAttemptHistory([]);
    };

    return (
        <div className="scoring-container">
            <div className="scoring-content">
                <h1 className="scoring-title">Debate Training</h1>
                <p className="scoring-subtitle">
                    Practice and improve your argumentation skills with AI-powered feedback
                </p>

                {/* Tab Switcher */}
                <div className="scoring-tabs">
                    <button
                        className={`scoring-tab ${activeTab === "training" ? "active" : ""}`}
                        onClick={() => { setActiveTab("training"); resetAll(); }}
                    >
                        <Target size={18} />
                        Training Mode
                    </button>
                    <button
                        className={`scoring-tab ${activeTab === "document" ? "active" : ""}`}
                        onClick={() => { setActiveTab("document"); resetAll(); }}
                    >
                        <FileText size={18} />
                        Document Analysis
                    </button>
                </div>

                {/* Training Mode */}
                {activeTab === "training" && !results && (
                    <div className="training-section">
                        {/* Target Score Setter */}
                        <div className="target-score-card">
                            <div className="target-header">
                                <Target size={20} />
                                <span>Set Your Target Score</span>
                            </div>
                            <div className="target-slider-container">
                                <input
                                    type="range"
                                    min="50"
                                    max="100"
                                    value={targetScore}
                                    onChange={(e) => setTargetScore(parseInt(e.target.value))}
                                    className="target-slider"
                                />
                                <div className="target-value">{targetScore}%</div>
                            </div>
                            <p className="target-hint">AI will guide you until you reach this score</p>
                        </div>

                        {/* Input Area */}
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
                                    placeholder="Write your argument here. Be clear, use evidence, and stay on topic..."
                                    value={argumentText}
                                    onChange={(e) => setArgumentText(e.target.value)}
                                    className="argument-textarea"
                                    rows={8}
                                />
                            </div>

                            <button
                                className="primary-btn"
                                onClick={handleAnalyzeArgument}
                                disabled={!argumentText.trim() || !topicText.trim() || isAnalyzing}
                            >
                                {isAnalyzing ? "Analyzing..." : "Score My Argument"}
                            </button>
                        </div>

                        {/* Attempt History */}
                        {attemptHistory.length > 0 && (
                            <div className="history-section">
                                <h3>Your Progress</h3>
                                <div className="history-graph">
                                    {attemptHistory.map((attempt, i) => (
                                        <div key={i} className="history-bar-container">
                                            <div
                                                className={`history-bar ${attempt.score >= targetScore ? "success" : ""}`}
                                                style={{ height: `${attempt.score}%` }}
                                            >
                                                <span className="history-score">{attempt.score}</span>
                                            </div>
                                            <span className="history-label">#{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="target-line" style={{ bottom: `${targetScore}%` }}>
                                    <span>Target: {targetScore}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Document Mode */}
                {activeTab === "document" && !results && (
                    <div className="scoring-input-area">
                        <div className="upload-section">
                            <div className="upload-icon">
                                <FileText size={48} />
                            </div>
                            <h2>Upload Debate Document</h2>
                            <p>Upload a PDF containing debate arguments. AI will identify and score arguments.</p>

                            <label className="primary-btn upload-label">
                                <Upload size={18} />
                                Choose PDF File
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    hidden
                                />
                            </label>

                            {selectedFile && (
                                <div className="selected-file">
                                    <FileText size={16} />
                                    <span>{selectedFile.name}</span>
                                    <button className="primary-btn small" onClick={handleAnalyzeDocument} disabled={isAnalyzing}>
                                        {isAnalyzing ? "Analyzing..." : "Analyze"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {results && (
                    <div className="results-section">
                        <div className="results-header">
                            <h2>Your Score</h2>
                            <button className="secondary-btn" onClick={resetTraining}>
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                        </div>

                        {/* Main Score */}
                        <div className={`main-score-card ${results.argumentStrength * 100 >= targetScore ? "success" : ""}`}>
                            <div className="main-score-value">
                                {Math.round(results.argumentStrength * 100)}
                            </div>
                            <div className="main-score-label">
                                {results.argumentStrength * 100 >= targetScore ? "🎉 Target Reached!" : `Target: ${targetScore}%`}
                            </div>
                        </div>

                        {/* AI Feedback */}
                        {feedback && (
                            <div className={`feedback-card ${feedback.type}`}>
                                <div className="feedback-header">
                                    <Lightbulb size={20} />
                                    <span>AI Coach Feedback</span>
                                </div>
                                <p className="feedback-message">{feedback.message}</p>
                                {feedback.tips.length > 0 && (
                                    <div className="feedback-tips">
                                        {feedback.tips.map((tip, i) => (
                                            <div key={i} className="tip-item">
                                                <span className="tip-metric">{tip.metric}</span>
                                                <p className="tip-text">{tip.tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Metric Cards */}
                        <div className="metrics-grid">
                            <div className="metric-card coherence">
                                <div className="metric-header">
                                    <span className="metric-label">Coherence</span>
                                    <span className="metric-value">{(results.coherence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div className="metric-fill" style={{ width: `${results.coherence * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="metric-card relevance">
                                <div className="metric-header">
                                    <span className="metric-label">Relevance</span>
                                    <span className="metric-value">{(results.relevance * 100).toFixed(0)}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div className="metric-fill" style={{ width: `${results.relevance * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="metric-card evidence">
                                <div className="metric-header">
                                    <span className="metric-label">Evidence</span>
                                    <span className="metric-value">{(results.evidenceStrength * 100).toFixed(0)}%</span>
                                </div>
                                <div className="metric-bar">
                                    <div className="metric-fill" style={{ width: `${results.evidenceStrength * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="metric-card fallacy">
                                <div className="metric-header">
                                    <span className="metric-label">Fallacy Penalty</span>
                                    <span className="metric-value penalty">-{(results.fallacyPenalty * 100).toFixed(0)}%</span>
                                </div>
                                <div className="metric-bar fallacy-bar">
                                    <div className="metric-fill" style={{ width: `${results.fallacyPenalty * 100}%` }}></div>
                                </div>
                                {results.details.fallaciesDetected.length > 0 && (
                                    <div className="fallacies-list">
                                        {results.details.fallaciesDetected.map((f, i) => (
                                            <span key={i} className="fallacy-tag">{f}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="scoring-error">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Scoring;
