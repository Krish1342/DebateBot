import os
from dotenv import load_dotenv
from typing import TypedDict
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    temperature=0.6,
    model="llama-3.3-70b-versatile"
)

class DebateState(TypedDict):
    topic: str              # The motion
    side: str               # Proposition or Opposition
    argument_history: str   # What has been said so far
    final_output: str       # The latest speech

def run_opening_node(state: DebateState):
    print("--- Generating Opening Argument ---")
    
    topic = state["topic"]
    side = state["side"]
    
    prompt = f"""
    You are a world-class debater participating in a formal debate.
    Motion: {topic}
    Your Stance: {side}
    
    Write a compelling, concise opening statement (max 200 words).
    Present 3 clear, distinct arguments.
    """
    
    response = llm.invoke(prompt)
    
    return {
        "final_output": response.content,
        "argument_history": f"\n\nOPENING ({side}):\n{response.content}"
    }

def run_rebuttal_node(state: DebateState):
    print("--- Generating Rebuttal ---")
    
    # Flip the Side
    current_side = state["side"]
    if current_side == "Proposition":
        new_side = "Opposition"
    else:
        new_side = "Proposition"
        
    topic = state["topic"]
    history = state["argument_history"]
    
    prompt = f"""
    You are a world-class debater. 
    Motion: {topic}
    Your Stance: {new_side}
    
    PREVIOUS ARGUMENTS:
    {history}
    
    Instruction: Write a sharp rebuttal (max 200 words) countering the points above. 
    """
    
    response = llm.invoke(prompt)
    
    return {
        "final_output": response.content,
        "argument_history": f"{history}\n\nREBUTTAL ({new_side}):\n{response.content}",
        "side": new_side 
    }

def run_summary_node(state: DebateState):
    print("--- Generating Summary ---")
    
    history = state["argument_history"]
    topic = state["topic"]
    
    prompt = f"""
    You are an expert debate judge.
    Motion: {topic}
    
    Review the following debate transcript:
    {history}
    
    Provide a final closing summary (max 150 words). 
    Highlight the strongest point from each side and conclude the debate.
    """
    
    response = llm.invoke(prompt)
    
    return {
        "final_output": response.content,
        "argument_history": f"{history}\n\nSUMMARY:\n{response.content}"
    }

builder = StateGraph(DebateState)

builder.add_node("opening", run_opening_node)
builder.add_node("rebuttal", run_rebuttal_node)
builder.add_node("summary", run_summary_node)

builder.add_edge(START, "opening")
builder.add_edge("opening", "rebuttal")
builder.add_edge("rebuttal", "summary")
builder.add_edge("summary", END)

debate_graph = builder.compile()


if __name__ == "__main__":
    test_input = {
        "topic": "Paneer is the best Dairy product.", 
        "side": "Proposition",
        "argument_history": "", 
        "final_output": ""
    }
    

    result = debate_graph.invoke(test_input) # type: ignore
    
    print("\n\nFINAL TRANSCRIPT:")
    print(result["argument_history"])