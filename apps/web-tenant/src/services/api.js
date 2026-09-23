async function request(method, path, body) {
  const token = localStorage.getItem('at_token');
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export const auth = {
  devLogin: (email) => request('POST', '/auth/dev/tenant', { email }),
};

export const workshops = {
  list:   (params = {}) => request('GET', `/workshops?${new URLSearchParams(params)}`),
  get:    (id)          => request('GET', `/workshops/${id}`),
  create: (data)        => request('POST', '/workshops', data),
  update: (id, data)    => request('PUT', `/workshops/${id}`, data),
  remove: (id)          => request('DELETE', `/workshops/${id}`),
};
