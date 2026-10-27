# 🚀 AI Career Copilot

**An AI-powered career preparation platform that helps users analyze their resumes, identify skills, and discover relevant job opportunities.**

[🌐 Live Demo](https://ai-career-copilot-six-alpha.vercel.app/) · [💻 GitHub Repository](https://github.com/Aakarsh-674/ai-career-copilot)

---

## 📌 Overview

AI Career Copilot is a full-stack web application designed to help job seekers improve their career readiness through AI-powered resume analysis and job matching.

The application combines a React frontend, an Express.js backend, MongoDB for data persistence, and Google Gemini for AI-powered resume insights.

## ✨ Features

- **🔐 User Authentication** — Registration and login with password hashing and JWT-based authentication.
- **📄 AI Resume Analysis** — Upload a resume and receive an AI-generated score, skill assessment, strengths, weaknesses, and improvement suggestions.
- **💼 Job Matching** — Discover relevant job matches based on available profile and skill information.
- **👤 Profile Management** — View and manage user profile information.
- **📊 Career Dashboard** — Access resume scores, skills information, and job-match statistics in one place.
- **☁️ Cloud Deployment** — React frontend hosted on Vercel and Node.js backend hosted on Render.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| AI Integration | Google Gemini API |
| HTTP Requests | Axios |
| Deployment | Vercel, Render |
| Version Control | Git, GitHub |

## 🏗️ Architecture

```text
             User
              |
              v
      React + Vite Frontend
              |
          Axios API
              |
              v
      Express.js Backend
         /          \
        v            v
   MongoDB       Gemini API
        \            /
         v          v
      Career Insights
              |
              v
       Dashboard UI
```

## 📂 Project Structure

```text
ai-career-copilot/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── ...
│   ├── vercel.json
│   ├── package.json
│   └── ...
├── server/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

*Some internal files and folders have been omitted for readability.*

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database (local or MongoDB Atlas)
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/Aakarsh-674/ai-career-copilot.git
cd ai-career-copilot
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder values with your own credentials. Never commit your `.env` file or expose API keys.

Start the backend:

```bash
npm run dev
```

If your server does not define a `dev` script, use the script listed in `server/package.json`.

### 3. Configure the frontend

Open a second terminal:

```bash
cd client
npm install
```

Create a `.env` file inside `client`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## 🔒 Security

- Passwords are hashed before storage.
- JWTs are used to authenticate protected requests.
- API credentials are configured through environment variables.
- Environment files and generated build artifacts should not be committed to GitHub.

**Important:** Keep all private credentials on the backend. Never expose the Gemini API key through a `VITE_` environment variable.

## 🚀 Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Configure the required backend environment variables in Render and set `VITE_API_URL` in Vercel to your deployed backend's base URL. The frontend API URL should not include an additional `/api` suffix.

## 🔮 Future Improvements

- Mock interviews and timed assessments
- More detailed skill-gap analysis
- Personalized learning roadmaps
- Enhanced job recommendations
- Resume analysis history and progress tracking

## 👨‍💻 Author

**Aakarsh Kumar**

- GitHub: [@Aakarsh-674](https://github.com/Aakarsh-674)
- LinkedIn: [Aakarsh Kumar](https://www.linkedin.com/in/aakarsh-kumar-819946287/)

---

*Built with React, Node.js, MongoDB, and Google Gemini.*
