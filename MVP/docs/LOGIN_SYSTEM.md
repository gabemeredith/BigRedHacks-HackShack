# Login System Documentation

## Overview

The LocalLens login system provides secure authentication for business accounts with automatic business profile creation, session persistence via HttpOnly cookies, and seamless navigation integration.

## Features

### ✅ **Tabbed Interface**
- **Sign In Tab**: Login for existing business accounts
- **Create Account Tab**: Registration with automatic business profile creation
- **Smooth Transitions**: Clean tab switching with form state preservation

### ✅ **Account Creation Flow**
1. **User Registration**: Email, password, business details
2. **Automatic Business Creation**: Business profile linked to user account
3. **Auto Sign-In**: Immediate login after successful registration
4. **Dashboard Redirect**: Seamless transition to business dashboard

### ✅ **Session Management**
- **HttpOnly Cookies**: Secure session storage
- **30-Day Expiration**: Long-lived sessions for convenience
- **JWT Strategy**: Efficient token-based authentication
- **Secure Settings**: Production-ready cookie configuration

### ✅ **Form Validation**
- **Email Validation**: Proper email format checking
- **Password Requirements**: Minimum 6 characters
- **Password Confirmation**: Matching password verification
- **Business Category**: Required category selection
- **URL Validation**: Proper website URL format

### ✅ **Navigation Integration**
- **Business Name Display**: Shows logged-in business name in navigation
- **Dynamic Auth State**: Login/logout buttons based on session
- **Dashboard Access**: Direct link to business dashboard when logged in

## Usage Examples

### Test Accounts
Use these seeded accounts for testing:

```
Email: tony@tonyspizza.com
Password: password123
Business: Tony's Authentic Pizza

Email: owner@gimmecoffe.com
Password: password123
Business: Gimme! Coffee

Email: cornell@collegetown.com
Password: password123
Business: Collegetown Bagels
```

### Creating New Business Account
1. Navigate to `/login`
2. Click "Create Account" tab
3. Fill in required fields:
   - Email
   - Password & Confirmation
   - Business Name
   - Category (Restaurant, Clothing, Art, Entertainment)
   - Optional: Website, Address
4. Click "Create Business Account"
5. Automatically redirected to `/dashboard`

### Signing In
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected to `/dashboard`

## API Integration

### NextAuth Configuration
```typescript
// lib/auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [CredentialsProvider({...})],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});
```

### Server Actions
```typescript
// app/actions/auth.ts
export async function signUpAction(data: SignUpData) {
  // 1. Validate user doesn't exist
  // 2. Hash password
  // 3. Create user + business in transaction
  // 4. Auto sign-in new user
}

export async function loginAction(data: LoginData) {
  // 1. Validate credentials
  // 2. Sign in with NextAuth
  // 3. Redirect to dashboard
}
```

### Client-Side Usage
```typescript
// components/LoginPage.tsx
const handleLogin = async (e: React.FormEvent) => {
  const result = await signIn('credentials', {
    email: loginForm.email,
    password: loginForm.password,
    redirect: false,
  });
  
  if (result?.ok) {
    router.push('/dashboard');
  }
};
```

## Security Features

### Password Security
- **bcryptjs Hashing**: Industry-standard password hashing
- **Salt Rounds**: 12 rounds for optimal security/performance balance
- **No Plain Text Storage**: Passwords never stored in plain text

### Session Security
- **HttpOnly Cookies**: Prevents XSS attacks on session tokens
- **SameSite Protection**: CSRF protection via SameSite cookie attribute
- **Secure Flag**: HTTPS-only cookies in production
- **JWT Tokens**: Stateless authentication with signed tokens

### Input Validation
- **Server-Side Validation**: All inputs validated on server
- **Client-Side Feedback**: Immediate validation feedback
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // bcrypt hashed
  role          Role      @default(BUSINESS)
  business      Business? // One-to-one relationship
  createdAt     DateTime  @default(now())
  
  // NextAuth fields
  accounts      Account[]
  sessions      Session[]
}
```

### Business Model
```prisma
model Business {
  id        String   @id @default(cuid())
  ownerId   String   @unique
  owner     User     @relation(fields: [ownerId], references: [id])
  name      String
  website   String?
  category  Category // RESTAURANTS, CLOTHING, ART, ENTERTAINMENT
  address   String?
  lat       Float?   // Geocoded coordinates
  lng       Float?
  videos    Video[]
  createdAt DateTime @default(now())
}
```

## Error Handling

### Common Error Scenarios
1. **Duplicate Email**: "User with this email already exists"
2. **Invalid Credentials**: "Invalid email or password"
3. **Validation Errors**: Field-specific validation messages
4. **Network Errors**: "An unexpected error occurred"

### Toast Notifications
- **Success Messages**: Account creation, successful login
- **Error Messages**: Validation errors, authentication failures
- **Warning Messages**: Non-critical issues
- **Info Messages**: System information

## Integration with Other Systems

### Navigation Bar
```typescript
// components/NavBar.tsx
const { data: session } = useSession();

// Shows business name when logged in
{session ? (
  <span>{session.user?.businessName || session.user?.email}</span>
) : (
  <LoginButtons />
)}
```

### Protected Routes
```typescript
// app/dashboard/page.tsx
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  // Dashboard content...
}
```

### Client-Side Guards
```typescript
// components/AuthGuard.tsx
const { data: session, status } = useSession();

if (status === 'loading') return <Loading />;
if (!session) return <LoginPrompt />;

return children;
```

## Development & Testing

### Environment Variables
```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL="file:./dev.db"
```

### Testing Login Flow
1. **Start Development Server**: `npm run dev`
2. **Seed Database**: `npm run db:seed`
3. **Visit Login Page**: `http://localhost:3000/login`
4. **Test Existing Account**: Use provided test credentials
5. **Test New Account**: Create new business account
6. **Verify Session**: Check navigation shows business name
7. **Test Logout**: Verify session clearing

### Database Management
```bash
# View database in browser
npm run db:studio

# Reset database and reseed
npm run db:reset

# Apply new migrations
npm run db:migrate
```

## Future Enhancements

- [ ] **Email Verification**: Verify email addresses before activation
- [ ] **Password Reset**: Forgot password functionality
- [ ] **Two-Factor Authentication**: Optional 2FA for enhanced security
- [ ] **Social Login**: Google/Facebook authentication options
- [ ] **Account Recovery**: Admin-assisted account recovery
- [ ] **Audit Logging**: Track login attempts and security events
