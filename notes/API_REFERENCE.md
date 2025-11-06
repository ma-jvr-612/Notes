# API Reference - D1 Database Endpoints

## Base URL

- **Local Development**: `http://localhost:4200/api` (proxied to port 8788)
- **Production**: `https://your-site.pages.dev/api`

All API calls are automatically routed to Cloudflare Functions with D1 database access.

---

## Users API

### Get All Users
```http
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2025-01-06T10:00:00Z",
      "updated_at": "2025-01-06T10:00:00Z"
    }
  ]
}
```

**Angular Service Call:**
```typescript
this.apiService.getUsers().subscribe({
  next: (response) => console.log(response.users),
  error: (error) => console.error(error)
});
```

### Create User
```http
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Angular Service Call:**
```typescript
this.apiService.createUser('user@example.com', 'John Doe').subscribe({
  next: (response) => console.log(response.user),
  error: (error) => console.error(error)
});
```

---

## Notes API

### Get User's Notes
```http
GET /api/notes/{userId}
```

**Parameters:**
- `userId` (path parameter): The user ID

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": 1,
      "user_id": 1,
      "title": "My Note",
      "content": "Note content here",
      "created_at": "2025-01-06T10:00:00Z",
      "updated_at": "2025-01-06T10:00:00Z"
    }
  ]
}
```

**Angular Service Call:**
```typescript
const userId = 1;
this.apiService.getNotes(userId).subscribe({
  next: (response) => console.log(response.notes),
  error: (error) => console.error(error)
});
```

### Create Note
```http
POST /api/notes/{userId}
Content-Type: application/json
```

**Parameters:**
- `userId` (path parameter): The user ID

**Request Body:**
```json
{
  "title": "My Note",
  "content": "Note content here"
}
```

**Response:**
```json
{
  "success": true,
  "note": {
    "id": 1,
    "user_id": 1,
    "title": "My Note",
    "content": "Note content here"
  }
}
```

**Angular Service Call:**
```typescript
const userId = 1;
this.apiService.createNote(userId, 'My Note', 'Content').subscribe({
  next: (response) => console.log(response.note),
  error: (error) => console.error(error)
});
```

### Update Note
```http
PUT /api/notes/{noteId}
Content-Type: application/json
```

**Parameters:**
- `noteId` (path parameter): The note ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Angular Service Call:**
```typescript
const noteId = 1;
this.apiService.updateNote(noteId, 'Updated Title', 'Updated content').subscribe({
  next: (response) => console.log(response),
  error: (error) => console.error(error)
});
```

### Delete Note
```http
DELETE /api/notes/{noteId}
```

**Parameters:**
- `noteId` (path parameter): The note ID

**Angular Service Call:**
```typescript
const noteId = 1;
this.apiService.deleteNote(noteId).subscribe({
  next: (response) => console.log('Deleted'),
  error: (error) => console.error(error)
});
```

---

## Blueprints API

### Get User's Blueprints
```http
GET /api/blueprints/{userId}
```

**Parameters:**
- `userId` (path parameter): The user ID

**Response:**
```json
{
  "success": true,
  "blueprints": [
    {
      "id": 1,
      "user_id": 1,
      "title": "My Blueprint",
      "content": "Blueprint content here",
      "created_at": "2025-01-06T10:00:00Z",
      "updated_at": "2025-01-06T10:00:00Z"
    }
  ]
}
```

**Angular Service Call:**
```typescript
const userId = 1;
this.apiService.getBlueprints(userId).subscribe({
  next: (response) => console.log(response.blueprints),
  error: (error) => console.error(error)
});
```

### Create Blueprint
```http
POST /api/blueprints/{userId}
Content-Type: application/json
```

**Parameters:**
- `userId` (path parameter): The user ID

**Request Body:**
```json
{
  "title": "My Blueprint",
  "content": "Blueprint content here"
}
```

**Response:**
```json
{
  "success": true,
  "blueprint": {
    "id": 1,
    "user_id": 1,
    "title": "My Blueprint",
    "content": "Blueprint content here"
  }
}
```

**Angular Service Call:**
```typescript
const userId = 1;
this.apiService.createBlueprint(userId, 'My Blueprint', 'Content').subscribe({
  next: (response) => console.log(response.blueprint),
  error: (error) => console.error(error)
});
```

### Update Blueprint
```http
PUT /api/blueprints/{blueprintId}
Content-Type: application/json
```

**Parameters:**
- `blueprintId` (path parameter): The blueprint ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Angular Service Call:**
```typescript
const blueprintId = 1;
this.apiService.updateBlueprint(blueprintId, 'Updated Title', 'Updated content').subscribe({
  next: (response) => console.log(response),
  error: (error) => console.error(error)
});
```

### Delete Blueprint
```http
DELETE /api/blueprints/{blueprintId}
```

**Parameters:**
- `blueprintId` (path parameter): The blueprint ID

**Angular Service Call:**
```typescript
const blueprintId = 1;
this.apiService.deleteBlueprint(blueprintId).subscribe({
  next: (response) => console.log('Deleted'),
  error: (error) => console.error(error)
});
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `500` - Server Error (database error, etc.)

---

## CORS Headers

All API endpoints include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Testing with cURL

### Get all users:
```bash
curl http://localhost:8788/api/users
```

### Create a user:
```bash
curl -X POST http://localhost:8788/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### Get user's notes:
```bash
curl http://localhost:8788/api/notes/1
```

### Create a note:
```bash
curl -X POST http://localhost:8788/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content"}'
```

---

## Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| email | TEXT | User email (unique) |
| name | TEXT | User name |
| created_at | TEXT | ISO 8601 timestamp |
| updated_at | TEXT | ISO 8601 timestamp |

### notes
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| user_id | INTEGER | Foreign key → users(id) |
| title | TEXT | Note title |
| content | TEXT | Note content (markdown) |
| created_at | TEXT | ISO 8601 timestamp |
| updated_at | TEXT | ISO 8601 timestamp |

### blueprints
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (auto-increment) |
| user_id | INTEGER | Foreign key → users(id) |
| title | TEXT | Blueprint title |
| content | TEXT | Blueprint content (markdown) |
| created_at | TEXT | ISO 8601 timestamp |
| updated_at | TEXT | ISO 8601 timestamp |

---

## Direct Database Queries

You can also query the database directly using Wrangler:

### Local database:
```bash
npx wrangler d1 execute notes-database --command "SELECT * FROM users" --local
```

### Production database:
```bash
npx wrangler d1 execute notes-database --command "SELECT * FROM users" --remote
```

---

## ApiService Quick Reference

The `ApiService` is located at `src/app/services/api.service.ts` and provides these methods:

```typescript
// Users
getUsers(): Observable<any>
createUser(email: string, name: string): Observable<any>

// Notes
getNotes(userId: number): Observable<any>
createNote(userId: number, title: string, content: string): Observable<any>
updateNote(noteId: number, title: string, content: string): Observable<any>
deleteNote(noteId: number): Observable<any>

// Blueprints
getBlueprints(userId: number): Observable<any>
createBlueprint(userId: number, title: string, content: string): Observable<any>
updateBlueprint(blueprintId: number, title: string, content: string): Observable<any>
deleteBlueprint(blueprintId: number): Observable<any>
```

Import it in your component:
```typescript
import { ApiService } from '../services/api.service';

constructor(private apiService: ApiService) {}
```

---

## Missing Endpoints (TODO)

These endpoints need to be created if you want full CRUD functionality:

- `GET /api/notes/:noteId` - Get single note by ID
- `GET /api/blueprints/:blueprintId` - Get single blueprint by ID
- `PUT /api/notes/:noteId` - Update note
- `DELETE /api/notes/:noteId` - Delete note
- `PUT /api/blueprints/:blueprintId` - Update blueprint
- `DELETE /api/blueprints/:blueprintId` - Delete blueprint
- `GET /api/users/:email` - Get user by email (for login)

Would you like me to implement any of these missing endpoints?
