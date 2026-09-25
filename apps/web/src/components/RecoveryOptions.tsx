import { useState } from 'react';
import type { RecoveryPlan, UserPreferences } from '../types';
import { Check, X, Clock, Zap, Heart, ChevronRight } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RecoveryOptionsProps {
  plans: RecoveryPlan[];
  preferences: UserPreferences;
  onPreferencesChange: (p: UserPreferences) => void;
  onSelectPlan?: (planId: string) => void;
  selectedPlan?: string;
}

const planIcons: Record<string, React.ReactNode> = {
  '⚡': <Zap size={18} />,
  '🕐': <Clock size={18} />,
  '❤️': <Heart size={18} />,
};

const planColors = ['#6D9EEB', '#F28C28', '#A9C39A'];

export function RecoveryOptions({ plans, preferences, onPreferencesChange, onSelectPlan, selectedPlan }: RecoveryOptionsProps) {
  const [view, setView] = useState<'cards' | 'compare'>('cards');
  const [quoteTimer] = useState(8);

  const ranked = [...plans].sort((a, b) => {
    const scoreA = (a.confidence * preferences.bookings / 100) + ((4000 - a.additionalCost) / 40 * preferences.cost / 100) + ((a.timeSaved || 0) / 130 * 100 * preferences.time / 100);
    const scoreB = (b.confidence * preferences.bookings / 100) + ((4000 - b.additionalCost) / 40 * preferences.cost / 100) + ((b.timeSaved || 0) / 130 * 100 * preferences.time / 100);
    return scoreB - scoreA;
  });

  const scatterData = plans.map((p, i) => ({
    x: p.additionalCost,
    y: parseInt(p.arrivalTime.replace(':', '')),
    name: p.label,
    color: planColors[i],
    confidence: p.confidence,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-lg" style={{ color: '#1D211C' }}>YatraSarthi found {plans.length} recovery paths</h3>
          <p className="text-sm mt-0.5" style={{ color: '#73776E' }}>Ranked by your preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: '#FDF3E3', color: '#A05B00' }}>
            ⏱ Quotes valid ~{quoteTimer} min
          </div>
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: '#E3E2D7' }}>
            <button
              onClick={() => setView('cards')}
              className="px-3 py-1.5 text-xs font-medium transition-all"
              style={{ background: view === 'cards' ? '#F28C28' : 'white', color: view === 'cards' ? 'white' : '#73776E' }}
            >
              Cards
            </button>
            <button
              onClick={() => setView('compare')}
              className="px-3 py-1.5 text-xs font-medium transition-all"
              style={{ background: view === 'compare' ? '#F28C28' : 'white', color: view === 'compare' ? 'white' : '#73776E' }}
            >
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card-sm p-4 mb-6">
        <div className="text-sm font-semibold mb-4" style={{ color: '#1D211C' }}>What matters most on this trip?</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([
            { key: 'cost' as const, label: 'Cost', emoji: '💰' },
            { key: 'time' as const, label: 'Time', emoji: '⏱' },
            { key: 'bookings' as const, label: 'Bookings', emoji: '🧳' },
          ]).map(({ key, label, emoji }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: '#73776E' }}>{emoji} {label}</span>
                <span className="text-sm font-bold" style={{ color: '#1D211C' }}>{preferences[key]}%</span>
              </div>
              <input
                type="range"
                min={0} max={100} step={5}
                value={preferences[key]}
                onChange={e => onPreferencesChange({ ...preferences, [key]: parseInt(e.target.value) })}
                className="preference-slider w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ranked.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              rank={i}
              isTop={i === 0}
              selected={selectedPlan === plan.id}
              onSelect={() => onSelectPlan?.(plan.id)}
              preferences={preferences}
            />
          ))}
        </div>
      ) : (
        <ParetoView data={scatterData} plans={plans} />
      )}
    </div>
  );
}

function PlanCard({ plan, rank, isTop, selected, onSelect, preferences }: {
  plan: RecoveryPlan; rank: number; isTop: boolean; selected: boolean;
  onSelect: () => void; preferences: UserPreferences;
}) {
  const colors = ['#F28C28', '#6D9EEB', '#A9C39A'];
  const color = colors[rank] || '#E3E2D7';

  return (
    <div
      className="card p-5 cursor-pointer transition-all"
      style={{
        border: selected ? `2px solid ${color}` : isTop ? `2px solid ${color}` : '1px solid #E3E2D7',
        boxShadow: selected ? `0 0 0 4px ${color}20` : undefined,
      }}
      onClick={onSelect}
    >
      {isTop && (
        <div className="text-xs font-bold mb-3 px-2 py-1 rounded-full inline-block" style={{ background: `${color}18`, color }}>
          ⭐ Best for your preferences
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <span style={{ fontSize: 16 }}>{plan.icon}</span>
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: '#1D211C' }}>{plan.label}</div>
          <div className="text-xs" style={{ color: '#73776E' }}>{plan.tagline}</div>
        </div>
      </div>

      <div className="my-3 text-2xl font-extrabold" style={{ color: '#1D211C' }}>
        +₹{plan.additionalCost.toLocaleString()}
      </div>

      <div className="flex flex-col gap-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs">
          <Check size={12} style={{ color: '#63A66B' }} />
          <span style={{ color: '#73776E' }}>{plan.bookingsPreserved}/{plan.totalBookings} bookings preserved</span>
        </div>
        {plan.timeSaved && (
          <div className="flex items-center gap-2 text-xs">
            <Check size={12} style={{ color: '#63A66B' }} />
            <span style={{ color: '#73776E' }}>{Math.floor(plan.timeSaved / 60)}h {plan.timeSaved % 60}m saved</span>
          </div>
        )}
        {plan.droppedBookings.map(d => (
          <div key={d} className="flex items-center gap-2 text-xs">
            <X size={12} style={{ color: '#E45B4D' }} />
            <span style={{ color: '#73776E' }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Confidence */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: '#73776E' }}>Confidence</span>
          <span className="text-xs font-bold" style={{ color: '#1D211C' }}>{plan.confidence}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E3E2D7' }}>
          <div className="h-full rounded-full" style={{ width: `${plan.confidence}%`, background: color }} />
        </div>
      </div>

      <button
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: selected ? color : `${color}15`,
          color: selected ? 'white' : color,
        }}
        onClick={e => { e.stopPropagation(); onSelect(); }}
      >
        {selected ? '✓ Selected' : 'Review plan'}
        {!selected && <ChevronRight size={14} />}
      </button>
    </div>
  );
}

function ParetoView({ data, plans }: { data: any[]; plans: RecoveryPlan[] }) {
  return (
    <div className="card p-6">
      <h4 className="font-semibold mb-2" style={{ color: '#1D211C' }}>Trade-off comparison</h4>
      <p className="text-xs mb-4" style={{ color: '#73776E' }}>X: Additional cost · Y: Arrival time (HHMM)</p>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke="#E3E2D7" strokeDasharray="4 4" />
            <XAxis
              type="number"
              dataKey="x"
              name="Cost"
              tickFormatter={v => `₹${v}`}
              label={{ value: 'Additional Cost', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#73776E' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Arrival"
              tickFormatter={v => `${Math.floor(v / 100)}:${String(v % 100).padStart(2, '0')}`}
              label={{ value: 'Arrival', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#73776E' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '4 4' }}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                const plan = plans.find(p => p.label === d.name);
                return (
                  <div className="card-sm p-3 text-xs" style={{ minWidth: 140 }}>
                    <div className="font-bold mb-1" style={{ color: '#1D211C' }}>{d.name}</div>
                    <div style={{ color: '#73776E' }}>Cost: +₹{d.x}</div>
                    <div style={{ color: '#73776E' }}>Arrival: {plan?.arrivalTime}</div>
                    <div style={{ color: '#73776E' }}>Confidence: {d.confidence}%</div>
                    {plan && <div style={{ color: '#73776E' }}>Dropped: {plan.droppedBookings.length}</div>}
                  </div>
                );
              }}
            />
            {data.map((d, i) => (
              <Scatter key={i} data={[d]} fill={d.color} name={d.name} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs mt-3 text-center" style={{ color: '#73776E' }}>
        Lower cost + earlier arrival = better. Pick the option that fits your priorities.
      </p>
    </div>
  );
}
