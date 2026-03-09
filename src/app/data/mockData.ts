/**
 * Mock Data - Deprecated
 * 
 * Este archivo se mantiene por compatibilidad pero los datos ahora se sirven
 * desde /src/app/services/mockBackend.ts que simula el backend PostgreSQL
 * con validaciones NIIF/IFRS completas.
 * 
 * Usar en su lugar:
 * - import { entities, getPeriodsForEntity, getAllAccounts, ... } from '../services/mockBackend';
 */

import type { User } from '../types';

// Solo exportamos currentUser por compatibilidad
// El resto de datos debe obtenerse del mockBackend
export const currentUser: User = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan.perez@coderic.com',
  role: 'accountant'
};

// Re-exportar desde mockBackend para compatibilidad
export { 
  entities,
  getAccountById,
  getAccountByCode,
  getEntryById,
  getAllAccounts as accounts,
  getEntriesForEntityPeriod,
  getPeriodsForEntity as periods,
  calculateBalance as balances,
  getAuditLog as auditLog,
  getSustainabilityMetrics as sustainabilityMetrics
} from '../services/mockBackend';
