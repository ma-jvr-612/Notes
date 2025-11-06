# Cloudflare Pages Deployment Guide

## How It Works in Production

When deployed to Cloudflare Pages:

1. **Static files** (Angular app) → Served from Cloudflare's global CDN
2. **API routes** (`/api/*`) → Run as Cloudflare Functions (serverless)
3. **D1 Database** → Automatically bound to your Functions

The `_routes.json` file tells Cloudflare:
- `/api/*` = Run as Functions
- Everything else = Serve as static files

## Prerequisites

1. Your D1 database is created on Cloudflare
2. Database schema has been applied
3. D1 is bound to your Pages project

## Deployment Methods

### Method 1: Git Integration (Recommended)

1. **Push to GitHub/GitLab:**
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Connect to Cloudflare Pages:**
   - Go to Cloudflare Dashboard → Workers & Pages
   - Click "Create application" → "Pages" → "Connect to Git"
   - Select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `www`
   - Click "Save and Deploy"

3. **Bind D1 Database:**
   - Go to your Pages project → Settings → Functions
   - Scroll to "D1 database bindings"
   - Click "Add binding"
   - Variable name: `DB`
   - D1 database: Select your `notes-database`
   - Save

4. **Redeploy:**
   - Go to Deployments → click "..." → "Retry deployment"

### Method 2: Manual Deploy with Wrangler

1. **Build the app:**
```bash
npm run build
```

2. **Deploy:**
```bash
npx wrangler pages deploy www --project-name=notes-app
```

On first deploy, you'll be prompted to create the project.

3. **Bind D1 (via wrangler.toml):**

The `wrangler.toml` file already has your D1 binding:
```toml
[[d1_databases]]
binding = "DB"
database_name = "notes-database"
database_id = "0401829d-c3dd-4c2f-93cd-88f67677a1ed"
```

This is automatically used when you deploy.

## How API Routes Work in Production

### Local Development:
```
http://localhost:4200/api/users → Proxy → http://localhost:8788/api/users
```

### Production:
```
https://your-site.pages.dev/api/users → Cloudflare Function
```

The routing is automatic! Your code doesn't need to change.

## Project Structure for Cloudflare Pages

```
notes/
├── www/                      # Built Angular app (static files)
│   ├── index.html
│   ├── *.js, *.css
│   └── _routes.json         # Tells Cloudflare which routes are Functions
├── functions/               # Cloudflare Functions (API endpoints)
│   └── api/
│       ├── users.ts         # GET/POST /api/users
│       └── notes/
│           └── [userId].ts  # GET/POST /api/notes/:userId
├── wrangler.toml           # D1 binding configuration
└── schema.sql              # Database schema
```

## Important Files

### _routes.json
```json
{
  "version": 1,
  "include": [
    "/api/*"
  ],
  "exclude": [
    "/*"
  ]
}
```

This tells Cloudflare:
- Include `/api/*` as Functions
- Exclude everything else (serve as static)

### wrangler.toml
```toml
[[d1_databases]]
binding = "DB"
database_name = "notes-database"
database_id = "0401829d-c3dd-4c2f-93cd-88f67677a1ed"
```

This binds your D1 database to the Functions.

## Verify Deployment

1. **Test the static site:**
```bash
curl https://your-site.pages.dev
```

2. **Test API endpoints:**
```bash
# Get all users
curl https://your-site.pages.dev/api/users

# Create a user
curl -X POST https://your-site.pages.dev/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

3. **Check D1 data:**
```bash
npx wrangler d1 execute notes-database \
  --command "SELECT * FROM users" \
  --remote
```

## Troubleshooting

### Issue: "DB is not defined" in production
**Solution**: Make sure D1 is bound in Pages settings:
- Pages project → Settings → Functions → D1 database bindings
- Variable name must be exactly `DB`

### Issue: API routes return 404
**Solution**:
1. Check that `_routes.json` is in the `www/` folder after build
2. Verify Functions are in `functions/api/` directory
3. Redeploy the project

### Issue: CORS errors
**Solution**: The Functions already include CORS headers. If you still see errors, check browser console for the actual error.

### Issue: Old data showing
**Solution**:
- Cloudflare Pages has aggressive caching
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or use incognito mode

## Environment Variables

If you need different API URLs or settings:

1. **Add in Cloudflare Pages:**
   - Settings → Environment variables
   - Add variables for Production and Preview

2. **Access in Functions:**
```typescript
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.API_KEY; // Environment variable
  const db = context.env.DB;          // D1 binding
  // ...
}
```

## Continuous Deployment

Once set up with Git integration:

1. Make changes locally
2. Commit and push to GitHub
3. Cloudflare automatically:
   - Runs `npm run build`
   - Deploys to a preview URL
   - After merge to main, deploys to production

## Custom Domain

1. Go to your Pages project → Custom domains
2. Add your domain
3. Update DNS records as instructed
4. SSL is automatic with Cloudflare
