const USER_KEY = "edutrack_user";
const TOKEN_KEY = "edutrack_demo_token";

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function setAuthSession(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function hasAuthSession() {
  return Boolean(getStoredUser() && localStorage.getItem(TOKEN_KEY));
}
