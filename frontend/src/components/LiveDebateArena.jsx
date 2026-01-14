import { useState } from "react";
import RoundTabs from "./RoundTabs";
import UserPosition from "./UserPosition";
import AICounterposition from "./AICounterposition";
import "./LiveDebateArena.css";

const SAMPLE_TOPICS = [
    "The Role of Artificial Intelligence in Modern Society",
    "Should Genetic Engineering Be Used on Humans?",
    "Is Privacy More Important Than National Security?",
    "The Future of Work: Automation vs Human Labor",
];

const API_BASE_URL = "http://localhost:8000";

function LiveDebateArena() {
    const [topic, setTopic] = useState("");
    const [hasStarted, setHasStarted] = useState(false);
    const [currentRound, setCurrentRound] = useState("opening");
    const [userArguments, setUserArguments] = useState({
        opening: [],
        rebuttal: [],
        closing: [],
    });
    const [aiResponses, setAiResponses] = useState({
        opening: [],
        rebuttal: [],
        closing: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleStartDebate = (selectedTopic) => {
        setTopic(selectedTopic);
        setHasStarted(true);
        setError(null);
    };

    const handleSubmitArgument = async (argument) => {
        // Add user argument to current round
        const newUserArg = { text: argument, id: Date.now(), type: "user" };
        setUserArguments((prev) => ({
            ...prev,
            [currentRound]: [...prev[currentRound], newUserArg],
        }));

        setIsLoading(true);
        setError(null);

        try {
            // Build argument history for context
            const allHistory = [];
            ["opening", "rebuttal", "closing"].forEach((round) => {
                userArguments[round].forEach((arg) => {
                    allHistory.push({ type: "user", text: arg.text });
                });
                aiResponses[round].forEach((resp) => {
                    allHistory.push({ type: "ai", text: resp.text });
                });
            });
            // Add current argument
            allHistory.push({ type: "user", text: argument });

            const response = await fetch(`${API_BASE_URL}/api/live-counter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topic: topic,
                    user_argument: argument,
                    round: currentRound,
                    argument_history: allHistory,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate counter-argument");
            }

            const data = await response.json();

            // Add AI response to current round
            setAiResponses((prev) => ({
                ...prev,
                [currentRound]: [
                    ...prev[currentRound],
                    {
                        text: data.counter_argument,
                        id: Date.now(),
                        points: data.points,
                        type: "ai",
                    },
                ],
            }));
        } catch (err) {
            console.error("Error generating counter-argument:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextRound = () => {
        const rounds = ["opening", "rebuttal", "closing"];
        const currentIndex = rounds.indexOf(currentRound);
        if (currentIndex < rounds.length - 1) {
            setCurrentRound(rounds[currentIndex + 1]);
        }
    };

    const canAdvance = userArguments[currentRound].length > 0;

    if (!hasStarted) {
        return (
            <div className="live-arena-container">
                <div className="topic-selection">
                    <h1 className="arena-title">Live Debate Arena</h1>
                    <p className="arena-subtitle">
                        Select or enter a topic to begin your debate against AI
                    </p>

                    <div className="topic-input-section">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter a debate topic..."
                            className="topic-input-field"
                        />
                        <button
                            className="start-debate-btn"
                            onClick={() => handleStartDebate(topic)}
                            disabled={!topic.trim()}
                        >
                            Start Debate
                        </button>
                    </div>

                    <div className="sample-topics-section">
                        <p className="sample-label">Or choose a topic:</p>
                        <div className="sample-topic-chips">
                            {SAMPLE_TOPICS.map((sampleTopic, index) => (
                                <button
                                    key={index}
                                    className="topic-chip"
                                    onClick={() => handleStartDebate(sampleTopic)}
                                >
                                    {sampleTopic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="live-arena-container">
            <div className="arena-header">
                <h1 className="debate-topic">{topic}</h1>
                <RoundTabs
                    currentRound={currentRound}
                    onRoundChange={setCurrentRound}
                    completedRounds={{
                        opening: userArguments.opening.length > 0,
                        rebuttal: userArguments.rebuttal.length > 0,
                        closing: userArguments.closing.length > 0,
                    }}
                />
            </div>

            {error && (
                <div className="arena-error">
                    <p>Error: {error}</p>
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            <div className="arena-content">
                <UserPosition
                    currentRound={currentRound}
                    arguments={userArguments[currentRound]}
                    onSubmit={handleSubmitArgument}
                    onNextRound={handleNextRound}
                    canAdvance={canAdvance && currentRound !== "closing"}
                />
                <AICounterposition
                    currentRound={currentRound}
                    responses={aiResponses[currentRound]}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default LiveDebateArena;
