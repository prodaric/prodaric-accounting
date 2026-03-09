import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { entities, periods as getPeriodsForEntity, sustainabilityMetrics as getSustainabilityMetrics } from '../data/mockData';
import type { SustainabilityMetric } from '../types';

export function Sustainability() {
  const [selectedEntity, setSelectedEntity] = useState(entities[0].id);
  const periodList = getPeriodsForEntity(selectedEntity);
  const [selectedPeriod, setSelectedPeriod] = useState(periodList[0]?.id ?? '');

  // Al cambiar entidad, resetear período al primero disponible
  useEffect(() => {
    const list = getPeriodsForEntity(selectedEntity);
    setSelectedPeriod(list[0]?.id ?? '');
  }, [selectedEntity]);

  const metrics = selectedPeriod ? getSustainabilityMetrics(selectedEntity, selectedPeriod) : [];
  const [newMetric, setNewMetric] = useState({
    scope: 'scope1' as 'scope1' | 'scope2' | 'scope3',
    name: '',
    value: 0,
    unit: 'tCO2e'
  });

  const filteredMetrics = metrics;

  const addMetric = () => {
    if (newMetric.name && newMetric.value > 0) {
      const metric: SustainabilityMetric = {
        id: String(metrics.length + 1),
        entity_id: selectedEntity,
        period_id: selectedPeriod,
        ...newMetric
      };
      // En mock solo se reflejaría con backend real (upsert_sustainability_metric)
      setNewMetric({
        scope: 'scope1',
        name: '',
        value: 0,
        unit: 'tCO2e'
      });
    }
  };

  const removeMetric = (_id: string) => {
    // En mock no persiste; con backend real se llamaría API de borrado
  };

  const getScopeLabel = (scope: string) => {
    const labels = {
      scope1: 'Scope 1 (Direct)',
      scope2: 'Scope 2 (Indirect - Energy)',
      scope3: 'Scope 3 (Value Chain)'
    };
    return labels[scope as keyof typeof labels] || scope;
  };

  const totalEmissions = filteredMetrics.reduce((sum, m) => sum + m.value, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Sustainability (IFRS S1/S2)</h1>

      {/* Context Selection */}
      <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded bg-[#f9f9f9]">
        <legend className="px-2 text-sm font-medium text-[#666]">Reporting Context</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-[#333] mb-1">Entity</label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
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
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
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

      {/* Summary */}
      <div className="mb-6 p-4 bg-[#f0f9f0] border border-[#c0e0c0] rounded">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-[#666]">Total Emissions</div>
            <div className="text-2xl font-semibold text-green-800">
              {totalEmissions.toFixed(2)} tCO2e
            </div>
          </div>
          <div className="text-right text-sm text-[#555]">
            <div>Scope 1: {filteredMetrics.filter(m => m.scope === 'scope1').reduce((s, m) => s + m.value, 0).toFixed(2)} tCO2e</div>
            <div>Scope 2: {filteredMetrics.filter(m => m.scope === 'scope2').reduce((s, m) => s + m.value, 0).toFixed(2)} tCO2e</div>
            <div>Scope 3: {filteredMetrics.filter(m => m.scope === 'scope3').reduce((s, m) => s + m.value, 0).toFixed(2)} tCO2e</div>
          </div>
        </div>
      </div>

      {/* Metrics List */}
      <fieldset className="mb-6 p-4 border border-[#c0c0c0] rounded">
        <legend className="px-2 text-sm font-medium text-[#666]">Climate Metrics (IFRS S2)</legend>
        <div className="mt-2">
          {filteredMetrics.length > 0 ? (
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-[#f5f5f5] border-b border-[#c0c0c0]">
                  <th className="px-3 py-2 text-left text-xs font-medium text-[#666]">Scope</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[#666]">Metric Name</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-[#666]">Value</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[#666]">Unit</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-[#666] w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMetrics.map((metric, index) => (
                  <tr key={metric.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                    <td className="px-3 py-2 text-sm">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                        metric.scope === 'scope1' ? 'bg-red-100 text-red-800' :
                        metric.scope === 'scope2' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getScopeLabel(metric.scope)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm">{metric.name}</td>
                    <td className="px-3 py-2 text-sm text-right font-medium">{metric.value.toFixed(2)}</td>
                    <td className="px-3 py-2 text-sm">{metric.unit}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => removeMetric(metric.id)}
                        className="p-1 hover:bg-[#e0e0e0] rounded"
                      >
                        <Trash2 size={16} className="text-[#666]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-sm text-[#999]">
              No metrics recorded for this period
            </div>
          )}

          {/* Add New Metric */}
          <div className="p-3 bg-[#f9f9f9] border border-[#e0e0e0] rounded">
            <div className="text-xs font-medium text-[#666] mb-2">Add New Metric</div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <select
                value={newMetric.scope}
                onChange={(e) => setNewMetric({ ...newMetric, scope: e.target.value as any })}
                className="px-2 py-1.5 bg-white border border-[#c0c0c0] rounded text-sm"
              >
                <option value="scope1">Scope 1</option>
                <option value="scope2">Scope 2</option>
                <option value="scope3">Scope 3</option>
              </select>
              <input
                type="text"
                placeholder="Metric name"
                value={newMetric.name}
                onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
                className="md:col-span-2 px-2 py-1.5 bg-white border border-[#c0c0c0] rounded text-sm"
              />
              <input
                type="number"
                placeholder="Value"
                min="0"
                step="0.01"
                value={newMetric.value || ''}
                onChange={(e) => setNewMetric({ ...newMetric, value: Number(e.target.value) })}
                className="px-2 py-1.5 bg-white border border-[#c0c0c0] rounded text-sm"
              />
              <button
                onClick={addMetric}
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white hover:bg-[#f0f0f0] border border-[#c0c0c0] rounded text-sm"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Info */}
      <div className="p-4 bg-[#f9f9f9] border border-[#e0e0e0] rounded text-sm text-[#555]">
        <strong>Note:</strong> This module supports IFRS S1 (General Requirements for Disclosure of
        Sustainability-related Financial Information) and IFRS S2 (Climate-related Disclosures). Record
        greenhouse gas emissions across Scope 1 (direct), Scope 2 (indirect from energy), and Scope 3
        (value chain) to comply with climate disclosure requirements.
      </div>
    </div>
  );
}
