# 🌍 Network Monitoring SaaS

A  Network Monitoring Software that tracks region health using a custom Network Agent and a Node.js backend.

---

# 🚀 Project Architecture

Network Agent → Backend API → MongoDB → Dashboard

This system continuously monitors:

- Ping latency
- HTTP response time
- DNS resolution time
- TCP connectivity

And evaluates region health as:

- healthy
- warning
- critical

---

# 📁 Project Structure
network-monitoring-app/ │ ├── backend/         # Express + MongoDB API ├── network-agent/   # Monitoring agent

---

# 🛠 Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- CORS

## Network Agent
- Node.js
- Ping checks
- Axios (HTTP check)
- DNS module
- TCP socket checks

---

# ⚙️ Backend Setup

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
2️⃣ Create .env file
Env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AGENT_TOKEN=your_agent_token
3️⃣ Start Backend
Bash
Copy code
npm start
or
Bash
Copy code
npm run dev
Backend runs on:
Copy code

http://localhost:5000
🛰 Network Agent Setup
1️⃣ Install Dependencies
Bash
Copy code
cd network-agent
npm install
2️⃣ Create .env file
Env
Copy code
BACKEND_URL=http://localhost:5000
AGENT_TOKEN=your_agent_token
⚠️ AGENT_TOKEN must match backend token.
3️⃣ Start Agent
Bash
Copy code
node index.js
The agent will:
Check regions
Evaluate health
Send logs to backend every cycle
📡 Important API Routes
🔐 Auth
POST /api/auth/login
🌍 Regions
GET /api/regions
📊 Health
POST /api/health/log (Agent only) GET /api/health/latest (Dashboard)
🔐 Security
JWT authentication for dashboard routes
Agent authentication using AGENT_TOKEN
CORS enabled for frontend
🧠 Health Evaluation Logic
Region is:
healthy → All checks good
warning → High latency
critical → Ping or HTTP failed

📌 Future Improvements
add frontend 
Auto-refresh dashboard
Region management panel (admin)
Real-time WebSocket updates
Alerts (Email / Telegram)
Status history graphs
👨‍💻 Author
Ranjan Das
B. TECH CSE (AIML) STUDENT
BRAINWARE UNIVERSITY
Built as a custom SaaS monitoring system project.
📜 License
For learning and educational purposes.
Copy code
