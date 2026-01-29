# Task Management Backend

This project is a backend service built using **Node.js + TypeScript**.  
It provides APIs to manage tasks with clean architecture, validation, pagination, and external system integration.

The project demonstrates:
- Three-layer architecture (Controller → Service → Repository)
- Proper error handling and response standardization
- Cursor-based pagination using `cuid`
- External API integration (Todoist)
- Production-ready coding practices

---

## 🚀 Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Zod (validation)

---

## 📦 Features

- Create, read, update, delete tasks
- Cursor-based pagination
- Centralized error handling
- Standard API response format
- External Todoist task sync (async, non-blocking)

---

## 🧱 Architecture Overview

- **Controller**: Handles HTTP requests and responses
- **Service**: Business logic and error decisions
- **Repository**: Database access via Prisma

This separation improves maintainability and testability.

---

## ▶️ How to Run the Project

### 1. Install dependencies
```bash
npm install
