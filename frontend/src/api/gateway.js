// Lightweight client for the unified gateway endpoint
const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8000/api";

export async function callGateway({ service, path, method = "GET", query, body, headers } = {}) {
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(headers || {}) },
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
