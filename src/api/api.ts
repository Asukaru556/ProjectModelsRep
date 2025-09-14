import { Cookies } from 'quasar'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
type Headers = Record<string, string>

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Headers

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
    const token = Cookies.get('login_token');
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }



  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    data?: unknown,
  customHeaders: Headers = {}
): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const tokenCookie: any = Cookies.get('login_token')
    if(tokenCookie){
      this.defaultHeaders['Authorization'] = `Bearer ${tokenCookie}`
    }

    const baseHeaders = { ...this.defaultHeaders, ...customHeaders };

    const config: RequestInit = {
      method,
      headers: baseHeaders,
      credentials: 'include',
    };

    if (data instanceof FormData) {
      delete baseHeaders['Content-Type'];
      config.body = data;
    } else if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData: any = await this.parseResponse(response)
        throw new Error(
          errorData?.message ||  `HTTP error! status: ${response.status}`
        )
      }

      return this.parseResponse(response)
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text();
    if (!text) return null as unknown as T;

    try {
      return JSON.parse(text);
    } catch (err) {
      console.log(err)
      return text as unknown as T;
    }
  }

  public get<T>(endpoint: string, headers?: Headers): Promise<T> {
    return this.request(endpoint, 'GET', undefined, headers)
  }

  public post<T>(
    endpoint: string,
    data?: unknown,
  headers?: Headers
): Promise<T> {
    return this.request(endpoint, 'POST', data, headers)
  }

  public put<T>(
    endpoint: string,
    data?: unknown,
  headers?: Headers
): Promise<T> {
    return this.request(endpoint, 'PUT', data, headers)
  }

  public delete<T>(endpoint: string, headers?: Headers): Promise<T> {
    return this.request(endpoint, 'DELETE', undefined, headers)
  }

  public patch<T>(
    endpoint: string,
    data?: unknown,
  headers?: Headers
): Promise<T> {
    return this.request(endpoint, 'PATCH', data, headers)
  }

  public setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    Cookies.set('login_token', token, {
      expires: 7,
      secure: true,
      sameSite: 'Strict'
    });
  }

  public removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
    Cookies.remove('login_token');
  }
}

//export const api = new ApiClient( import.meta.env.VITE_API_BASE_URL)
export const api = new ApiClient( 'http://localhost:3000/api/v1')

