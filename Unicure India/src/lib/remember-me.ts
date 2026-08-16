// "Remember me" toggle for Supabase sessions.
//
// Supabase persists the session to localStorage by default, which survives
// browser close. When the user opts out of "remember me", we want the session
// to stay only for the current browser session (survives refresh, cleared on
// browser/tab close). We can't swap the Supabase storage driver (client.ts is
// auto-generated), so we mark the session as ephemeral and clear it on boot
// when the tab's sessionStorage marker is gone — which only happens after the
// browser/tab was fully closed, not on a plain refresh.

const REMEMBER_KEY = "unicure.rememberMe"; // "1" persistent, "0" ephemeral
const TAB_MARKER_KEY = "unicure.sessionActive";

export function setRememberPreference(remember: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  if (!remember) window.sessionStorage.setItem(TAB_MARKER_KEY, "1");
  else window.sessionStorage.removeItem(TAB_MARKER_KEY);
}

export function clearRememberPreference() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REMEMBER_KEY);
  window.sessionStorage.removeItem(TAB_MARKER_KEY);
}

/**
 * Returns true if the persisted session should be dropped because the user
 * previously chose "don't remember me" and the browser/tab has since closed.
 */
export function shouldDropEphemeralSession(): boolean {
  if (typeof window === "undefined") return false;
  const remember = window.localStorage.getItem(REMEMBER_KEY);
  if (remember !== "0") return false;
  const tabAlive = window.sessionStorage.getItem(TAB_MARKER_KEY);
  return !tabAlive;
}

/** Call once on app boot to keep the tab marker alive across refreshes. */
export function markTabAlive() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(REMEMBER_KEY) === "0") {
    window.sessionStorage.setItem(TAB_MARKER_KEY, "1");
  }
}