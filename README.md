# AI Chat

Simple full-stack AI chat app with:
- React + Vite + TypeScript frontend
- Express backend proxy for Groq API
- Basic local RAG-style keyword retrieval (`src/knowledge-base.ts`)

## Project Structure

```txt
.
├── backend/
│   └── server.js
├── src/
│   ├── components/Chat.tsx
│   └── knowledge-base.ts
└── README.md
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- Groq API key

## Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Create `backend/.env`:

```env
API_KEY=your_groq_api_key_here
```

## Run Locally

1. Start backend (from `backend/`):

```bash
node server.js
```

Backend runs on `http://localhost:4000`.

2. Start frontend (from project root):

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` (default Vite port).

## Frontend Scripts

From project root:

- `npm run dev` - start dev server
- `npm run build` - type check + production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## API Endpoint

- `POST /api/chat`
  - Body:
    - `messages`: array of `{ role, content }`
    - `context`: string (optional extra context from knowledge base)
  - Response:
    - `answer`: assistant response string

## Notes

- The model is currently hardcoded in `backend/server.js` as `llama-3.1-8b-instant`.
- The frontend requests the backend at `http://localhost:4000/api/chat`.
