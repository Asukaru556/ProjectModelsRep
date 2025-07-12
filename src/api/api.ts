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

    const headers = { ...this.defaultHeaders, ...customHeaders }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    }

    if (data) {
      config.body = JSON.stringify(data)
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
    const text = await response.text()
    return text ? JSON.parse(text) : null
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
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
    Cookies.set('login_token', token)
  }

  public removeAuthToken(): void {
    delete this.defaultHeaders['Authorization']
    Cookies.set('login_token', '')
  }
}

// Создание экземпляра API
//export const api = new ApiClient(import.meta.env.VITE_API_BASE_URL, 'http://localhost:3000/api/v1')

export const api = new ApiClient( 'http://localhost:3000/api/v1')
