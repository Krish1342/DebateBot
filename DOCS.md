# DebateBot Project Documentation

## 📖 Overview

DebateBot is an AI-powered debate platform that uses LangGraph and large language models to generate intelligent arguments on both sides of any debate topic.

## 📚 Documentation Files

- **README.md** - Main project documentation and getting started guide
- **frontend/README.md** - Frontend-specific documentation
- **CONTRIBUTING.md** - Contributing guidelines and code style
- **API.md** - Detailed API documentation (coming soon)
- **DEPLOYMENT.md** - Deployment guides for different platforms (coming soon)

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│  React + Vite + TailwindCSS-like styling        │
│  (localhost:5173)                                │
└────────────────┬────────────────────────────────┘
                 │ HTTP/JSON
┌────────────────▼────────────────────────────────┐
│                   FastAPI Backend                │
│  (127.0.0.1:8000)                               │
│  ┌──────────────────────────────────────────┐  │
│  │ Routes:                                   │  │
│  │ - POST /api/debate                        │  │
│  │ - GET /api/health                         │  │
│  │ - GET /docs (OpenAPI)                     │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│                   LangGraph                      │
│  Orchestrates the debate flow:                  │
│  Opening → Rebuttal → Closing                   │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│              Groq LLaMA 3.3 70B                  │
│   Generates arguments for both sides             │
└──────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input**: User enters a debate topic in the React frontend
2. **API Request**: Frontend sends POST request to `/api/debate`
3. **Debate Generation**: Backend uses LangGraph to orchestrate the debate:
   - Generates opening arguments for both sides
   - Creates rebuttals for each side
   - Produces closing statements
4. **Response**: All arguments returned as JSON
5. **Display**: Frontend displays arguments in an attractive two-column layout

## 🔄 Request/Response Cycle

### Request

```json
{
  "topic": "Should we accelerate artificial intelligence development?"
}
```

### Response

```json
{
  "topic": "Should we accelerate artificial intelligence development?",
  "proposition": {
    "opening": {
      "summary": "Short version...",
      "full": "Full argument..."
    },
    "rebuttal": {
      "summary": "Short version...",
      "full": "Full argument..."
    },
    "closing": {
      "summary": "Short version...",
      "full": "Full argument..."
    }
  },
  "opposition": {
    "opening": {
      "summary": "Short version...",
      "full": "Full argument..."
    },
    "rebuttal": {
      "summary": "Short version...",
      "full": "Full argument..."
    },
    "closing": {
      "summary": "Short version...",
      "full": "Full argument..."
    }
  }
}
```

## 🛠️ Development Setup

### Environment Setup

1. **Python Virtual Environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   # or
   venv\Scripts\activate     # Windows
   ```

2. **Install Backend Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Setup Environment Variables**

   ```bash
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running Development Servers

**Terminal 1 - Backend:**

```bash
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📂 Key Files Explained

### Backend

- **main.py** - FastAPI application with routes and debate endpoint
- **graph.py** - LangGraph state machine and debate flow logic
- **requirements.txt** - Python package dependencies

### Frontend

- **src/App.jsx** - Root React component managing app state
- **src/components/DebateInput.jsx** - Input form for debate topics
- **src/components/DebateArena.jsx** - Main debate display wrapper
- **src/components/DebateSide.jsx** - Left/right debate side components
- **src/components/ArgumentCard.jsx** - Individual argument card component
- **src/index.css** - Global styles and animations

## 🎨 UI/UX Features

### Design Philosophy

- Modern dark theme with cyan/pink accents
- Premium typography (Space Grotesk + Plus Jakarta Sans)
- Smooth animations and transitions
- Responsive design for all devices

### Key Components

1. **Input Form**

   - Auto-expanding textarea
   - Sample topic suggestions
   - Real-time validation

2. **Debate Arena**

   - Side-by-side layout
   - Animated divider
   - Color-coded sides

3. **Argument Cards**
   - Expandable/collapsible content
   - Stage indicators (Opening/Rebuttal/Closing)
   - Pulsing status dots
   - Hover effects

## 🔐 Security Considerations

- Environment variables for API keys
- CORS enabled for frontend origin
- Input validation on backend
- No sensitive data in frontend logs

## 🚀 Performance Optimizations

- Vite for fast builds and dev server
- CSS animations use GPU acceleration
- Lazy loading for components (future)
- Efficient state management
- API response caching (future)

## 📊 Metrics & Monitoring

Future additions:

- Response time tracking
- Error logging
- User analytics
- Performance monitoring

## 🐛 Debugging Tips

### Backend Debugging

```bash
# Enable FastAPI debug mode
python -m uvicorn main:app --reload --log-level debug
```

### Frontend Debugging

- Open DevTools (F12)
- Check Console for errors
- Use React DevTools extension
- Network tab for API requests

## 📝 Code Examples

### Adding a New Debate Stage

```python
# In graph.py
def run_custom_node(state: DebateState):
    topic = state["topic"]
    side = state["side"]

    response = llm.invoke(f"Your prompt here")
    return {
        "final_output": response.content,
        "argument_history": f"{state['argument_history']}\n\nNEW STAGE:\n{response.content}"
    }

# Add to graph
builder.add_node("custom", run_custom_node)
builder.add_edge("previous_node", "custom")
```

### Adding a New React Component

```jsx
import { useState } from "react";
import "./NewComponent.css";

function NewComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  return <div className="component">{/* Component JSX */}</div>;
}

export default NewComponent;
```

## 📞 Support & Resources

- **Issues**: Report bugs or request features
- **Discussions**: Ask questions and share ideas
- **Email**: Contact the maintainers
- **Documentation**: Check README files

## 🔮 Future Roadmap

- [ ] Real-time argument streaming
- [ ] Multiple debate formats (Moderated, Cross-examination, etc.)
- [ ] Debate history and save functionality
- [ ] Team debates with multiple participants
- [ ] Custom LLM model selection
- [ ] Mobile app
- [ ] Video debate generation
- [ ] Audience voting system

---

**Last Updated**: January 2026
