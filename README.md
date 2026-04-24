# 🗂 Multi-Tenant Task Management System

## Project Overview
This project is a **Multi-Tenant Task Management System** built using Node.js, Express, MySQL, and vanilla frontend (HTML, CSS, JavaScript).  

It allows multiple organizations to manage tasks securely with **Role-Based Access Control (RBAC)** and **JWT Authentication**.

---

## Features

### Authentication
- User Login & Registration
- Secure password hashing using bcrypt
- JWT-based authentication

### Multi-Tenant System
- Each user belongs to an organization
- Data isolation between organizations

### 👥 Role-Based Access Control (RBAC)
- **Admin**
  - Access all tasks
  - Can edit/delete any task
- **Member**
  - Can only manage their own tasks

### Task Management
- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks

### Dashboard
- Total tasks
- Completed tasks
- In-progress tasks
- Pending tasks

### Audit Logs
- Tracks user actions (create, update, delete)

---

## Tech Stack

### Frontend:
- HTML
- CSS
- JavaScript

### Backend:
- Node.js
- Express.js

### Database:
- MySQL

### Security:
- JWT (JSON Web Token)
- bcrypt

---

## 🗄 Database Structure

### Users Table
- id
- name
- email
- password
- role (admin/member)
- organization_id

### Tasks Table
- id
- title
- description
- status (todo / progress / done)
- created_by
- organization_id

### Audit Logs Table
- id
- user_id
- task_id
- action
- created_at

---

## Authentication Flow

1. User logs in with email & password
2. Server validates credentials
3. JWT token is generated
4. Token is stored in browser (localStorage)
5. Every API request uses token for authentication

---

## API Endpoints

### Auth
- POST `/login` → User login
- POST `/register` → User registration

### Tasks
- GET `/tasks` → Get all tasks
- POST `/tasks` → Create task
- PUT `/tasks/:id` → Update task
- DELETE `/tasks/:id` → Delete task

---

## How to Run Project

### Backend:```bash
npm install
node server.js

## frontend 
use live server to run the login html file
```bash
npm install
node server.js
