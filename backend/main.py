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
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
        prompt = f"""You are presenting the {side} position in a formal debate.
Motion: {topic}

Write a strong opening statement (max 150 words) with 2-3 distinct arguments.

IMPORTANT RULES:
- Do NOT start with "Ladies and gentlemen" or similar greetings
- Do NOT use phrases like "I believe" or "In my opinion"
- Present arguments as factual claims with evidence
- Use a direct, assertive tone
- Jump straight into your first point

Example format:
"[First key claim]. [Supporting evidence or reasoning]. [Second point with evidence]. [Third point if needed]."
"""
    
    elif stage == "rebuttal":
        prompt = f"""You are presenting a rebuttal for the {side} position in a formal debate.
Motion: {topic}

Arguments to counter:
{history}

Write a sharp rebuttal (max 150 words) addressing the opposing points.

IMPORTANT RULES:
- Do NOT start with "While my opponent" or "My opponent claims"
- Do NOT use "the opposition" or "they argue"
- Instead, directly state why each claim is flawed
- Present counter-evidence factually
- Use phrases like "This overlooks...", "The evidence shows...", "In reality..."

Example format:
"The claim that [X] fails to account for [Y]. [Counter-evidence]. Furthermore, [next counter-point with evidence]."
"""
    
    else:  # closing
        prompt = f"""You are delivering a closing statement for the {side} position.
Motion: {topic}

Debate context:
{history}

Write a powerful closing (max 150 words) summarizing your strongest points.

IMPORTANT RULES:
- Do NOT start with "In conclusion" or "To summarize"
- Do NOT use "Ladies and gentlemen" or "As I have shown"
- Make a final compelling case with your best evidence
- End with a strong declarative statement
- Be assertive and confident

Example format:
"[Restate strongest point]. [Key evidence that proves your case]. [Why this matters]. [Strong final statement]."
"""
    
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
        history_context = "\n\nPrevious points in this debate:\n"
        for item in history:
            if item.get("type") == "user":
                history_context += f"PRO: {item.get('text', '')}\n"
            else:
                history_context += f"CON: {item.get('text', '')}\n"
    
    # Generate counter-argument based on round
    if round_type == "opening":
        prompt = f"""You are presenting the Opposition position in a live debate.
Motion: {topic}

Argument to counter:
{user_argument}
{history_context}

Write a counter-argument (max 200 words) that directly challenges this position.

IMPORTANT RULES:
- Do NOT refer to "the user" or "my opponent" or "the speaker"
- Do NOT start with greetings or "I would argue"
- Present counter-points as factual claims
- Use evidence and logical reasoning
- Directly address and refute the specific claims made

Format: Jump straight into your counter-arguments. State facts and evidence."""

    elif round_type == "rebuttal":
        prompt = f"""You are presenting a rebuttal in a live debate.
Motion: {topic}

Argument to counter:
{user_argument}
{history_context}

Write a rebuttal (max 200 words) that dismantles this argument.

IMPORTANT RULES:
- Do NOT use "the user", "my opponent", "the previous speaker"
- Do NOT start with "While..." or "Although..."
- Identify specific flaws in the reasoning
- Provide counter-evidence directly
- Use phrases like "This fails because...", "The evidence contradicts...", "In fact..."

Format: Directly address each claim with counter-evidence."""

    else:  # closing
        prompt = f"""You are delivering a closing counter-argument in a live debate.
Motion: {topic}

Final argument to counter:
{user_argument}
{history_context}

Write a closing counter-argument (max 200 words).

IMPORTANT RULES:
- Do NOT use "In conclusion" or "To summarize"
- Do NOT refer to "the user" or "my opponent"
- Highlight the key weaknesses exposed in this debate
- Make a final compelling case for your position
- End with a strong declarative statement

Format: Present your strongest counter-points with evidence. End powerfully."""

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
    
    # Use LLM to analyze the argument with specific quotes
    scoring_prompt = f"""You are an expert debate judge. Analyze this argument IN DETAIL.

TOPIC: {topic}

ARGUMENT TO ANALYZE:
"{argument}"

Provide a thorough analysis with SPECIFIC QUOTES from the argument. For each metric, cite exactly which phrases led to your score.

Respond in this EXACT JSON format:
{{
    "coherence": 0.XX,
    "coherence_reason": "Quote the specific phrases that show good/poor flow. Example: 'The transition from X to Y was abrupt' or 'The phrase \"therefore\" effectively connects ideas'",
    "relevance": 0.XX,
    "relevance_reason": "Quote which parts directly address the topic and which parts drift off-topic",
    "evidence_strength": 0.XX,
    "evidence_reason": "List the specific evidence/facts cited. If none: 'No concrete evidence provided - claims like \"X\" lack supporting data'",
    "fallacy_penalty": 0.XX,
    "fallacy_reason": "Quote the exact phrases containing fallacies, or say 'No fallacies detected'",
    "sentence_count": N,
    "evidence_count": N,
    "fallacies": ["specific fallacy with quote"] or [],
    "strongest_point": "Quote the single best sentence/argument",
    "weakest_point": "Quote the sentence that needs most improvement and explain why"
}}

Be specific. Quote exact phrases. Don't give generic feedback."""

    try:
        response = llm.invoke(scoring_prompt)
        content = response.content
        
        import json
        import re
        
        json_match = re.search(r'\{[\s\S]*\}', str(content))
        if json_match:
            scores = json.loads(json_match.group())
        else:
            raise ValueError("Could not parse scoring response")
        
        # Ensure all values are within bounds
        scores["coherence"] = max(0, min(1, float(scores.get("coherence", 0.7))))
        scores["relevance"] = max(0, min(1, float(scores.get("relevance", 0.7))))
        scores["evidence_strength"] = max(0, min(1, float(scores.get("evidence_strength", 0.6))))
        scores["fallacy_penalty"] = max(0, min(1, float(scores.get("fallacy_penalty", 0.1))))
        
        # Calculate argument strength using weighted sum
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
            "coherenceReason": scores.get("coherence_reason", ""),
            "relevance": scores["relevance"],
            "relevanceReason": scores.get("relevance_reason", ""),
            "evidenceStrength": scores["evidence_strength"],
            "evidenceReason": scores.get("evidence_reason", ""),
            "fallacyPenalty": scores["fallacy_penalty"],
            "fallacyReason": scores.get("fallacy_reason", ""),
            "argumentStrength": argument_strength,
            "strongestPoint": scores.get("strongest_point", ""),
            "weakestPoint": scores.get("weakest_point", ""),
            "details": {
                "sentenceCount": scores.get("sentence_count", len(argument.split('.'))),
                "evidenceCount": scores.get("evidence_count", 0),
                "fallaciesDetected": scores.get("fallacies", [])
            }
        }
        
    except Exception as e:
        print(f"Error scoring argument: {e}")
        return {
            "coherence": 0.7,
            "coherenceReason": "Unable to analyze - please try again",
            "relevance": 0.7,
            "relevanceReason": "Unable to analyze - please try again",
            "evidenceStrength": 0.6,
            "evidenceReason": "Unable to analyze - please try again",
            "fallacyPenalty": 0.1,
            "fallacyReason": "Unable to analyze - please try again",
            "argumentStrength": 0.72,
            "strongestPoint": "",
            "weakestPoint": "",
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
