const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body:
        body === undefined ? undefined : isFormData ? body : JSON.stringify(body)
    });
  } catch (networkError) {
    const err = new Error(
      `Network error: ${networkError.message} (check that your backend is running at ${API_BASE_URL})`,
    );
    err.status = 0;
    throw err;
  }

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
