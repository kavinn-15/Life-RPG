// Production auth service wired to Spring Boot backend.
// Manages JWT token storage in localStorage and user identity.

import { api, setToken, setStoredUser, getStoredUser, clearAuth } from './apiClient';

export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const result = await api.post('/auth/login', {
    email: email.trim(),
    password,
  });

  if (result?.token) {
    setToken(result.token);
    setStoredUser(result.user);
  }

  return result;
}

export async function register(name, email, password) {
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  const result = await api.post('/auth/register', {
    name: name.trim(),
    email: email.trim(),
    password,
  });

  if (result?.token) {
    setToken(result.token);
    setStoredUser(result.user);
  }

  return result;
}

export async function logout() {
  try {
    await api.post('/auth/logout', {});
  } catch (err) {
    console.warn('Logout notification to server failed:', err);
  } finally {
    clearAuth();
  }
  return { success: true };
}

export async function getCurrentUser() {
  const stored = getStoredUser();
  try {
    const user = await api.get('/auth/me');
    if (user) {
      setStoredUser(user);
      return user;
    }
  } catch (err) {
    console.warn('Failed to fetch /auth/me, using stored user:', err);
  }
  return stored;
}

export async function forgotPassword(email) {
  if (!email) {
    throw new Error('Adventurer email is required.');
  }
  return await api.post('/auth/forgot-password', {
    email: email.trim().toLowerCase(),
  });
}

export async function verifyOtp(email, otp) {
  if (!email || !otp) {
    throw new Error('Email and 6-digit OTP code are required.');
  }
  return await api.post('/auth/verify-otp', {
    email: email.trim().toLowerCase(),
    otp: otp.trim(),
  });
}

export async function resetPassword(email, otp, newPassword) {
  if (!email || !otp || !newPassword) {
    throw new Error('Email, OTP code, and new password are required.');
  }
  return await api.post('/auth/reset-password', {
    email: email.trim().toLowerCase(),
    otp: otp.trim(),
    newPassword,
  });
}

export default { login, register, logout, getCurrentUser, forgotPassword, verifyOtp, resetPassword };

