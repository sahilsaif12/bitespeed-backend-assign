# Express Backend 

This is a basic Express backend application using Drizzle ORM for PostgreSQL, with a clean folder structure and environment variable support.

## Project Structure

```
bitespeed backend assignment
├── src
│   ├── app.js
│   ├── db
│   │   └── schema.ts
│   ├── routes
│   │   └── index.js
│   └── controllers
│       └── index.js
├── package.json
├── .gitignore
└── README.md
```

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
   - Create a `.env` file in the root directory.
   - Add your database connection string and other secrets as needed.

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

## Usage

Once the application is running, you can access it at `http://localhost:3000`. The root route will respond with a welcome message.

## Scripts

- `npm run dev` — Start server with nodemon (auto-reloads on changes)
- `npm start` — Start server with Node.js
- `npm run db:push` — Run Drizzle ORM migrations
- `npm run db:studio` — Open Drizzle Studio for DB management

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.