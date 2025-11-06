# Cloudflare D1 Database Setup Guide

## Step 1: Get Your D1 Database ID

1. Go to your Cloudflare dashboard
2. Navigate to **Workers & Pages** → **D1**
3. Find your database name (or create one)
4. Copy the **Database ID**

## Step 2: Apply the Schema

Run this command to create the tables in your D1 database:

```bash
npx wrangler d1 execute notes-database --file=schema.sql --remote
```

Replace `notes-database` with your actual database name if different.

## Step 3: Update wrangler.toml

1. Open `wrangler.toml`
2. Replace `YOUR_DATABASE_ID_HERE` with your actual database ID
3. Update `database_name` if yours is different

```toml
[[d1_databases]]
binding = "DB"
database_name = "notes-database"  # Your database name
database_id = "abc123..."         # Your database ID
```

## Step 4: Bind D1 to Your Cloudflare Pages Project

### Option A: Via Dashboard (Recommended)
1. Go to your Cloudflare Pages project
2. Click **Settings** → **Functions**
3. Scroll to **D1 database bindings**
4. Click **Add binding**
5. Variable name: `DB`
6. D1 database: Select your database
7. Click **Save**

### Option B: Via wrangler CLI
```bash
npx wrangler pages project create notes-app
npx wrangler pages deployment create
```

## Step 5: Local Development

For local testing with D1:

1. Install Wrangler globally:
```bash
npm install -g wrangler
```

2. Create a local D1 database:
```bash
npx wrangler d1 create notes-database --local
npx wrangler d1 execute notes-database --file=schema.sql --local
```

3. Run local development server:
```bash
npx wrangler pages dev www --d1 DB=notes-database
```

Or use the Angular dev server and proxy to Wrangler:
```bash
# Terminal 1: Angular dev server
npm start

# Terminal 2: Wrangler for API functions
npx wrangler pages dev www --port 8788
```

## Step 6: Deploy to Cloudflare Pages

### First Time Setup
```bash
npm run build
npx wrangler pages deploy www --project-name=notes-app
```

### Subsequent Deploys
```bash
npm run build
npx wrangler pages deploy www
```

Or use Git integration:
1. Push to GitHub
2. Cloudflare will automatically build and deploy

## Step 7: Update API URL in Production

In `src/app/services/api.service.ts`, the API URL is set to `/api` which works for both local and production.

For local development with proxy, add to `angular.json`:

```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

Create `proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:8788",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Testing Your Database

### Test user creation:
```bash
curl -X POST https://your-site.pages.dev/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### Test get users:
```bash
curl https://your-site.pages.dev/api/users
```

### Query database directly:
```bash
npx wrangler d1 execute notes-database --command "SELECT * FROM users" --remote
```

## Troubleshooting

### Error: "DB is not defined"
- Make sure you've bound the D1 database in Cloudflare Pages settings
- Check that the binding name is exactly `DB` (case-sensitive)

### Error: "no such table: users"
- Run the schema.sql file: `npx wrangler d1 execute notes-database --file=schema.sql --remote`

### CORS errors in browser
- The API functions include CORS headers (`Access-Control-Allow-Origin: *`)
- If issues persist, check Cloudflare Pages settings

### Local development not working
- Make sure Wrangler is installed: `npm install -g wrangler`
- Run `wrangler login` to authenticate
- Create local DB: `npx wrangler d1 create notes-database --local`

## Next Steps

1. Update notes.service.ts to use ApiService instead of localStorage
2. Update blueprints.service.ts to use ApiService
3. Add authentication (JWT tokens or sessions)
4. Add error handling and loading states
5. Implement offline support with service workers
