import { useState, useEffect } from 'react';
import { Zap, Check, X, Info } from 'lucide-react';

type Tab = 'flights' | 'hotels';

export function Recommendations() {
  const [activeTab, setActiveTab] = useState<Tab>('flights');
  // For the moment, we just render an empty state or generic suggestions since API isn't built.
  // In a real app, this would fetch from /api/routing/estimate or a flight/hotel aggregator.

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold" style={{ color: '#1D211C' }}>Smart recommendations</h3>
          <p className="text-sm mt-0.5" style={{ color: '#73776E' }}>Based on your group's overall schedule</p>
        </div>
        <div className="text-xs px-2.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5" style={{ background: '#F5F3E8', color: '#1D211C' }}>
          <Zap size={13} style={{ color: '#F28A28' }} />
          Auto-optimizing
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('flights')}
          className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={{ background: activeTab === 'flights' ? '#1D211C' : '#F5F3E8', color: activeTab === 'flights' ? 'white' : '#73776E' }}
        >
          Flights
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={{ background: activeTab === 'hotels' ? '#1D211C' : '#F5F3E8', color: activeTab === 'hotels' ? 'white' : '#73776E' }}
        >
          Hotels
        </button>
      </div>

      <div className="text-sm text-gray-500 py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
        Live recommendations fetching from real providers will appear here once connected.
      </div>
    </div>
  );
}
