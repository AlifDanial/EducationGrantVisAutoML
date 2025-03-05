// export const API_BASE_URL = "https://5b0e-188-43-14-13.ngrok-free.app:8080";
// export const BACKEND_BASE_URL = "https://5b0e-188-43-14-13.ngrok-free.app:8080/api/";

// Use environment variables if available, otherwise fallback to localhost for development
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
export const BACKEND_BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/` : "http://localhost:8000/api/";
