# CMS Quick Start Guide

## 🚀 Getting Started in 5 Minutes

This is a quick reference for setting up the Directus + Supabase CMS system.

---

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
npm install -D tsx yaml @types/node
```

---

## Step 2: Set Up Supabase

1. Create account at https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Run `supabase-schema.sql`
5. Copy your credentials:
   - Project URL
   - Anon/Public Key

---

## Step 3: Configure Environment

Create `.env`:

```env
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Add to `.gitignore`:
```
.env
.env.*
!.env.example
```

---

## Step 4: Migrate Existing Posts

```bash
npx tsx scripts/migrate-posts-to-supabase.ts
```

Verify in Supabase Dashboard > Table Editor > posts

---

## Step 5: Set Up Directus

### Option A: Directus Cloud (Easiest)
1. Sign up at https://directus.cloud
2. Create project
3. Connect to Supabase database
4. Done!

### Option B: Docker (Self-hosted)
```bash
# Edit directus.config.yaml with your credentials
docker run -d \
  --name directus \
  -p 8055:8055 \
  -e KEY="your-random-key" \
  -e SECRET="your-random-secret" \
  -e DB_CLIENT="pg" \
  -e DB_HOST="db.your-project.supabase.co" \
  -e DB_PORT="5432" \
  -e DB_DATABASE="postgres" \
  -e DB_USER="postgres" \
  -e DB_PASSWORD="your-supabase-password" \
  -e ADMIN_EMAIL="admin@example.com" \
  -e ADMIN_PASSWORD="your-password" \
  directus/directus:latest
```

Access at http://localhost:8055

---

## Step 6: Update Your App

Replace post imports:

```typescript
// Before
import { getPosts } from '$lib/server/posts';

// After
import { getPosts } from '$lib/server/posts-supabase';
```

Files to update:
- `src/routes/(pond)/pond/+page.server.ts`
- `src/routes/(pond)/pond/[slug]/+page.server.ts`
- `src/routes/(pond)/pond/archive/+page.server.ts`
- `src/routes/api/posts/+server.ts`
- `src/routes/rss.xml/+server.ts`

---

## Step 7: Test Locally

```bash
npm run dev
```

Visit http://localhost:5173/pond

---

## Step 8: Deploy

Add environment variables to your hosting:

**Vercel:**
```bash
vercel env add PUBLIC_SUPABASE_URL
vercel env add PUBLIC_SUPABASE_ANON_KEY
```

**Netlify:**
```bash
netlify env:set PUBLIC_SUPABASE_URL "https://xxx.supabase.co"
netlify env:set PUBLIC_SUPABASE_ANON_KEY "eyJhbGc..."
```

Then deploy:
```bash
git add .
git commit -m "feat: add CMS integration"
git push
```

---

## ✅ You're Done!

**Create your first post:**
1. Open Directus
2. Go to Posts collection
3. Click "Create Item"
4. Fill in details
5. Toggle "Published"
6. Save
7. Visit your site!

---

## 📚 Full Documentation

- **Detailed Setup**: See `CMS-SETUP.md`
- **Content Pages**: See `CONTENT-PAGE-STRATEGY.md`
- **Database Schema**: See `supabase-schema.sql`

---

## 🆘 Troubleshooting

**Posts not showing?**
```bash
# Check Supabase connection
curl https://your-project.supabase.co/rest/v1/posts \
  -H "apikey: YOUR_ANON_KEY"
```

**Directus can't connect?**
- Verify database credentials
- Check Supabase is accepting connections
- Ensure SSL is enabled

**Build errors?**
```bash
# Clear cache
rm -rf .svelte-kit node_modules/.vite
npm install
npm run dev
```

---

## 💡 Next Steps

- [ ] Set up content pages (Bio, Resume)
- [ ] Configure image upload
- [ ] Add webhooks for cache invalidation
- [ ] Set up automated backups
- [ ] Train content editors

---

**Need help?** Check the full documentation or Supabase/Directus community forums.
