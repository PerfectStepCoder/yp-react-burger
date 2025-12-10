export function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
}

export function checkSuccess(res) {
  if (res && res.success) {
    return res;
  }
  // Если есть сообщение об ошибке, используем его
  const errorMessage = res?.message || `Ответ не success: ${JSON.stringify(res)}`;
  const error = new Error(errorMessage);
  error.response = res;
  return Promise.reject(error);
}

