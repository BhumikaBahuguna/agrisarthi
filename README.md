# AgriSarthi

AgriSarthi is a React + Tailwind CSS frontend skeleton for an AI-powered smart agriculture management platform.

## Installation Commands

```bash
npm install
npm run dev
```

## Backend Server Setup

The backend server is built with Node.js and Express.js, providing REST API endpoints to manage crop cycles and calculate telemetry statistics.

### Environment Variables
Create a `.env` file inside the `/backend` directory based on the `.env.example`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Installation and Launch
Open a new terminal window and run:
```bash
# Navigate to backend and install dependencies
cd backend
npm install

# Start the server in development mode (using nodemon)
npm run dev
```
The server will start listening at `http://localhost:5000`. CORS is preconfigured to permit connection queries from your frontend at `http://localhost:5173`.


## Tailwind Setup

Tailwind CSS is configured through `tailwind.config.js`, `postcss.config.js`, and `src/index.css`.

```bash
npm install -D tailwindcss postcss autoprefixer
```

## Folder Structure

```text
src/
  components/
    Navbar.jsx
    Hero.jsx
    Card.jsx
    Footer.jsx
  pages/
    Home.jsx
    About.jsx
    Dashboard.jsx
    Login.jsx
  assets/
    agrisarthi-hero.png
  App.jsx
  main.jsx
  index.css
```

## Routes

- `/`
- `/about`
- `/dashboard`
- `/login`

## Suggested Git Commit Sequence

```bash
git add .
git commit -m "chore: setup react vite project with tailwind"

git add .
git commit -m "feat: create reusable navbar hero card and footer components"

git add .
git commit -m "feat: add routing and page structure"
```

## Verification Checklist

- Home page uses Navbar, Hero, Card, and Footer.
- Home page displays at least three feature cards.
- About, Dashboard, and Login routes are available.
- Each additional page includes Navbar and Footer.
- Dashboard includes three static statistic cards.
- Login page includes email, password, and button UI only.
- Layout is responsive for desktop, tablet, and mobile.
- Tailwind CSS is active.
- Local dev server runs with `npm run dev`.
