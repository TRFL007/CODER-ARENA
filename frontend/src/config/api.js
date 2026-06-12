/*
All API calls must use this constant.
Set VITE_API_URL in your .env file for the deployed backend URL.
Falls back to localhost:5001 for local development, and relative URL in production.
*/
export const API_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001" : "");
