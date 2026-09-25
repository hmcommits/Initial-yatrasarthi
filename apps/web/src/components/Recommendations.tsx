import { useState } from 'react';
import { Zap, Check, X, Info } from 'lucide-react';
import { mockFlights, mockHotels } from '../data/mockData';

type Tab = 'flights' | 'hotels';

export function Recommendations() {
  const [tab, setTab] = useState<Tab>('flights');

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-lg" style={{ color: '#1B211C' }}>Personalized recommendations</h3>
          <p className="text-sm mt-0.5" style={{ color: '#6F756C' }}>Based on your group's preferences and meetup requirements</p>
        </div>
        <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: '#E3E2D7' }}>
          {(['flights', 'hotels'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 text-sm font-medium capitalize transition-all"
              style={{
                background: tab === t ? '#F28A28' : 'white',
                color: tab === t ? 'white' : '#6F756C',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'flights' ? <FlightRecs /> : <HotelRecs />}
    </div>
  );
}

function FlightRecs() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {mockFlights.map(f => (
        <div
          key={f.id}
          className="rounded-xl p-4 transition-all cursor-pointer"
          style={{
            border: selected === f.id ? '2px solid #F28A28' : f.recommended ? '1px solid #F28A28' : '1px solid #E3E2D7',
            background: selected === f.id ? 'rgba(242,138,40,0.04)' : 'white',
          }}
          onClick={() => setSelected(f.id)}
        >
          <div className="flex items-start gap-4 flex-wrap">
            {/* Airline info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-bold" style={{ color: '#1B211C' }}>{f.airline} {f.number}</span>
                {f.recommended && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(242,138,40,0.12)', color: '#D96D16' }}>
                    <Zap size={9} />
                    Recommended
                  </span>
                )}
                <span
                  className="text-xs font-bold ml-auto"
                  style={{
                    color: f.compatScore >= 90 ? '#62A86B' : f.compatScore >= 75 ? '#E5A43F' : '#6F756C',
                  }}
                >
                  {f.compatScore}% match
                </span>
              </div>

              <div className="flex items-center gap-6 mb-3">
                <div>
                  <div className="font-bold text-xl" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>{f.dep}</div>
                  <div className="text-xs" style={{ color: '#6F756C' }}>{f.from}</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs mb-1" style={{ color: '#6F756C' }}>{f.duration}</div>
                  <div className="w-full h-px relative" style={{ background: '#E3E2D7' }}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#F28A28' }} />
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#A8C39A' }}>Direct</div>
                </div>
                <div>
                  <div className="font-bold text-xl" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>{f.arr}</div>
                  <div className="text-xs" style={{ color: '#6F756C' }}>{f.to}</div>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap text-xs" style={{ color: '#6F756C' }}>
                <span className="flex items-center gap-1">
                  {f.cancellation === 'Flexible' ? <Check size={10} style={{ color: '#62A86B' }} /> : <X size={10} style={{ color: '#E45B4D' }} />}
                  {f.cancellation}
                </span>
                <span>{f.baggage} baggage</span>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="text-right flex-shrink-0">
              <div className="font-extrabold text-2xl" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>₹{f.price.toLocaleString()}</div>
              <div className="text-xs mb-3" style={{ color: '#6F756C' }}>per person</div>
              <button
                onClick={e => { e.stopPropagation(); setSelected(f.id); }}
                className="btn-primary text-xs px-4 py-2"
                style={{ opacity: !f.recommended && selected !== f.id ? 0.8 : 1 }}
              >
                {selected === f.id ? '✓ Selected' : 'Select'}
              </button>
            </div>
          </div>

          {/* Why recommendation */}
          <div className="mt-3 p-3 rounded-xl flex items-start gap-2" style={{ background: '#EEF1E5' }}>
            <Info size={12} style={{ color: '#66855A', flexShrink: 0, marginTop: 1 }} />
            <p className="text-xs" style={{ color: '#6F756C' }}>{f.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function HotelRecs() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {mockHotels.map(h => (
        <div
          key={h.id}
          className="rounded-xl overflow-hidden transition-all cursor-pointer"
          style={{
            border: selected === h.id ? '2px solid #F28A28' : h.recommended ? '1px solid #F28A28' : '1px solid #E3E2D7',
          }}
          onClick={() => setSelected(h.id)}
        >
          <div className="flex gap-0 flex-col sm:flex-row">
            <div className="sm:w-44 h-36 sm:h-auto flex-shrink-0 overflow-hidden" style={{ background: '#EEF1E5' }}>
              <img src={h.image} alt={h.name} className="w-full h-full object-cover" style={{ minHeight: 144 }} />
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold" style={{ color: '#1B211C' }}>{h.name}</span>
                    {h.recommended && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(242,138,40,0.12)', color: '#D96D16' }}>
                        Best group fit
                      </span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#6F756C' }}>{h.area} · ★ {h.rating}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-xl" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>₹{h.price.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: '#6F756C' }}>per night</div>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap text-xs mb-3" style={{ color: '#6F756C' }}>
                <span className="flex items-center gap-1">
                  <Check size={10} style={{ color: '#62A86B' }} />
                  {h.dist}
                </span>
                <span className="flex items-center gap-1">
                  {h.cancellation.startsWith('Free') ? <Check size={10} style={{ color: '#62A86B' }} /> : <X size={10} style={{ color: '#E45B4D' }} />}
                  {h.cancellation}
                </span>
                <span>Group fit: {h.groupFit}</span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#66855A', maxWidth: 280 }}>{h.reason}</p>
                <button
                  onClick={e => { e.stopPropagation(); setSelected(h.id); }}
                  className="btn-primary text-xs px-4 py-2 flex-shrink-0 ml-3"
                >
                  {selected === h.id ? '✓ Selected' : 'Select'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
