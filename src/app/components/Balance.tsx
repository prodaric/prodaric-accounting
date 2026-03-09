import { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { entities, periods as getPeriodsForEntity, balances as calculateBalance, accounts as getAllAccounts } from '../data/mockData';

export function Balance() {
  const [filterEntity, setFilterEntity] = useState(entities[0].id);
  const periodList = getPeriodsForEntity(filterEntity);
  const [filterPeriod, setFilterPeriod] = useState(periodList[0]?.id ?? '');
  const [filterAccount, setFilterAccount] = useState('');
  const [asOfDate, setAsOfDate] = useState('2026-03-05');

  const balances = filterPeriod ? calculateBalance(filterEntity, filterPeriod) : [];
  const accounts = getAllAccounts();
  const filteredBalances = balances.filter((balance) => {
    if (filterAccount && balance.account_id !== filterAccount) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Balance (Ledger Balances)</h1>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#e0e0e0] hover:bg-[#d0d0d0] border border-[#c0c0c0] rounded text-sm">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Filters */}
      <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded bg-[#f9f9f9]">
        <legend className="px-2 text-sm font-medium text-[#666] flex items-center gap-2">
          <Filter size={14} />
          Filters
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Entity</label>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            >
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Period</label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            >
              {periodList.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.from} to {period.to}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Account (optional)</label>
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            >
              <option value="">All accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">As of Date</label>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            />
          </div>
        </div>
      </fieldset>

      {/* Balances Table */}
      <div className="bg-white border border-[#c0c0c0] rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Account Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Account Name</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Total Debit</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Total Credit</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredBalances.map((balance, index) => (
                <tr
                  key={balance.account_id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                >
                  <td className="px-4 py-2 text-sm font-mono">{balance.account_code}</td>
                  <td className="px-4 py-2 text-sm">{balance.account_name}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    {balance.debit.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {balance.credit.toLocaleString()}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right font-medium ${
                    balance.balance >= 0 ? 'text-[#1a1a1a]' : 'text-[#666]'
                  }`}>
                    {balance.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-[#666]">
        Showing {filteredBalances.length} accounts
      </div>
    </div>
  );
}
