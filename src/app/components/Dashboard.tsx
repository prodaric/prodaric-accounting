import { Link } from 'react-router';
import { AlertCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
  entities,
  periods as getPeriodsForEntity,
  getEntriesForEntityPeriod,
  balances as calculateBalance,
} from '../data/mockData';

export function Dashboard() {
  const currentEntity = entities[0];
  const periodList = getPeriodsForEntity(currentEntity.id);
  const currentPeriod = periodList.find((p) => p.status === 'open');
  const entries = currentPeriod
    ? getEntriesForEntityPeriod(currentEntity.id, currentPeriod.id)
    : [];
  const recentEntries = entries.slice(-5).reverse();
  const balances = currentPeriod
    ? calculateBalance(currentEntity.id, currentPeriod.id)
    : [];

  // Calculate summary metrics
  const totalAssets = balances
    .filter((b) => b.account_code.startsWith('1'))
    .reduce((sum, b) => sum + b.balance, 0);

  const totalLiabilities = Math.abs(
    balances
      .filter((b) => b.account_code.startsWith('2'))
      .reduce((sum, b) => sum + b.balance, 0)
  );

  const totalEquity = Math.abs(
    balances
      .filter((b) => b.account_code.startsWith('3'))
      .reduce((sum, b) => sum + b.balance, 0)
  );

  const totalIncome = Math.abs(
    balances
      .filter((b) => b.account_code.startsWith('4'))
      .reduce((sum, b) => sum + b.balance, 0)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Entity and Period Info */}
      <div className="mb-6 p-4 bg-[#f9f9f9] border border-[#e0e0e0] rounded">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-[#666]">Current Entity</div>
            <div className="font-medium">{currentEntity.name}</div>
            <div className="text-sm text-[#666]">
              {currentEntity.jurisdiction} • {currentEntity.currency}
            </div>
          </div>
          {currentPeriod && (
            <div className="text-right">
              <div className="text-sm text-[#666]">Current Period</div>
              <div className="font-medium">
                {currentPeriod.from} to {currentPeriod.to}
              </div>
              <div className={`text-sm ${
                currentPeriod.status === 'open' ? 'text-green-600' : 'text-[#666]'
              }`}>
                Status: {currentPeriod.status}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white border border-[#c0c0c0] rounded">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[#666]">Total Assets</div>
            <DollarSign size={20} className="text-[#808080]" />
          </div>
          <div className="text-2xl font-semibold">
            {totalAssets.toLocaleString('en-US', { style: 'currency', currency: currentEntity.currency })}
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <TrendingUp size={12} />
            <span>Balanced</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#c0c0c0] rounded">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[#666]">Total Liabilities</div>
            <DollarSign size={20} className="text-[#808080]" />
          </div>
          <div className="text-2xl font-semibold">
            {totalLiabilities.toLocaleString('en-US', { style: 'currency', currency: currentEntity.currency })}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#666] mt-1">
            <TrendingDown size={12} />
            <span>Current</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#c0c0c0] rounded">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[#666]">Total Equity</div>
            <DollarSign size={20} className="text-[#808080]" />
          </div>
          <div className="text-2xl font-semibold">
            {totalEquity.toLocaleString('en-US', { style: 'currency', currency: currentEntity.currency })}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#666] mt-1">
            <span>Shareholders</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#c0c0c0] rounded">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[#666]">Total Revenue</div>
            <DollarSign size={20} className="text-[#808080]" />
          </div>
          <div className="text-2xl font-semibold">
            {totalIncome.toLocaleString('en-US', { style: 'currency', currency: currentEntity.currency })}
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
            <TrendingUp size={12} />
            <span>Year to date</span>
          </div>
        </div>
      </div>

      {/* Alerts/Notices */}
      {currentPeriod && (
        <div className="mb-6 p-4 bg-[#fffbf0] border border-[#f0e68c] rounded flex items-start gap-3">
          <AlertCircle size={20} className="text-[#d4a017] mt-0.5" />
          <div>
            <div className="font-medium text-sm">Period Status</div>
            <div className="text-sm text-[#555] mt-1">
              The current period ({currentPeriod.from} to {currentPeriod.to}) is open for transactions.
              Remember to close the period once all entries are finalized.
            </div>
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="bg-white border border-[#c0c0c0] rounded">
        <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center justify-between">
          <h2 className="font-medium">Recent Entries</h2>
          <Link to="/ledger" className="text-sm text-[#555] hover:text-[#1a1a1a]">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Reference</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Description</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Debit</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Credit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry, index) => {
                const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
                const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit, 0);
                
                return (
                  <tr
                    key={entry.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                  >
                    <td className="px-4 py-2 text-sm">{entry.id}</td>
                    <td className="px-4 py-2 text-sm">{entry.date}</td>
                    <td className="px-4 py-2 text-sm">{entry.reference}</td>
                    <td className="px-4 py-2 text-sm">{entry.description}</td>
                    <td className="px-4 py-2 text-sm text-right">
                      {totalDebit.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {totalCredit.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Link
                        to={`/ledger/${entry.id}`}
                        className="text-[#555] hover:text-[#1a1a1a] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
