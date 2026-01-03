# Contributing to DebateBot

First off, thanks for taking the time to contribute! ❤️

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details** (OS, Python version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required PR template
- Follow the Python and JavaScript styleguides
- End all files with a newline
- Avoid platform-dependent code
- Write tests for new functionality

## Development Workflow

1. **Fork the repository**
2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/DebateBot.git
   cd DebateBot
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**

   ```bash
   # Backend changes
   # or Frontend changes
   cd frontend/
   ```

5. **Test your changes**

   ```bash
   # Backend: Ensure no syntax errors
   # Frontend: Test in dev server
   npm run dev
   ```

6. **Commit with clear messages**

   ```bash
   git commit -m "Add: Brief description of your change"
   ```

7. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request** on GitHub

## Styleguides

### Python Code Style

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use type hints where possible
- Max line length: 100 characters
- Use meaningful variable names

Example:

```python
def generate_argument(topic: str, side: str) -> str:
    """Generate an argument for the given topic and side."""
    response = llm.invoke(prompt)
    return response.content
```

### JavaScript/React Code Style

- Use ESLint with default configuration
- Use meaningful variable names
- Use arrow functions for callbacks
- Keep components focused and single-responsibility
- Use CSS modules or CSS-in-JS for styles

Example:

```javascript
const DebateCard = ({ title, content, side }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`card ${side}`}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};
```

### Commit Message Convention

Format: `<type>: <subject>`

Types:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning (formatting, etc.)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Code change that improves performance
- `test:` Adding missing tests or correcting existing tests

Example:

```
feat: Add real-time debate generation with streaming
fix: Fix button hover state causing text disappearance
docs: Update README with API documentation
```

## Questions?

Feel free to open an issue with the `question` label if you have any questions!

---

**Thank you for contributing! Your help makes DebateBot better. 🎉**
