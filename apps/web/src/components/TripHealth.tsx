import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface TripHealthProps {
  score: number;
  status: string;
  weakestEdge?: { from: string; to: string; slack: number } | null;
}

const breakdown = [
  { label: 'Schedule', score: 92 },
  { label: 'Booking reliability', score: 94 },
  { label: 'Route risk', score: 86 },
  { label: 'Refund flexibility', score: 90 },
];

export function TripHealth({ score, status, weakestEdge }: TripHealthProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore(s => {
          if (s >= score) { clearInterval(interval); return score; }
          return s + 2;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timeout);
  }, [score]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = score >= 80 ? '#63A66B' : score >= 60 ? '#E7A943' : '#E45B4D';
  const statusLabel = score >= 80 ? '🟢 Healthy' : score >= 60 ? '🟠 At Risk' : '🔴 Disrupted';

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold" style={{ color: '#1D211C' }}>Trip Health</h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: '#EEF1E4', color: '#65855A' }}>
          Weakest-link scoring
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <svg width={120} height={120} viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#E3E2D7" strokeWidth="10" />
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.1s' }}
            />
            <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1D211C" fontFamily="Plus Jakarta Sans, sans-serif">
              {animatedScore}
            </text>
            <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#73776E" fontFamily="Plus Jakarta Sans, sans-serif">
              / 100
            </text>
          </svg>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold" style={{ color }}>
            {statusLabel}
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 flex flex-col gap-2.5">
          {breakdown.map(b => (
            <div key={b.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: '#73776E' }}>{b.label}</span>
                <span className="text-xs font-bold" style={{ color: '#1D211C' }}>{b.score}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E3E2D7' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${b.score}%`,
                    background: b.score >= 90 ? '#63A66B' : b.score >= 80 ? '#A9C39A' : '#E7A943',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weakest link */}
      {weakestEdge && (
        <div className="mt-4 p-3 rounded-xl flex items-start gap-3" style={{ background: '#FDF3E3', border: '1px solid #F0C97A' }}>
          <AlertTriangle size={15} style={{ color: '#E7A943', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div className="text-xs font-semibold" style={{ color: '#A05B00' }}>Weakest link</div>
            <div className="text-xs" style={{ color: '#73776E' }}>{weakestEdge.from} → {weakestEdge.to}</div>
            <div className="text-xs mt-0.5" style={{ color: '#73776E' }}>
              {weakestEdge.slack < 0 ? 'Negative slack!' : `Slack: ${weakestEdge.slack}m`} — Suggestion: Add 30 min buffer
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
