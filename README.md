# FeatureVoteBoard

A modern, full-stack feature voting board where users can suggest, vote, and track the progress of product features. Built with React (frontend) and Go (backend), styled for a clean, user-friendly experience.

---

## Features

- 🗳️ **Feature Voting:** Users can upvote features they want most.
- ➕ **Suggest Features:** Add new feature ideas with title, description, and category.
- 🏷️ **Status Tracking:** Features display status (Planned, In Progress, Done) and category.
- 🔍 **Search & Filter:** Filter by category, search, and sort by Top/New/Trending.
- 📊 **Live Vote Counts:** Vote counts update in real time.
- 🌐 **Multi-language:** English and Russian supported.
- ⚡ **Modern UI:** Responsive, accessible, and clean design.

---

## Project Structure

```
FeatureVoteBoard/
├── backend/         # Go Fiber API server (feature storage, voting API)
│   ├── cmd/backend/ # Main Go entrypoint
│   ├── internal/    # Config, handlers, router, store logic
│   ├── data/        # (Created at runtime) JSON file for features
│   └── go.mod
├── frontend/        # React app (user interface)
│   ├── public/      # Static assets (index.html, favicon)
│   ├── src/         # React source code
│   │   ├── components/ # FeatureCard, FeatureList, AddFeatureModal, CSS
│   │   ├── utils/       # API helpers
│   │   └── App.jsx      # Main app logic
│   ├── package.json
│   └── ...
├── .env             # Environment variables for backend
└── ...
```

---

## Getting Started

### Prerequisites

- **Node.js** (v16+ recommended)
- **Go** (v1.18+ recommended)

---

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/FeatureVoteBoard.git
cd FeatureVoteBoard
```

---

### 2. Start the Development Environment

The project uses a Makefile to simplify setup and running both frontend and backend together.

```sh
make dev
```

- This will install all dependencies and start both the backend (Go API) and frontend (React app) in development mode.
- The backend runs on `http://localhost:8088` by default.
- The frontend runs on `http://localhost:9099` by default.

---

### 3. Open in Browser

Visit: [http://localhost:9099](http://localhost:9099)

---

## Deployment

### Deploying to GitHub Pages

1. **Build the frontend for production:**
   ```sh
   make build
   ```
   This will run the production build for the React app and output to `frontend/build/`.

2. **Deploy the `frontend/build/` folder to GitHub Pages.**
   - You can use the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package or configure GitHub Actions.
   - Make sure your API backend is hosted somewhere accessible (GitHub Pages is static-only).

**Note:** For a fully working demo, the backend must be deployed separately (e.g., on Render, Heroku, or your own server) and the frontend must be configured to point to the correct API URL.

---

### Cleaning Up

To remove installed dependencies and build artifacts, run:

```sh
make clean
```

## Configuration

- Edit `.env` in the root for backend ports, database file, and timeouts.
- To change the API endpoint for the frontend, set `REACT_APP_API_URL` in `frontend/.env`.

---

## Customization

- **Styling:** All main styles are in `src/components/*.css` and `App.css`.
- **Feature logic:** See `src/components/FeatureCard.jsx`, `FeatureList.jsx`, and `AddFeatureModal.jsx`.
- **Backend logic:** See `backend/internal/` for API routes and storage.

---

## Contributing

1. Fork the repo and create your branch.
2. Make changes and add tests if needed.
3. Open a pull request!

---

## License

MIT

---

**Inspiration**

This project was inspired by the excellent [features.vote](https://features.vote) product by [Manta Tech](https://www.youtube.com/watch?v=f5mIuciLVjk).

---

**Questions?**  
Open an issue or discussion on GitHub!