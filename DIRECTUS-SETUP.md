# Directus Self-Hosting Setup Guide

## Why Self-Host?

**Directus Cloud** provides its own database and doesn't support connecting to external databases like Supabase.

To manage your Supabase data with Directus, you need to **self-host Directus** and point it to your Supabase database.

---

## Quick Start with Docker

### Step 1: Get Supabase Database Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **Database**
3. Copy the **Connection String** under "Connection Pooling" or "Direct Connection"
4. Note your database password (you set this when creating the project)

The connection string looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

Extract these values:
- **DB_HOST**: `db.xxxxx.supabase.co`
- **DB_USER**: `postgres`
- **DB_DATABASE**: `postgres`
- **DB_PASSWORD**: Your database password
- **DB_PORT**: `5432`

### Step 2: Generate Security Keys

Generate random keys for Directus:

```bash
# On Mac/Linux
openssl rand -base64 32
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 3: Configure Docker Compose

Edit `docker-compose.yml` and replace:

```yaml
KEY: 'paste-first-random-key-here'
SECRET: 'paste-second-random-key-here'
ADMIN_EMAIL: 'your@email.com'
ADMIN_PASSWORD: 'choose-a-secure-password'
DB_HOST: 'db.xxxxx.supabase.co'  # Your Supabase host
DB_PASSWORD: 'your-supabase-db-password'
```

### Step 4: Start Directus

```bash
# Start Directus
docker compose up -d

# Check logs
docker compose logs -f directus
```

### Step 5: Access Directus

Open http://localhost:8055 in your browser

Login with:
- Email: Your ADMIN_EMAIL
- Password: Your ADMIN_PASSWORD

---

## First Time Setup in Directus

Once logged in:

### 1. Configure the Posts Collection

Directus should automatically detect your `posts` table from Supabase.

Go to **Settings** > **Data Model** > **posts** and configure:

- **Display Template**: `{{title}}`
- **Archive Field**: Leave empty (we use `published` as boolean)
- **Sort Field**: `date` (descending)

### 2. Configure Field Display

Click on the **posts** collection, then configure each field:

**Title**
- Interface: Input
- Display: Raw Value

**Subtitle**
- Interface: Input
- Display: Raw Value

**Content**
- Interface: **WYSIWYG** or **Markdown**
- Display: Formatted Value

**Form**
- Interface: Dropdown
- Choices: `longform`, `shortform`

**Category**
- Interface: Input
- Display: Raw Value

**Date**
- Interface: Date
- Display: Date

**Tags**
- Interface: Tags
- Display: Tags

**Published**
- Interface: Toggle
- Display: Boolean

**Excerpt**
- Interface: Textarea
- Display: Formatted Value

**Slug**
- Interface: Input
- Options: Slugify (enable)
- Display: Raw Value

### 3. Configure Permissions (Optional)

If you want to allow others to use Directus:

1. Go to **Settings** > **Roles & Permissions**
2. Create a new role (e.g., "Editor")
3. Grant permissions for the `posts` collection
4. Invite users with that role

---

## Creating Your First Post in Directus

1. Click **Posts** in the sidebar
2. Click **Create Item** (+ button)
3. Fill in:
   - Title
   - Subtitle
   - Form (longform/shortform)
   - Category
   - Date
   - Tags (comma-separated, press Enter after each)
   - Chapter
   - Excerpt
   - Content (use the rich text editor or markdown)
4. Toggle **Published** to ON
5. Click **Save**

The post is now in Supabase and will appear on your site!

---

## Verify It's Working

### Check Supabase

Go to Supabase Dashboard > Table Editor > posts

You should see your post there.

### Check Your App

If you've switched to `posts-supabase.ts`:

```bash
npm run dev
```

Visit http://localhost:5173/pond - your post should appear!

---

## Production Deployment

### Option 1: Deploy on Render.com (Free Tier)

1. Create account at https://render.com
2. Click **New** > **Web Service**
3. Connect your GitHub repo or use Docker image: `directus/directus:latest`
4. Add environment variables from `docker-compose.yml`
5. Deploy

### Option 2: Railway.app

1. Create account at https://railway.app
2. Click **New Project** > **Deploy from Docker**
3. Use image: `directus/directus:latest`
4. Add environment variables
5. Deploy

### Option 3: DigitalOcean App Platform

1. Create account at https://www.digitalocean.com
2. Go to **App Platform**
3. Create new app from Docker Hub
4. Image: `directus/directus:latest`
5. Add environment variables
6. Deploy

### Environment Variables for Production

Update these in your deployment:

```env
PUBLIC_URL=https://your-directus-domain.com
CORS_ORIGIN=https://perakasem.co,https://your-directus-domain.com
```

---

## Stopping/Restarting Directus

```bash
# Stop
docker compose down

# Restart
docker compose up -d

# View logs
docker compose logs -f directus

# Rebuild after config changes
docker compose down
docker compose up -d --force-recreate
```

---

## Troubleshooting

### Can't connect to database

**Error**: `Connection refused` or `timeout`

**Fix**: Check Supabase connection pooling settings:
1. Go to Supabase Dashboard > Settings > Database
2. Enable **Connection Pooling**
3. Use the pooler host in `DB_HOST` (usually `db.xxxxx.supabase.co`)

### SSL connection error

**Error**: `SSL required`

**Fix**: Ensure `DB_SSL: 'true'` is set in docker-compose.yml

### Tables not showing in Directus

**Cause**: Directus can't see the tables

**Fix**:
1. Check database connection is working
2. Restart Directus: `docker compose restart`
3. Check Directus logs for errors: `docker compose logs directus`

### Permissions errors

**Error**: `Forbidden` when creating posts

**Fix**: You're likely logged in as a role without permissions. Login with admin account.

---

## Alternative: Directus Cloud + API Sync

If you prefer Directus Cloud, you can:

1. Use Directus Cloud with its own database
2. Set up webhooks to sync data to Supabase
3. More complex, not recommended for this use case

---

## Next Steps

- [ ] Configure image uploads (Directus Storage)
- [ ] Set up webhooks for cache invalidation
- [ ] Create content pages (Bio, Resume)
- [ ] Invite team members
- [ ] Set up automated backups

---

**Need help?**
- Directus Docs: https://docs.directus.io
- Supabase Docs: https://supabase.com/docs
- Docker Docs: https://docs.docker.com
