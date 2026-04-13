export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const raw = await response.text();

  let payload: any = null;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      (typeof payload?.message === "string" ? payload.message : "") ||
      raw ||
      "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

