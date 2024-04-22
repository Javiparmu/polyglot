interface UseApiFetch<T> {
  apiFetch: (url: string, options: RequestInit) => Promise<T>;
  abortSignal: AbortController;
}

const apiBaseUrl = process.env.API_BASE_URL;

export const useApiFetch = <T>(): UseApiFetch<T> => {
  const abortSignal = new AbortController();

  const apiFetch = async (url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(apiBaseUrl + url, {
      signal: abortSignal.signal,
      ...options,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  };

  return {
    apiFetch,
    abortSignal,
  };
};
