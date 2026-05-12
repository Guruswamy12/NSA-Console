import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "../api";
import type { Category } from "../mock/data";
import { useAuth } from "./AuthContext";

interface CategoriesContextValue {
  categories: Category[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const data = await api.getCategories();
      const list: Category[] = Array.isArray(data)
        ? data
        : data?.data || data?.categories || [];
      setCategories(list);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) refresh();
  }, [isLoggedIn, refresh]);

  return (
    <CategoriesContext.Provider value={{ categories, loading, refresh }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx)
    throw new Error("useCategories must be used inside CategoriesProvider");
  return ctx;
}
