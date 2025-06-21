# Bitespeed Backend Assignment

A TypeScript-based Express backend using Drizzle ORM and Neon serverless PostgreSQL, designed for contact identification and management.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Endpoint Flow](#endpoint-flow)
- [Controller Functionalities](#controller-functionalities)
- [Service Layer](#service-layer)
- [TypeScript & Nodemon Setup](#typescript--nodemon-setup)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Project Structure

```
bitespeed backend assignment
├── src
│   ├── app.ts
│   ├── db
│   │   ├── schema.ts
│   │   └── index.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── contact.route.ts
│   ├── controllers
│   │   └── contact.controller.ts
│   └── service
│       └── contact.service.ts
├── package.json
├── tsconfig.json
├── nodemon.json
├── .gitignore
├── .env
├── .env.sample
└── README.md
```

---

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd "bitespeed backend assignment"
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.sample` to `.env` and fill in your database connection string.
   - Example:
     ```
     DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
     ```

4. **Drizzle ORM Setup:**
   - Define your schema in `src/db/schema.ts`.
   - To push your schema/migrations to the database, run:
     ```sh
     npm run db:push
     ```
   - To open Drizzle Studio for database management, run:
     ```sh
     npm run db:studio
     ```

5. **Run the application:**
   ```sh
   npm run dev
   ```
   Or, to run without nodemon:
   ```sh
   npm start
   ```

---

## Environment Variables

- `DATABASE_URL` — Your Neon PostgreSQL connection string.

---

## Database Schema

The `contacts` table has the following structure:

| Column         | Type      | Description                                   |
|----------------|-----------|-----------------------------------------------|
| id             | serial    | Primary key, auto-increment                   |
| phoneNumber    | text      | Contact's phone number                        |
| email          | text      | Contact's email address                       |
| linkedId       | integer   | FK to contacts.id (self-reference)            |
| linkPrecedence | enum      | 'primary' or 'secondary'                      |
| createdAt      | timestamp | Record creation timestamp                     |
| updatedAt      | timestamp | Last update timestamp                         |
| deletedAt      | timestamp | Soft delete timestamp (nullable)              |

---

## API Endpoints

### POST `/identify`

**Description:**  
Identifies a contact based on email and/or phone number. Handles merging, linking, and deduplication logic.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phoneNumber": "1234567890"
}
```
- At least one of `email` or `phoneNumber` is required.

**Response:**
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["user@example.com", "other@example.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [2, 3]
  }
}
```

**Possible Status Codes:**
- `200 OK` — Success, returns contact structure.
- `400 Bad Request` — If both email and phoneNumber are missing.

---

### GET `/identify`

**Description:**  
Test endpoint. Returns a message indicating the route is working and instructs to use POST for identification.

**Response:**
```json
"This is GET request , to test the identify route use POST req with json body!"
```

---

## Endpoint Flow

1. **Input Validation:**  
   - If neither `email` nor `phoneNumber` is provided, returns `400 Bad Request`.

2. **Find Existing Contacts:**  
   - The service searches for all contacts matching the provided email or phone number.

3. **No Match:**  
   - If no contact is found, a new contact is inserted as `primary`.
   - The response contains the new contact as the primary contact.

4. **Match Found:**  
   - The oldest contact with `linkPrecedence: 'primary'` is selected as the primary contact.
   - All other contacts (including those previously marked as primary but now secondary) are updated to `linkPrecedence: 'secondary'` and linked to the primary contact.
   - The response aggregates all unique emails, phone numbers, and secondary contact IDs related to the primary contact.

5. **Deduplication & Linking:**  
   - If both email and phone number match different contacts, the system merges them under the oldest as primary, updating others as secondary and linking them.

6. **Soft Deleted Contacts:**  
   - Contacts with a non-null `deletedAt` are ignored in identification and merging.

---

## Controller Functionalities

- **identifyContact (POST /identify):**
  - Validates input (requires at least one of email or phone number).
  - Calls the service layer to find, create, or merge contacts.
  - Determines the primary contact and updates/links secondary contacts as needed.
  - Returns a unified contact structure with all related emails, phone numbers, and secondary contact IDs.

---

## Service Layer

- **findMatchingContacts:**  
  Finds all contacts matching the given email or phone number, and recursively fetches all related contacts (by `linkedId`).

- **insertContact:**  
  Inserts a new contact as either primary or secondary, with proper timestamps.

- **updateContact:**  
  Updates an existing contact's fields (such as `linkPrecedence` and `linkedId`), ensuring only defined fields are updated.

---

## TypeScript & Nodemon Setup

- The project uses TypeScript for type safety and maintainability.
- All source files are in the `src` directory and use `.ts` extensions.
- **Development:** Uses `nodemon` with `ts-node` or `tsx` for live-reloading TypeScript files.
- The `nodemon.json` file ensures `.ts` files are watched and executed correctly.
- The `tsconfig.json` file is configured for modern Node.js and strict type checking (recommended for production).
- If you enable `"strict": true` in `tsconfig.json`, you must add explicit types to all Express handlers and function parameters.

---

## Scripts

- `npm run dev` — Start server with nodemon and ts-node (auto-reloads on changes)
- `npm start` — Start server with ts-node
- `npm run db:push` — Run Drizzle ORM migrations
- `npm run db:studio` — Open Drizzle Studio for DB management

---

## Contributing

- Fork the repo and create a feature branch.
- Submit issues or pull requests for improvements or bug fixes.
- Ensure all new code is covered by tests (if applicable).

---

## Notes

- The codebase uses TypeScript strict mode for type safety (recommended for production).
- All business logic for contact identification and merging is in `src/service/contact.service.ts`.
- All API logic is in `src/controllers/contact.controller.ts` and `src/routes/contact.route.ts`.

---

**For any questions, please open an issue or contact the maintainer.**