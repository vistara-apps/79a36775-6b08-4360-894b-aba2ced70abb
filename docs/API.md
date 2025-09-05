# GigFlow API Documentation

This document provides comprehensive documentation for the GigFlow Base MiniApp API endpoints.

## Base URL
```
https://your-domain.com/api
```

## Authentication
Most endpoints require authentication via Farcaster ID or wallet address. Include the user identifier in request headers or query parameters as specified.

## Endpoints

### Gigs API

#### GET /api/gigs
Retrieve curated gigs with filtering and pagination.

**Query Parameters:**
- `category` (optional): Filter by gig category (e.g., "Writing & Content", "Digital Marketing")
- `skills` (optional): Comma-separated list of skills to filter by
- `search` (optional): Search term for title and description
- `limit` (optional): Number of results per page (default: 20, max: 100)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "gigs": [
    {
      "gigId": "uuid",
      "title": "Content Writer for Tech Blog",
      "description": "Looking for experienced content writers...",
      "url": "https://example.com/gig1",
      "source": "Upwork",
      "category": "Writing & Content",
      "payRate": "$25-35/hour",
      "vetted": true,
      "postedDate": "2024-01-15T00:00:00Z",
      "skills": ["Content Writing", "SEO", "Research"],
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

#### POST /api/gigs
Create a new gig (admin only).

**Request Body:**
```json
{
  "title": "New Gig Title",
  "description": "Detailed description of the gig",
  "url": "https://example.com/gig",
  "source": "Platform Name",
  "category": "Category Name",
  "payRate": "$20-30/hour",
  "skills": ["Skill1", "Skill2"]
}
```

**Response:**
```json
{
  "gig": {
    "gigId": "uuid",
    "title": "New Gig Title",
    // ... other gig fields
    "vetted": false
  }
}
```

### Skill Guides API

#### GET /api/guides
Retrieve skill guides with filtering.

**Query Parameters:**
- `skillTag` (optional): Filter by skill tag
- `search` (optional): Search term for title, content, and skill tag
- `isPremium` (optional): Filter by premium status (true/false)
- `difficulty` (optional): Filter by difficulty level (Beginner/Intermediate/Advanced)
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "guides": [
    {
      "guideId": "uuid",
      "title": "Getting Started with Content Writing",
      "content": "Learn the fundamentals of content writing...",
      "skillTag": "Content Writing",
      "price": 0,
      "isPremium": false,
      "estimatedTime": "2 hours",
      "difficulty": "Beginner",
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

#### POST /api/guides
Create a new skill guide (admin only).

**Request Body:**
```json
{
  "title": "Guide Title",
  "content": "Guide content...",
  "skillTag": "Skill Name",
  "price": 1.99,
  "isPremium": true,
  "estimatedTime": "3 hours",
  "difficulty": "Intermediate"
}
```

### Users API

#### GET /api/users
Retrieve user data by Farcaster ID or wallet address.

**Query Parameters:**
- `farcasterId` (optional): Farcaster ID of the user
- `walletAddress` (optional): Wallet address of the user

**Response:**
```json
{
  "user": {
    "userId": "uuid",
    "farcasterId": "12345",
    "walletAddress": "0x...",
    "savedGigs": ["gig-uuid-1", "gig-uuid-2"],
    "completedModules": ["guide-uuid-1"],
    "purchasedContent": ["guide-uuid-2"],
    "createdAt": "2024-01-15T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

#### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "farcasterId": "12345",
  "walletAddress": "0x..."
}
```

#### PATCH /api/users
Update user data.

**Request Body:**
```json
{
  "userId": "uuid",
  "savedGigs": ["gig-uuid-1", "gig-uuid-2"],
  "completedModules": ["guide-uuid-1"],
  "purchasedContent": ["guide-uuid-2"]
}
```

### Payments API

#### POST /api/payments
Process a payment for premium content.

**Request Body:**
```json
{
  "userId": "uuid",
  "guideId": "uuid",
  "paymentMethod": "crypto", // or "fiat"
  "amount": 1.99
}
```

**Response:**
```json
{
  "success": true,
  "purchase": {
    "purchaseId": "uuid",
    "userId": "uuid",
    "guideId": "uuid",
    "amount": 1.99,
    "paymentMethod": "crypto",
    "transactionId": "crypto_1234567890_abcdef",
    "status": "completed",
    "purchaseDate": "2024-01-15T00:00:00Z"
  },
  "transactionId": "crypto_1234567890_abcdef"
}
```

#### GET /api/payments
Get payment history for a user.

**Query Parameters:**
- `userId` (required): User ID to get payment history for

**Response:**
```json
{
  "purchases": [
    {
      "purchaseId": "uuid",
      "userId": "uuid",
      "guideId": "uuid",
      "amount": 1.99,
      "paymentMethod": "crypto",
      "transactionId": "crypto_1234567890_abcdef",
      "status": "completed",
      "purchaseDate": "2024-01-15T00:00:00Z",
      "skill_guides": {
        "title": "Advanced SEO Strategies",
        "skillTag": "SEO",
        "price": 1.99
      }
    }
  ]
}
```

### Pitch Generation API

#### POST /api/pitch/generate
Generate a personalized pitch using AI.

**Request Body:**
```json
{
  "skillTag": "Content Writing",
  "experience": "Intermediate",
  "skills": ["Content Writing", "SEO", "Research"],
  "projectType": "Blog Writing",
  "userInput": "I specialize in tech content and have worked with SaaS companies"
}
```

**Response:**
```json
{
  "pitch": {
    "content": "Generated pitch content...",
    "style": "confident and experienced",
    "generatedAt": "2024-01-15T00:00:00Z",
    "wordCount": 150
  },
  "templates": [
    {
      "templateId": "uuid",
      "title": "Content Writer Pitch",
      "content": "Template content...",
      "skillTag": "Content Writing",
      "category": "Writing & Content"
    }
  ]
}
```

#### GET /api/pitch/generate
Get pitch templates.

**Query Parameters:**
- `skillTag` (optional): Filter by skill tag
- `category` (optional): Filter by category

**Response:**
```json
{
  "templates": [
    {
      "templateId": "uuid",
      "title": "Content Writer Pitch",
      "content": "Template content...",
      "skillTag": "Content Writing",
      "category": "Writing & Content",
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing or invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

## Data Types

### Gig Categories
- "Writing & Content"
- "Digital Marketing"
- "Programming & Tech"
- "Virtual Assistant"
- "Design & Creative"
- "Data & Analytics"

### Payment Methods
- "crypto" - USDC payments on Base network via Privy
- "fiat" - Credit card payments via Stripe

### Difficulty Levels
- "Beginner"
- "Intermediate"
- "Advanced"

### Purchase Status
- "pending" - Payment is being processed
- "completed" - Payment successful, content unlocked
- "failed" - Payment failed
- "refunded" - Payment was refunded

## Integration Examples

### Fetching Gigs with React Query
```typescript
import { useQuery } from '@tanstack/react-query';

const useGigs = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['gigs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category !== 'All') params.set('category', filters.category);
      if (filters.skills.length > 0) params.set('skills', filters.skills.join(','));
      
      const response = await fetch(`/api/gigs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch gigs');
      return response.json();
    }
  });
};
```

### Processing Payments
```typescript
const purchaseGuide = async (guideId: string, paymentMethod: 'crypto' | 'fiat') => {
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser.userId,
      guideId,
      paymentMethod,
      amount: guide.price
    })
  });
  
  if (!response.ok) throw new Error('Payment failed');
  return response.json();
};
```

## Webhooks

### Stripe Webhooks
For fiat payments, configure Stripe webhooks to handle payment confirmations:

**Endpoint:** `/api/webhooks/stripe`
**Events:** `payment_intent.succeeded`, `payment_intent.payment_failed`

### Privy Webhooks
For crypto payments, configure Privy webhooks to handle transaction confirmations:

**Endpoint:** `/api/webhooks/privy`
**Events:** `transaction.confirmed`, `transaction.failed`
