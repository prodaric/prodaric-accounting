import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, Entity } from '../types';
import { entities, getPeriodsForEntity } from '../services/mockBackend';

interface AuthContextType {
  currentUser: User | null;
  selectedEntity: Entity | null;
  selectedPeriod: string | null;
  setUser: (user: User) => void;
  setSelectedEntity: (entity: Entity | null) => void;
  setSelectedPeriod: (periodId: string | null) => void;
  hasPermission: (permission: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  // Inicializar con usuario y entidad por defecto
  useEffect(() => {
    if (!currentUser) {
      const defaultUser: User = {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan.perez@coderic.com',
        role: 'accountant'
      };
      setCurrentUser(defaultUser);
    }

    if (!selectedEntity && entities.length > 0) {
      setSelectedEntity(entities[0]);
    }

    if (selectedEntity && !selectedPeriod) {
      const periods = getPeriodsForEntity(selectedEntity.id);
      const openPeriod = periods.find(p => p.status === 'open');
      if (openPeriod) {
        setSelectedPeriod(openPeriod.id);
      }
    }
  }, [currentUser, selectedEntity, selectedPeriod]);

  const setUser = (user: User) => {
    setCurrentUser(user);
  };

  // Matriz de permisos por rol según design.md §2.8
  const rolePermissions: Record<string, string[]> = {
    admin: [
      'entity:read', 'entity:manage',
      'period:read', 'period:manage',
      'chart_of_accounts:read', 'chart_of_accounts:write',
      'journal:write',
      'ledger:read',
      'balance:read',
      'report:read',
      'configuration:read', 'configuration:write',
      'sustainability:read', 'sustainability:write',
      'user:read', 'user:manage',
      'audit_log:read'
    ],
    accountant: [
      'entity:read',
      'period:read',
      'chart_of_accounts:read', 'chart_of_accounts:write',
      'journal:write',
      'ledger:read',
      'balance:read',
      'report:read',
      'configuration:read',
      'sustainability:read', 'sustainability:write'
    ],
    auditor: [
      'entity:read',
      'period:read',
      'chart_of_accounts:read',
      'ledger:read',
      'balance:read',
      'report:read',
      'configuration:read',
      'sustainability:read',
      'audit_log:read'
    ],
    viewer: [
      'entity:read',
      'period:read',
      'chart_of_accounts:read',
      'balance:read',
      'report:read'
    ]
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    const permissions = rolePermissions[currentUser.role] || [];
    return permissions.includes(permission);
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedEntity(null);
    setSelectedPeriod(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        selectedEntity,
        selectedPeriod,
        setUser,
        setSelectedEntity,
        setSelectedPeriod,
        hasPermission,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
