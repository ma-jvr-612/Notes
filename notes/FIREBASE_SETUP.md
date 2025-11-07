# Firebase Setup Guide

This guide will help you set up Firebase for your Notes application.

## Prerequisites

- A Google account
- Node.js and npm installed
- The Notes application code

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "Notes App")
4. (Optional) Enable Google Analytics for your project
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web** icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "Notes Web App")
3. (Optional) Check "Also set up Firebase Hosting" if you want to host on Firebase
4. Click "Register app"
5. **Copy the Firebase configuration object** - you'll need this in Step 5

The configuration should look like this:

```javascript
{
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
}
```

## Step 3: Enable Authentication

1. In the Firebase Console, click **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Click on **Email/Password**
5. Enable **Email/Password** (first toggle)
6. Click **Save**

## Step 4: Enable Firestore Database

1. In the Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - **Important:** You'll update security rules later for production
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **Enable**

## Step 5: Update Your App Configuration

Update the Firebase configuration in both environment files:

### Development Environment

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};
```

### Production Environment

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};
```

**Note:** Replace all the placeholder values with your actual Firebase configuration from Step 2.

## Step 6: Set Up Firestore Security Rules

For development, the test mode rules allow unrestricted access. For production, you should implement proper security rules.

### Development Rules (already set from test mode)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 3, 1);
    }
  }
}
```

### Production Rules (recommended)

Go to **Firestore Database > Rules** in the Firebase Console and update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only access their own notes
    match /notes/{noteId} {
      allow read, write: if request.auth != null &&
                          resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null &&
                     request.resource.data.user_id == request.auth.uid;
    }

    // Users can only access their own blueprints
    match /blueprints/{blueprintId} {
      allow read, write: if request.auth != null &&
                          resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null &&
                     request.resource.data.user_id == request.auth.uid;
    }
  }
}
```

Click **Publish** to save the rules.

## Step 7: Create Firestore Indexes (Optional but Recommended)

For better query performance, create indexes for your collections:

1. Go to **Firestore Database > Indexes** in the Firebase Console
2. Click **Create index**

### For Notes Collection:

- Collection ID: `notes`
- Fields to index:
  - `user_id` - Ascending
  - `updated_at` - Descending
- Query scope: Collection

### For Blueprints Collection:

- Collection ID: `blueprints`
- Fields to index:
  - `user_id` - Ascending
  - `updated_at` - Descending
- Query scope: Collection

**Note:** Firebase may automatically suggest these indexes when you first run queries. You can also create them when prompted.

## Step 8: Test Your Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Open the app in your browser (usually http://localhost:4200)

3. Click on the login/register button

4. Try registering a new user with:
   - Email address
   - Password (minimum 6 characters)
   - Nickname

5. Check the Firebase Console:
   - Go to **Authentication > Users** to see your registered user
   - Go to **Firestore Database > Data** to see the user profile document

## Data Structure

Your Firestore database will have the following collections:

### Users Collection (`users`)

```
users/{userId}
  - email: string
  - name: string
  - created_at: timestamp
  - updated_at: timestamp
```

### Notes Collection (`notes`)

```
notes/{noteId}
  - user_id: string
  - title: string
  - content: string
  - created_at: timestamp
  - updated_at: timestamp
```

### Blueprints Collection (`blueprints`)

```
blueprints/{blueprintId}
  - user_id: string
  - title: string
  - content: string
  - created_at: timestamp
  - updated_at: timestamp
```

## Troubleshooting

### Error: "Firebase: Error (auth/email-already-in-use)"

This means the email address is already registered. Try logging in instead of registering.

### Error: "Firebase: Error (auth/weak-password)"

Firebase requires passwords to be at least 6 characters long.

### Error: "Firebase: Error (auth/invalid-email)"

Make sure you're entering a valid email address format.

### Error: "Missing or insufficient permissions"

This means your Firestore security rules are blocking the request. Make sure:
1. The user is authenticated
2. The security rules allow the operation
3. The `user_id` field matches the authenticated user's ID

### Cannot read from Firestore

Check that:
1. Firestore is enabled in your Firebase project
2. Your security rules allow reading
3. The collection/document exists
4. The indexes are created (check Console for suggestions)

## Additional Firebase Features

You can extend your app with additional Firebase features:

- **Firebase Storage**: Store images and files
- **Firebase Cloud Functions**: Run backend code
- **Firebase Hosting**: Host your web app
- **Firebase Analytics**: Track user behavior
- **Cloud Messaging**: Send push notifications

## Security Best Practices

1. **Never commit your Firebase config to public repositories** - Consider using environment variables for sensitive data
2. **Always use security rules** - Never leave your database in test mode in production
3. **Implement proper authentication** - Validate user identity before allowing operations
4. **Use HTTPS only** - Firebase enforces this by default
5. **Monitor usage** - Check Firebase Console regularly for unusual activity
6. **Set up billing alerts** - To avoid unexpected charges if you exceed free tier limits

## Free Tier Limits

Firebase offers a generous free tier:

- **Authentication**: 10,000 phone auth/month (email/password unlimited)
- **Firestore**:
  - 1 GB storage
  - 10 GB/month network egress
  - 50,000 document reads/day
  - 20,000 document writes/day
  - 20,000 document deletes/day
- **Hosting**: 10 GB storage, 360 MB/day transfer

For most development and small projects, this should be sufficient.

## Next Steps

- Implement password reset functionality
- Add email verification
- Set up Firebase Hosting for deployment
- Implement real-time data synchronization
- Add offline support with Firestore persistence

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [AngularFire Documentation](https://github.com/angular/angularfire)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
