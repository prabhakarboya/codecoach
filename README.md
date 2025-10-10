# CodeCoach

## Overview

CodeCoach is a full-stack platform designed to help users practice and improve their Data Structures and Algorithms (DSA) skills through an interactive, AI-assisted coding environment.

Users can sign in to browse a curated list of coding problems, view problem details and test cases, and write code in a powerful Monaco editor supporting multiple languages. Submissions are securely executed via Docker containers, and users receive real-time AI-powered feedback on their code's correctness, efficiency, and style.

Additionally, the platform generates follow-up questions based on users’ submissions, encouraging deeper learning through interactive Q&A with evaluation and suggestions for better answers.

---

## Features

- **User Authentication & Authorization**
  - Signup, login with JWT authentication and role-based access.
  - Password reset via OTP emails using Gmail SMTP.

- **Problem Management**
  - Curated DSA problem list.
  - Detailed problem views with descriptions, constraints, and test cases.

- **Interactive Coding Environment**
  - Monaco editor embedded for rich code editing.
  - Supports C, C++, Java, Python, JavaScript.
  - Real-time code execution and submission.

- **AI-Powered Guidance**
  - Immediate feedback on code correctness and efficiency.
  - Suggestions for coding improvements and best practices.
  - AI-generated follow-up questions post submission.
  - Evaluation of user answers with enhanced suggestions.

---

## Technology Stack

- **Frontend**
  - Next.js (React 18+), CSS Modules
  - Monaco Editor integration for code editing
  - Context API for state and authentication management

- **Backend**
  - Node.js, Express.js
  - MongoDB with Mongoose ODM
  - JWT-based secure authentication
  - Nodemailer for OTP email delivery

- **Code Execution**
  - Docker containers providing isolated and secure environments for executing user code in multiple languages

---

## Installation and Setup

### Prerequisites

- Node.js (v16+)
- Docker (latest version)
- MongoDB (local installation or cloud URI)
- Gmail account for SMTP (with app password)

### Steps
1. Clone the repository:
git clone https://github.com/prabhakarboya/codecoach.git

2. Backend setup:

cd codecoach/server
npm install

3. Frontend setup:

cd ../client
npm install


4. Configure environment variables:

- `server/.env`:
  ```
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  GMAIL_USER=your_gmail_email
  GMAIL_PASS=your_gmail_app_password
  ```

- `client/.env.local`:
  ```
  NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
  ```

5. Run backend server:

cd ../server
npm start

6. Run frontend server:

cd ../client
npm run dev


7. Open `http://localhost:3000` in your browser to start using the platform.

---

## Project Structure

- `server/` – Backend Express API with controllers, routes, models, middleware.
- `client/` – Frontend Next.js app with Monaco editor integration.
- `Docker/` (if applicable) – Dockerfiles and configuration for sandboxed code execution.

---

## Usage

- Sign up or log in to access the problem list.
- Select a problem to view details and write code.
- Run your code with real-time output and submit for feedback.
- Explore AI-generated follow-up questions and answer them.
- Review AI feedback to improve coding skills continuously.

---

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

---

## License

MIT License

---



