# README

## fun-ml-neural-networks

A tiny interactive web app that teaches how neural networks work — starting from a single artificial neuron.

Built with zero framework dependencies. Runs entirely in the browser as static HTML, CSS, and vanilla JavaScript Web Components.

### Quick start

```bash
npm install      # install http-server (dev dependency)
npm run serve    # start at http://localhost:8080
```

### Lessons

1. **Single Neuron** — Adjust weights and bias on a single artificial neuron to classify data points. See the weighted sum, activation function, and decision boundary in real time.
2. **Neural Network** — (coming soon) Connect multiple neurons into a small network.

### Testing

```bash
npm test         # run all tests (Node built-in test runner)
```

### Structure

```
fun-ml-neural-networks/
├── index.html                    # Home page
├── lesson-single-neuron.html     # Lesson 1
├── lesson-neural-network.html    # Lesson 2 (placeholder)
├── styles.css                    # All styles
├── src/                          # JavaScript modules
│   ├── components/               # Web Components
│   ├── domain/                   # Pure logic (testable)
│   ├── state/                    # State management
│   ├── data/                     # Dataset fixtures
│   ├── i18n/                     # English, Spanish, Catalan
│   └── utils/                    # Shared helpers
├── tests/                        # Node test suite
└── docs/                         # Architecture docs
```

### Localization

English, Spanish, and Catalan. Switch via the language picker in the navigation bar. String catalogs live in `src/i18n/`.

### Deployment

Push to `main` and GitHub Actions deploys to GitHub Pages.

### Related

- `fun-ml-decision-trees` — the sibling project that teaches decision trees.
