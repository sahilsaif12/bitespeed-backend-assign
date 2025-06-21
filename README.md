# Express Backend Assignment

This is a basic Express backend application using Drizzle ORM for PostgreSQL, with a clean folder structure, TypeScript support, and environment variable management.

## Project Structure

```
bitespeed backend assignment
├── src
│   ├── app.ts
│   ├── db
│   │   └── schema.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── contact.route.ts
│   └── controllers
│       └── index.ts
├── package.json
├── tsconfig.json
├── nodemon.json
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

5. **TypeScript & Nodemon Setup:**
   - The project uses TypeScript for type safety.
   - Development uses `nodemon` with `ts-node` or `tsx` for live-reloading TypeScript files.
   - The `nodemon.json` file ensures `.ts` files are watched and executed correctly.

6. **Run the application:**
   ```sh
   npm run dev
   ```
   Or, to run without nodemon:
   ```sh
   npm start
   ```

## TypeScript Strict Mode

- By default, `"strict": false` in `tsconfig.json` for easier development.
- If you enable `"strict": true`, you must add explicit types to all Express handlers and function parameters.

## Usage

- The server will start on `http://localhost:3000` by default.
- The root route `/` responds with a welcome message.
- The `/identify` route is handled by `contact.route.ts`.

## Scripts

- `npm run dev` — Start server with nodemon and ts-node (auto-reloads on changes)
- `npm start` — Start server with ts-node
- `npm run db:push` — Run Drizzle ORM migrations
- `npm run db:studio` — Open Drizzle Studio for DB management

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

---