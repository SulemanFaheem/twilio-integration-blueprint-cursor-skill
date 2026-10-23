/**
 * Base URL for the Verify API.
 * Prefer react-native-config (or similar) in production apps.
 *
 * Emulator tips:
 * - Android emulator → host machine: http://10.0.2.2:3000
 * - iOS simulator: http://localhost:3000
 */
export const API_BASE_URL = (
  (typeof process !== 'undefined' && process.env?.API_BASE_URL) ||
  'http://localhost:3000'
).replace(/\/$/, '');
