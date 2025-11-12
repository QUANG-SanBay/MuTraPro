// Lightweight client for the unified gateway endpoint
import { getAccessToken } from '~/utils/auth';

const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8000/api";

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/users/register',
  '/users/login',
  '/users/hello'
];

export async function callGateway({ service, path, method = "GET", query, body, headers, requireAuth = true } = {}) {
  // Check if this is a public endpoint
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => path.startsWith(endpoint));
  
  // Only add JWT token if:
  // 1. requireAuth is explicitly true (default), OR
  // 2. It's not a public endpoint
  const authHeaders = {};
  if (requireAuth && !isPublicEndpoint) {
    const token = getAccessToken();
    if (token) {
      authHeaders.Authorization = `Bearer ${token}`;
    }
  }
  
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      ...authHeaders,
      ...(headers || {}) 
    },
    body: JSON.stringify({ service, path, method, query, body }),
    credentials: "include", // forward cookies if needed
  });
  const contentType = res.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) {
    const err = new Error(`Gateway error ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
