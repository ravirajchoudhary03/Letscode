# Supabase Setup Guide for MarketEcho

This guide will help you set up a free PostgreSQL database using Supabase in less than 5 minutes.

## 1. Create Supabase Project
1. Go to **[supabase.com](https://supabase.com)** and strictly click "Start your project".
2. Sign in with GitHub (easiest) or email.
3. Click **"New Project"**.
4. Select an Organization (create one if needed).
5. Fill in the details:
   - **Name**: `MarketEcho`
   - **Database Password**: Generates a strong password or type one. **SAVE THIS PASSWORD!** You cannot see it again.
   - **Region**: Choose the one closest to you (e.g., Mumbai, Singapore, US East).
6. Click **"Create new project"**.

## 2. Get Connection String
Wait a minute for the project to provision (status will change from "Setting up" to "Active").

1. Go to **Project Settings** (Cog/Gear icon at the bottom of the left sidebar).
2. Select **"Database"** from the menu.
3. Scroll down to the **"Connection string"** section.
4. Click on the **"URI"** tab (not JDBC or ADO.NET).
5. Copy the string. It will look like this:
   ```
   postgresql://postgres.your-ref:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
   *Note: Port might be 5432 or 6543. Both work for Supabase usually, but 6543 is for the connection pooler (better for serverless).*

## 3. Configure Backend
1. Open your local file `backend/.env` (create it if missing, copy from `.env.example`).
2. Paste your connection string into `DATABASE_URL`.
3. **Replace `[YOUR-PASSWORD]`** with the password you created in step 1.

Example `.env` content:
```ini
DATABASE_URL=postgresql://postgres.abcdefghijkl:MySecretPass123!@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## 4. Initialize Database
Open your terminal in the `backend` folder and run:

```bash
# Activate virtual env if not active
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Run initialization script
python -m app.core.init_db
```

If successful, you will see:
```
Creating database tables...
✓ Tables created successfully
Seeding platforms...
✓ Platforms seeded
Seeding categories...
✓ Categories seeded
✅ Database initialization complete!
```

## 5. Verify
1. Go back to your Supabase Dashboard.
2. Click the **"Table Editor"** icon (spreadsheet icon) on the left.
3. You should see tables: `brands`, `categories`, `mentions`, etc.

You are now ready to run the backend!
