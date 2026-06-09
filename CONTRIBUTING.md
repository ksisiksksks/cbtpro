# Contributing to CBTPro

Thank you for your interest in contributing to **CBTPro**! We welcome contributions from developers, designers, and proctors of all skill levels. By participating in this project, you agree to abide by our Code of Conduct.

---

## 🗺️ How to Contribute

### 1. Reporting Bugs
* Search the existing Issues before opening a new one.
* Use a clear and descriptive title.
* Describe the steps to reproduce the bug, expected vs. actual behavior, and include logs or screenshots.

### 2. Suggesting Enhancements
* Open an Issue with the tag `enhancement`.
* Explain the utility of the feature, how it should behave, and mockups if applicable.

### 3. Pull Requests (PRs)
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
2. Ensure code is formatted correctly and complies with TypeScript types.
3. Write clean, readable code with comments for complex operations.
4. Open the PR against the `main` branch with a detailed description of changes.

---

## 🛠️ Local Development Guidelines

* **TypeScript Strictness:** Do not use `any` unless absolutely necessary.
* **Tailwind & CSS styling:** Follow clean design paradigms (Curated HSL colors, smooth transitions).
* **Database migrations:** Do not edit migrations manually. Always use Prisma CLI commands (`npx prisma migrate dev`).

Thank you for making CBTPro a safer and better platform!
