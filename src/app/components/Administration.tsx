import { useState } from 'react';
import { Plus } from 'lucide-react';
import { entities, periods as getPeriodsForEntity } from '../data/mockData';

type AdminTab = 'entities' | 'periods';

export function Administration() {
  const [activeTab, setActiveTab] = useState<AdminTab>('entities');
  const [selectedEntityId, setSelectedEntityId] = useState(entities[0].id);
  const entityPeriods = getPeriodsForEntity(selectedEntityId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Administration</h1>

      {/* Tabs */}
      <div className="border-b border-[#c0c0c0] mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-4 py-2 text-sm border-b-2 ${
              activeTab === 'entities'
                ? 'border-[#808080] bg-white'
                : 'border-transparent bg-[#f5f5f5] text-[#666] hover:bg-[#e8e8e8]'
            }`}
          >
            Entities
          </button>
          <button
            onClick={() => setActiveTab('periods')}
            className={`px-4 py-2 text-sm border-b-2 ${
              activeTab === 'periods'
                ? 'border-[#808080] bg-white'
                : 'border-transparent bg-[#f5f5f5] text-[#666] hover:bg-[#e8e8e8]'
            }`}
          >
            Periods
          </button>
        </div>
      </div>

      {/* Entities Tab */}
      {activeTab === 'entities' && (
        <div>
          <div className="bg-white border border-[#c0c0c0] rounded">
            <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center justify-between bg-[#f5f5f5]">
              <h2 className="font-medium">Entities</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#e0e0e0] hover:bg-[#d0d0d0] border border-[#c0c0c0] rounded text-sm">
                <Plus size={16} />
                Add Entity
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Jurisdiction</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Currency</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#666]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((entity, index) => (
                    <tr
                      key={entity.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}
                    >
                      <td className="px-4 py-2 text-sm font-medium">{entity.name}</td>
                      <td className="px-4 py-2 text-sm">{entity.jurisdiction}</td>
                      <td className="px-4 py-2 text-sm">{entity.currency}</td>
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
        </div>
      )}

      {/* Periods Tab */}
      {activeTab === 'periods' && (
        <div>
          {/* Entity Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#333] mb-2">
              Select Entity
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full max-w-md px-3 py-2 bg-white border border-[#c0c0c0] rounded text-sm"
            >
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {entity.name} ({entity.jurisdiction})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-[#c0c0c0] rounded">
            <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center justify-between bg-[#f5f5f5]">
              <h2 className="font-medium">Periods for {entities.find(e => e.id === selectedEntityId)?.name}</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#e0e0e0] hover:bg-[#d0d0d0] border border-[#c0c0c0] rounded text-sm">
                <Plus size={16} />
                Add Period
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
                            Edit
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
        </div>
      )}
    </div>
  );
}
