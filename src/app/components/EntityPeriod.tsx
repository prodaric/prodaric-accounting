import { useState } from 'react';
import { Plus } from 'lucide-react';
import { entities, periods as getPeriodsForEntity } from '../data/mockData';

export function EntityPeriod() {
  const [selectedEntity, setSelectedEntity] = useState(entities[0].id);
  const entityPeriods = getPeriodsForEntity(selectedEntity);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Entity & Period</h1>

      {/* Entity Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#333] mb-2">
          Select Entity
        </label>
        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="w-full max-w-md px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
        >
          {entities.map(entity => (
            <option key={entity.id} value={entity.id}>
              {entity.name} ({entity.jurisdiction})
            </option>
          ))}
        </select>
      </div>

      {/* Periods List */}
      <div className="bg-white border border-[#c0c0c0] rounded">
        <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center justify-between bg-[#f5f5f5]">
          <h2 className="font-medium">Periods</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#e0e0e0] hover:bg-[#d0d0d0] border border-[#c0c0c0] rounded text-sm">
            <Plus size={16} />
            New Period
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">From</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">To</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entityPeriods.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#999]">
                    No periods found for this entity
                  </td>
                </tr>
              ) : (
                entityPeriods.map((period, index) => (
                  <tr
                    key={period.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                  >
                    <td className="px-4 py-2 text-sm">{period.from}</td>
                    <td className="px-4 py-2 text-sm">{period.to}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                        period.status === 'open' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-[#e0e0e0] text-[#666]'
                      }`}>
                        {period.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button className="text-[#555] hover:text-[#1a1a1a] hover:underline mr-3">
                        View
                      </button>
                      {period.status === 'open' && (
                        <button className="text-[#555] hover:text-[#1a1a1a] hover:underline">
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entity Details */}
      <div className="mt-6 p-4 bg-[#f9f9f9] border border-[#e0e0e0] rounded">
        <h3 className="font-medium mb-3">Entity Information</h3>
        {entities.find(e => e.id === selectedEntity) && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[#666]">Name</div>
              <div className="font-medium">
                {entities.find(e => e.id === selectedEntity)?.name}
              </div>
            </div>
            <div>
              <div className="text-[#666]">Jurisdiction</div>
              <div className="font-medium">
                {entities.find(e => e.id === selectedEntity)?.jurisdiction}
              </div>
            </div>
            <div>
              <div className="text-[#666]">Currency</div>
              <div className="font-medium">
                {entities.find(e => e.id === selectedEntity)?.currency}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
