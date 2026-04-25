# Strategy-Solution Project Overview

This project is a web application with a React-based frontend integrated into an Express.js backend.

## Project Structure

- `/`: Root directory containing the Express backend (`index.js`).
- `/Frontend/Strategy-Solution`: The core React application scaffolded with Vite.
- `/Frontend/Strategy-Solution/dist`: The production build of the frontend, served by Express.

## Technologies

- **Frontend:**
  - React 19
  - Vite
  - Vanilla CSS
  - ESLint for linting
- **Backend:**
  - Express.js
  - Prisma ORM

## Building and Running

### Full Application (Integrated)

From the root directory:
- `npm install`: Install root dependencies.
- `npm run build`: Installs all dependencies (root and frontend) and builds the frontend production assets.
- `npx prisma generate`: Generates the Prisma Client (handled automatically by `postinstall`).
- `npm start`: Starts the Express server which serves the API and the frontend.

## Database (Prisma)

- **Schema:** Located at `prisma/schema.prisma`.
- **Client Instance:** Access the singleton client via `src/utils/prisma.js`.
- **Migration:** Run `npx prisma migrate dev` to create and apply migrations during development.
- **Studio:** Run `npx prisma studio` to view and edit your data in a GUI.

### Development

From the root directory:
- `npm run dev`: Starts both the Express backend (with auto-reload) and the Vite frontend (with HMR) concurrently.
  - Backend: `http://localhost:3000`
  - Frontend: `http://localhost:5173` (Proxies `/api` to the backend)

## API Routes

- `GET /api/health`: Health check endpoint.
- All other routes are directed to the frontend's `index.html` via `app.get('(.*)', ...)` to support client-side routing.

## Development Conventions

- **Component Style:** Functional components using React Hooks.
- **Styling:** Vanilla CSS is preferred.
- **Linting:** Strict ESLint rules as configured in `Frontend/Strategy-Solution/eslint.config.js`.
- **Imports:** Standard ES Modules (`import`/`export`).
