// Production REST API client connecting React frontend to the Spring Boot backend.
// Replaces simulated requests with live HTTP fetch calls to http://localhost:8080/api

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const TOKEN_KEY = 'liferpg_token';
const USER_KEY = 'liferpg_user';

let forcedFailure = false;

export function setForcedFailure(val) {
  forcedFailure = Boolean(val);
}

export function getForcedFailure() {
  return forcedFailure;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearCache();
}

// In-memory cache & in-flight deduplication
const responseCache = new Map();
const inFlightRequests = new Map();

export function clearCache(prefix = null) {
  if (!prefix) {
    responseCache.clear();
    return;
  }
  for (const key of responseCache.keys()) {
    if (key.includes(prefix)) {
      responseCache.delete(key);
    }
  }
}

function invalidateCacheForMutation(path) {
  if (path.includes('/quests')) {
    clearCache('/quests');
    clearCache('/character');
    clearCache('/dashboard');
    clearCache('/progress');
  } else if (path.includes('/rewards') || path.includes('/inventory')) {
    clearCache('/rewards');
    clearCache('/inventory');
    clearCache('/character');
  } else if (path.includes('/character')) {
    clearCache('/character');
    clearCache('/dashboard');
  } else if (path.includes('/missions') || path.includes('/daily-missions')) {
    clearCache('/missions');
    clearCache('/daily-missions');
    clearCache('/character');
  } else if (path.includes('/notifications')) {
    clearCache('/notifications');
  } else {
    clearCache();
  }
}

/**
 * Retrieves the stored JWT token if one exists for the current user session.
 */
export async function ensureAuth() {
  return getToken();
}

/**
 * Core HTTP fetch wrapper with automatic JWT injection, error handling,
 * in-memory caching, deduplication, and ApiResponse unwrapping.
 */
export async function request(path, options = {}) {
  if (forcedFailure) {
    throw new Error('Simulated network failure (forced-failure mode active).');
  }

  const method = (options.method || 'GET').toUpperCase();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanPath}`;

  // Check cache for GET requests
  const isGet = method === 'GET';
  const cacheKey = `${cleanPath}::${getToken() || 'anon'}`;

  if (isGet && !options.noCache) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
    // Deduplicate in-flight requests
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }
  }

  const exec = async () => {
    // Ensure token is available for authenticated routes
    let token = getToken();
    if (!token && !path.startsWith('/auth/')) {
      token = await ensureAuth();
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const fetchOptions = {
      ...options,
      headers,
    };

    try {
      const res = await fetch(url, fetchOptions);

      // If 401 unauthorized on a non-auth path, clear stale auth credentials
      if (res.status === 401 && !path.startsWith('/auth/')) {
        clearAuth();
      }

      const contentType = res.headers.get('content-type') || '';
      let json = null;
      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        const text = await res.text();
        return text;
      }

      if (!res.ok || (json && json.success === false)) {
        const errorMsg = json?.error?.message || json?.message || `Request failed with status ${res.status}`;
        throw new Error(errorMsg);
      }

      // Unwrap ApiResponse: { success: true, data: ..., message: ..., pagination: ... }
      const data = json.data !== undefined ? json.data : json;

      if (isGet) {
        // Cache read queries: 30s for catalog data, 12s for active state
        const ttl = cleanPath.includes('/domains') || cleanPath.includes('/rewards') || cleanPath.includes('/achievements') ? 30000 : 12000;
        responseCache.set(cacheKey, { data, expiresAt: Date.now() + ttl });
      } else {
        // Invalidate relevant cache on mutation
        invalidateCacheForMutation(cleanPath);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${method} ${cleanPath}]:`, err);
      throw err;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  };

  if (isGet && !options.noCache) {
    const promise = exec();
    inFlightRequests.set(cacheKey, promise);
    return promise;
  }

  return exec();
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export function simulateRequest(value, { err = null } = {}) {
  if (err) return Promise.reject(new Error(err));
  return Promise.resolve(typeof value === 'function' ? value() : value);
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export default api;
