import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DebateInput from "./components/DebateInput";
import DebateArena from "./components/DebateArena";
import LiveDebateArena from "./components/LiveDebateArena";
import Scoring from "./components/Scoring";
import "./App.css";

function App() {
  const [debateData, setDebateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartDebate = async (topic) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/debate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate debate");
      }

      const data = await response.json();
      setDebateData(data);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDebateData(null);
    setError(null);
  };

  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="header">
                <h1 className="title">The AI Debate</h1>
                {debateData && <p className="subtitle">{debateData.topic}</p>}
                {!debateData && !isLoading && (
                  <p className="subtitle">Enter a topic to start the debate</p>
                )}
              </header>

              <main className="main-content">
                {!debateData && !isLoading && (
                  <DebateInput onSubmit={handleStartDebate} />
                )}

                {isLoading && (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Generating debate arguments...</p>
                    <p className="loading-subtext">
                      This may take a moment as our AI debaters prepare their arguments
                    </p>
                  </div>
                )}

                {error && (
                  <div className="error-container">
                    <p className="error-text">Error: {error}</p>
                    <button onClick={handleReset} className="retry-btn">
                      Try Again
                    </button>
                  </div>
                )}

                {debateData && !isLoading && (
                  <>
                    <DebateArena data={debateData} />
                    <div className="reset-container">
                      <button onClick={handleReset} className="new-debate-btn">
                        Start New Debate
                      </button>
                    </div>
                  </>
                )}
              </main>
            </>
          }
        />
        <Route path="/live-arena" element={<LiveDebateArena />} />
        <Route path="/scoring" element={<Scoring />} />
      </Routes>
    </div>
  );
}

export default App;
