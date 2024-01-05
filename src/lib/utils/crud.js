const defaultOptions = {
  method: 'GET',
  body: null,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

export const crud = async (options) => {
  const { url, ...restOptions } = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, restOptions);

  if (response.ok) {
    response.data = await response.json();
  }
  return response;
};

crud.get = (url, options) => {
  return crud({
    url,
    ...options,
  });
};

crud.post = (url, body, options) => {
  return crud({
    method: 'POST',
    url,
    body: JSON.stringify(body),
    ...options,
  });
};

crud.delete = (url, options) => {
  return crud({
    method: 'DELETE',
    url,
    ...options,
  });
};

crud.put = (url, body, options) => {
  return crud({
    method: 'PUT',
    url,
    body: JSON.stringify(body),
    ...options,
  });
};
