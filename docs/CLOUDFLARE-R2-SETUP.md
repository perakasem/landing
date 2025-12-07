# Cloudflare R2 Setup Guide for Directus

> **Purpose:** Migrate Directus file storage from local filesystem to Cloudflare R2
> **Last Updated:** 2025-12-07

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create R2 Bucket](#step-1-create-r2-bucket)
4. [Step 2: Generate API Credentials](#step-2-generate-api-credentials)
5. [Step 3: Configure Directus](#step-3-configure-directus)
6. [Step 4: Test Upload](#step-4-test-upload)
7. [Step 5: Migrate Existing Files](#step-5-migrate-existing-files)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### Current Architecture

```
Directus (Render/Railway)
    └── Local filesystem (/uploads/)
        └── ❌ Files lost on restart
```

### Target Architecture

```
Directus (Render/Railway)
    ↓ uploads to
Cloudflare R2 Bucket
    ↓ serves via
Public CDN URL
    ↓ used by
Your SvelteKit App
```

---

## Prerequisites

- ✅ Cloudflare account (free tier is fine)
- ✅ Directus instance running (Render/Railway)
- ✅ Access to Directus environment variables

---

## Step 1: Create R2 Bucket

### 1.1 Access R2 Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. In the left sidebar, click **R2**
3. Click **Create bucket**

### 1.2 Create Bucket

**Bucket Name:** Choose a name (e.g., `perakasem-directus-assets`)

**Important naming rules:**
- Lowercase letters, numbers, hyphens only
- Must be globally unique within your Cloudflare account
- 3-63 characters

**Location:** Choose closest to your users (e.g., `Automatic` or `WNAM` for North America)

Click **Create bucket**

### 1.3 Configure Public Access (Optional but Recommended)

For public blog images, you'll want a public URL:

1. Go to your bucket settings
2. Under **Settings**, find **R2.dev subdomain**
3. Click **Allow Access** to enable public reads
4. Note the public URL: `https://pub-xxxxx.r2.dev`

**Alternative:** Use Cloudflare custom domain for cleaner URLs (requires domain on Cloudflare)

---

## Step 2: Generate API Credentials

### 2.1 Create R2 API Token

1. In R2 dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**

**Token Configuration:**

- **Token name:** `directus-upload`
- **Permissions:** Object Read & Write
- **Bucket:** Select your bucket (e.g., `perakasem-directus-assets`)
- **TTL:** Never expire (or set expiration as needed)

Click **Create API Token**

### 2.2 Save Credentials

You'll see three values - **SAVE THESE NOW** (they won't be shown again):

```bash
# Example values (yours will be different)
Access Key ID: 4a3b2c1d5e6f7g8h9i0j1k2l3m4n5o6p
Secret Access Key: 7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a
Endpoint URL: https://1234567890abcdef.r2.cloudflarestorage.com
```

**DO NOT SHARE THESE PUBLICLY**

---

## Step 3: Configure Directus

### 3.1 Update Environment Variables

Add these to your Directus environment variables (Render/Railway dashboard):

```bash
# Storage Configuration
STORAGE_LOCATIONS=cloudflare

# Cloudflare R2 Settings
STORAGE_CLOUDFLARE_DRIVER=s3
STORAGE_CLOUDFLARE_KEY=<your Access Key ID>
STORAGE_CLOUDFLARE_SECRET=<your Secret Access Key>
STORAGE_CLOUDFLARE_BUCKET=<your bucket name>
STORAGE_CLOUDFLARE_REGION=auto
STORAGE_CLOUDFLARE_ENDPOINT=<your Endpoint URL>

# Public URL (if you enabled R2.dev subdomain)
STORAGE_CLOUDFLARE_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

**Example with real values:**

```bash
STORAGE_LOCATIONS=cloudflare
STORAGE_CLOUDFLARE_DRIVER=s3
STORAGE_CLOUDFLARE_KEY=4a3b2c1d5e6f7g8h9i0j1k2l3m4n5o6p
STORAGE_CLOUDFLARE_SECRET=7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a
STORAGE_CLOUDFLARE_BUCKET=perakasem-directus-assets
STORAGE_CLOUDFLARE_REGION=auto
STORAGE_CLOUDFLARE_ENDPOINT=https://1234567890abcdef.r2.cloudflarestorage.com
STORAGE_CLOUDFLARE_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 3.2 Restart Directus

After saving environment variables:

**On Render:**
1. Go to your Directus service
2. Click **Manual Deploy** → **Deploy latest commit**

**On Railway:**
1. Changes trigger automatic redeploy
2. Or click **Redeploy** manually

### 3.3 Verify Configuration

Check Directus logs for errors:

```bash
# Look for successful S3 connection
# No "storage" or "S3" errors
```

---

## Step 4: Test Upload

### 4.1 Upload Test File

1. Log in to Directus admin
2. Go to **File Library**
3. Click **Upload Files**
4. Upload a small test image

### 4.2 Verify in R2

1. Go to Cloudflare R2 dashboard
2. Click your bucket
3. You should see the uploaded file in the file list

### 4.3 Check Public URL

If you enabled public access, the file should be accessible at:

```
https://pub-xxxxx.r2.dev/[file-id]/[filename]
```

Try opening this URL in your browser.

---

## Step 5: Migrate Existing Files

If you have existing files in local storage that need to be migrated:

### 5.1 Download Existing Files

**On Render/Railway:**

1. Use their CLI or dashboard to download files from `/uploads/` directory
2. Or use Directus File Library to download files

### 5.2 Re-upload to Directus

**Option A: Manual (Small number of files)**

1. Download files from current Directus
2. Delete old files in Directus
3. Re-upload via Directus admin (now saves to R2)

**Option B: Automated (Many files)**

Create a migration script (see `scripts/migrate-files-to-r2.ts` example below)

### 5.3 Update Database References

Directus stores file metadata in `directus_files` table. If you re-uploaded files, you may need to update post content to reference new file IDs.

---

## Troubleshooting

### Files Not Uploading

**Check Directus logs for errors:**

```bash
# Common issues:
# 1. Wrong credentials
# 2. Wrong endpoint URL
# 3. Bucket permissions
```

**Verify environment variables:**

```bash
# Make sure all variables are set correctly
# No typos in bucket name or endpoint
```

### Files Upload but Not Accessible

**Issue:** Public URL not working

**Solution:**

1. Verify R2.dev subdomain is enabled
2. Check bucket is set to allow public access
3. Ensure `STORAGE_CLOUDFLARE_PUBLIC_URL` is set correctly

### Wrong File URLs in Database

**Issue:** Old local file paths in `directus_files` table

**Solution:**

```sql
-- Check current file storage locations
SELECT id, filename_disk, storage FROM directus_files;

-- If storage is still 'local', Directus is not using R2
-- Verify environment variables and restart
```

### Performance Issues

**Issue:** Slow uploads

**Solution:**

- Choose R2 region closer to your Directus server
- Check network connectivity between Render/Railway and Cloudflare

---

## Advanced: Custom Domain (Optional)

For cleaner URLs like `https://assets.perakasem.com`, you can use a Cloudflare custom domain:

### Requirements

- Domain managed by Cloudflare DNS
- R2 bucket already created

### Setup

1. In R2 bucket settings, click **Connect Domain**
2. Enter subdomain: `assets.perakasem.com`
3. Cloudflare automatically creates DNS record
4. Update Directus env var:

```bash
STORAGE_CLOUDFLARE_PUBLIC_URL=https://assets.perakasem.com
```

---

## Security Best Practices

1. ✅ **Never commit credentials** - Use environment variables only
2. ✅ **Rotate API tokens** - Change periodically
3. ✅ **Limit token permissions** - Only Read & Write for specific bucket
4. ✅ **Use HTTPS** - Always use secure endpoints
5. ✅ **Backup files** - Keep local backups of important assets

---

## Cost Estimates

**Cloudflare R2 Pricing (as of 2025):**

- **Storage:** $0.015/GB/month
- **Class A operations (writes):** $4.50/million
- **Class B operations (reads):** $0.36/million
- **Egress:** FREE (no bandwidth charges)

**Example for small blog:**

- 10GB storage: $0.15/month
- 10,000 image views: ~$0.004
- **Total: ~$0.20/month**

**Free Tier:**

- 10GB storage included
- 1 million Class A operations/month
- 10 million Class B operations/month

---

## Next Steps

After successful migration:

1. ✅ Test all existing posts with images
2. ✅ Update any hardcoded file paths in content
3. ✅ Remove old local storage configuration
4. ✅ Document new upload workflow for content editors
5. ✅ Set up automated backups (optional)

---

## Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Directus File Storage Documentation](https://docs.directus.io/self-hosted/config-options.html#file-storage)
- [S3-Compatible Storage Guide](https://docs.directus.io/self-hosted/config-options.html#amazon-s3-compatible)

---

**Questions or Issues?**

Check Directus logs and Cloudflare R2 dashboard for detailed error messages.
