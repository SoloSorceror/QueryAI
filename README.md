# QueryAI

QueryAI is a secure, full-stack analytics platform that allows non-technical users to query a PostgreSQL database using natural language. It translates plain English questions into optimized SQL, executes them safely, and generates business insights using Google Gemini AI.

## 🚀 Features

- **Natural Language to SQL**: Ask questions in plain English (e.g., "What are our top 5 selling products?") and get data instantly.
- **AI Business Insights**: Automatically summarizes raw database results into human-readable business insights.
- **Triple-Layer Security Architecture**:
  1. **Application Validator**: Explicit allowlist blocking non-`SELECT` statements via regex.
  2. **Transaction Security**: Queries are strictly executed within a `BEGIN READ ONLY` PostgreSQL transaction.
  3. **Role-Based Access**: Dual connection pools isolating authenticated users from AI query execution.
- **JWT Authentication**: Secure stateless authentication using bcrypt password hashing.
- **Query History**: Automatically saves your past questions, generated SQL, and insights in a PostgreSQL JSONB column for later review.

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router, Axios. (Clean minimalist design system).
- **Backend**: Node.js, Express, TypeScript, Google Generative AI SDK.
- **Database**: PostgreSQL (Neon Serverless)
- **AI Model**: Google Gemini 3.5 Flash (Optimized for fast Text-to-SQL inference).

### The Two-Pass AI Pipeline

QueryAI does not try to force the LLM to do everything at once. We use a multi-agent pipeline:

1. **Pass 1 (Text-to-SQL)**: Contextualized with dynamic Schema Introspection to translate English into accurate SQL.
2. **Pass 2 (Data-to-Insight)**: The raw JSON output from the PostgreSQL database is fed back to the LLM to generate a professional business summary.

## 🛠️ Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/QueryAI.git
   cd QueryAI
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:

   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgres://user:password@host/db
   GEMINI_API_KEY=your_google_ai_key
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Initialize Database:**

   ```bash
   npm run db:setup
   npm run db:seed
   ```

5. **Start Development Servers:**

   ```bash
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

## 📊 Database Schema

The database includes realistic synthetic analytics data:

- `users`: Application authentication.
- `query_history`: Stores past AI interactions using `JSONB`.
- `customers`, `products`, `orders`, `order_items`: Business analytics tables populated with over 7,500 rows of Indian business data for testing.
