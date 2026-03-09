import { useState } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllAccounts, registerEntry } from '../services/mockBackend';
import type { EntryLine } from '../types';

export function Journal() {
  const { selectedEntity, selectedPeriod, currentUser } = useAuth();
  const [date, setDate] = useState('2026-03-09');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<Omit<EntryLine, 'id' | 'account_code' | 'account_name'>[]>([
    { account_id: '', debit: 0, credit: 0 },
    { account_id: '', debit: 0, credit: 0 }
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>('');

  const accounts = getAllAccounts();

  const addLine = () => {
    setLines([...lines, { account_id: '', debit: 0, credit: 0 }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      const newLines = lines.filter((_, i) => i !== index);
      setLines(newLines);
    }
  };

  const updateLine = (index: number, field: 'account_id' | 'debit' | 'credit', value: string | number) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    // Si se ingresa un débito, limpiar el crédito y viceversa
    if (field === 'debit' && Number(value) > 0) {
      newLines[index].credit = 0;
    } else if (field === 'credit' && Number(value) > 0) {
      newLines[index].debit = 0;
    }
    
    setLines(newLines);
  };

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    if (!selectedEntity || !selectedPeriod || !currentUser) {
      setErrors(['Please select an entity and period']);
      return;
    }

    // Filtrar líneas vacías
    const validLines = lines.filter(line => 
      line.account_id && (line.debit > 0 || line.credit > 0)
    );

    if (validLines.length < 2) {
      setErrors(['Entry must have at least 2 lines']);
      return;
    }

    // Llamar al backend simulado
    const response = registerEntry({
      entity_id: selectedEntity.id,
      period_id: selectedPeriod,
      date,
      reference,
      description,
      lines: validLines,
      created_by: currentUser.name
    });

    if (response.success) {
      setSuccess(`Entry #${response.entry_id} registered successfully! Checksum: ${response.checksum}`);
      
      // Reset form
      setDate('2026-03-09');
      setReference('');
      setDescription('');
      setLines([
        { account_id: '', debit: 0, credit: 0 },
        { account_id: '', debit: 0, credit: 0 }
      ]);
    } else {
      setErrors(response.errors || ['Unknown error occurred']);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Journal Entry</h1>
        <p className="text-sm text-[#666]">
          Register accounting entries following IFRS double-entry principles
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Entry Header */}
        <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded bg-[#f9f9f9]">
          <legend className="px-2 text-sm font-medium text-[#666]">Entry Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#808080]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333] mb-1">
                Reference
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., INV-001"
                className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#808080]"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[#333] mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Brief description of the transaction"
                className="w-full px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#808080]"
              />
            </div>
          </div>
        </fieldset>

        {/* Entry Lines */}
        <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded">
          <legend className="px-2 text-sm font-medium text-[#666]">Entry Lines (Double-Entry)</legend>
          <div className="mt-2">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f5f5f5] border-b border-[#c0c0c0]">
                    <th className="px-3 py-2 text-left text-xs font-medium text-[#666]">Account</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-[#666]">Debit</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-[#666]">Credit</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-[#666] w-16">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                      <td className="px-3 py-2">
                        <select
                          value={line.account_id}
                          onChange={(e) => updateLine(index, 'account_id', e.target.value)}
                          required
                          className="w-full px-2 py-1.5 bg-white border border-[#c0c0c0] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#808080]"
                        >
                          <option value="">Select account...</option>
                          {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                              {account.code} - {account.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.debit || ''}
                          onChange={(e) => updateLine(index, 'debit', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white border border-[#c0c0c0] rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#808080]"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.credit || ''}
                          onChange={(e) => updateLine(index, 'credit', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white border border-[#c0c0c0] rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#808080]"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeLine(index)}
                          disabled={lines.length <= 2}
                          className="p-1 hover:bg-[#e0e0e0] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Remove line"
                        >
                          <Trash2 size={16} className="text-[#666]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#f5f5f5] border-t-2 border-[#808080]">
                    <td className="px-3 py-2 text-sm font-medium">Totals</td>
                    <td className="px-3 py-2 text-sm font-medium text-right">
                      {totalDebit.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-sm font-medium text-right">
                      {totalCredit.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <button
              type="button"
              onClick={addLine}
              className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#f0f0f0] border border-[#c0c0c0] rounded text-sm transition-colors"
            >
              <Plus size={16} />
              Add Line
            </button>
          </div>
        </fieldset>

        {/* Validation Message */}
        <div className="mb-6 p-3 rounded border">
          {isBalanced ? (
            <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 border-green-300">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Entry is balanced</div>
                <div className="text-xs mt-0.5">
                  Debits = Credits = {totalDebit.toFixed(2)} (IFRS Double-Entry compliant)
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border-red-300">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Entry is not balanced</div>
                <div className="text-xs mt-0.5">
                  Debits ({totalDebit.toFixed(2)}) must equal Credits ({totalCredit.toFixed(2)}) 
                  according to IFRS double-entry accounting principles
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-3 rounded border bg-red-50 border-red-300">
            <div className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium mb-1">Validation Errors:</div>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 p-3 rounded border bg-green-50 border-green-300">
            <div className="flex items-start gap-2 text-sm text-green-700">
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Success</div>
                <div className="text-xs mt-0.5">{success}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isBalanced}
            className="px-4 py-2 bg-[#d0d0d0] hover:bg-[#c0c0c0] border border-[#a0a0a0] rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Register Entry
          </button>
          <button
            type="button"
            onClick={() => {
              setDate('2026-03-09');
              setReference('');
              setDescription('');
              setLines([
                { account_id: '', debit: 0, credit: 0 },
                { account_id: '', debit: 0, credit: 0 }
              ]);
              setErrors([]);
              setSuccess('');
            }}
            className="px-4 py-2 bg-white hover:bg-[#f0f0f0] border border-[#c0c0c0] rounded text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-[#f9f9f9] border border-[#e0e0e0] rounded text-sm text-[#555]">
        <div className="font-medium mb-1">IFRS Compliance Notes:</div>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li>All entries must follow the double-entry principle (Debits = Credits)</li>
          <li>Each line must have either a debit OR a credit, not both</li>
          <li>Entry date must be within the selected open period</li>
          <li>Ledger is immutable - entries cannot be deleted, only reversed</li>
          <li>All entries are verified with SHA-256 checksum for audit trail (ISA compliance)</li>
        </ul>
      </div>
    </div>
  );
}
