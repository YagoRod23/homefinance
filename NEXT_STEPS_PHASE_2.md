# Next Steps - Phase 2 (Authentication)

Phase 1 ✅ is complete. Project infrastructure is ready.

**Next Phase Duration:** 1-2 days

## Overview

Implement authentication endpoints and connect frontend forms to backend.

## Phase 2 Tasks

### 1. Backend Authentication Routes

Create `backend/src/routes/auth.ts`:

```typescript
// POST /api/auth/register
// - Validate email, password
// - Hash password with bcryptjs
// - Create user in database
// - Return JWT token

// POST /api/auth/login
// - Find user by email
// - Compare password with hash
// - Generate JWT token
// - Return token + user data

// POST /api/auth/refresh
// - Validate refresh token
// - Generate new access token
```

### 2. User Service

Create `backend/src/services/AuthService.ts`:

```typescript
// Class with methods:
// - createUser(name, email, password)
// - getUserByEmail(email)
// - verifyPassword(password, hash)
// - generateTokens(userId, email)
```

### 3. Connect Backend to Frontend

Update `frontend/src/context/AuthContext.tsx`:

- Replace TODO comments with actual API calls
- Fix network interceptors
- Handle error responses

### 4. Test Endpoints

```bash
# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### 5. Frontend Testing

- Test signup form (create account)
- Test login form (sign in)
- Verify token stored in localStorage
- Verify protected route works
- Test logout functionality

## Files to Create/Modify

**New Files:**
- `backend/src/routes/auth.ts` - Auth endpoints
- `backend/src/services/AuthService.ts` - Auth logic

**Modify:**
- `backend/src/index.ts` - Add auth routes
- `frontend/src/context/AuthContext.tsx` - Uncomment TODO API calls

**Note:**
- Database connection service might be needed (`backend/src/db/client.ts`)
- You can use existing schema in `backend/src/db/schema.ts`

## Testing Strategy

1. **Unit Tests**
   - Password hashing functions
   - JWT token generation

2. **Integration Tests**
   - POST /auth/register with valid data
   - POST /auth/register with duplicate email (should fail)
   - POST /auth/login with wrong password (should fail)
   - POST /auth/login with valid credentials (should succeed)

3. **E2E Tests**
   - Frontend signup → Backend creates user
   - Frontend login → Get token → Access protected page
   - Token expiry → Auto redirect to login

## Success Criteria

✅ User can create account (sign up)
✅ User can log in with email/password
✅ JWT token returned and stored
✅ Protected routes blocked without token
✅ Token automatically added to API requests
✅ All endpoints tested and working

## Performance Notes

- Bcrypt hashing is slow (intentional) - consider timeout for tests
- JWT tokens should be HttpOnly cookies (future improvement)
- Rate limiting on auth endpoints recommended (future)

## Security Reminders

⚠️ **Production Checklist (for later):**
- [ ] Use HTTPS only
- [ ] HttpOnly cookies for tokens
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Strong JWT_SECRET
- [ ] Password minimum 8 chars
- [ ] Input validation & sanitization
- [ ] SQL injection prevention (Drizzle prevents this)

For MVP: Basic validation is OK, security hardening after launch.

## After Phase 2

Once authentication is working:
- Proceed to Phase 3: Core Modules (Expenses, Income, Residents)
- Users can be linked to their data via user_id
- Permission checks can verify user owns data

## Resources

- [Express middleware patterns](https://expressjs.com/en/guide/using-middleware.html)
- [JWT best practices](https://tools.ietf.org/html/rfc7519)
- [bcryptjs docs](https://github.com/dcodeIO/bcrypt.js)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Ready?** Start with creating `backend/src/routes/auth.ts` and wire up the register endpoint.

Good luck! 🚀
