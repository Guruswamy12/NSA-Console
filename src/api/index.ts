const BASE_URL = "https://consoleapis-qqtlx.ondigitalocean.app";

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  login: (email: string, password: string) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json()),

  getStats: (queryParams = "") =>
    fetch(`${BASE_URL}/dashboard/stats${queryParams}`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  getBlogs: (queryParams = "") =>
    fetch(
      `${BASE_URL}/blogs${queryParams ? (queryParams.startsWith("?") ? queryParams : "?" + queryParams) : ""}`,
      { headers: authHeaders() },
    ).then((r) => r.json()),

  getBlogsPaged: (page: number, limit = 10) =>
    fetch(`${BASE_URL}/blogs?page=${page}&limit=${limit}`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  getBlog: (id: string) =>
    fetch(`${BASE_URL}/blogs/${id}`, { headers: authHeaders() }).then((r) =>
      r.json(),
    ),

  createBlog: (payload: unknown) =>
    fetch(`${BASE_URL}/blogs`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),

  updateBlog: (id: string, payload: unknown) =>
    fetch(`${BASE_URL}/blogs/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),

  deleteBlog: (id: string) =>
    fetch(`${BASE_URL}/blogs/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),

  getCategories: () =>
    fetch(`${BASE_URL}/categories`, { headers: authHeaders() }).then((r) =>
      r.json(),
    ),

  createCategory: (payload: unknown) =>
    fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),

  updateCategory: (id: string, payload: unknown) =>
    fetch(`${BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }),

  deleteCategory: (id: string) =>
    fetch(`${BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),

  getUsers: () =>
    fetch(`${BASE_URL}/team/users`, { headers: authHeaders() }).then((r) =>
      r.json(),
    ),

  getRoles: () =>
    fetch(`${BASE_URL}/team/roles`, { headers: authHeaders() }).then((r) =>
      r.json(),
    ),

  getPermissions: () =>
    fetch(`${BASE_URL}/team/permissions`, { headers: authHeaders() }).then(
      (r) => r.json(),
    ),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
