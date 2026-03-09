import type { Entity, Period, Account, Entry, EntryLine, Balance, AuditLogEntry, SustainabilityMetric } from '../types';

// ============================================================================
// DATOS MOCK - Simulan el contenido de las vistas en public schema
// ============================================================================

export const entities: Entity[] = [
  { id: '1', name: 'Coderic SAS', jurisdiction: 'Colombia', currency: 'COP' },
  { id: '2', name: 'Coderic SA', jurisdiction: 'Venezuela', currency: 'VES' },
  { id: '3', name: 'Coderic Corporation', jurisdiction: 'USA', currency: 'USD' }
];

const periodsData: Period[] = [
  { id: '1', entity_id: '1', from: '2026-01-01', to: '2026-12-31', status: 'open' },
  { id: '2', entity_id: '1', from: '2025-01-01', to: '2025-12-31', status: 'closed' },
  { id: '3', entity_id: '2', from: '2026-01-01', to: '2026-12-31', status: 'open' },
  { id: '4', entity_id: '3', from: '2026-01-01', to: '2026-12-31', status: 'open' },
  { id: '5', entity_id: '1', from: '2024-01-01', to: '2024-12-31', status: 'closed' }
];

// Plan de cuentas alineado a los 5 elementos del Marco Conceptual NIIF
const accountsData: Account[] = [
  // Assets - Activos
  { id: '1', code: '1', name: 'Assets', element: 'asset', type: 'debit' },
  { id: '2', code: '1.1', name: 'Current Assets', element: 'asset', type: 'debit', parent_id: '1' },
  { id: '3', code: '1.1.1', name: 'Cash and Cash Equivalents', element: 'asset', type: 'debit', parent_id: '2' },
  { id: '4', code: '1.1.2', name: 'Trade and Other Receivables', element: 'asset', type: 'debit', parent_id: '2' },
  { id: '5', code: '1.1.3', name: 'Inventories', element: 'asset', type: 'debit', parent_id: '2' },
  { id: '6', code: '1.1.4', name: 'Prepayments', element: 'asset', type: 'debit', parent_id: '2' },
  { id: '7', code: '1.2', name: 'Non-current Assets', element: 'asset', type: 'debit', parent_id: '1' },
  { id: '8', code: '1.2.1', name: 'Property, Plant and Equipment', element: 'asset', type: 'debit', parent_id: '7' },
  { id: '9', code: '1.2.2', name: 'Intangible Assets', element: 'asset', type: 'debit', parent_id: '7' },
  
  // Liabilities - Pasivos
  { id: '10', code: '2', name: 'Liabilities', element: 'liability', type: 'credit' },
  { id: '11', code: '2.1', name: 'Current Liabilities', element: 'liability', type: 'credit', parent_id: '10' },
  { id: '12', code: '2.1.1', name: 'Trade and Other Payables', element: 'liability', type: 'credit', parent_id: '11' },
  { id: '13', code: '2.1.2', name: 'Accrued Expenses', element: 'liability', type: 'credit', parent_id: '11' },
  { id: '14', code: '2.1.3', name: 'Deferred Revenue', element: 'liability', type: 'credit', parent_id: '11' },
  { id: '15', code: '2.2', name: 'Non-current Liabilities', element: 'liability', type: 'credit', parent_id: '10' },
  { id: '16', code: '2.2.1', name: 'Long-term Borrowings', element: 'liability', type: 'credit', parent_id: '15' },
  
  // Equity - Patrimonio
  { id: '17', code: '3', name: 'Equity', element: 'equity', type: 'credit' },
  { id: '18', code: '3.1', name: 'Share Capital', element: 'equity', type: 'credit', parent_id: '17' },
  { id: '19', code: '3.2', name: 'Retained Earnings', element: 'equity', type: 'credit', parent_id: '17' },
  { id: '20', code: '3.3', name: 'Other Reserves', element: 'equity', type: 'credit', parent_id: '17' },
  
  // Income - Ingresos
  { id: '21', code: '4', name: 'Income', element: 'income', type: 'credit' },
  { id: '22', code: '4.1', name: 'Revenue from Contracts with Customers', element: 'income', type: 'credit', parent_id: '21' },
  { id: '23', code: '4.1.1', name: 'Subscription Revenue', element: 'income', type: 'credit', parent_id: '22' },
  { id: '24', code: '4.1.2', name: 'Service Revenue', element: 'income', type: 'credit', parent_id: '22' },
  { id: '25', code: '4.2', name: 'Other Income', element: 'income', type: 'credit', parent_id: '21' },
  
  // Expenses - Gastos
  { id: '26', code: '5', name: 'Expenses', element: 'expense', type: 'debit' },
  { id: '27', code: '5.1', name: 'Cost of Sales', element: 'expense', type: 'debit', parent_id: '26' },
  { id: '28', code: '5.2', name: 'Administrative Expenses', element: 'expense', type: 'debit', parent_id: '26' },
  { id: '29', code: '5.2.1', name: 'Salaries and Wages', element: 'expense', type: 'debit', parent_id: '28' },
  { id: '30', code: '5.2.2', name: 'Infrastructure Costs', element: 'expense', type: 'debit', parent_id: '28' },
  { id: '31', code: '5.3', name: 'Selling Expenses', element: 'expense', type: 'debit', parent_id: '26' },
  { id: '32', code: '5.4', name: 'Finance Costs', element: 'expense', type: 'debit', parent_id: '26' }
];

let entriesData: Entry[] = [
  {
    id: '1',
    entity_id: '1',
    period_id: '1',
    date: '2026-01-15',
    reference: 'CAP-001',
    description: 'Initial capital contribution',
    lines: [
      { id: '1', account_id: '3', account_code: '1.1.1', account_name: 'Cash and Cash Equivalents', debit: 500000, credit: 0 },
      { id: '2', account_id: '18', account_code: '3.1', account_name: 'Share Capital', debit: 0, credit: 500000 }
    ],
    created_at: '2026-01-15T10:30:00Z',
    created_by: 'Juan Pérez',
    checksum: 'sha256:abcd1234...'
  },
  {
    id: '2',
    entity_id: '1',
    period_id: '1',
    date: '2026-01-20',
    reference: 'INV-001',
    description: 'Purchase of inventory - Cloud infrastructure components',
    lines: [
      { id: '3', account_id: '5', account_code: '1.1.3', account_name: 'Inventories', debit: 75000, credit: 0 },
      { id: '4', account_id: '12', account_code: '2.1.1', account_name: 'Trade and Other Payables', debit: 0, credit: 75000 }
    ],
    created_at: '2026-01-20T14:15:00Z',
    created_by: 'Juan Pérez',
    checksum: 'sha256:efgh5678...'
  },
  {
    id: '3',
    entity_id: '1',
    period_id: '1',
    date: '2026-02-01',
    reference: 'SUB-001',
    description: 'Monthly subscription revenue - Prodaric CRM',
    lines: [
      { id: '5', account_id: '4', account_code: '1.1.2', account_name: 'Trade and Other Receivables', debit: 120000, credit: 0 },
      { id: '6', account_id: '23', account_code: '4.1.1', account_name: 'Subscription Revenue', debit: 0, credit: 120000 }
    ],
    created_at: '2026-02-01T09:00:00Z',
    created_by: 'María García',
    checksum: 'sha256:ijkl9012...'
  },
  {
    id: '4',
    entity_id: '1',
    period_id: '1',
    date: '2026-02-05',
    reference: 'SAL-001',
    description: 'Payroll - January 2026',
    lines: [
      { id: '7', account_id: '29', account_code: '5.2.1', account_name: 'Salaries and Wages', debit: 180000, credit: 0 },
      { id: '8', account_id: '3', account_code: '1.1.1', account_name: 'Cash and Cash Equivalents', debit: 0, credit: 180000 }
    ],
    created_at: '2026-02-05T11:45:00Z',
    created_by: 'Juan Pérez',
    checksum: 'sha256:mnop3456...'
  },
  {
    id: '5',
    entity_id: '1',
    period_id: '1',
    date: '2026-02-10',
    reference: 'INF-001',
    description: 'Cloud infrastructure costs - coderic.cloud',
    lines: [
      { id: '9', account_id: '30', account_code: '5.2.2', account_name: 'Infrastructure Costs', debit: 45000, credit: 0 },
      { id: '10', account_id: '13', account_code: '2.1.2', account_name: 'Accrued Expenses', debit: 0, credit: 45000 }
    ],
    created_at: '2026-02-10T16:20:00Z',
    created_by: 'Juan Pérez',
    checksum: 'sha256:qrst7890...'
  }
];

let auditLogData: AuditLogEntry[] = [
  { id: '1', user: 'Juan Pérez', tenant: 'Coderic SAS', action: 'journal:write', resource: 'entry/1', timestamp: '2026-01-15T10:30:00Z', status: 'success' },
  { id: '2', user: 'Juan Pérez', tenant: 'Coderic SAS', action: 'journal:write', resource: 'entry/2', timestamp: '2026-01-20T14:15:00Z', status: 'success' },
  { id: '3', user: 'María García', tenant: 'Coderic SAS', action: 'journal:write', resource: 'entry/3', timestamp: '2026-02-01T09:00:00Z', status: 'success' },
  { id: '4', user: 'Juan Pérez', tenant: 'Coderic SAS', action: 'journal:write', resource: 'entry/4', timestamp: '2026-02-05T11:45:00Z', status: 'success' },
  { id: '5', user: 'Juan Pérez', tenant: 'Coderic SAS', action: 'journal:write', resource: 'entry/5', timestamp: '2026-02-10T16:20:00Z', status: 'success' },
  { id: '6', user: 'Admin User', tenant: 'Coderic SAS', action: 'configuration:write', resource: 'entity_config', timestamp: '2026-01-10T08:00:00Z', status: 'success' }
];

const sustainabilityMetricsData: SustainabilityMetric[] = [
  { id: '1', entity_id: '1', period_id: '1', scope: 'scope1', name: 'Direct emissions from data centers', value: 145.8, unit: 'tCO2e' },
  { id: '2', entity_id: '1', period_id: '1', scope: 'scope2', name: 'Indirect emissions from electricity consumption', value: 102.4, unit: 'tCO2e' },
  { id: '3', entity_id: '1', period_id: '1', scope: 'scope3', name: 'Value chain emissions - Customer cloud usage', value: 325.7, unit: 'tCO2e' }
];

// ============================================================================
// FUNCIONES DE LECTURA (simulan vistas en public schema)
// ============================================================================

export function getPeriodsForEntity(entityId: string): Period[] {
  return periodsData.filter(p => p.entity_id === entityId);
}

export function getAccountById(id: string): Account | undefined {
  return accountsData.find(acc => acc.id === id);
}

export function getAccountByCode(code: string): Account | undefined {
  return accountsData.find(acc => acc.code === code);
}

export function getAllAccounts(): Account[] {
  return [...accountsData];
}

export function getAccountsByElement(element: string): Account[] {
  return accountsData.filter(acc => acc.element === element);
}

export function getEntryById(id: string): Entry | undefined {
  return entriesData.find(entry => entry.id === id);
}

export function getEntriesForEntityPeriod(entityId: string, periodId: string): Entry[] {
  return entriesData.filter(e => e.entity_id === entityId && e.period_id === periodId);
}

export function getAuditLog(): AuditLogEntry[] {
  return [...auditLogData];
}

export function getSustainabilityMetrics(entityId: string, periodId: string): SustainabilityMetric[] {
  return sustainabilityMetricsData.filter(m => m.entity_id === entityId && m.period_id === periodId);
}

// ============================================================================
// CÁLCULOS DE BALANCES (simula vista balance en accounting schema)
// ============================================================================

export function calculateBalance(entityId: string, periodId: string): Balance[] {
  const entries = getEntriesForEntityPeriod(entityId, periodId);
  const balanceMap = new Map<string, { debit: number; credit: number }>();

  // Acumular débitos y créditos por cuenta
  entries.forEach(entry => {
    entry.lines.forEach(line => {
      const key = line.account_id;
      const current = balanceMap.get(key) || { debit: 0, credit: 0 };
      balanceMap.set(key, {
        debit: current.debit + line.debit,
        credit: current.credit + line.credit
      });
    });
  });

  // Calcular balance neto según naturaleza de la cuenta
  const balances: Balance[] = [];
  balanceMap.forEach((amounts, accountId) => {
    const account = getAccountById(accountId);
    if (account) {
      const balance = account.type === 'debit'
        ? amounts.debit - amounts.credit
        : amounts.credit - amounts.debit;

      balances.push({
        account_id: accountId,
        account_code: account.code,
        account_name: account.name,
        debit: amounts.debit,
        credit: amounts.credit,
        balance
      });
    }
  });

  return balances.sort((a, b) => a.account_code.localeCompare(b.account_code));
}

// ============================================================================
// VALIDACIONES NIIF/IFRS (simula las que están en las funciones del backend)
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Valida partida doble: suma de débitos debe igualar suma de créditos
 * Requerimiento NIIF: Marco Conceptual - Ecuación contable
 */
export function validateDoubleEntry(lines: EntryLine[]): ValidationResult {
  const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
  
  const errors: string[] = [];
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    errors.push(
      `Double-entry violation: Debits (${totalDebit.toFixed(2)}) must equal Credits (${totalCredit.toFixed(2)}). ` +
      `Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}`
    );
  }
  
  if (totalDebit === 0 && totalCredit === 0) {
    errors.push('Entry must have at least one debit and one credit movement.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida que cada línea tenga solo débito O crédito, no ambos
 * Requerimiento NIIF: Convención contable estándar
 */
export function validateLineAmounts(lines: EntryLine[]): ValidationResult {
  const errors: string[] = [];
  
  lines.forEach((line, index) => {
    if (line.debit > 0 && line.credit > 0) {
      errors.push(`Line ${index + 1}: Cannot have both debit and credit. Use separate lines.`);
    }
    if (line.debit === 0 && line.credit === 0) {
      errors.push(`Line ${index + 1}: Must have either debit or credit amount.`);
    }
    if (line.debit < 0 || line.credit < 0) {
      errors.push(`Line ${index + 1}: Amounts cannot be negative.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida que los movimientos respeten la naturaleza de la cuenta
 * Requerimiento NIIF: Clasificación por elementos
 */
export function validateAccountNature(lines: EntryLine[]): ValidationResult {
  const errors: string[] = [];
  
  lines.forEach((line, index) => {
    const account = getAccountById(line.account_id);
    if (!account) {
      errors.push(`Line ${index + 1}: Invalid account ID ${line.account_id}`);
      return;
    }

    // Cuentas de naturaleza débito deben tener normalmente débito para aumentar
    // Cuentas de naturaleza crédito deben tener normalmente crédito para aumentar
    // Permitimos ambas direcciones pero advertimos si es inusual
    const hasDebit = line.debit > 0;
    const hasCredit = line.credit > 0;
    
    if (account.type === 'debit' && hasCredit) {
      // Es válido pero advertencia: está disminuyendo una cuenta de naturaleza débito
      // No marcamos como error, solo para información
    }
    
    if (account.type === 'credit' && hasDebit) {
      // Es válido pero advertencia: está disminuyendo una cuenta de naturaleza crédito
      // No marcamos como error, solo para información
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida que el período esté abierto
 * Requerimiento NIIF/ISA: Control de períodos cerrados
 */
export function validatePeriodOpen(periodId: string): ValidationResult {
  const period = periodsData.find(p => p.id === periodId);
  const errors: string[] = [];
  
  if (!period) {
    errors.push(`Period ${periodId} not found.`);
  } else if (period.status === 'closed') {
    errors.push(`Period from ${period.from} to ${period.to} is closed. Cannot create new entries.`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida que la fecha del asiento esté dentro del período
 */
export function validateDateInPeriod(date: string, periodId: string): ValidationResult {
  const period = periodsData.find(p => p.id === periodId);
  const errors: string[] = [];
  
  if (!period) {
    errors.push(`Period ${periodId} not found.`);
  } else {
    if (date < period.from || date > period.to) {
      errors.push(`Entry date ${date} must be between period dates ${period.from} and ${period.to}.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida la ecuación contable: Activos = Pasivos + Patrimonio
 * Requerimiento NIIF: Marco Conceptual - Ecuación fundamental
 */
export function validateAccountingEquation(entityId: string, periodId: string): ValidationResult {
  const balances = calculateBalance(entityId, periodId);
  const errors: string[] = [];
  
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;
  
  balances.forEach(bal => {
    const account = getAccountById(bal.account_id);
    if (!account) return;
    
    switch (account.element) {
      case 'asset':
        totalAssets += bal.balance;
        break;
      case 'liability':
        totalLiabilities += Math.abs(bal.balance);
        break;
      case 'equity':
        totalEquity += Math.abs(bal.balance);
        break;
    }
  });
  
  const difference = Math.abs(totalAssets - (totalLiabilities + totalEquity));
  
  if (difference > 0.01) {
    errors.push(
      `Accounting equation not balanced: Assets (${totalAssets.toFixed(2)}) ≠ Liabilities (${totalLiabilities.toFixed(2)}) + Equity (${totalEquity.toFixed(2)}). ` +
      `Difference: ${difference.toFixed(2)}`
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================================
// FUNCIONES DE ESCRITURA (simulan funciones SECURITY DEFINER en public schema)
// ============================================================================

export interface RegisterEntryRequest {
  entity_id: string;
  period_id: string;
  date: string;
  reference: string;
  description: string;
  lines: Omit<EntryLine, 'id' | 'account_code' | 'account_name'>[];
  created_by: string;
}

export interface RegisterEntryResponse {
  success: boolean;
  entry_id?: string;
  errors?: string[];
  checksum?: string;
}

/**
 * Simula la función public.register_entry()
 * Valida todas las reglas NIIF/IFRS antes de insertar en ledger
 */
export function registerEntry(request: RegisterEntryRequest): RegisterEntryResponse {
  const allErrors: string[] = [];
  
  // Validación 1: Período abierto
  const periodValidation = validatePeriodOpen(request.period_id);
  if (!periodValidation.valid) {
    allErrors.push(...periodValidation.errors);
  }
  
  // Validación 2: Fecha dentro del período
  const dateValidation = validateDateInPeriod(request.date, request.period_id);
  if (!dateValidation.valid) {
    allErrors.push(...dateValidation.errors);
  }
  
  // Completar información de líneas
  const completeLines: EntryLine[] = request.lines.map((line, index) => {
    const account = getAccountById(line.account_id);
    return {
      ...line,
      id: `line_${Date.now()}_${index}`,
      account_code: account?.code || '',
      account_name: account?.name || ''
    };
  });
  
  // Validación 3: Partida doble
  const doubleEntryValidation = validateDoubleEntry(completeLines);
  if (!doubleEntryValidation.valid) {
    allErrors.push(...doubleEntryValidation.errors);
  }
  
  // Validación 4: Montos de líneas
  const lineAmountsValidation = validateLineAmounts(completeLines);
  if (!lineAmountsValidation.valid) {
    allErrors.push(...lineAmountsValidation.errors);
  }
  
  // Validación 5: Naturaleza de cuentas
  const accountNatureValidation = validateAccountNature(completeLines);
  if (!accountNatureValidation.valid) {
    allErrors.push(...accountNatureValidation.errors);
  }
  
  if (allErrors.length > 0) {
    return {
      success: false,
      errors: allErrors
    };
  }
  
  // Generar checksum (simulado)
  const checksum = `sha256:${Math.random().toString(36).substring(7)}...`;
  
  // Insertar en ledger (simulado)
  const newEntry: Entry = {
    id: String(entriesData.length + 1),
    entity_id: request.entity_id,
    period_id: request.period_id,
    date: request.date,
    reference: request.reference,
    description: request.description,
    lines: completeLines,
    created_at: new Date().toISOString(),
    created_by: request.created_by,
    checksum
  };
  
  entriesData.push(newEntry);
  
  // Registrar en audit log
  auditLogData.push({
    id: String(auditLogData.length + 1),
    user: request.created_by,
    tenant: entities.find(e => e.id === request.entity_id)?.name || '',
    action: 'journal:write',
    resource: `entry/${newEntry.id}`,
    timestamp: newEntry.created_at,
    status: 'success'
  });
  
  return {
    success: true,
    entry_id: newEntry.id,
    checksum
  };
}

/**
 * Simula la función public.create_reversal_entry()
 */
export function createReversalEntry(
  sourceEntryId: string,
  reversalDate: string,
  description: string,
  createdBy: string
): RegisterEntryResponse {
  const sourceEntry = getEntryById(sourceEntryId);
  
  if (!sourceEntry) {
    return {
      success: false,
      errors: [`Source entry ${sourceEntryId} not found.`]
    };
  }
  
  // Crear líneas invertidas (débitos ↔ créditos)
  const reversalLines = sourceEntry.lines.map(line => ({
    account_id: line.account_id,
    debit: line.credit,  // Invertir
    credit: line.debit   // Invertir
  }));
  
  return registerEntry({
    entity_id: sourceEntry.entity_id,
    period_id: sourceEntry.period_id,
    date: reversalDate,
    reference: `REV-${sourceEntry.reference}`,
    description: description || `Reversal of entry #${sourceEntryId}: ${sourceEntry.description}`,
    lines: reversalLines,
    created_by: createdBy
  });
}

/**
 * Simula la función public.close_period()
 */
export function closePeriod(periodId: string, userId: string): { success: boolean; errors?: string[] } {
  const period = periodsData.find(p => p.id === periodId);
  
  if (!period) {
    return {
      success: false,
      errors: [`Period ${periodId} not found.`]
    };
  }
  
  if (period.status === 'closed') {
    return {
      success: false,
      errors: [`Period is already closed.`]
    };
  }
  
  // Validar ecuación contable
  const equationValidation = validateAccountingEquation(period.entity_id, periodId);
  if (!equationValidation.valid) {
    return {
      success: false,
      errors: equationValidation.errors
    };
  }
  
  // Validar trial balance
  const balances = calculateBalance(period.entity_id, periodId);
  const totalDebit = balances.reduce((sum, b) => sum + b.debit, 0);
  const totalCredit = balances.reduce((sum, b) => sum + b.credit, 0);
  
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return {
      success: false,
      errors: [`Trial balance not balanced: Debits (${totalDebit}) ≠ Credits (${totalCredit})`]
    };
  }
  
  // Cerrar período
  period.status = 'closed';
  
  // Audit log
  auditLogData.push({
    id: String(auditLogData.length + 1),
    user: userId,
    tenant: entities.find(e => e.id === period.entity_id)?.name || '',
    action: 'period:manage',
    resource: `period/${periodId}/close`,
    timestamp: new Date().toISOString(),
    status: 'success'
  });
  
  return { success: true };
}
