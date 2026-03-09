import { useState } from 'react';
import { Filter, Download, CheckCircle2, XCircle } from 'lucide-react';
import { auditLog as getAuditLog } from '../data/mockData';

export function AuditLog() {
  const [filterUser, setFilterUser] = useState('');
  const [filterTenant, setFilterTenant] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const logs = getAuditLog();
  const filteredLogs = logs.filter((log) => {
    let matches = true;
    if (filterUser && !log.user.toLowerCase().includes(filterUser.toLowerCase())) matches = false;
    if (filterTenant && !log.tenant.toLowerCase().includes(filterTenant.toLowerCase())) matches = false;
    if (filterAction && !log.action.toLowerCase().includes(filterAction.toLowerCase())) matches = false;
    if (dateFrom && log.timestamp < dateFrom) matches = false;
    if (dateTo && log.timestamp > dateTo) matches = false;
    return matches;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Audit Log</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">User</label>
            <input
              type="text"
              placeholder="Filter by user..."
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Tenant</label>
            <input
              type="text"
              placeholder="Filter by tenant..."
              value={filterTenant}
              onChange={(e) => setFilterTenant(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Action</label>
            <input
              type="text"
              placeholder="e.g., journal:write"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">From Date</label>
            <input
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">To Date</label>
            <input
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            />
          </div>
        </div>
      </fieldset>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#c0c0c0] rounded">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f5f5] border-b border-[#e0e0e0]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Timestamp</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">User</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Tenant</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Action</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Resource</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-[#666]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                >
                  <td className="px-4 py-2 text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-sm">{log.user}</td>
                  <td className="px-4 py-2 text-sm">{log.tenant}</td>
                  <td className="px-4 py-2 text-sm font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-2 text-sm font-mono text-xs">{log.resource}</td>
                  <td className="px-4 py-2 text-center">
                    {log.status === 'success' ? (
                      <div className="flex items-center justify-center gap-1 text-green-700">
                        <CheckCircle2 size={16} />
                        <span className="text-xs">OK</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-red-700">
                        <XCircle size={16} />
                        <span className="text-xs">Failed</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-[#666]">
        Showing {filteredLogs.length} of {auditLog.length} entries
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-[#f9f9f9] border border-[#e0e0e0] rounded text-sm text-[#555]">
        <strong>Note:</strong> The audit log records all sensitive operations including journal entries,
        configuration changes, and user management actions. Logs are immutable and comply with ISA
        (International Standards on Auditing) requirements for evidence and traceability.
      </div>
    </div>
  );
}
