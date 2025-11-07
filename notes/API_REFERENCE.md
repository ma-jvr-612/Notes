# API Reference - Firebase Integration

## Overview

This application uses Firebase for authentication and data storage. All API operations are handled through the `ApiService` which uses:

- **Firebase Authentication** for user login/registration
- **Firestore Database** for storing users, notes, and blueprints

No backend API endpoints are needed - Firebase SDK handles all operations directly from the client.

---

## Authentication

### Register User

**Method:**
```typescript
await apiService.registerUser(email: string, password: string, name: string): Promise<User>
```

**Description:** Creates a new user account with Firebase Authentication and stores user profile in Firestore.

**Example:**
```typescript
try {
  const user = await this.apiService.registerUser(
    'user@example.com',
    'password123',
    'John Doe'
  );
  console.log('User registered:', user);
  localStorage.setItem('userId', user.id);
} catch (error) {
  console.error('Registration failed:', error);
}
```

**Returns:**
```typescript
{
  id: "firebase-user-uid",
  email: "user@example.com",
  name: "John Doe",
  created_at: Date,
  updated_at: Date
}
```

**Errors:**
- `auth/email-already-in-use` - Email is already registered
- `auth/weak-password` - Password is less than 6 characters
- `auth/invalid-email` - Email format is invalid

---

### Login User

**Method:**
```typescript
await apiService.loginUser(email: string, password: string): Promise<User>
```

**Description:** Authenticates user with Firebase Authentication and retrieves user profile from Firestore.

**Example:**
```typescript
try {
  const user = await this.apiService.loginUser(
    'user@example.com',
    'password123'
  );
  console.log('User logged in:', user);
  localStorage.setItem('userId', user.id);
} catch (error) {
  console.error('Login failed:', error);
}
```

**Returns:**
```typescript
{
  id: "firebase-user-uid",
  email: "user@example.com",
  name: "John Doe",
  created_at: Date,
  updated_at: Date
}
```

**Errors:**
- `auth/user-not-found` - No user with this email
- `auth/wrong-password` - Incorrect password
- `auth/invalid-email` - Email format is invalid

---

### Logout User

**Method:**
```typescript
await apiService.logoutUser(): Promise<void>
```

**Description:** Signs out the current user from Firebase Authentication.

**Example:**
```typescript
try {
  await this.apiService.logoutUser();
  localStorage.clear();
} catch (error) {
  console.error('Logout failed:', error);
}
```

---

### Get Current User

**Method:**
```typescript
apiService.getCurrentUser(): FirebaseUser | null
```

**Description:** Gets the currently authenticated Firebase user (synchronous).

**Example:**
```typescript
const currentUser = this.apiService.getCurrentUser();
if (currentUser) {
  console.log('Logged in as:', currentUser.email);
}
```

---

### Get User Profile

**Method:**
```typescript
await apiService.getUser(userId: string): Promise<User | null>
```

**Description:** Retrieves a user profile from Firestore by user ID.

**Example:**
```typescript
const userId = localStorage.getItem('userId');
const user = await this.apiService.getUser(userId);
console.log('User profile:', user);
```

---

### Get All Users

**Method:**
```typescript
await apiService.getUsers(): Promise<User[]>
```

**Description:** Retrieves all user profiles from Firestore (ordered by creation date).

**Example:**
```typescript
const users = await this.apiService.getUsers();
console.log('All users:', users);
```

**Note:** In production, you should restrict this with Firestore security rules.

---

## Notes API

### Get Notes for User

**Method:**
```typescript
await apiService.getNotes(userId: string): Promise<Note[]>
```

**Description:** Retrieves all notes for a specific user (ordered by update date).

**Example:**
```typescript
const userId = localStorage.getItem('userId');
const notes = await this.apiService.getNotes(userId);
console.log('User notes:', notes);
```

**Returns:**
```typescript
[
  {
    id: "note-doc-id",
    user_id: "firebase-user-uid",
    title: "My Note",
    content: "Note content here",
    created_at: Date,
    updated_at: Date
  }
]
```

---

### Create Note

**Method:**
```typescript
await apiService.createNote(userId: string, title: string, content: string): Promise<string>
```

**Description:** Creates a new note for the specified user.

**Example:**
```typescript
const userId = localStorage.getItem('userId');
const noteId = await this.apiService.createNote(
  userId,
  'My Note Title',
  'Note content here'
);
console.log('Created note:', noteId);
```

**Returns:** The document ID of the newly created note.

---

### Update Note

**Method:**
```typescript
await apiService.updateNote(noteId: string, title: string, content: string): Promise<void>
```

**Description:** Updates an existing note's title and content.

**Example:**
```typescript
await this.apiService.updateNote(
  'note-doc-id',
  'Updated Title',
  'Updated content'
);
console.log('Note updated');
```

---

### Delete Note

**Method:**
```typescript
await apiService.deleteNote(noteId: string): Promise<void>
```

**Description:** Deletes a note by its document ID.

**Example:**
```typescript
await this.apiService.deleteNote('note-doc-id');
console.log('Note deleted');
```

---

## Blueprints API

### Get Blueprints for User

**Method:**
```typescript
await apiService.getBlueprints(userId: string): Promise<Blueprint[]>
```

**Description:** Retrieves all blueprints for a specific user (ordered by update date).

**Example:**
```typescript
const userId = localStorage.getItem('userId');
const blueprints = await this.apiService.getBlueprints(userId);
console.log('User blueprints:', blueprints);
```

**Returns:**
```typescript
[
  {
    id: "blueprint-doc-id",
    user_id: "firebase-user-uid",
    title: "My Blueprint",
    content: "Blueprint content here",
    created_at: Date,
    updated_at: Date
  }
]
```

---

### Create Blueprint

**Method:**
```typescript
await apiService.createBlueprint(userId: string, title: string, content: string): Promise<string>
```

**Description:** Creates a new blueprint for the specified user.

**Example:**
```typescript
const userId = localStorage.getItem('userId');
const blueprintId = await this.apiService.createBlueprint(
  userId,
  'My Blueprint Title',
  'Blueprint content here'
);
console.log('Created blueprint:', blueprintId);
```

**Returns:** The document ID of the newly created blueprint.

---

### Update Blueprint

**Method:**
```typescript
await apiService.updateBlueprint(blueprintId: string, title: string, content: string): Promise<void>
```

**Description:** Updates an existing blueprint's title and content.

**Example:**
```typescript
await this.apiService.updateBlueprint(
  'blueprint-doc-id',
  'Updated Title',
  'Updated content'
);
console.log('Blueprint updated');
```

---

### Delete Blueprint

**Method:**
```typescript
await apiService.deleteBlueprint(blueprintId: string): Promise<void>
```

**Description:** Deletes a blueprint by its document ID.

**Example:**
```typescript
await this.apiService.deleteBlueprint('blueprint-doc-id');
console.log('Blueprint deleted');
```

---

## Data Models

### User

```typescript
interface User {
  id: string;           // Firebase Auth UID
  email: string;        // User's email address
  name: string;         // Display name
  created_at: Date;     // Account creation timestamp
  updated_at: Date;     // Last update timestamp
}
```

### Note

```typescript
interface Note {
  id: string;           // Firestore document ID
  user_id: string;      // Owner's Firebase Auth UID
  title: string;        // Note title
  content: string;      // Note content (markdown supported)
  created_at: Date;     // Creation timestamp
  updated_at: Date;     // Last update timestamp
}
```

### Blueprint

```typescript
interface Blueprint {
  id: string;           // Firestore document ID
  user_id: string;      // Owner's Firebase Auth UID
  title: string;        // Blueprint title
  content: string;      // Blueprint content
  created_at: Date;     // Creation timestamp
  updated_at: Date;     // Last update timestamp
}
```

---

## Error Handling

All API methods return Promises and can throw errors. Always use try-catch blocks:

```typescript
try {
  const result = await this.apiService.someMethod();
  // Handle success
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error
}
```

### Common Firebase Errors

**Authentication Errors:**
- `auth/email-already-in-use`
- `auth/weak-password`
- `auth/invalid-email`
- `auth/user-not-found`
- `auth/wrong-password`
- `auth/too-many-requests`

**Firestore Errors:**
- `permission-denied` - Security rules blocking access
- `not-found` - Document doesn't exist
- `already-exists` - Document already exists
- `unavailable` - Network error or service unavailable

---

## Security

### Authentication Required

All Firestore operations require the user to be authenticated. Check authentication before making API calls:

```typescript
const currentUser = this.apiService.getCurrentUser();
if (!currentUser) {
  // Redirect to login
  return;
}
```

### Firestore Security Rules

The application uses Firestore security rules to ensure:
- Users can only read/write their own profile
- Users can only access their own notes and blueprints
- All operations require authentication

See `FIREBASE_SETUP.md` for details on security rules.

---

## Migration from D1

This application previously used Cloudflare D1 database. The following changes were made:

1. **Authentication**: Now using Firebase Auth instead of custom implementation
2. **Data Storage**: Firestore instead of SQL database
3. **API Calls**: Direct Firebase SDK calls instead of HTTP endpoints
4. **Data Types**: Document IDs are strings instead of integers
5. **Timestamps**: Using Firestore timestamps instead of ISO strings

### Breaking Changes

- User IDs changed from `number` to `string`
- Note IDs changed from `number` to `string`
- Blueprint IDs changed from `number` to `string`
- API calls changed from Observable (RxJS) to Promise (async/await)
- Removed HTTP endpoints (`/api/users`, `/api/notes`, etc.)

---

## Development Setup

1. Configure Firebase in `src/environments/environment.ts`
2. Run development server: `npm start`
3. App will be available at `http://localhost:4200`

See `FIREBASE_SETUP.md` for complete setup instructions.
