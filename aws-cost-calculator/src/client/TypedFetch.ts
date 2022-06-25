const defaultConfig: RequestInit = {

}

async function request<T>(url: string, config: RequestInit): Promise<T> {
  const response = await fetch(url, config);
  return await response.json();
}

export const api = {
  get: <T>(url: string, config: RequestInit = defaultConfig) => request<T>(url, config)
}