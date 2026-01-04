// src/router/guards.ts
function isAuthenticated(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith("access_token="));
}

function isAdmin(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith("role=admin"));
}

export { isAdmin, isAuthenticated };
