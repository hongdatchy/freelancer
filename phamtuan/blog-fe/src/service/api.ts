const BASE_URL = process.env.NEXT_PUBLIC_BE_HOST;
const BE_TOKEN_ADMIN = process.env.NEXT_PUBLIC_BE_TOKEN_ADMIN;
// GET
export const getData = async (endpoint: string, token = BE_TOKEN_ADMIN) => {
  
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Nếu cần thiết
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${BASE_URL}/${endpoint}`);
  }

  return response.json();
};

// POST
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postData = async (endpoint: string, data: any, token = BE_TOKEN_ADMIN) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to post data to ${endpoint}`);
  }
  return response.json();
};

// PUT
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const putData = async (endpoint: string, data: any, token = BE_TOKEN_ADMIN) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to put data to ${endpoint}`);
  }
  return response.json();
};

// DELETE
export const deleteData = async (endpoint: string, token = BE_TOKEN_ADMIN) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete data from ${endpoint}`);
  }
  return response.json();
};
