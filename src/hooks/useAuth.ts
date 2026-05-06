interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const getUser = (): User | null => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getToken = (): string | null => localStorage.getItem("token");

  const isLoggedIn = (): boolean => !!getToken();

  const logout = (): void => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const login = (token: string, user: User): void => {
    document.cookie = `token=${token}; path=/; max-age=86400`;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return { getUser, getToken, isLoggedIn, logout, login };
}
