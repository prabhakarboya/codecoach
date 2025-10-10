# CodeCoach

CodeCoach is a full-stack platform designed to help developers practice data structures and algorithms (DSA) problems effectively.

## Features

- **User Authentication:** Secure login system with JWT-based authorization.
- **Problem List:** Users can browse a list of curated DSA problems after logging in.
- **Interactive Problem View:** Clicking a problem shows its description, test cases, and constraints.
- **Integrated Monaco Editor:** Embedded code editor supports C, C++, Java, Python, and JavaScript.
- **Code Execution & Submission:** Secure, multi-language code execution and submission via Docker containers.
- **AI-Powered Feedback:** Get real-time feedback on code correctness, efficiency, and suggestions for improvement.
- **Follow-up Questions:** AI generates follow-up questions based on submitted code and problem context.
- **Answer Evaluation:** User responses to follow-up questions are analyzed, and suggestions are provided to enhance learning.

## Tech Stack

- **Frontend:** Next.js (React 18+), Monaco Editor, CSS Modules
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT authentication
- **Execution Environment:** Docker containers for isolated multi-language code execution
- **Email:** Nodemailer with Gmail SMTP for OTP-based password reset

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Docker installed and running
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:

git clone https://github.com/prabhakarboya/codecoach.git

text

2. Backend setup:

cd codecoach/server
npm install

text

3. Frontend setup:

cd ../client
npm install

text

4. Create `.env` files in both `server` and `client` directories with environment variables such as:

- MongoDB connection URI
- JWT secret key
- Gmail email and app password (for sending OTP emails)
- Any other config keys

5. Run the backend server:

cd ../server
npm start

text

6. Run the frontend server:

cd ../client
npm run dev

text

7. Open your browser and navigate to `http://localhost:3000` to use CodeCoach.

## Usage

- Register or log in to start practicing coding problems.
- Select problems from the list to view details and attempt solutions.
- Use the Monaco editor to write and run code in multiple languages.
- Submit your solution to receive AI-generated feedback and improvement suggestions.
- Answer follow-up questions to deepen your coding understanding.

## Contributing

Contributions are welcome! Feel free to fork the project, open issues, or submit pull requests.

## License

This project is licensed under the MIT License.

---
