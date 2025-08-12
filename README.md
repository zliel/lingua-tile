<h1 align="center">LinguaTile</h1>
<p align="center">
  <img src="./src/assets/LinguaTile%20Logo.png" />
</p>

Welcome to LinguaTile, a language learning platform aimed at English speakers who are learning Japanese. \
This application is designed to combine the best aspects of various language-learning tools into a single, full-stack application.

## About The Project

At its core, I'm building LinguaTile not only as a project to practice full-stack development and build something related to my passion for education and learning, I'm trying to build a tool for learners that I wish I would have had starting out. My goal is to create a comprehensive tool for Japanese learners by recreating, combining, and improving upon features from various existing learning tools.

### Built With

The project is built with a modern tech stack, separating the frontend and backend for scalability and maintainability.

**Frontend:**

- `React`
- `React Router`
- `React Query`
- `Material-UI (MUI)`
- `Axios`
- `Wanakana (for Japanese IME)`

**Backend:**

- `FastAPI`
- `FSRS` spaced-repetition algorithm
- `PyMongo` & `MongoDB`
- `Redis` (for caching translations)

## Features

LinguaTile offers a variety of features to help users learn Japanese:

- **Themed Interface:** Switch between light and dark modes to suit your preference.
- **Diverse Lesson Types:**
  - **Grammar:** In-depth lessons with markdown-formatted content.
  - **Flashcard:** Study with flashcards that can be flipped to show the translation.
  - **Practice:** Test your knowledge by translating sentences.
- **Lesson Tracking & Review:** Logged-in users can mark lessons as complete and get personalized review schedules using the FSRS spaced-repetition algorithm.
- **Translation Tool:** A utility to get instant translations between English and Japanese.
- **Admin Dashboard:** For administrators, there are dedicated tools to manage:
  - Users
  - Flashcards
  - Lessons
  - Sections

## Getting Started

To get a local copy running, do the following:

### Prerequisites

You will need `npm` (or `yarn`) and `Python` installed on your machine. You will also need access to a `MongoDB` database and a`Redis` instance.

### Installation

1. **Clone the repo**

   ```sh
   git clone [https://github.com/zliel/lingua-tile.git](https://github.com/zliel/lingua-tile.git)
   ```

2. **Install NPM packages**

   ```sh
   npm install
   ```

3. **Set up environment variables**

   Rename or copy `.env.example` to `.env` in the root folder of the project and add the following variable, \
   pointing to the backend:

   ```
   REACT_APP_API_BASE=your_backend_url_here
   ```

   _Note: For info on how to set up the backend, see [the backend repo](https://github.com/zliel/Lingua-Tile-Backend)_

4. **Run the application**

   ```sh
   npm start
   ```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
