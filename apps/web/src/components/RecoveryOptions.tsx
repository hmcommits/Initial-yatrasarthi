import { useState } from 'react';
import type { RecoveryOption, UserPreferences } from '../types';
import { Check, X, ChevronRight } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RecoveryOptionsProps {
  plans: RecoveryOption[];
  preferences: UserPreferences;
  onPreferencesChange: (p: UserPreferences) => void;
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string;
}

export function RecoveryOptions({ plans, preferences, onPreferencesChange, onSelectPlan, selectedPlan }: RecoveryOptionsProps) {
  const [view, setView] = useState<'cards' | 'compare'>('cards');
  const [quoteTimer] = useState(8);

  const scatterData = plans.map((p, i) => ({
    x: p.netCost,
    y: parseInt(p.arrivalTime.replace(':', '')),
    name: p.name,
    color: ['#6D9EEB', '#F28C28', '#A9C39A'][i % 3],
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-lg" style={{ color: '#1D211C' }}>YatraSarthi found {plans.length} recovery paths</h3>
          <p className="text-sm mt-0.5" style={{ color: '#73776E' }}>Ranked by your preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl overflow-hidden border">
            <button onClick={() => setView('cards')} className={`px-3 py-1.5 text-xs font-medium ${view === 'cards' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500'}`}>Cards</button>
            <button onClick={() => setView('compare')} className={`px-3 py-1.5 text-xs font-medium ${view === 'compare' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500'}`}>Compare</button>
          </div>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <PlanCard key={plan.optionId} plan={plan} rank={i} isTop={plan.recommended} selected={selectedPlan === plan.optionId} onSelect={() => onSelectPlan?.(plan.optionId)} />
          ))}
        </div>
      ) : (
        <ParetoView data={scatterData} plans={plans} />
      )}
    </div>
  );
}

function PlanCard({ plan, rank, isTop, selected, onSelect }: { plan: RecoveryOption; rank: number; isTop: boolean; selected: boolean; onSelect: () => void }) {
  const colors = ['#F28C28', '#6D9EEB', '#A9C39A'];
  const color = colors[rank] || '#E3E2D7';

  return (
    <div className="card p-5 cursor-pointer transition-all border" style={{ borderColor: selected ? color : '#E3E2D7' }} onClick={onSelect}>
      {isTop && <div className="text-xs font-bold mb-3 px-2 py-1 rounded-full inline-block" style={{ background: `${color}18`, color }}>⭐ Recommended</div>}
      <div className="font-bold text-sm mb-3">{plan.name}</div>
      <div className="my-3 text-2xl font-extrabold">+₹{plan.netCost.toLocaleString()}</div>
      <div className="flex flex-col gap-1.5 mb-4">
        <div className="text-xs text-gray-500"><Check size={12} className="inline mr-1 text-green-500" />Arrival: {plan.arrivalTime}</div>
        {plan.nodesDropped?.map(d => (
          <div key={d} className="text-xs text-gray-500"><X size={12} className="inline mr-1 text-red-500" />Drops node: {d}</div>
        ))}
      </div>
      <button className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{ background: selected ? color : `${color}15`, color: selected ? 'white' : color }}>
        {selected ? '✓ Selected' : 'Review plan'}
      </button>
    </div>
  );
}

function ParetoView({ data, plans }: { data: any[]; plans: RecoveryOption[] }) {
  return (
    <div className="card p-6">
      <h4 className="font-semibold mb-2">Trade-off comparison</h4>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke="#E3E2D7" strokeDasharray="4 4" />
            <XAxis type="number" dataKey="x" name="Cost" tickFormatter={v => `₹${v}`} />
            <YAxis type="number" dataKey="y" name="Arrival" />
            <Tooltip />
            {data.map((d, i) => <Scatter key={i} data={[d]} fill={d.color} name={d.name} />)}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
