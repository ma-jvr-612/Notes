# Deployment Guide

This guide covers how to deploy your Notes application with Firebase backend.

## Overview

The application uses:
- **Firebase Authentication** for user management
- **Firestore Database** for data storage
- **Static hosting** for the Angular application (Firebase Hosting, Cloudflare Pages, Netlify, Vercel, etc.)

Since Firebase is a backend-as-a-service, you only need to:
1. Configure Firebase (already done in development)
2. Build your Angular application
3. Deploy the static files to any hosting provider

---

## Prerequisites

1. Firebase project configured (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
2. Firebase configuration in `src/environments/environment.prod.ts`
3. Node.js and npm installed

---

## Option 1: Firebase Hosting (Recommended)

Firebase Hosting provides fast, secure hosting with CDN, SSL, and seamless integration with Firebase services.

### Step 1: Install Firebase Tools

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Hosting

In your project root:

```bash
firebase init hosting
```

Answer the prompts:
- **Project setup**: Select your existing Firebase project
- **Public directory**: Enter `www` (or `dist/notes` depending on your Angular build output)
- **Configure as single-page app**: Yes
- **Set up automatic builds with GitHub**: Optional (recommended for CI/CD)
- **Overwrite index.html**: No

### Step 4: Update firebase.json

Edit `firebase.json` to configure hosting:

```json
{
  "hosting": {
    "public": "www",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Step 5: Build and Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app will be deployed to: `https://your-project-id.web.app`

### Step 6: Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify and configure DNS

---

## Option 2: Cloudflare Pages

### Step 1: Build Your Application

```bash
npm run build
```

### Step 2: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
3. Click "Create a project"
4. Connect your Git repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `www` (or `dist/notes`)
   - **Root directory**: `/`
6. Add environment variables (if needed)
7. Click "Save and Deploy"

### Step 3: Configure Environment Variables

In Cloudflare Pages dashboard:
1. Go to Settings > Environment variables
2. Add your Firebase config if needed (though it's already in your built files)

Your app will be available at: `https://your-project.pages.dev`

### Step 4: Custom Domain (Optional)

1. Go to Custom domains in Cloudflare Pages
2. Add your domain
3. Follow DNS configuration instructions

---

## Option 3: Netlify

### Step 1: Build Your Application

```bash
npm run build
```

### Step 2: Deploy via Netlify CLI

Install Netlify CLI:
```bash
npm install -g netlify-cli
```

Deploy:
```bash
netlify deploy --prod --dir=www
```

### Step 3: Or Deploy via Git Integration

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [Netlify Dashboard](https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `www`
6. Click "Deploy site"

Your app will be available at: `https://your-site.netlify.app`

---

## Option 4: Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
# Build your app
npm run build

# Deploy with Vercel
vercel --prod
```

Follow the prompts to link your project.

### Step 3: Or Deploy via Git Integration

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your repository
5. Vercel will auto-detect Angular and configure build settings
6. Click "Deploy"

Your app will be available at: `https://your-project.vercel.app`

---

## Option 5: AWS S3 + CloudFront

### Step 1: Build Your Application

```bash
npm run build
```

### Step 2: Create S3 Bucket

1. Go to AWS S3 Console
2. Create a new bucket
3. Enable static website hosting
4. Set bucket policy for public read access

### Step 3: Upload Files

Upload the contents of your `www` folder to the S3 bucket.

### Step 4: Configure CloudFront (Optional but Recommended)

1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure SSL certificate
4. Set up custom error pages to redirect to index.html

---

## Environment Configuration

### Production Firebase Config

Make sure your `src/environments/environment.prod.ts` has the correct Firebase configuration:

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_PRODUCTION_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};
```

### Build Configuration

The build process uses `environment.prod.ts` automatically:

```bash
npm run build
# Or explicitly:
ng build --configuration production
```

---

## Security Checklist Before Production

### 1. Firestore Security Rules

Replace test mode rules with production rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /notes/{noteId} {
      allow read, write: if request.auth != null &&
                          resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null &&
                     request.resource.data.user_id == request.auth.uid;
    }

    match /blueprints/{blueprintId} {
      allow read, write: if request.auth != null &&
                          resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null &&
                     request.resource.data.user_id == request.auth.uid;
    }
  }
}
```

### 2. Firebase Authentication Settings

1. Enable only the sign-in methods you need
2. Configure authorized domains in Firebase Console
3. Set up email templates for verification/password reset

### 3. Environment Variables

- Never commit Firebase config with sensitive keys to public repositories
- Use environment variables for sensitive data
- Consider using Angular's environment replacement feature

### 4. HTTPS Only

- All hosting providers listed above provide SSL/HTTPS by default
- Ensure your app only runs over HTTPS

### 5. Content Security Policy (Optional)

Add CSP headers to your hosting configuration for additional security.

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example (Firebase Hosting)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### Cloudflare Pages

Cloudflare Pages automatically deploys on git push - no configuration needed!

### Netlify

Netlify also automatically deploys on git push after initial setup.

---

## Performance Optimization

### 1. Enable Production Mode

Angular's production build automatically:
- Minifies code
- Removes development code
- Enables Ahead-of-Time (AOT) compilation
- Optimizes bundle sizes

### 2. Lazy Loading

Consider implementing lazy loading for routes to reduce initial bundle size.

### 3. CDN Caching

All recommended hosting providers include CDN with automatic caching.

### 4. Firebase Performance Monitoring (Optional)

Add Firebase Performance Monitoring to track real-world performance:

```bash
npm install @angular/fire
```

Configure in your app initialization.

---

## Monitoring and Analytics

### Firebase Analytics

Enable Firebase Analytics in your Firebase Console to track:
- User engagement
- Screen views
- Custom events
- Crash reporting

### Firebase Crashlytics

Monitor app crashes and errors in production.

### Custom Monitoring

Consider adding:
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, DataDog)
- User analytics (Google Analytics, Mixpanel)

---

## Rollback Strategy

### Firebase Hosting

View and rollback to previous deployments:

```bash
# List previous deployments
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:clone source-site-id:channel target-site-id:channel
```

### Cloudflare Pages / Netlify / Vercel

All platforms keep deployment history and allow instant rollback through their dashboards.

---

## Post-Deployment Testing

1. **Authentication Flow**
   - Test user registration
   - Test user login
   - Test logout

2. **CRUD Operations**
   - Create notes and blueprints
   - Read/view notes and blueprints
   - Update existing items
   - Delete items

3. **Security**
   - Verify users can only access their own data
   - Test unauthenticated access is blocked
   - Check HTTPS is enforced

4. **Performance**
   - Check page load times
   - Test on mobile devices
   - Verify CDN is serving assets

5. **Error Handling**
   - Test with invalid credentials
   - Test network error scenarios
   - Check error messages display correctly

---

## Troubleshooting

### Issue: Firebase Config Not Found

Make sure `environment.prod.ts` is properly configured and the build is using production configuration.

### Issue: CORS Errors

Firebase services handle CORS automatically. If you see CORS errors, verify your Firebase configuration is correct.

### Issue: 404 on Page Refresh

Configure your hosting provider to serve `index.html` for all routes (SPA configuration).

### Issue: Authentication Fails in Production

1. Add your production domain to authorized domains in Firebase Console
2. Go to Authentication > Settings > Authorized domains
3. Add your production domain

### Issue: Firestore Permission Denied

Check your Firestore security rules are properly configured and published.

---

## Cost Estimation

### Firebase Free Tier (Spark Plan)

- **Authentication**: Unlimited email/password
- **Firestore**: 1GB storage, 50k reads/day, 20k writes/day
- **Hosting**: 10GB storage, 360MB/day transfer

### When to Upgrade

Consider the Blaze plan (pay-as-you-go) when you exceed free tier limits:
- More than 50k daily Firestore reads
- More than 1GB Firestore storage
- More than 360MB daily hosting transfer

### Hosting Costs

- **Firebase Hosting**: Free tier generous, then $0.026/GB
- **Cloudflare Pages**: Free for unlimited sites
- **Netlify**: Free for personal projects, then $19/month
- **Vercel**: Free for personal projects, then $20/month

---

## Support and Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Angular Deployment Guide](https://angular.dev/tools/cli/deployment)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)

---

## Next Steps

1. Set up custom domain
2. Enable Firebase Analytics
3. Configure error monitoring
4. Set up automated backups
5. Implement rate limiting
6. Add monitoring and alerting
7. Create deployment checklist
8. Document runbook for incidents
