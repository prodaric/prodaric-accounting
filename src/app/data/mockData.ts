/**
 * Fuente única de datos mock para la UI (compatibilidad con mockBackend).
 *
 * Los datos y la lógica viven en /src/app/services/mockBackend.ts (simula
 * backend PostgreSQL con validaciones NIIF/IFRS). Este archivo re-exporta
 * todo lo que la UI necesita para una sola fuente de importación.
 *
 * Exportados (todos desde mockBackend):
 * - currentUser          (objeto) usuario actual
 * - entities             (array) entidades de reporte
 * - accounts             (función) getAllAccounts() → Account[]
 * - periods              (función) getPeriodsForEntity(entityId) → Period[]
 * - auditLog             (función) getAuditLog() → AuditLogEntry[]
 * - getAccountById       (id) → Account | undefined
 * - getAccountByCode     (code) → Account | undefined
 * - getEntryById         (id) → Entry | undefined
 * - getEntriesForEntityPeriod (entityId, periodId) → Entry[]
 * - calculateBalance     (entityId, periodId) → Balance[]  (exportado como balances)
 * - getSustainabilityMetrics (entityId, periodId) → SustainabilityMetric[]  (exportado como sustainabilityMetrics)
 *
 * Para escritura (registerEntry, etc.) importar desde '../services/mockBackend'.
 */
import type { User } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan.perez@coderic.com',
  role: 'accountant'
};

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
