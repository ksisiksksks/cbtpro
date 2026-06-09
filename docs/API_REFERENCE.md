# CBTPro Complete REST API Reference

This document provides a detailed overview of the CBTPro API endpoints. All requests and responses are in `application/json` format unless stated otherwise.

## 1. Authentication Endpoints

### 1.1 Student Login
Authenticates a student and returns a JWT token.

* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Body:**
  ```json
  {
    "email": "student@example.com",
    "password": "securepassword123"
  }
  ```
* **Success Response:**
  * **Code:** `200 OK`
  * **Content:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR...",
      "user": {
        "id": "user123",
        "email": "student@example.com",
        "role": "STUDENT"
      }
    }
    ```

### 1.2 Admin Login
Authenticates an administrator.

* **URL:** `/api/auth/admin-login`
* **Method:** `POST`
* **Body:** Same as Student Login.
* **Success Response:** Same as Student Login, but with `role: "ADMIN"`.

---

## 2. Examination Endpoints (Student)

### 2.1 Get Active Exam
Retrieves the exam currently assigned to the student.

* **URL:** `/api/exams/latest`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Success Response:**
  * **Code:** `200 OK`
  * **Content:**
    ```json
    {
      "id": "exam123",
      "title": "Final Mathematics Examination",
      "durationMinutes": 120,
      "questions": [...]
    }
    ```

### 2.2 Start Exam Session
Initializes the timer and tracking session.

* **URL:** `/api/exams/start`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
  ```json
  {
    "examId": "exam123"
  }
  ```

### 2.3 Report Cheat Detection
Logs a tab switch or focus loss to the database.

* **URL:** `/api/exams/cheat`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
  ```json
  {
    "examId": "exam123"
  }
  ```

### 2.4 Upload Proctoring Video
Uploads WebM chunks of the screen recording.

* **URL:** `/api/exams/upload-recording`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Content-Type:** `multipart/form-data`
* **Body Form-Data:**
  * `video_chunk`: [File Blob]
  * `examId`: `exam123`
  * `timestamp`: `171638201`

---

## 3. Administrative Endpoints

### 3.1 Fetch All Sessions
Get all live sessions for the telemetry dashboard.

* **URL:** `/api/admin/sessions`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <admin_token>`
* **Success Response:**
  * **Code:** `200 OK`
  * **Content:** Array of active sessions, including `cheatWarnings` count and `recordingUrl`.
