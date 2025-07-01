# Refresh Token Implementation

This implementation adds refresh token functionality to the authentication system using Redis and HTTP-only cookies.

## Features

- **Access Tokens**: Short-lived (15 minutes) for API requests
- **Refresh Tokens**: Long-lived (7 days) stored in Redis and HTTP-only cookies
- **Automatic Token Refresh**: Client-side automatic refresh when access token expires
- **Secure Cookie Storage**: Refresh tokens stored as HTTP-only cookies
- **Redis Storage**: Server-side refresh token storage with automatic expiration

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install redis cookie-parser
npm install --save-dev @types/cookie-parser
```

### 2. Environment Variables

Add these environment variables to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-jwt-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key

# Redis Configuration
REDIS_URL=redis://localhost:6379

# CORS Configuration (for cookies)
CORS_ORIGIN=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### 3. Redis Setup

#### Option A: Local Redis
```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server

# Check if Redis is running
redis-cli ping
```

#### Option B: Docker Redis
```bash
# Run Redis in Docker
docker run -d -p 6379:6379 redis:alpine
```

#### Option C: Cloud Redis (Redis Cloud, AWS ElastiCache, etc.)
Use your cloud provider's Redis service and update the `REDIS_URL` environment variable.

### 4. API Endpoints

The following endpoints are available:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### 5. Client-Side Integration

The client-side authentication utility (`next/src/utils/auth.ts`) handles:

- Automatic token refresh on 401 responses
- Cookie management for refresh tokens
- Local storage for access tokens
- Automatic logout on refresh failure

## How It Works

### 1. Login Flow
1. User submits login credentials
2. Server validates credentials
3. Server generates access token (15 min) and refresh token (7 days)
4. Access token returned in response body
5. Refresh token stored in Redis and set as HTTP-only cookie
6. Client stores access token in localStorage

### 2. API Request Flow
1. Client includes access token in Authorization header
2. Server validates access token
3. If valid, request proceeds
4. If expired, server returns 401

### 3. Token Refresh Flow
1. Client receives 401 response
2. Client automatically calls `/api/auth/refresh`
3. Server validates refresh token from cookie
4. Server checks if refresh token exists in Redis
5. If valid, server generates new token pair
6. New access token returned, new refresh token set as cookie
7. Client retries original request with new access token

### 4. Logout Flow
1. Client calls `/api/auth/logout`
2. Server removes refresh token from Redis
3. Server clears refresh token cookie
4. Client removes access token from localStorage

## Security Features

- **HTTP-Only Cookies**: Refresh tokens cannot be accessed via JavaScript
- **Secure Cookies**: In production, cookies are only sent over HTTPS
- **SameSite**: Prevents CSRF attacks
- **Redis Storage**: Server-side token storage with automatic expiration
- **Short-lived Access Tokens**: Minimizes exposure window
- **Token Rotation**: New refresh token issued on each refresh

## Error Handling

- **Invalid Refresh Token**: Redirect to login
- **Expired Refresh Token**: Redirect to login
- **Redis Connection Error**: Fallback to database storage (optional)
- **Network Errors**: Retry mechanism with exponential backoff

## Testing

### Test Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

### Test Authentication Flow
1. Register a new user
2. Login with credentials
3. Make authenticated API request
4. Wait for access token to expire (15 minutes)
5. Make another request (should auto-refresh)
6. Logout and verify tokens are cleared

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Check if Redis is running
   - Verify `REDIS_URL` environment variable
   - Check firewall settings

2. **Cookies Not Set**
   - Verify CORS configuration
   - Check `withCredentials: true` on client
   - Ensure same domain or proper CORS setup

3. **Token Refresh Fails**
   - Check refresh token in Redis: `redis-cli get refresh_token:userId`
   - Verify cookie is being sent
   - Check server logs for errors

4. **CORS Issues**
   - Update `CORS_ORIGIN` to match your frontend URL
   - Ensure `credentials: true` in CORS config

## Production Considerations

1. **Use Strong Secrets**: Generate cryptographically secure secrets
2. **HTTPS Only**: Enable secure cookies in production
3. **Redis Security**: Configure Redis with authentication
4. **Monitoring**: Monitor Redis memory usage and token counts
5. **Backup**: Implement Redis backup strategy
6. **Rate Limiting**: Add rate limiting to refresh endpoint 