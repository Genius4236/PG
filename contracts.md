# Book My PG - API Contracts & Implementation Plan

## Authentication System

### User Roles
- **User**: Can search and book PGs
- **Owner**: Can list and manage PGs

### Auth Endpoints

#### 1. POST /api/auth/signup
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" | "owner",
  "phone": "+91 9876543210"
}
```
**Response:**
```json
{
  "user": { "id", "name", "email", "role" },
  "token": "jwt_token"
}
```

#### 2. POST /api/auth/login
**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "user": { "id", "name", "email", "role" },
  "token": "jwt_token"
}
```

## PG Management (Owner Only)

#### 3. POST /api/pgs (Protected - Owner only)
**Request:** multipart/form-data
```json
{
  "name": "Green Valley PG",
  "city": "Bengaluru",
  "locality": "Koramangala",
  "address": "123, 5th Block",
  "gender": "boys" | "girls",
  "description": "Premium PG...",
  "sharingTypes": [
    { "type": "Single", "price": 12000, "available": true }
  ],
  "amenities": ["WiFi", "AC", ...],
  "images": [file1, file2, ...]
}
```

#### 4. GET /api/pgs
**Query Params:** city, gender, minPrice, maxPrice, locality
**Response:**
```json
{
  "pgs": [{ pg_object }]
}
```

#### 5. GET /api/pgs/:id
**Response:**
```json
{
  "pg": { full_pg_object }
}
```

#### 6. PUT /api/pgs/:id (Protected - Owner only)
Update PG details

#### 7. DELETE /api/pgs/:id (Protected - Owner only)
Delete PG listing

#### 8. GET /api/owner/pgs (Protected - Owner only)
Get all PGs belonging to the owner

## Booking Management

#### 9. POST /api/bookings (Protected - User only)
**Request:**
```json
{
  "pgId": "pg_id",
  "sharingType": "Double",
  "moveInDate": "2024-02-01",
  "duration": 3,
  "totalAmount": 24000,
  "discount": 500
}
```

#### 10. GET /api/user/bookings (Protected - User only)
Get all user bookings

#### 11. GET /api/owner/bookings (Protected - Owner only)
Get all bookings for owner's PGs

## Image Upload
- Use multer for handling multipart/form-data
- Store images in /app/backend/uploads/pgs/
- Return image URLs in responses

## Mock Data to Replace
File: `/app/frontend/src/mock/mockData.js`
- cities: Keep static
- pgs: Replace with API call to GET /api/pgs
- User data: Replace with API authentication
- Bookings: Replace with API calls

## Frontend Integration Changes
1. Create axios API service file
2. Add authentication context for managing user state
3. Replace mock data in:
   - SearchPG.jsx → GET /api/pgs
   - PGDetails.jsx → GET /api/pgs/:id
   - Booking.jsx → POST /api/bookings
   - UserDashboard.jsx → GET /api/user/bookings
   - OwnerDashboard.jsx → GET /api/owner/pgs, POST /api/pgs
4. Add image upload component for PG owners
5. Implement JWT token storage and API authentication

## Database Models

### User Model
```
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: user, owner),
  phone: String,
  createdAt: Date
}
```

### PG Model
```
{
  name: String,
  ownerId: ObjectId (ref: User),
  city: String,
  locality: String,
  address: String,
  gender: String (enum: boys, girls),
  description: String,
  images: [String],
  sharingTypes: [{
    type: String,
    price: Number,
    available: Boolean
  }],
  amenities: [String],
  rating: Number,
  reviews: Number,
  createdAt: Date
}
```

### Booking Model
```
{
  userId: ObjectId (ref: User),
  pgId: ObjectId (ref: PG),
  sharingType: String,
  moveInDate: Date,
  duration: Number,
  monthlyRent: Number,
  securityDeposit: Number,
  discount: Number,
  totalAmount: Number,
  status: String (enum: active, completed, cancelled),
  createdAt: Date
}
```
