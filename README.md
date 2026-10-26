# Gather Event Studio

A small event-management application with a React frontend and an Express,
MongoDB, and Mongoose backend. It supports listing, searching, creating,
editing, and deleting events.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MongoDB, either local or hosted

## Run locally

1. Create `backend/.env` using `backend/.env.example` and set `MONGODB_URI` to
   your MongoDB connection string.
2. In one terminal, run the backend:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

   The API listens on port 5000 by default. Set `PORT` in `backend/.env` to
   change it.
3. In another terminal, run the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite. The frontend uses
   `http://localhost:5000/api` by default. To use a different API base URL,
   create `frontend/.env` from `frontend/.env.example` and set `VITE_API_URL`.

## Checks

Run frontend linting and a production build from `frontend/`:

```sh
npm run lint
npm run build
```

The backend does not currently have an automated test suite.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/events` | Create an event |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |

Each event has an event name, description, date, and venue.

## Before publishing or deploying

- Keep real credentials in local environment files or your hosting provider's
  secret manager. Never commit `.env` files.
- Configure a production MongoDB connection and restrict API CORS origins
  before exposing the backend publicly.
- This project currently has no authentication or authorization and is not
  suitable for managing private event data on a public deployment without
  adding access controls.
