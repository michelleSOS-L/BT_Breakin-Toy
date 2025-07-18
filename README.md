#  Breakable Toy I: To-Do App – Gen AI Upgrades Branch

This branch (`gen-ai-upgrades`) contains major enhancements and refactoring to both frontend and backend, including UI upgrades, task completion metrics, unit testing infrastructure, and improved formatting logic.

---

##  Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Java + Maven + Spring Boot
- **Storage**: In-memory Java repository (no DB)
- **Styling**: Custom pastel galaxy aesthetic with Bootstrap-like elements

---

## Running the App Locally

###  Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Java](https://adoptopenjdk.net/) (v17+)
- [Maven](https://maven.apache.org/)
- Git CLI

---

###  Project Structure
├── frontend/ # React + TypeScript + Vite App
├── backend/ # Spring Boot Java Application
└── README.md # This file

##  Frontend Setup (`/BreakableToy_FE`)

### 1. Install dependencies

```bash
cd frontend
npm install

### 2. Run frontend

npm run dev

### 3. Run tests

npm run test

###  Backend Setup (`/BT`)

### 1. Run the Spring Boot app

cd backend

mvn spring-boot:run

Server starts at: http://localhost:9090


### Features (Gen AI Upgrade)

- Completion time formatting (seconds/minutes/hours/days)

-Backend refactored to cleanly separate concerns

-DTO + Mapper logic updated and tested

- In-memory repo structured for easy DB swap

- Average completion stats overall + per priority format
