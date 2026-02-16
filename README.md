# dotnet_to_do_list

Task management application (To-Do List) with user authentication, built with .NET 10 and React.

## 🚀 Technologies

### Backend
- .NET 10.0
- Entity Framework Core 10.0
- SQLite
- JWT Authentication
- BCrypt for password hashing
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Query
- React Router DOM
- Shadcn/ui + Radix UI
- Tailwind CSS
- React Hook Form + Zod

## 📋 Features

- User authentication (login/signup)
- Email confirmation
- Task lists management
- Task items management
- RESTful API

## 🔧 Prerequisites

- .NET SDK 10.0
- Node.js (version 18+)
- npm or bun

## ⚙️ Setup

### Backend

1. Configure environment variables by creating a `.env` file in `ToDoList.Api/`:
```env
JWT_SECRET=<your_secret_key>
JWT_ISSUER=<your_issuer>
JWT_AUDIENCE=<your_audience>
```

2. Run database migrations:
```bash
make setup-backend
```

### Frontend

1. Install dependencies:
```bash
make setup-frontend
```

2. Configure environment variables in `App/.env` if needed.

## 🚀 Running the application

### Start everything at once
```bash
make start-app
```

### Start separately

Backend (port 5197):
```bash
make start-backend
```

Frontend (port 5173):
```bash
make start-frontend
```

### Kill processes on ports
```bash
make kill-ports
```

## 📁 Project Structure

```
dotnet_to_do_list/
├── ToDoList.Api/          # .NET Backend
│   ├── Controllers/       # API Controllers
│   ├── Models/           # Data Models
│   ├── DTOs/             # Data Transfer Objects
│   ├── Services/         # Services (email, etc)
│   ├── Data/             # Database Context
│   └── Migrations/       # EF Core Migrations
├── App/                  # React Frontend
│   ├── src/
│   │   ├── components/   # React Components
│   │   ├── pages/        # Pages
│   │   ├── services/     # API Services
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript Types
└── Makefile              # Automation commands
```

## 🔗 API Endpoints

Complete API documentation is available via Swagger at:
```
http://localhost:5197/swagger
```

## 📝 License

This project is for personal/educational use.
