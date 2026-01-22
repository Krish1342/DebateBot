import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            id: "ai-debate",
            icon: "🎯",
            title: "AI Debate",
            description:
                "Generate comprehensive dual-sided debates on any topic. Our AI creates compelling arguments from both Proposition and Opposition perspectives.",
            highlights: ["Opening Arguments", "Rebuttals", "Closing Statements"],
            color: "cyan",
            path: "/debate",
        },
        {
            id: "live-arena",
            icon: "⚔️",
            title: "Live Arena",
            description:
                "Step into the arena and debate against AI in real-time. Present your position and receive intelligent counterarguments.",
            highlights: ["Real-time Responses", "Dynamic Counterpoints", "Interactive Experience"],
            color: "pink",
            path: "/live-arena",
        },
        {
            id: "training",
            icon: "📊",
            title: "Training & Scoring",
            description:
                "Sharpen your debate skills with AI-powered analysis. Get detailed feedback and scoring on your argumentation techniques.",
            highlights: ["Performance Metrics", "Skill Assessment", "Improvement Tips"],
            color: "gradient",
            path: "/scoring",
        },
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-orb hero-orb-1"></div>
                    <div className="hero-orb hero-orb-2"></div>
                </div>

                <div className="hero-content">
                    <h1 className="hero-title">
                        Master the Art of
                        <span className="hero-highlight"> Debate </span>
                        with AI
                    </h1>
                    <p className="hero-subtitle">
                        Sharpen your argumentation skills, explore multiple perspectives, and become a more persuasive communicator with our AI-powered debate platform.
                    </p>
                    <div className="hero-cta">
                        <button
                            className="cta-primary"
                            onClick={() => navigate("/debate")}
                        >
                            Start Debating
                            <span className="cta-arrow">→</span>
                        </button>
                        <button
                            className="cta-secondary"
                            onClick={() => navigate("/live-arena")}
                        >
                            Try Live Arena
                        </button>
                    </div>
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">3</span>
                        <span className="stat-label">Debate Stages</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">2</span>
                        <span className="stat-label">Perspectives</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">∞</span>
                        <span className="stat-label">Topics</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">What We Offer</h2>
                    <p className="section-subtitle">
                        Three powerful tools to transform your debate capabilities
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={`feature-card feature-card-${feature.color}`}
                            onClick={() => navigate(feature.path)}
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <ul className="feature-highlights">
                                {feature.highlights.map((highlight, i) => (
                                    <li key={i}>
                                        <span className="highlight-dot"></span>
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                            <div className="feature-action">
                                <span>Explore</span>
                                <span className="feature-arrow">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
