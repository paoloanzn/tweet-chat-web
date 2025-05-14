# tweet-chat-web

[API Documentation](docs/)


A web application for chatting with AI personas trained on Twitter data. The project consists of:

## Project Structure

- `/src` - Main application code
  - `/client` - React frontend application
    - `/assets` - Static assets and images
    - `/components` - Reusable UI components including auth, chat and UI primitives
    - `/contexts` - React context providers
    - `/lib` - Frontend utilities
    - `/store` - Zustand state management
  - `/server` - Backend Node.js server using Fastify
    - `/db` - Database managers and SQL queries
    - `/lib` - Core business logic (AI, chat, persona, scraper)
    - `/routes` - API route handlers

- `/docs` - API documentation
  - `/api/server` - Backend API docs for database, libraries and routes

- `/scripts` - Utility scripts for deployment and migrations

- `/supabase` - Database configuration
  - `/migrations` - SQL migration files
  - `/schemas` - Database schema definitions

- `/terraform` - Infrastructure as code for GCP deployment

- `/tests` - Integration and unit tests

## Key Technologies

- Frontend: React, TailwindCSS, Radix UI
- Backend: Node.js, Fastify, PostgreSQL
- AI: OpenAI SDK
- Testing: Vitest
- Infrastructure: Supabase, Google Cloud Platform
- DevOps: Docker, Terraform

## Configuration Files
- `docker-compose.yml` & `Dockerfile` - Container configuration
- `vite.config.js` - Frontend build config
- `eslint.config.js` - Code linting rules
- `components.json` - UI component configurations

## Available Commands

- `npm run dev` - Start development server (both frontend and backend)
- `npm run dev:vite` - Start frontend development server
- `npm run dev:server` - Start backend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally
- `npm run clean` - Remove build artifacts
- `npm run lint` - Run ESLint code linting
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run migrate` - Apply database migrations
- `npm run migrate:push` - Push migrations to database
- `npm run docs:generate` - Generate API documentation


