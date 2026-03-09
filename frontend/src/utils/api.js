// In production, API routes are at /api on the same domain
// In development, you can set VITE_API_URL to point to a local backend
const rawBaseUrl = import.meta.env.VITE_API_URL || "";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, token, headers = {} } = options;

  const finalHeaders = { ...headers };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;

  if (body !== undefined && !isFormData) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body:
      body === undefined ? undefined : isFormData ? body : JSON.stringify(body)
  });

  const rawText = await response.text();
  let data = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText };
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}
