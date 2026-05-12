import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";

interface RoleId {
  _id: string;
  roleName: string;
}

export interface TeamUser {
  _id: string;
  name: string;
  email: string;
  roleId?: RoleId;
  status?: string;
  createdAt: string;
}

export type RoleRecord = Record<string, unknown>;
export type PermissionRecord = Record<string, unknown>;

interface TeamContextValue {
  users: TeamUser[];
  roles: RoleRecord[];
  permissions: PermissionRecord[];
  usersLoading: boolean;
  rolesLoading: boolean;
  permissionsLoading: boolean;
  refreshUsers: () => Promise<void>;
  refreshRoles: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
}

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  const refreshUsers = useCallback(async () => {
    if (!isLoggedIn) return;
    setUsersLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(Array.isArray(data) ? data : data?.data || data?.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setUsersLoading(false);
    }
  }, [isLoggedIn]);

  const refreshRoles = useCallback(async () => {
    if (!isLoggedIn) return;
    setRolesLoading(true);
    try {
      const data = await api.getRoles();
      setRoles(Array.isArray(data) ? data : data?.data || data?.roles || []);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    } finally {
      setRolesLoading(false);
    }
  }, [isLoggedIn]);

  const refreshPermissions = useCallback(async () => {
    if (!isLoggedIn) return;
    setPermissionsLoading(true);
    try {
      const data = await api.getPermissions();
      setPermissions(
        Array.isArray(data) ? data : data?.data || data?.permissions || [],
      );
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    } finally {
      setPermissionsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      refreshUsers();
      refreshRoles();
      refreshPermissions();
    }
  }, [isLoggedIn, refreshUsers, refreshRoles, refreshPermissions]);

  return (
    <TeamContext.Provider
      value={{
        users,
        roles,
        permissions,
        usersLoading,
        rolesLoading,
        permissionsLoading,
        refreshUsers,
        refreshRoles,
        refreshPermissions,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used inside TeamProvider");
  return ctx;
}
