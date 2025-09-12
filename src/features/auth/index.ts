// Auth Context and Provider
export { AuthProvider, useAuth } from './context/authContext';

// Auth Components
export { default as AuthGuard } from './components/AuthGuard';
export { default as AuthCheckExample } from './components/AuthCheckExample';

// Auth Hooks
export { useAuthCheck } from './hooks/useAuthCheck';

// Auth Utils
export {
  checkAuthenticationStatus,
  checkAuthAndRedirect,
  checkLoginAndRedirect,
  useCheckLoginAndRedirect,
  withAuthCheck,
  hasValidSession,
  getCurrentUserId,
  isOfflineMode,
  type AuthCheckResult,
} from './utils/authUtils';

// Auth Screens (if needed)
export { default as Login } from './screens/Login';
export { default as SignUp } from './screens/SignUp';
export { default as AuthGuardScreen } from './screens/AuthGuard';