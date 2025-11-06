# Local Development Setup

## The Problem
When you run `npx wrangler pages dev www`, it serves static files but doesn't run Angular's dev server, so Ionic components don't work properly.

## The Solution
You need to run TWO servers simultaneously:

1. **Angular Dev Server** (port 4200) - Serves your app with hot reload
2. **Wrangler Dev Server** (port 8788) - Provides D1 database API functions

## Option 1: Manual (Two Terminals)

### Terminal 1: Angular Dev Server with Proxy
```bash
npm run dev
```
This runs Angular on `http://localhost:4200` and proxies API calls to port 8788.

### Terminal 2: Wrangler for API Functions
First, make sure you have a local D1 database:
```bash
npx wrangler d1 create notes-database --local
npx wrangler d1 execute notes-database --file=schema.sql --local
```

Then start Wrangler:
```bash
npm run wrangler:dev
```

### Access Your App
Open `http://localhost:4200` in your browser.

- Angular serves your app with hot reload
- API calls to `/api/*` are proxied to Wrangler on port 8788
- Wrangler provides access to your local D1 database

## Option 2: Production Preview (Test Exactly Like Cloudflare)

⚠️ **Note**: Due to how Wrangler serves files locally, some Ionic lazy-loaded components (modals, searchbars) may not load correctly in preview mode. **Use Option 1 for development**. Only use this to verify the production build works.

If you want to test the production build locally (same as it will run on Cloudflare Pages):

### One Command:
```bash
npm run preview
```

This will:
1. Build the Angular app (`npm run build`)
2. Start Wrangler with D1 (`npx wrangler pages dev www`)
3. Serve everything on `http://localhost:8788`

The `_routes.json` file is automatically copied during build, so:
- Static files are served normally
- `/api/*` routes run as Functions with D1 access

### What Works vs What Doesn't:

✅ **Works in Preview:**
- Static pages
- Basic routing
- API calls to D1 database
- Most Ionic components

❌ **May Not Work in Preview:**
- Lazy-loaded Ionic components (modals, popovers, searchbars)
- Hot module replacement
- Some dynamic imports

### For Full Testing:
Either:
1. **Use Option 1** (development mode with proxy) - Everything works
2. **Deploy to Cloudflare Pages** - Everything works in production

Wrangler's local dev server has limitations with lazy-loading that don't exist in production.

## How the Proxy Works

The `proxy.conf.json` file tells Angular's dev server to forward all `/api/*` requests to Wrangler:

```json
{
  "/api": {
    "target": "http://localhost:8788",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Common Issues

### Issue: "Cannot find module 'wrangler'"
**Solution**: Install wrangler globally:
```bash
npm install -g wrangler
```

### Issue: "DB is not defined"
**Solution**: Make sure you're using the local D1 database:
```bash
npx wrangler d1 create notes-database --local
npx wrangler d1 execute notes-database --file=schema.sql --local
```

### Issue: "CORS errors"
**Solution**: The API functions already include CORS headers. Make sure both servers are running.

### Issue: "API calls return 404"
**Solution**: Check that:
1. Wrangler is running on port 8788
2. The proxy configuration is correct
3. API endpoints are in the `functions/api/` directory

## Testing the API

### Test user creation:
```bash
curl -X POST http://localhost:8788/api/users \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"name\":\"Test User\"}"
```

### Test get users:
```bash
curl http://localhost:8788/api/users
```

### Query database directly:
```bash
npx wrangler d1 execute notes-database --command "SELECT * FROM users" --local
```

## Deployment

When you're ready to deploy:

1. Build the app:
```bash
npm run build
```

2. Deploy to Cloudflare Pages:
```bash
npx wrangler pages deploy www
```

Or use Git integration - just push to your repository and Cloudflare will automatically build and deploy.
