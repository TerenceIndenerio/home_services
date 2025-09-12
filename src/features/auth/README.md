# Authentication System

This directory contains a comprehensive authentication system with multiple ways to check user authentication status and redirect to login when needed.

## 🚀 Quick Start

```typescript
import { useAuthCheck, checkAuthenticationStatus, withAuthCheck } from '@/features/auth';

// Method 1: Using the hook
const { checkAndRedirect, isAuthenticated } = useAuthCheck();

// Method 2: Using utility functions
const authStatus = await checkAuthenticationStatus();

// Method 3: Protecting functions
const protectedAction = withAuthCheck(() => {
  // Your protected code here
});
```

## 📋 Available Functions

### Hook: `useAuthCheck()`

```typescript
const {
  checkAndRedirect,    // Check auth and redirect to login if needed
  requireAuth,         // Require authentication for current route
  isAuthenticated,     // Check if user is currently authenticated
  isLoading,          // Check if auth state is loading
  hasError,           // Check if there's an auth error
  authState,          // Get full auth state
} = useAuthCheck();
```

### Utility Functions

#### `checkAuthenticationStatus()`
Returns detailed authentication status:
```typescript
const result = await checkAuthenticationStatus();
// Returns: { isAuthenticated: boolean, needsRedirect: boolean, userId?: string, isOffline?: boolean }
```

#### `checkAuthAndRedirect(router)`
Checks auth and redirects to login if needed:
```typescript
import { useRouter } from 'expo-router';
const router = useRouter();
const isAuth = await checkAuthAndRedirect(router);
```

#### `withAuthCheck(handler)`
Higher-order function to protect any function:
```typescript
const protectedFunction = withAuthCheck(async (param1, param2) => {
  // Your code here - only runs if authenticated
  return result;
});
```

#### `hasValidSession()`
Simple boolean check for valid session:
```typescript
const hasSession = await hasValidSession(); // true/false
```

#### `getCurrentUserId()`
Get current authenticated user's ID:
```typescript
const userId = await getCurrentUserId(); // string | null
```

#### `isOfflineMode()`
Check if user is in offline mode:
```typescript
const offline = await isOfflineMode(); // true/false
```

## 🛡️ Component Protection

### Using AuthGuard Component

```typescript
import { AuthGuard } from '@/features/auth';

const ProtectedComponent = () => (
  <AuthGuard>
    <YourProtectedContent />
  </AuthGuard>
);
```

### Custom Fallback

```typescript
<AuthGuard
  fallback={<LoginPrompt />}
  requireAuth={true}
>
  <ProtectedContent />
</AuthGuard>
```

## 📱 Usage Examples

### 1. Protect a Screen

```typescript
import React, { useEffect } from 'react';
import { useAuthCheck } from '@/features/auth';

const ProtectedScreen = () => {
  const { requireAuth, isLoading } = useAuthCheck();

  useEffect(() => {
    requireAuth(); // Redirects to login if not authenticated
  }, [requireAuth]);

  if (isLoading()) return <LoadingSpinner />;

  return <YourScreenContent />;
};
```

### 2. Protect a Button Action

```typescript
import { withAuthCheck } from '@/features/auth';

const handleDeleteAccount = withAuthCheck(async () => {
  // This only runs if user is authenticated
  await deleteUserAccount();
  Alert.alert('Account deleted');
});
```

### 3. Conditional Rendering

```typescript
import { useAuthCheck } from '@/features/auth';

const MyComponent = () => {
  const { isAuthenticated } = useAuthCheck();

  return (
    <View>
      {isAuthenticated() ? (
        <UserDashboard />
      ) : (
        <LoginPrompt />
      )}
    </View>
  );
};
```

### 4. API Call Protection

```typescript
import { checkAuthenticationStatus } from '@/features/auth';

const makeAuthenticatedRequest = async () => {
  const authStatus = await checkAuthenticationStatus();

  if (!authStatus.isAuthenticated) {
    throw new Error('User not authenticated');
  }

  const response = await fetch('/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${authStatus.userId}`,
      'X-Offline-Mode': authStatus.isOffline ? 'true' : 'false',
    },
  });

  return response.json();
};
```

## 🔐 Authentication States

The system supports multiple authentication states:

- **Online Authenticated**: User logged in with valid Firebase session
- **Offline Authenticated**: User has valid offline session (24 hours)
- **Session Expired**: User's session has expired
- **Not Authenticated**: User needs to log in

## ⚡ Best Practices

1. **Use hooks for React components**: `useAuthCheck()` provides reactive auth state
2. **Use utilities for non-React code**: `checkAuthenticationStatus()` for services
3. **Protect sensitive actions**: Use `withAuthCheck()` for critical operations
4. **Handle offline mode**: Check `isOffline` flag for reduced functionality
5. **Show loading states**: Always handle loading states in your UI

## 🔧 Advanced Usage

### Custom Auth Guard

```typescript
const CustomAuthGuard = ({ children, requiredRole }) => {
  const { isAuthenticated, authState } = useAuthCheck();

  if (!isAuthenticated()) return <LoginPrompt />;

  if (requiredRole && authState.user?.role !== requiredRole) {
    return <Unauthorized />;
  }

  return children;
};
```

### Auth State Listener

```typescript
import { useAuth } from '@/features/auth';

const AuthListener = () => {
  const { state } = useAuth();

  useEffect(() => {
    switch (state.status) {
      case 'authenticated':
        console.log('User authenticated:', state.user?.email);
        break;
      case 'unauthenticated':
        console.log('User logged out');
        break;
      case 'error':
        console.error('Auth error:', state.error);
        break;
    }
  }, [state]);

  return null; // This component doesn't render anything
};
```

This authentication system provides flexible, secure, and user-friendly ways to manage authentication throughout your app!