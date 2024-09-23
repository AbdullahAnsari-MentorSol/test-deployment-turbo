
interface FetchWithInterceptorResult<T> {
  data: T | null;
  error: string | null;
}

export async function fetchWithInterceptor<T>(url: string, body?: any, options?: RequestInit): Promise<FetchWithInterceptorResult<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fullUrl = `${baseUrl}${url}`;
  console.log(fullUrl)
  const fetchOptions: RequestInit = {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
    ...options,
  };

  try {
    const response = await fetch(fullUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return { data: result, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Unknown error' };
  }
}
