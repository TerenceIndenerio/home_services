import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { auth } from "../../firebaseConfig";

export function useInactivityTimer(timeout: number = 300000) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      auth.signOut();
    }, timeout);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          resetTimer();
        }
      }
    );

    const listener = () => resetTimer();

    if (typeof document !== "undefined") {
      const touchableEvents = ["touchstart", "mousedown"];
      touchableEvents.forEach((evt) =>
        document.addEventListener(evt, listener, true)
      );

      return () => {
        if (timer.current) clearTimeout(timer.current);
        subscription.remove();
        touchableEvents.forEach((evt) =>
          document.removeEventListener(evt, listener, true)
        );
      };
    }

    
    return () => {
      if (timer.current) clearTimeout(timer.current);
      subscription.remove();
    };
  }, []);
} 