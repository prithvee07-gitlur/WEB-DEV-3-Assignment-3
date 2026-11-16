# Lab 4: Secure Connect and Communication Platform

## Overview
This repository contains the completed code for Web Dev III - Lab 4. It implements a secure backend with authentication, a protected CRUD Notes API, and real-time chat via WebSockets without relying on pre-built auth boilerplates.

## Setup Instructions
1. Run `npm install` in your terminal to fetch the Node modules (`express`, `mongoose`, `bcrypt`, `jsonwebtoken`, `socket.io`, `dotenv`, etc.).
2. Ensure MongoDB is running locally (`mongodb://localhost:27017/secure-connect`), or update the `MONGO_URI` connection string inside the `.env` file.
3. Start the server by running `npm start` (or `npm run dev` if you prefer using nodemon).

## Implemented Features
- **Signup/Login System:** Hashes passwords via `bcrypt` and handles JWT generation.
- **Protected Routes:** `authMiddleware.js` verifies tokens and throws a 403 `{"message": "No token provided"}` error if missing, checking both `Authorization: Bearer` and cookies to match Postman configurations.
- **Role-Based Access Control:** Accounts default to the `user` role. Users can manage only their own notes; an account whose stored role is `admin` can access and manage all notes.
- **Notes API:** Provides protected CRUD operations for notes, linking each note to its MongoDB user ObjectId.
- **Real-Time Chat:** Configured `socket.io` server logic in `server.js` allowing users to join rooms and broadcast messages while logging activity to the console.
- **Event-Driven Operations:** Custom `EventEmitter` instance logs new user registrations automatically. 

## API summary

- `POST /api/auth/signup` - register a user account
- `POST /api/auth/login` - receive a one-hour JWT
- `POST /api/notes` - create a note for the authenticated user
- `GET /api/notes` - list the authenticated user's notes, or all notes for an admin
- `PUT /api/notes/:id` - update an owned note, or any note as an admin
- `DELETE /api/notes/:id` - delete an owned note, or any note as an admin

The project keeps `cors` enabled for local browser/client access. Configure a user's `role` as `admin` in MongoDB when demonstrating the administrator view; public signup never accepts a role from the request.

## Verification

Run `node --check` against the application files, start MongoDB and the server, then verify signup, login, missing/invalid JWT responses, user-owned Notes CRUD, admin Notes listing, Socket.IO room/message events, and the registration EventEmitter log.
