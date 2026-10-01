export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error =
  (data && (data.message || data.error)) ||
  response.statusText;
    throw new ApiError(response.status, error, data);
  }

  return data;
}
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

export const apiClient = {
  get: async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
  post: async (url, body, options = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  put: async (url, body, options = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  patch: async (url, body, options = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  delete: async (url, body = null, options = {}) => {
  const response = await fetch(url, {
    ...options,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...getAuthHeaders(),
    },
    ...(body !== null && {
      body: JSON.stringify(body),
    }),
  });

  return handleResponse(response);
},
};
