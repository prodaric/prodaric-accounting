import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { accounts as getAllAccounts } from '../data/mockData';
import type { Account } from '../types';

export function ChartOfAccounts() {
  const [filterElement, setFilterElement] = useState<string>('all');
  const accounts = getAllAccounts();
  const filteredAccounts = filterElement === 'all'
    ? accounts
    : accounts.filter((acc) => acc.element === filterElement);

  const getElementLabel = (element: Account['element']) => {
    const labels = {
      asset: 'Asset',
      liability: 'Liability',
      equity: 'Equity',
      income: 'Income',
      expense: 'Expense'
    };
    return labels[element];
  };

  const getElementColor = (element: Account['element']) => {
    const colors = {
      asset: 'bg-blue-100 text-blue-800',
      liability: 'bg-red-100 text-red-800',
      equity: 'bg-purple-100 text-purple-800',
      income: 'bg-green-100 text-green-800',
      expense: 'bg-orange-100 text-orange-800'
    };
    return colors[element];
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Chart of Accounts</h1>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#e0e0e0] hover:bg-[#d0d0d0] border border-[#c0c0c0] rounded text-sm">
          <Plus size={16} />
          Add Account
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 p-4 bg-[#f9f9f9] border border-[#e0e0e0] rounded">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#666]" />
            <span className="text-sm font-medium text-[#666]">Filter by Element:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterElement('all')}
              className={`px-3 py-1 rounded text-xs border ${
                filterElement === 'all'
                  ? 'bg-[#d0d0d0] border-[#a0a0a0]'
                  : 'bg-white border-[#c0c0c0] hover:bg-[#f0f0f0]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterElement('asset')}
              className={`px-3 py-1 rounded text-xs border ${
                filterElement === 'asset'
                  ? 'bg-[#d0d0d0] border-[#a0a0a0]'
                  : 'bg-white border-[#c0c0c0] hover:bg-[#f0f0f0]'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setFilterElement('liability')}
              className={`px-3 py-1 rounded text-xs border ${
                filterElement === 'liability'
                  ? 'bg-[#d0d0d0] border-[#a0a0a0]'
                  : 'bg-white border-[#c0c0c0] hover:bg-[#f0f0f0]'
              }`}
            >
              Liabilities
            </button>
            <button
              onClick={() => setFilterElement('equity')}
              className={`px-3 py-1 rounded text-xs border ${
                filterElement === 'equity'
                  ? 'bg-[#d0d0d0] border-[#a0a0a0]'
                  : 'bg-white border-[#c0c0c0] hover:bg-[#f0f0f0]'
              }`}
            >
              Equity
            </button>
            <button
              onClick={() => setFilterElement('income')}
              className={`px-3 py-1 rounded text-xs border ${
                filterElement === 'income'
                  ? 'bg-[#d0d0d0] border-[#a0a0a0]'
                  : 'bg-white border-[#c0c0c0] hover:bg-[#f0f0f0]'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterElement('expense')}
              className={`px-3 py-1 rounded text-xs border ${
                filterElement === 'expense'
                  ? 'bg-[#d0d0d0] border-[#a0a0a0]'
                  : 'bg-white border-[#c0c0c0] hover:bg-[#f0f0f0]'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white border border-[#c0c0c0] rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Element</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account, index) => (
                <tr
                  key={account.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                >
                  <td className="px-4 py-2 text-sm font-mono">{account.code}</td>
                  <td className="px-4 py-2 text-sm">
                    <span style={{ paddingLeft: `${(account.code.split('.').length - 1) * 16}px` }}>
                      {account.name}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${getElementColor(account.element)}`}>
                      {getElementLabel(account.element)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm capitalize">{account.type}</td>
                  <td className="px-4 py-2 text-sm">
                    <button className="text-[#555] hover:text-[#1a1a1a] hover:underline mr-3">
                      Edit
                    </button>
                    <button className="text-[#555] hover:text-[#1a1a1a] hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-[#666]">
        Showing {filteredAccounts.length} of {accounts.length} accounts
      </div>
    </div>
  );
}
