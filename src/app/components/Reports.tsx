import { useState } from 'react';
import { Filter, Download } from 'lucide-react';
import { entities, periods as getPeriodsForEntity, balances as calculateBalance } from '../data/mockData';

type ReportTab = 'financial-position' | 'profit-loss';

export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('financial-position');
  const [filterEntity, setFilterEntity] = useState(entities[0].id);
  const periodList = getPeriodsForEntity(filterEntity);
  const [filterPeriod, setFilterPeriod] = useState(periodList[0]?.id ?? '');
  const balances = filterPeriod ? calculateBalance(filterEntity, filterPeriod) : [];

  const currentEntity = entities.find((e) => e.id === filterEntity);

  // Calculate financial position
  const assets = balances.filter((b) => b.account_code.startsWith('1'));
  const liabilities = balances.filter((b) => b.account_code.startsWith('2'));
  const equity = balances.filter((b) => b.account_code.startsWith('3'));

  const totalAssets = assets.reduce((sum, b) => sum + b.balance, 0);
  const totalLiabilities = Math.abs(liabilities.reduce((sum, b) => sum + b.balance, 0));
  const totalEquity = Math.abs(equity.reduce((sum, b) => sum + b.balance, 0));

  // Calculate profit/loss
  const income = balances.filter((b) => b.account_code.startsWith('4'));
  const expenses = balances.filter((b) => b.account_code.startsWith('5'));

  const totalIncome = Math.abs(income.reduce((sum, b) => sum + b.balance, 0));
  const totalExpenses = expenses.reduce((sum, b) => sum + b.balance, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Financial Reports</h1>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#e0e0e0] hover:bg-[#d0d0d0] border border-[#c0c0c0] rounded text-sm">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Filters */}
      <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded bg-[#f9f9f9]">
        <legend className="px-2 text-sm font-medium text-[#666] flex items-center gap-2">
          <Filter size={14} />
          Report Parameters
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
        </div>
      </fieldset>

      {/* Tabs */}
      <div className="border-b border-[#c0c0c0] mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('financial-position')}
            className={`px-4 py-2 text-sm border-b-2 ${
              activeTab === 'financial-position'
                ? 'border-[#808080] bg-white'
                : 'border-transparent bg-[#f5f5f5] text-[#666] hover:bg-[#e8e8e8]'
            }`}
          >
            Statement of Financial Position
          </button>
          <button
            onClick={() => setActiveTab('profit-loss')}
            className={`px-4 py-2 text-sm border-b-2 ${
              activeTab === 'profit-loss'
                ? 'border-[#808080] bg-white'
                : 'border-transparent bg-[#f5f5f5] text-[#666] hover:bg-[#e8e8e8]'
            }`}
          >
            Statement of Profit or Loss
          </button>
        </div>
      </div>

      {/* Report Content */}
      {activeTab === 'financial-position' && (
        <div className="bg-white border border-[#c0c0c0] rounded p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">{currentEntity?.name}</h2>
            <h3 className="text-lg">Statement of Financial Position</h3>
            <p className="text-sm text-[#666]">As of {periodList.find((p) => p.id === filterPeriod)?.to}</p>
          </div>

          <div className="space-y-6">
            {/* Assets */}
            <div>
              <h4 className="font-semibold border-b border-[#c0c0c0] pb-2 mb-2">ASSETS</h4>
              {assets.map(account => (
                <div key={account.account_id} className="flex justify-between py-1 text-sm">
                  <span className="pl-4">{account.account_name}</span>
                  <span>{account.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-semibold border-t border-[#c0c0c0] mt-2">
                <span>Total Assets</span>
                <span>{totalAssets.toLocaleString()}</span>
              </div>
            </div>

            {/* Liabilities */}
            <div>
              <h4 className="font-semibold border-b border-[#c0c0c0] pb-2 mb-2">LIABILITIES</h4>
              {liabilities.map(account => (
                <div key={account.account_id} className="flex justify-between py-1 text-sm">
                  <span className="pl-4">{account.account_name}</span>
                  <span>{Math.abs(account.balance).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-semibold border-t border-[#c0c0c0] mt-2">
                <span>Total Liabilities</span>
                <span>{totalLiabilities.toLocaleString()}</span>
              </div>
            </div>

            {/* Equity */}
            <div>
              <h4 className="font-semibold border-b border-[#c0c0c0] pb-2 mb-2">EQUITY</h4>
              {equity.map(account => (
                <div key={account.account_id} className="flex justify-between py-1 text-sm">
                  <span className="pl-4">{account.account_name}</span>
                  <span>{Math.abs(account.balance).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-semibold border-t border-[#c0c0c0] mt-2">
                <span>Total Equity</span>
                <span>{totalEquity.toLocaleString()}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between py-3 font-semibold border-t-2 border-[#808080] text-lg">
              <span>Total Liabilities and Equity</span>
              <span>{(totalLiabilities + totalEquity).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profit-loss' && (
        <div className="bg-white border border-[#c0c0c0] rounded p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">{currentEntity?.name}</h2>
            <h3 className="text-lg">Statement of Profit or Loss</h3>
            <p className="text-sm text-[#666]">
              For the period {periodList.find((p) => p.id === filterPeriod)?.from} to{' '}
              {periodList.find((p) => p.id === filterPeriod)?.to}
            </p>
          </div>

          <div className="space-y-6">
            {/* Income */}
            <div>
              <h4 className="font-semibold border-b border-[#c0c0c0] pb-2 mb-2">INCOME</h4>
              {income.map(account => (
                <div key={account.account_id} className="flex justify-between py-1 text-sm">
                  <span className="pl-4">{account.account_name}</span>
                  <span>{Math.abs(account.balance).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-semibold border-t border-[#c0c0c0] mt-2">
                <span>Total Income</span>
                <span>{totalIncome.toLocaleString()}</span>
              </div>
            </div>

            {/* Expenses */}
            <div>
              <h4 className="font-semibold border-b border-[#c0c0c0] pb-2 mb-2">EXPENSES</h4>
              {expenses.map(account => (
                <div key={account.account_id} className="flex justify-between py-1 text-sm">
                  <span className="pl-4">{account.account_name}</span>
                  <span>{account.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-semibold border-t border-[#c0c0c0] mt-2">
                <span>Total Expenses</span>
                <span>{totalExpenses.toLocaleString()}</span>
              </div>
            </div>

            {/* Net Profit/Loss */}
            <div className={`flex justify-between py-3 font-semibold border-t-2 border-[#808080] text-lg ${
              netProfit >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              <span>Net {netProfit >= 0 ? 'Profit' : 'Loss'}</span>
              <span>{Math.abs(netProfit).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
