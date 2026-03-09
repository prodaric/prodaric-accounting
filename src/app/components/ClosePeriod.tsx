import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { entities, periods as getPeriodsForEntity, balances as calculateBalance } from '../data/mockData';

export function ClosePeriod() {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const openPeriods = entities.flatMap((e) => getPeriodsForEntity(e.id).filter((p) => p.status === 'open'));
  const period = selectedPeriod ? openPeriods.find((p) => p.id === selectedPeriod) : null;
  const entity = period ? entities.find((e) => e.id === period.entity_id) : null;
  const balances = period ? calculateBalance(period.entity_id, period.id) : [];

  // Validation checks
  const totalDebit = balances.reduce((sum, b) => sum + b.debit, 0);
  const totalCredit = balances.reduce((sum, b) => sum + b.credit, 0);
  const isBalanced = totalDebit === totalCredit;
  const hasEntries = true; // Mock check

  const validations = [
    { label: 'Period has entries', passed: hasEntries },
    { label: 'Trial balance is balanced', passed: isBalanced },
    { label: 'No pending reconciliations', passed: true },
    { label: 'All transactions validated', passed: true }
  ];

  const canClose = validations.every(v => v.passed);

  const handleClose = () => {
    if (canClose && window.confirm(`Are you sure you want to close period ${period?.from} to ${period?.to}?`)) {
      alert('Period closed successfully!');
      setSelectedPeriod('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Close Period</h1>

      {/* Period Selection */}
      <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded">
        <legend className="px-2 text-sm font-medium text-[#666]">Select Period to Close</legend>
        <div className="mt-2">
          <label className="block text-sm font-medium text-[#333] mb-2">
            Open Periods
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full max-w-md px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
          >
            <option value="">Select a period...</option>
            {openPeriods.map(period => {
              const ent = entities.find(e => e.id === period.entity_id);
              return (
                <option key={period.id} value={period.id}>
                  {ent?.name} - {period.from} to {period.to}
                </option>
              );
            })}
          </select>
        </div>
      </fieldset>

      {selectedPeriod && period && (
        <>
          {/* Period Information */}
          <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded bg-[#f9f9f9]">
            <legend className="px-2 text-sm font-medium text-[#666]">Period Information</legend>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <div className="text-[#666]">Entity</div>
                <div className="font-medium">{entity?.name}</div>
              </div>
              <div>
                <div className="text-[#666]">Jurisdiction</div>
                <div className="font-medium">{entity?.jurisdiction}</div>
              </div>
              <div>
                <div className="text-[#666]">From</div>
                <div className="font-medium">{period.from}</div>
              </div>
              <div>
                <div className="text-[#666]">To</div>
                <div className="font-medium">{period.to}</div>
              </div>
            </div>
          </fieldset>

          {/* Validation Checks */}
          <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded">
            <legend className="px-2 text-sm font-medium text-[#666]">Pre-closing Validations</legend>
            <div className="mt-2 space-y-3">
              {validations.map((validation, index) => (
                <div key={index} className="flex items-center gap-3">
                  {validation.passed ? (
                    <CheckCircle2 size={20} className="text-green-600" />
                  ) : (
                    <AlertCircle size={20} className="text-red-600" />
                  )}
                  <span className="text-sm">{validation.label}</span>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Warning */}
          <div className="mb-6 p-4 bg-[#fffbf0] border border-[#f0e68c] rounded flex items-start gap-3">
            <AlertCircle size={20} className="text-[#d4a017] mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium mb-1">Important Notice</div>
              <p className="text-[#555]">
                Once a period is closed, no new entries can be added to it. Only reversing entries 
                (if permitted by policy) will be allowed. Please ensure all transactions are complete 
                and validated before proceeding.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={!canClose}
              className="px-4 py-2 bg-[#d0d0d0] hover:bg-[#c0c0c0] border border-[#a0a0a0] rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Close Period
            </button>
            <button
              onClick={() => setSelectedPeriod('')}
              className="px-4 py-2 bg-white hover:bg-[#f0f0f0] border border-[#c0c0c0] rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {!selectedPeriod && (
        <div className="text-center py-12 text-sm text-[#999]">
          Select a period to view closing options
        </div>
      )}
    </div>
  );
}
