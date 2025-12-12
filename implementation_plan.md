# Smart Meeting Assistant & AI Interviewer - Implementation Plan

## 📋 Workflow Guide
**How to use this plan:**
1.  **Daily Focus**: Do not attempt everything at once. Focus on one "Day" or "Module" at a time.
2.  **Status Tracking**: As you complete each task, mark the box with an `x` (e.g., `[x]`).
3.  **Categories**:
    *   **🔥 Priority Task**: Critical core features needed for the system to work.
    *   **🚧 Middle Priority**: Important features that support the core.
    *   **🎨 Non-Functional**: Styling, aesthetics, optimizations, docs.
    *   **⚙️ Functional**: Logic, backend, API integrations.

---

## 📅 Daily Plan

### Day 1: Foundation & Infrastructure (Current)
*Objective: Set up the monorepo, initializing both frontend and backend environments.*

**🔥 Priority Tasks (Functional)**
- [x] **Initialize Frontend**: Create Next.js 15 app with TypeScript.
- [x] **Initialize Backend**: Set up Node.js/Express with TypeScript.
- [x] **Project Structure**: Define the monorepo folder layout.

**🚧 Middle Priority (Functional)**
- [x] **Basic Connectivity**: Establish a simple API endpoint to ping from frontend to backend.
- [x] **Socket Setup**: Install `socket.io` on server and `socket.io-client` on client; test connection.

**🎨 Non-Functional Tasks**
- [x] **Environment Variables**: Create `.env` files for secrets.
- [x] **Linting/Formatting**: Configure ESLint and Prettier for consistency.
- [x] **Dependencies**: Install core libraries (Tailwind, Framer Motion, Shadcn/UI scripts).

---

### Day 2: Core UI & Authentication
*Objective: Build the visual shell and user identity layer.*

**🔥 Priority Tasks (Functional)**
- [ ] **Authentication Backend**: Set up JWT loginc.
- [ ] **Login/Signup Pages**: Connect forms to auth endpoints.

**🚧 Middle Priority (Functional)**
- [ ] **Dashboard Logic**: Fetch user session state on load.
- [ ] **Protected Routes**: Create wrappers to secure meeting pages.

**🎨 Non-Functional Tasks**
- [ ] **Landing Page Design**: Create a "Wow" factor hero section (Glassmorphism, gradients).
- [ ] **UI Components**: Generate buttons, inputs, cards using Shadcn/UI.
- [ ] **Responsiveness**: Ensure mobile-friendly layout for the dashboard.

---

### Day 3: Real-Time Communication (WebRTC & Sockets)
*Objective: Enable users to see and hear each other.*

**🔥 Priority Tasks (Functional)**
- [ ] **Signaling Server**: Implement socket events for joining rooms (`join-room`, `user-connected`).
- [ ] **WebRTC Implementation**: Integrate simple-peer or raw WebRTC for video stream exchange.

**🚧 Middle Priority (Functional)**
- [ ] **Meeting Controls**: Mute audio, stop video, screen share toggle logic.
- [ ] **Room Management**: Generate unique meeting IDs.

**🎨 Non-Functional Tasks**
- [ ] **Video Grid Layout**: CSS Grid for dynamic participant tiles.
- [ ] **Control Bar Styling**: Floating, sleek animation on hover.

---

### Day 4: AI Interviewer Intelligence
*Objective: Integrate the "Smart" features.*

**🔥 Priority Tasks (Functional)**
- [ ] **AI Context Setup**: Endpoint to accept Resume/Job Description.
- [ ] **LLM Integration**: Connect to OpenAI API for generating questions.
- [ ] **Transcription (STT)**: Integrate Whisper/Deepgram for real-time speech-to-text.

**🚧 Middle Priority (Functional)**
- [ ] **TTS (Text-to-Speech)**: Give the AI a voice to speak questions back.
- [ ] **Scoring System**: Logic to analyze answers against keywords.

**🎨 Non-Functional Tasks**
- [ ] **AI Persona UI**: Visual feedback when AI is "thinking" or "speaking" (waveforms).
- [ ] **Result Card Design**: Beautiful scorecard layout for post-interview feedback.

---

### Day 5: Polish, Testing & Deployment
*Objective: Quality assurance and launch.*

**🔥 Priority Tasks (Functional)**
- [ ] **Bug Fixes**: End-to-end testing of the interview flow.
- [ ] **Database Persistence**: Ensure all reports/users are saved correctly.

**🎨 Non-Functional Tasks**
- [ ] **Performance Audit**: Check Lighthouse scores.
- [ ] **Animations**: Add smooth transitions between pages.
- [ ] **Deployment**: Deploy Frontend (Vercel) and Backend (Render/Heroku/AWS).

---

## 🛠 Tech Stack Reference

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn/UI + Framer Motion
- **Real-time**: Socket.io-client, WebRTC

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL (Prisma) or MongoDB
- **AI**: OpenAI (GPT-4), Whisper (STT)
