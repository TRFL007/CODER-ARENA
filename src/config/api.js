/*
All API calls must use this constant.
Set VITE_API_URL in your .env file for the deployed backend URL.
Falls back to localhost:5000 for local development.
*/
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
