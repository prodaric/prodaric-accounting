import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './components/AppShell';
import { Dashboard } from './components/Dashboard';
import { EntityPeriod } from './components/EntityPeriod';
import { ChartOfAccounts } from './components/ChartOfAccounts';
import { Journal } from './components/Journal';
import { Ledger } from './components/Ledger';
import { Balance } from './components/Balance';
import { TrialBalance } from './components/TrialBalance';
import { Reports } from './components/Reports';
import { Configuration } from './components/Configuration';
import { Administration } from './components/Administration';
import { AuditLog } from './components/AuditLog';
import { Sustainability } from './components/Sustainability';
import { EntryDetail } from './components/EntryDetail';
import { ClosePeriod } from './components/ClosePeriod';
import { ReverseEntry } from './components/ReverseEntry';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/entity-period" element={<EntityPeriod />} />
            <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/ledger/:id" element={<EntryDetail />} />
            <Route path="/reverse-entry" element={<ReverseEntry />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/trial-balance" element={<TrialBalance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/close-period" element={<ClosePeriod />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="/audit-log" element={<AuditLog />} />
            <Route path="/sustainability" element={<Sustainability />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AuthProvider>
  );
}