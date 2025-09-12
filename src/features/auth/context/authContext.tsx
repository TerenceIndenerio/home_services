import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getIdToken, getIdTokenResult } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { auth } from "../../../../firebaseConfig";

// Session configuration
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthState {
  status: AuthStatus;
  user: User | null;
  userDocumentId: string | null;
  error: string | null;
  sessionExpiresAt: number | null;
  errorCode: string | null;
  retryCount: number;
}

type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; userDocumentId?: string } }
  | { type: 'AUTH_FAILURE'; payload: string | { message: string; code?: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'SET_USER_DOCUMENT_ID'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SESSION_EXPIRED' };

const initialState: AuthState = {
  status: 'idle',
  user: null,
  userDocumentId: null,
  error: null,
  sessionExpiresAt: null,
  errorCode: null,
  retryCount: 0,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, status: 'loading', error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        status: 'authenticated',
        user: action.payload.user,
        userDocumentId: action.payload.userDocumentId || action.payload.user.uid,
        error: null,
        sessionExpiresAt: Date.now() + SESSION_DURATION,
      };
    case 'AUTH_FAILURE':
      const errorMessage = typeof action.payload === 'string' ? action.payload : action.payload.message;
      const errorCode = typeof action.payload === 'string' ? null : action.payload.code || null;
      return {
        ...state,
        status: 'error',
        user: null,
        userDocumentId: null,
        error: errorMessage,
        errorCode,
        sessionExpiresAt: null,
        retryCount: state.retryCount + 1
      };
    case 'AUTH_LOGOUT':
      return { ...initialState, status: 'unauthenticated' };
    case 'SET_USER_DOCUMENT_ID':
      return { ...state, userDocumentId: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SESSION_EXPIRED':
      return { ...initialState, status: 'unauthenticated', error: 'Session expired. Please log in again.' };
    default:
      return state;
  }
}

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserDocumentId: (id: string) => Promise<void>;
  clearError: () => void;
  extendSession: () => void;
  checkSessionExpiry: () => boolean;
  refreshToken: () => Promise<string | null>;
  getTokenExpiry: () => Promise<number | null>;
  isOfflineAuthenticated: () => Promise<boolean>;
  enableOfflineMode: () => Promise<void>;
  retryLastOperation: () => Promise<void>;
  canRetry: () => boolean;
  authenticateWithBiometrics: () => Promise<boolean>;
  isBiometricAvailable: () => Promise<boolean>;
  enrollBiometrics: () => Promise<void>;
  checkAuthAndRedirect: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setUserDocumentId = async (id: string) => {
    try {
      await AsyncStorage.setItem('user_document_id', id);
      dispatch({ type: 'SET_USER_DOCUMENT_ID', payload: id });
    } catch (error) {
      console.error('Error storing user document ID:', error);
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store setup flag
      await AsyncStorage.setItem("hasSetup", "true");

      // Store session expiry
      const sessionExpiry = Date.now() + SESSION_DURATION;
      await AsyncStorage.setItem('sessionExpiresAt', sessionExpiry.toString());

      // Get stored user document ID or use UID
      const storedId = await AsyncStorage.getItem('user_document_id');
      const userDocumentId = storedId || user.uid;

      dispatch({ type: 'AUTH_SUCCESS', payload: { user, userDocumentId } });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
    }
  };

  const register = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store setup flag
      await AsyncStorage.setItem("hasSetup", "true");

      // Store session expiry
      const sessionExpiry = Date.now() + SESSION_DURATION;
      await AsyncStorage.setItem('sessionExpiresAt', sessionExpiry.toString());

      dispatch({ type: 'AUTH_SUCCESS', payload: { user, userDocumentId: user.uid } });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.multiRemove([
        'user_document_id',
        'sessionExpiresAt',
        'user_names',
        'hasSetup',
        'offline_user',
        'offline_session_expiry'
      ]);
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const extendSession = () => {
    if (state.status === 'authenticated' && state.sessionExpiresAt) {
      const newExpiry = Date.now() + SESSION_DURATION;
      // Update AsyncStorage with new session expiry
      AsyncStorage.setItem('sessionExpiresAt', newExpiry.toString());
      // Note: We don't dispatch here as the state is already authenticated
      // The session expiry will be checked periodically
    }
  };

  const checkSessionExpiry = (): boolean => {
    if (state.sessionExpiresAt && Date.now() > state.sessionExpiresAt) {
      dispatch({ type: 'SESSION_EXPIRED' });
      return true;
    }
    return false;
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      if (state.user) {
        const token = await getIdToken(state.user, true); // Force refresh
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  const getTokenExpiry = async (): Promise<number | null> => {
    try {
      if (state.user) {
        const tokenResult = await getIdTokenResult(state.user);
        return tokenResult.expirationTime ? new Date(tokenResult.expirationTime).getTime() : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting token expiry:', error);
      return null;
    }
  };

  const isOfflineAuthenticated = async (): Promise<boolean> => {
    try {
      const [storedUser, storedSessionExpiry, storedUserId] = await Promise.all([
        AsyncStorage.getItem('offline_user'),
        AsyncStorage.getItem('offline_session_expiry'),
        AsyncStorage.getItem('user_document_id')
      ]);

      if (storedUser && storedSessionExpiry && storedUserId) {
        const sessionExpiry = parseInt(storedSessionExpiry);
        if (Date.now() < sessionExpiry) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking offline authentication:', error);
      return false;
    }
  };

  const enableOfflineMode = async (): Promise<void> => {
    try {
      if (state.user && state.userDocumentId) {
        const offlineSessionExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours offline
        await Promise.all([
          AsyncStorage.setItem('offline_user', JSON.stringify({
            uid: state.user.uid,
            email: state.user.email,
            displayName: state.user.displayName
          })),
          AsyncStorage.setItem('offline_session_expiry', offlineSessionExpiry.toString())
        ]);
      }
    } catch (error) {
      console.error('Error enabling offline mode:', error);
    }
  };

  const canRetry = (): boolean => {
    return state.status === 'error' && state.retryCount < 3;
  };

  const retryLastOperation = async (): Promise<void> => {
    if (!canRetry()) return;

    // For now, just clear the error and let user try again
    // In a more sophisticated implementation, we'd store the last operation
    clearError();
  };

  const isBiometricAvailable = async (): Promise<boolean> => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const enrollBiometrics = async (): Promise<void> => {
    try {
      const available = await isBiometricAvailable();
      if (!available) {
        throw new Error('Biometric authentication is not available on this device');
      }

      // Store biometric preference
      await AsyncStorage.setItem('biometric_enabled', 'true');
    } catch (error) {
      console.error('Error enrolling biometrics:', error);
      throw error;
    }
  };

  const checkAuthAndRedirect = async (): Promise<boolean> => {
    try {
      // Check if user is authenticated
      if (state.status === 'authenticated' && state.user) {
        return true; // User is authenticated
      }

      // Check offline authentication
      const offlineAuth = await isOfflineAuthenticated();
      if (offlineAuth) {
        return true; // User has offline access
      }

      // If not authenticated, redirect to login
      // Note: In a real app, you'd use router.push or similar
      // For now, we'll return false to indicate redirect needed
      return false;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  };

  useEffect(() => {
    dispatch({ type: 'AUTH_LOADING' });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if session has expired
        const storedExpiry = await AsyncStorage.getItem('sessionExpiresAt');
        if (storedExpiry && Date.now() > parseInt(storedExpiry)) {
          // Session expired, sign out
          await signOut(auth);
          dispatch({ type: 'SESSION_EXPIRED' });
          return;
        }

        // Get stored user document ID or use UID
        const storedId = await AsyncStorage.getItem('user_document_id');
        const userDocumentId = storedId || firebaseUser.uid;

        dispatch({ type: 'AUTH_SUCCESS', payload: { user: firebaseUser, userDocumentId } });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    });

    return unsubscribe;
  }, []);

  // Periodic session check
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.status === 'authenticated') {
        checkSessionExpiry();
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [state.status]);

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    setUserDocumentId,
    clearError,
    extendSession,
    checkSessionExpiry,
    refreshToken,
    getTokenExpiry,
    isOfflineAuthenticated,
    enableOfflineMode,
    retryLastOperation,
    canRetry,
    authenticateWithBiometrics,
    isBiometricAvailable,
    enrollBiometrics,
    checkAuthAndRedirect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
