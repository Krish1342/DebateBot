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