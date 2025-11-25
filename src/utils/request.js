import { API_BASE_URL } from './api';
import { checkResponse, checkSuccess } from './checkResponse';

export function request(endpoint, options) {
  return fetch(`${API_BASE_URL}${endpoint}`, options)
    .then(checkResponse)
    .then(checkSuccess);
}

