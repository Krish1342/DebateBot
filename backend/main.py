import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import llm

load_dotenv()

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DebateRequest(BaseModel):
    topic: str

class DebateResponse(BaseModel):
    topic: str
    proposition: dict
    opposition: dict

def generate_argument(topic: str, side: str, stage: str, history: str = "") -> str:
    """Generate a debate argument for a given side and stage."""
    
    if stage == "opening":
        prompt = f"""You are a world-class debater participating in a formal debate.
Motion: {topic}
Your Stance: {side}

Write a compelling, concise opening statement (max 150 words).
Present 2-3 clear, distinct arguments. Be persuasive and articulate."""
    
    elif stage == "rebuttal":
        opponent = "Opposition" if side == "Proposition" else "Proposition"
        prompt = f"""You are a world-class debater.
Motion: {topic}
Your Stance: {side}

OPPONENT'S ARGUMENTS:
{history}

Write a sharp rebuttal (max 150 words) countering the opponent's points. 
Address their specific arguments and provide counter-evidence."""
    
    else:  # closing
        prompt = f"""You are a world-class debater giving your closing argument.
Motion: {topic}
Your Stance: {side}

DEBATE SO FAR:
{history}

Write a powerful closing statement (max 150 words).
Summarize your strongest points and make a final appeal."""
    
    response = llm.invoke(prompt)
    content = response.content
    return str(content) if not isinstance(content, str) else content

def get_summary(content: str, max_words: int = 25) -> str:
    """Get first sentence or truncate to max words."""
    sentences = content.split('.')
    if sentences:
        first_sentence = sentences[0].strip()
        words = first_sentence.split()
        if len(words) > max_words:
            return ' '.join(words[:max_words]) + '...'
        return first_sentence + '.'
    return content[:150] + '...'

@app.get("/")
def read_root():
    return {"message": "Debate Bot System Online"}

@app.post("/api/debate")
async def run_debate(request: DebateRequest):
    """Run a full debate on the given topic."""
    topic = request.topic
    
    # Generate Opening Arguments
    prop_opening = generate_argument(topic, "Proposition", "opening")
    opp_opening = generate_argument(topic, "Opposition", "opening")
    
    # Generate Rebuttals (each side rebuts the other's opening)
    prop_rebuttal = generate_argument(topic, "Proposition", "rebuttal", opp_opening)
    opp_rebuttal = generate_argument(topic, "Opposition", "rebuttal", prop_opening)
    
    # Generate Closing Arguments
    prop_history = f"Your Opening: {prop_opening}\nOpponent's Rebuttal: {opp_rebuttal}"
    opp_history = f"Your Opening: {opp_opening}\nOpponent's Rebuttal: {prop_rebuttal}"
    
    prop_closing = generate_argument(topic, "Proposition", "closing", prop_history)
    opp_closing = generate_argument(topic, "Opposition", "closing", opp_history)
    
    return {
        "topic": topic,
        "proposition": {
            "opening": {
                "summary": get_summary(prop_opening),
                "full": prop_opening
            },
            "rebuttal": {
                "summary": get_summary(prop_rebuttal),
                "full": prop_rebuttal
            },
            "closing": {
                "summary": get_summary(prop_closing),
                "full": prop_closing
            }
        },
        "opposition": {
            "opening": {
                "summary": get_summary(opp_opening),
                "full": opp_opening
            },
            "rebuttal": {
                "summary": get_summary(opp_rebuttal),
                "full": opp_rebuttal
            },
            "closing": {
                "summary": get_summary(opp_closing),
                "full": opp_closing
            }
        }
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


class LiveDebateRequest(BaseModel):
    topic: str
    user_argument: str
    round: str  # "opening", "rebuttal", "closing"
    argument_history: list = []  # Previous arguments in the debate


class LiveDebateResponse(BaseModel):
    counter_argument: str
    points: list


@app.post("/api/live-counter")
async def generate_counter(request: LiveDebateRequest):
    """Generate AI counter-argument for the user's position in live debate."""
    topic = request.topic
    user_argument = request.user_argument
    round_type = request.round
    history = request.argument_history
    
    # Build history context
    history_context = ""
    if history:
        history_context = "\n\nPREVIOUS EXCHANGES:\n"
        for item in history:
            if item.get("type") == "user":
                history_context += f"USER'S ARGUMENT: {item.get('text', '')}\n"
            else:
                history_context += f"AI COUNTER: {item.get('text', '')}\n"
    
    # Generate counter-argument based on round
    if round_type == "opening":
        prompt = f"""You are an expert AI debater analyzing and countering arguments.
Motion: {topic}
Your Role: Opposition (countering the user's position)

USER'S OPENING ARGUMENT:
{user_argument}
{history_context}

Generate a compelling counter-argument (max 200 words) that:
1. Acknowledges the user's point briefly
2. Presents clear counter-evidence or reasoning  
3. Explains why the opposing view is stronger

Be analytical, respectful, and persuasive. Write in a formal debate style."""

    elif round_type == "rebuttal":
        prompt = f"""You are an expert AI debater in a rebuttal round.
Motion: {topic}
Your Role: Opposition (countering the user's position)

USER'S REBUTTAL ARGUMENT:
{user_argument}
{history_context}

Generate a sharp rebuttal (max 200 words) that:
1. Directly addresses the user's specific points
2. Identifies weaknesses in their reasoning
3. Reinforces your counter-position with evidence

Be analytical and point out logical gaps. Maintain a respectful but firm debate tone."""

    else:  # closing
        prompt = f"""You are an expert AI debater giving a closing counter-argument.
Motion: {topic}
Your Role: Opposition (summarizing why the user's position is weaker)

USER'S CLOSING ARGUMENT:
{user_argument}
{history_context}

Generate a powerful closing counter-argument (max 200 words) that:
1. Summarizes the key weaknesses in the user's overall position
2. Highlights the strongest points from your counter-arguments
3. Makes a compelling final case for the opposing view

Be persuasive and conclusive."""

    response = llm.invoke(prompt)
    content = response.content
    counter_text = str(content) if not isinstance(content, str) else content
    
    # Split into points for structured display
    points = []
    paragraphs = counter_text.strip().split('\n\n')
    for i, para in enumerate(paragraphs):
        if para.strip():
            points.append({
                "id": i + 1,
                "text": para.strip()
            })
    
    # If no clear paragraphs, treat whole response as one point
    if not points:
        points = [{"id": 1, "text": counter_text.strip()}]
    
    return {
        "counter_argument": counter_text,
        "points": points
    }


class ScoringRequest(BaseModel):
    argument: str
    topic: str


@app.post("/api/score-argument")
async def score_argument(request: ScoringRequest):
    """Score a debate argument based on multiple metrics using AI analysis."""
    argument = request.argument
    topic = request.topic
    
    # Use LLM to analyze the argument and generate scores
    scoring_prompt = f"""You are an expert debate judge analyzing an argument. Evaluate the following argument on the given topic.

TOPIC: {topic}

ARGUMENT:
{argument}

Analyze this argument and provide scores (as decimal numbers between 0 and 1) for:

1. COHERENCE (0-1): How well do the sentences flow together? Are ideas connected logically?
2. RELEVANCE (0-1): How relevant is the argument to the debate topic?
3. EVIDENCE_STRENGTH (0-1): Does the argument use evidence, facts, or logical reasoning? How credible is the support?
4. FALLACY_PENALTY (0-1): Are there logical fallacies? (0 = no fallacies, higher = more/worse fallacies)

Also identify:
- Number of distinct points/sentences in the argument
- Number of evidence pieces or factual claims used
- List any logical fallacies detected (e.g., "Ad Hominem", "Straw Man", "Appeal to Authority", etc.)

Respond in this EXACT JSON format:
{{
    "coherence": 0.XX,
    "relevance": 0.XX,
    "evidence_strength": 0.XX,
    "fallacy_penalty": 0.XX,
    "sentence_count": N,
    "evidence_count": N,
    "fallacies": ["fallacy1", "fallacy2"] or []
}}

Provide only the JSON, no other text."""

    try:
        response = llm.invoke(scoring_prompt)
        content = response.content
        
        # Parse the JSON response
        import json
        import re
        
        # Extract JSON from response
        json_match = re.search(r'\{[\s\S]*\}', str(content))
        if json_match:
            scores = json.loads(json_match.group())
        else:
            # Fallback to default scores if parsing fails
            scores = {
                "coherence": 0.7,
                "relevance": 0.7,
                "evidence_strength": 0.6,
                "fallacy_penalty": 0.1,
                "sentence_count": len(argument.split('.')),
                "evidence_count": 0,
                "fallacies": []
            }
        
        # Ensure all values are within bounds
        scores["coherence"] = max(0, min(1, float(scores.get("coherence", 0.7))))
        scores["relevance"] = max(0, min(1, float(scores.get("relevance", 0.7))))
        scores["evidence_strength"] = max(0, min(1, float(scores.get("evidence_strength", 0.6))))
        scores["fallacy_penalty"] = max(0, min(1, float(scores.get("fallacy_penalty", 0.1))))
        
        # Calculate argument strength using weighted sum
        # S = w1*C + w2*R + w3*E - w4*F
        w1, w2, w3, w4 = 0.25, 0.30, 0.30, 0.15
        argument_strength = (
            w1 * scores["coherence"] +
            w2 * scores["relevance"] +
            w3 * scores["evidence_strength"] -
            w4 * scores["fallacy_penalty"]
        )
        argument_strength = max(0, min(1, argument_strength))
        
        return {
            "coherence": scores["coherence"],
            "relevance": scores["relevance"],
            "evidenceStrength": scores["evidence_strength"],
            "fallacyPenalty": scores["fallacy_penalty"],
            "argumentStrength": argument_strength,
            "details": {
                "sentenceCount": scores.get("sentence_count", len(argument.split('.'))),
                "evidenceCount": scores.get("evidence_count", 0),
                "fallaciesDetected": scores.get("fallacies", [])
            }
        }
        
    except Exception as e:
        print(f"Error scoring argument: {e}")
        # Return fallback scores on error
        return {
            "coherence": 0.7,
            "relevance": 0.7,
            "evidenceStrength": 0.6,
            "fallacyPenalty": 0.1,
            "argumentStrength": 0.72,
            "details": {
                "sentenceCount": len(argument.split('.')),
                "evidenceCount": 0,
                "fallaciesDetected": []
            }
        }


class FeedbackRequest(BaseModel):
    argument: str
    topic: str
    scores: dict
    target_score: int


@app.post("/api/get-feedback")
async def get_feedback(request: FeedbackRequest):
    """Get AI feedback on how to improve an argument to reach the target score."""
    argument = request.argument
    topic = request.topic
    scores = request.scores
    target_score = request.target_score
    current_score = int(scores.get("argumentStrength", 0.7) * 100)
    gap = target_score - current_score
    
    feedback_prompt = f"""You are an expert debate coach helping someone improve their argumentation skills.

TOPIC: {topic}

STUDENT'S ARGUMENT:
{argument}

CURRENT SCORES:
- Coherence: {scores.get('coherence', 0.7):.0%}
- Relevance: {scores.get('relevance', 0.7):.0%}
- Evidence Strength: {scores.get('evidenceStrength', 0.6):.0%}
- Fallacy Penalty: -{scores.get('fallacyPenalty', 0.1):.0%}
- Overall Score: {current_score}%
- Target Score: {target_score}%
- Gap to close: {gap} points

Provide specific, actionable feedback to help them improve. Focus on their weakest areas.

Respond in this EXACT JSON format:
{{
    "type": "improvement",
    "message": "A brief encouraging message about their gap to the target (1 sentence)",
    "tips": [
        {{
            "metric": "Name of metric to improve",
            "tip": "Specific, actionable advice (2-3 sentences max)"
        }}
    ]
}}

Provide 2-3 tips focusing on the metrics with the lowest scores. Be concise and practical."""

    try:
        response = llm.invoke(feedback_prompt)
        content = response.content
        
        import json
        import re
        
        json_match = re.search(r'\{[\s\S]*\}', str(content))
        if json_match:
            feedback = json.loads(json_match.group())
            return feedback
        else:
            raise ValueError("Could not parse feedback")
            
    except Exception as e:
        print(f"Error getting feedback: {e}")
        # Generate fallback feedback
        tips = []
        if scores.get("coherence", 1) < 0.75:
            tips.append({
                "metric": "Coherence",
                "tip": "Connect your ideas more clearly. Use transition words like 'therefore', 'however', 'furthermore' to link sentences."
            })
        if scores.get("relevance", 1) < 0.8:
            tips.append({
                "metric": "Relevance",
                "tip": "Stay focused on the debate topic. Make sure each point directly addresses the motion."
            })
        if scores.get("evidenceStrength", 1) < 0.7:
            tips.append({
                "metric": "Evidence",
                "tip": "Add specific examples, statistics, or expert citations to strengthen your claims."
            })
        if scores.get("fallacyPenalty", 0) > 0.1:
            tips.append({
                "metric": "Logic",
                "tip": "Avoid emotional appeals and stick to evidence-based reasoning. Check for common fallacies."
            })
        
        if not tips:
            tips.append({
                "metric": "Overall",
                "tip": "Add more depth and specificity to your arguments. Consider addressing potential counterarguments."
            })
        
        return {
            "type": "improvement",
            "message": f"You need {gap} more points to reach your target. Here's how:",
            "tips": tips[:3]
        }
