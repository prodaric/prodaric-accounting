import { useState } from 'react';
import { Link } from 'react-router';
import { Filter, Download } from 'lucide-react';
import { entities, periods as getPeriodsForEntity, getEntriesForEntityPeriod } from '../data/mockData';

export function Ledger() {
  const [filterEntity, setFilterEntity] = useState(entities[0].id);
  const periodListForEntity = getPeriodsForEntity(filterEntity);
  const [filterPeriod, setFilterPeriod] = useState(() => getPeriodsForEntity(entities[0].id)[0]?.id ?? '');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const entries = filterPeriod ? getEntriesForEntityPeriod(filterEntity, filterPeriod) : [];
  const filteredEntries = entries.filter((entry) => {
    let matches = true;
    if (filterEntity) matches = matches && entry.entity_id === filterEntity;
    if (filterPeriod) matches = matches && entry.period_id === filterPeriod;
    if (dateFrom) matches = matches && entry.date >= dateFrom;
    if (dateTo) matches = matches && entry.date <= dateTo;
    return matches;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Ledger (Journal)</h1>
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
              {periodListForEntity.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.from} to {period.to}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            />
          </div>
        </div>
      </fieldset>

      {/* Entries Table */}
      <div className="bg-white border border-[#c0c0c0] rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Entry ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Reference</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Description</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Total Debit</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-[#666]">Total Credit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, index) => {
                const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
                const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit, 0);
                
                return (
                  <tr
                    key={entry.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                  >
                    <td className="px-4 py-2 text-sm font-mono">{entry.id}</td>
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

      <div className="mt-4 text-sm text-[#666]">
        Showing {filteredEntries.length} entries
      </div>
    </div>
  );
}
