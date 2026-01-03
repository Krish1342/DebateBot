# 🎤 DebateBot - AI-Powered Debate Platform

An intelligent debate platform powered by LLMs that generates compelling arguments on both sides of any motion using LangGraph and FastAPI.

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **License**: MIT

## ✨ Features

- **Dual-sided Debates**: Generate comprehensive arguments from both Proposition and Opposition sides
- **Three-stage Debate Flow**: Opening Arguments → Rebuttals → Closing Statements
- **Modern UI**: Beautiful dark-themed interface with smooth animations
- **Real-time Processing**: Stream debate arguments as they're generated
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Backend

- **FastAPI**: High-performance Python web framework
- **LangGraph**: Orchestrates the debate flow with state management
- **Groq LLaMA 3.3**: Powerful LLM for generating arguments
- **Python 3.12**: Latest Python version for better performance

### Frontend

- **React 18**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool and dev server
- **Space Grotesk & Plus Jakarta Sans**: Premium typography
- **CSS3**: Advanced animations and effects

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 16+
- GROQ API Key (get it free at [console.groq.com](https://console.groq.com))

### Backend Setup

1. **Create and activate virtual environment**

   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

4. **Start the backend server**
   ```bash
   python -m uvicorn main:app --reload
   ```
   Server will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## 📝 API Endpoints

### `POST /api/debate`

Generate a full debate on a given topic.

**Request:**

```json
{
  "topic": "Should we accelerate artificial intelligence development?"
}
```

**Response:**

```json
{
  "topic": "...",
  "proposition": {
    "opening": { "summary": "...", "full": "..." },
    "rebuttal": { "summary": "...", "full": "..." },
    "closing": { "summary": "...", "full": "..." }
  },
  "opposition": {
    "opening": { "summary": "...", "full": "..." },
    "rebuttal": { "summary": "...", "full": "..." },
    "closing": { "summary": "...", "full": "..." }
  }
}
```

### `GET /api/health`

Check API health status.

## 📁 Project Structure

```
DebateBot/
├── main.py              # FastAPI application
├── graph.py             # LangGraph debate flow
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── README.md            # This file
│
└── frontend/            # React application
    ├── package.json     # NPM dependencies
    ├── vite.config.js   # Vite configuration
    ├── index.html       # HTML entry point
    ├── src/
    │   ├── main.jsx     # React entry point
    │   ├── App.jsx      # Main app component
    │   ├── index.css    # Global styles
    │   └── components/
    │       ├── DebateInput.jsx    # Input form
    │       ├── DebateArena.jsx    # Debate display
    │       ├── DebateSide.jsx     # Left/right sides
    │       └── ArgumentCard.jsx   # Individual arguments
    └── node_modules/    # Dependencies
```

## 🎨 Customization

### Changing the Debate Model

Edit `main.py` and modify the LLM model name:

```python
def generate_argument(topic: str, side: str, stage: str, history: str = "") -> str:
    response = llm.invoke(prompt)
    # Change model in prompts as needed
```

### Styling

All CSS variables are defined in `frontend/src/index.css`:

```css
:root {
  --bg-primary: #0a0f1a;
  --cyan-primary: #06b6d4;
  --pink-primary: #ec4899;
  /* ... more variables ... */
}
```

## 🔧 Development

### Running Both Servers

In one terminal:

```bash
# Backend
python -m uvicorn main:app --reload
```

In another terminal:

```bash
# Frontend
cd frontend
npm run dev
```

### Building for Production

Backend:

```bash
# No build needed, deploy directly with Gunicorn/Uvicorn
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

Frontend:

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## 📚 Technologies Used

- **Backend**: FastAPI, LangGraph, Groq, Pydantic
- **Frontend**: React, Vite, CSS3
- **Languages**: Python 3.12, JavaScript (ES6+)
- **Fonts**: Space Grotesk, Plus Jakarta Sans

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for the powerful LLaMA models
- [LangGraph](https://github.com/langchain-ai/langgraph) for the graph framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://react.dev/) for the frontend library

## 📞 Support

For issues and questions:

- Open an [Issue](https://github.com/Krish1342/DebateBot/issues)
- Check existing [Discussions](https://github.com/Krish1342/DebateBot/discussions)

---

**Built with ❤️ by the DebateBot team**
