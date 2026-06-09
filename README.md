<p align="center">
  <img src="./screenshots/cbtpro_banner.png" alt="CBTPro Banner" width="100%">
</p>

<h1 align="center">🚀 CBTPro : Next-Generation Open Source Assessment Platform</h1>

<p align="center">
  <a href="https://github.com/ksisiksksks/cbtpro">
    <img src="https://img.shields.io/github/stars/ksisiksksks/cbtpro?style=for-the-badge&color=FFD700" alt="Stars">
  </a>
  <a href="https://github.com/ksisiksksks/cbtpro/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-Non--Commercial_|_Open_Source-red.svg?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="License">
  </a>
  <a href="https://github.com/ksisiksksks/cbtpro/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/ksisiksksks/cbtpro/ci.yml?branch=main&style=for-the-badge" alt="Build Status">
  </a>
  <br>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS">
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

<p align="center">
  <strong>CBTPro</strong> is a revolutionary, enterprise-grade admission system and Computer Based Testing (CBT) platform. Engineered from the ground up for massive scalability, unbreakable integrity, and zero-compromise security. Equipped with AI-driven paper generation, live CCTV telemetry, and automated anti-cheat protocols.
</p>

> [!CAUTION]
> ### 🛑 STRICT ANTI-RESALE & 100% FREE OPEN-SOURCE POLICY 🛑
> **CBTPro is PROUDLY OPEN-SOURCE and FREE FOR EVERYONE.** 
> * **100% FREE FOR ALL:** You are fully allowed to download, self-host, modify, and distribute this platform to run student admissions for completely free.
> * **NO RESALE / NOT FOR SALE:** You are **STRICTLY FORBIDDEN** from selling, reselling, renting, leasing, commercializing, or making any money off this software. **This software is a gift to the community. DO NOT BUY OR SELL THIS PROJECT!** 

---

## ✨ Experience the Magic (Animated Interactive Demo)

Witness **CBTPro** in fluid motion! Below is our ultra-smooth high-definition animated tour showcasing the real-time proctoring telemetry, intuitive admin panels, and the beautiful candidate test-taking experience.

<p align="center">
  <img src="./screenshots/cbtpro_tour.webp" alt="CBTPro Animated Live Demo Tour" width="100%" style="border-radius: 10px; box-shadow: 0px 4px 15px rgba(0,0,0,0.3);">
</p>

---

## 📖 Comprehensive Table of Contents
1. [🌟 Why Choose CBTPro?](#-why-choose-cbtpro)
2. [🖥️ System Architecture & Telemetry Flow](#️-system-architecture--telemetry-flow)
3. [📺 Detailed Interface Showcases](#-detailed-interface-showcases)
4. [🛡️ Unbreakable Anti-Cheat Mechanics](#️-unbreakable-anti-cheat-mechanics)
5. [🤖 AI-Powered Exam Generation](#-ai-powered-exam-generation)
6. [📊 Prisma Database Schema & ERD](#-prisma-database-schema--erd)
7. [🔌 Extensive REST API Reference Guide](#-extensive-rest-api-reference-guide)
8. [📁 Enterprise Directory Structure](#-enterprise-directory-structure)
9. [⚙️ Complete Setup & Installation Instructions](#️-complete-setup--installation-instructions)
10. [📈 Project Roadmap & Future Outlook](#-project-roadmap--future-outlook)
11. [🤝 Contributing & License](#-contributing--license)

---

## 🌟 Why Choose CBTPro?

CBTPro isn't just another testing tool. It is a **comprehensive admission ecosystem** designed for modern educational institutions requiring absolute certainty in exam integrity. 

* **Completely Free:** Don't pay thousands of dollars for proprietary software. CBTPro offers premium features at zero cost.
* **Modern Tech Stack:** Built with React 18, TypeScript, Node.js, Express, and Prisma ORM. Fast, reliable, and type-safe.
* **Real-time Proctoring:** Live telemetry gives invigilators immediate insight into any candidate's behavior.
* **AI Integration:** Stop typing questions manually. Upload a PDF, and our Groq Llama 3 AI parser will structure your exam automatically.
* **Scalable Architecture:** Designed to handle thousands of concurrent test-takers with efficient WebM video chunking.

---

## 🖥️ System Architecture & Telemetry Flow

CBTPro utilizes a micro-service-inspired monolithic design. The frontend client captures device hardware streams and pushes asynchronous telemetry packets to the backend, which persists data to MySQL via Prisma, and serves real-time feeds to the Admin Dashboard.

```mermaid
graph TD
    subgraph "Candidate Portal (React + WebRTC)"
        A["Identity Verification Gate"] --> B["Hardware Handshake (Webcam/Screen)"]
        B --> C["Secure Exam Workspace"]
        C -->|MediaRecorder API| D["Capture WebM Chunks"]
        C -->|Visibility API| E["Detect Tab-Switching"]
        D -->|FormData POST| F["Video Chunk Uploader"]
        E -->|Telemetry Event| G["Anti-Cheat API Endpoint"]
    end
    subgraph "Core Backend Engine (Node.js + Express)"
        F --> H["Media Controller"]
        H -->|Disk I/O| I["/uploads/recordings/"]
        G --> J["Session State Manager"]
        J --> K[("MySQL Database (Prisma)")]
    end
    subgraph "Command Center (Admin Dashboard)"
        L["Admin Authentication"] --> M["Live CCTV Monitor"]
        M -->|Stream| I
        L --> N["Exam Authoring Suite"]
        N -->|PDF Upload| O["Groq Llama 3 AI Parser"]
        O -->|Structured JSON| K
    end
```

---

## 📺 Detailed Interface Showcases

Our UI/UX team crafted CBTPro to be not only functional but visually stunning and highly intuitive. 

<table width="100%">
  <tr>
    <td width="50%" align="center"><strong>🌐 Public Candidate Portal</strong><br><em>Sleek, responsive landing page for seamless onboarding.</em></td>
    <td width="50%" align="center"><strong>🔒 Admin Authentication Gate</strong><br><em>Secure, enterprise-grade login for invigilators.</em></td>
  </tr>
  <tr>
    <td><img src="./screenshots/landing.png" alt="Landing Page" width="100%"></td>
    <td><img src="./screenshots/admin_login.png" alt="Admin Login" width="100%"></td>
  </tr>
  <tr>
    <td width="50%" align="center"><strong>📈 Telemetry Dashboard Overview</strong><br><em>Bird's-eye view of all live metrics and system health.</em></td>
    <td width="50%" align="center"><strong>✏️ Rich-Text Exam Editor</strong><br><em>WYSIWYG editor supporting complex mathematical formulas and images.</em></td>
  </tr>
  <tr>
    <td><img src="./screenshots/admin_dashboard.png" alt="Admin Dashboard" width="100%"></td>
    <td><img src="./screenshots/exam_management.png" alt="Exam Editor" width="100%"></td>
  </tr>
  <tr>
     <td colspan="2" align="center"><strong>🎥 Live Telemetry & Automated Video Proctoring Playback</strong><br><em>Real-time CCTV grid allowing admins to monitor multiple candidates simultaneously.</em></td>
  </tr>
  <tr>
     <td colspan="2" align="center"><img src="./screenshots/live_monitoring.png" alt="CCTV Proctoring" width="90%"></td>
  </tr>
</table>

---

## 🛡️ Unbreakable Anti-Cheat Mechanics

CBTPro implements military-grade countermeasures against academic dishonesty:

1. **Hardware Enforced Screen Sharing:** Candidates cannot start the exam without sharing their entire screen. Selecting a specific window is programmatically rejected.
2. **Foreground Focus Enforcement:** Utilizing the `visibilitychange` API. The exact millisecond a candidate clicks away, switches tabs, or minimizes the browser, a critical telemetry alert is dispatched to the server.
3. **Continuous Video Archiving:** Screen recordings are captured via `MediaRecorder` and streamed to the server in lightweight `.webm` chunks to prevent client-side tampering or memory crashes.
4. **Clipboard & Context Menu Lock:** Right-clicking, copying, and pasting are entirely disabled within the exam container.

---

## 🤖 AI-Powered Exam Generation

Say goodbye to manual data entry. CBTPro integrates seamlessly with **Groq Cloud API** and the **Llama 3 LLM**.

* **How it works:** Admins upload a raw PDF containing unstructured text.
* **Processing:** The backend extracts the text buffer and prompts the LLM to identify questions, options, and the correct answer.
* **Output:** The LLM returns a strict JSON array which is instantly mapped to the `Question` database table. An entire 50-question paper is created in under 3 seconds!

---

## 📊 Prisma Database Schema & ERD

Our relational database is heavily optimized for fast read-heavy operations during exams, using JSON columns for dynamic option structures.

| Prisma Model | Core Purpose | Important Fields | Relationships |
| :--- | :--- | :--- | :--- |
| **`User`** | System Access & Security | `id`, `email`, `password`, `role` | `1:1` -> Student |
| **`Student`** | Candidate Demographic Profile | `nisn`, `fullName`, `phone`, `status` | `1:M` -> Documents, Sessions |
| **`Exam`** | Assessment Configuration | `title`, `duration`, `startTime`, `endTime`| `1:M` -> Questions, Sessions |
| **`Question`** | Exam Content Storage | `text` (HTML), `options` (JSON), `answer`| `M:1` -> Exam |
| **`ExamSession`**| Live State & Telemetry Link | `status`, `cheatWarnings`, `recordingUrl`| Links Student & Exam |
| **`ExamResult`** | Immutable Final Scoring | `score`, `submittedAt` | Links Student & Exam |

---

## 🔌 Extensive REST API Reference Guide

CBTPro provides a robust, fully-documented RESTful API. Below are key endpoints with request/response examples.

### 1. Start Exam Session (Telemetry Initiation)
* **Endpoint:** `POST /api/exams/start`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "examId": "cm1x8yqzw0001lq..."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "message": "Exam started successfully",
    "session": {
      "id": "cm1x8yqzw0002lq...",
      "startTime": "2024-10-25T10:00:00Z",
      "cheatWarnings": 0
    }
  }
  ```

### 2. Report Tab Switch (Anti-Cheat)
* **Endpoint:** `POST /api/exams/cheat`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "examId": "cm1x8yqzw0001lq..."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "message": "Cheat warning logged",
    "totalWarnings": 3
  }
  ```

### 3. AI Question Import (Admin Only)
* **Endpoint:** `POST /api/admin/exams/:id/import-pdf`
* **Content-Type:** `multipart/form-data`
* **Body:** Form data containing the `pdf_file` blob.
* **Response (201 Created):**
  ```json
  {
    "message": "Imported 45 questions successfully via Groq Llama3"
  }
  ```

---

## ⚙️ Complete Setup & Installation Instructions

Follow these steps carefully to deploy CBTPro on your local machine or server.

### Prerequisites
* Node.js (v18 or higher)
* MySQL Server (v8.0 or higher)
* Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/ksisiksksks/cbtpro.git
cd cbtpro
```

### Step 2: Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```properties
# Server Port
PORT=5000

# Database Connection (Adjust to your MySQL credentials)
DATABASE_URL="mysql://root:yourpassword@localhost:3306/cbtpro_db"

# Security Secret (Make this random and long!)
JWT_SECRET="cbtpro_super_secret_enterprise_key_2024"

# AI Integration Key (Get from console.groq.com)
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

### Step 3: Database Migration & Seeding
Push the Prisma schema to your MySQL database and seed initial test data.
```bash
npx prisma db push
npx ts-node seed.ts
```

### Step 4: Run the Backend Engine
```bash
npm run dev
```
*The backend should now be listening on port 5000.*

### Step 5: Frontend Configuration
Open a new terminal tab and navigate to the frontend:
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend is now accessible at `http://localhost:5173`.*

---

## 📈 Project Roadmap & Future Outlook

CBTPro is constantly evolving. Here is what we are building next:

- [ ] **Dual-Camera Face Mesh:** Implementing TensorFlow.js to track eye movement and second-camera mobile integration.
- [ ] **Desktop Lockdown Browser:** A dedicated Electron app to disable OS-level shortcuts (Ctrl+Alt+Del, Alt+Tab).
- [ ] **Automated Essay Scoring:** Using LLMs to grade descriptive paragraph answers and provide immediate feedback.
- [ ] **Dockerization:** Providing a 1-click `docker-compose.yml` for instant zero-config deployments.

---

## 🤝 Contributing & License

We believe in the power of the open-source community! 

* **Contributing:** Want to add a feature? Fix a bug? Read our extensive [CONTRIBUTING.md](./CONTRIBUTING.md) guide to get started. 
* **Code of Conduct:** Please adhere to our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) to keep our community safe and welcoming.
* **Security:** Found a vulnerability? Refer to our [SECURITY.md](./SECURITY.md) for responsible disclosure.

### 📜 License Declaration
This project is fiercely protected by the **[CBTPro Non-Commercial License](./LICENSE)**. It is free for educational and personal use, but **COMMERCIAL RESALE IS STRICTLY PROHIBITED.** 

---
<p align="center">
  <i>Developed with ❤️ by the CBTPro Open Source Team</i>
</p>
