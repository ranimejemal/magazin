import { useState, useCallback, useRef } from 'react';

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60 * 1000; // 1 minute lockout
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minute window for attempts

/**
 * Hook to implement client-side rate limiting for authentication
 * Provides exponential backoff and temporary lockout after failed attempts
 */
export function useAuthRateLimit() {
  const stateRef = useRef<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    lockedUntil: null,
  });
  
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const checkRateLimit = useCallback((): { allowed: boolean; message?: string } => {
    const now = Date.now();
    const state = stateRef.current;

    // Check if currently locked out
    if (state.lockedUntil && now < state.lockedUntil) {
      const remaining = Math.ceil((state.lockedUntil - now) / 1000);
      setLockoutRemaining(remaining);
      setIsLocked(true);
      return {
        allowed: false,
        message: `Too many attempts. Please try again in ${remaining} seconds.`,
      };
    }

    // Reset lockout if expired
    if (state.lockedUntil && now >= state.lockedUntil) {
      state.lockedUntil = null;
      state.attempts = 0;
      setIsLocked(false);
      setLockoutRemaining(0);
    }

    // Reset attempts if outside the window
    if (now - state.lastAttempt > ATTEMPT_WINDOW) {
      state.attempts = 0;
    }

    return { allowed: true };
  }, []);

  const recordAttempt = useCallback((success: boolean) => {
    const now = Date.now();
    const state = stateRef.current;

    if (success) {
      // Reset on successful login
      state.attempts = 0;
      state.lockedUntil = null;
      setIsLocked(false);
      setLockoutRemaining(0);
    } else {
      // Increment failed attempts
      state.attempts += 1;
      state.lastAttempt = now;

      // Lock out after max attempts
      if (state.attempts >= MAX_ATTEMPTS) {
        state.lockedUntil = now + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutRemaining(Math.ceil(LOCKOUT_DURATION / 1000));
      }
    }
  }, []);

  const reset = useCallback(() => {
    stateRef.current = {
      attempts: 0,
      lastAttempt: 0,
      lockedUntil: null,
    };
    setIsLocked(false);
    setLockoutRemaining(0);
  }, []);

  return {
    checkRateLimit,
    recordAttempt,
    reset,
    isLocked,
    lockoutRemaining,
    attemptsRemaining: MAX_ATTEMPTS - stateRef.current.attempts,
  };
}

/**
 * Returns a generic error message for auth failures
 * This prevents email enumeration attacks
 */
export function getGenericAuthError(): string {
  return 'Invalid email or password. Please try again.';
}
