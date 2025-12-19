import { API_BASE_URL } from './api';
import { checkResponse, checkSuccess } from './checkResponse';
import { ApiResponse } from './types';

export function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  return fetch(`${API_BASE_URL}${endpoint}`, options)
    .then(checkResponse)
    .then(checkSuccess);
}
