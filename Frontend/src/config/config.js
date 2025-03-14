// export const API_BASE_URL = "https://0703-14-192-210-146.ngrok-free.app:8000";
// export const BACKEND_BASE_URL = "https://0703-14-192-210-146.ngrok-free.app:8000/api/";

// Use environment variables if available, otherwise fallback to localhost
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8000/api/";
