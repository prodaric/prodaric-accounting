import { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { entities, periods as getPeriodsForEntity, balances as calculateBalance } from '../data/mockData';

export function TrialBalance() {
  const [filterEntity, setFilterEntity] = useState(entities[0].id);
  const periodList = getPeriodsForEntity(filterEntity);
  const [filterPeriod, setFilterPeriod] = useState(periodList[0]?.id ?? '');
  const [asOfDate, setAsOfDate] = useState('2026-03-05');
  const balances = filterPeriod ? calculateBalance(filterEntity, filterPeriod) : [];

  const totalDebit = balances.reduce((sum, b) => sum + b.debit, 0);
  const totalCredit = balances.reduce((sum, b) => sum + b.credit, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Trial Balance</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
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

      {/* Trial Balance Table */}
      <div className="bg-white border border-[#c0c0c0] rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Account Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Account Name</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Debit Total</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Credit Total</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance, index) => (
                <tr
                  key={balance.account_id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                >
                  <td className="px-4 py-2 text-sm font-mono">{balance.account_code}</td>
                  <td className="px-4 py-2 text-sm">{balance.account_name}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    {balance.debit > 0 ? balance.debit.toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {balance.credit > 0 ? balance.credit.toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#f5f5f5] border-t-2 border-[#808080]">
                <td colSpan={2} className="px-4 py-2 text-sm font-medium">Totals</td>
                <td className="px-4 py-2 text-sm font-medium text-right">
                  {totalDebit.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm font-medium text-right">
                  {totalCredit.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Balance Validation */}
      <div className="mt-6 p-3 rounded border">
        {totalDebit === totalCredit ? (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border-green-300">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span>Trial balance is balanced (Debits = Credits = {totalDebit.toLocaleString()})</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border-red-300">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span>Trial balance is NOT balanced. Please review entries.</span>
          </div>
        )}
      </div>
    </div>
  );
}
