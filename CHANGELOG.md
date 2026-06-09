# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-25

### Added
- **Core Engine:** Initial release of the CBTPro engine.
- **Frontend:** React 18 + Vite dashboard for Admin and Students.
- **Backend:** Express + TypeScript REST API.
- **AI Integration:** Implemented Groq Llama 3 for automated PDF Question Extraction.
- **Security:** Added WebRTC Screen Recording (`MediaRecorder` API) capability.
- **Telemetry:** Implemented real-time Tab-Switch/Blur detection via `visibilitychange`.
- **Database:** Prisma ORM integrated with MySQL 8.0 support.
- **Deployment:** Added Dockerfile and `docker-compose.yml` for containerized deployments.
- **Documentation:** Comprehensive `README.md`, `API_REFERENCE.md`, and `DEPLOYMENT.md`.
- **Community:** Added `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and Issue Templates.

### Security
- Enforced Non-Commercial License restrictions.
- Added Clipboard lock (Right-click, Copy, Paste disabled) during exam sessions.
