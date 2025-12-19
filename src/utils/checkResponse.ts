import { ApiResponse } from './types';

export function checkResponse(res: Response): Promise<ApiResponse<any>> {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
}

export function checkSuccess<T>(res: ApiResponse<T>): Promise<ApiResponse<T>> {
  if (res && res.success) {
    return Promise.resolve(res);
  }
  // Если есть сообщение об ошибке, используем его
  const errorMessage = res?.message || `Ответ не success: ${JSON.stringify(res)}`;
  const error = new Error(errorMessage);
  (error as any).response = res;
  return Promise.reject(error);
}
