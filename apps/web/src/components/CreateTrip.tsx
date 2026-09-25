import { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, Trash2, Check, Upload, FileText, MessageSquare, Image, PenLine, Mail, AlertTriangle } from 'lucide-react';
import { Recommendations } from './Recommendations';

interface CreateTripProps {
  onNavigate: (page: string) => void;
  onTripCreated: () => void;
}

type Mode = 'choose' | 'create' | 'import';
type CreateStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ImportStage = 'upload' | 'extracting' | 'review' | 'confirm';

interface TravelerEntry {
  name: string;
  origin: string;
  mode: string;
}

export function CreateTrip({ onNavigate, onTripCreated }: CreateTripProps) {
  const [mode, setMode] = useState<Mode>('choose');

  if (mode === 'choose') return <ChooseMode onChoose={setMode} />;
  if (mode === 'create') return <CreateFromScratch onNavigate={onNavigate} onTripCreated={onTripCreated} onBack={() => setMode('choose')} />;
  return <ImportFlow onNavigate={onNavigate} onTripCreated={onTripCreated} onBack={() => setMode('choose')} />;
}

function ChooseMode({ onChoose }: { onChoose: (m: Mode) => void }) {
  return (
    <div className="min-h-screen pb-20 md:pb-8 flex items-center justify-center px-5" style={{ background: '#F7F5EC' }}>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-extrabold mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#1B211C', letterSpacing: '-0.02em' }}>
            Let's build your trip.
          </h1>
          <p style={{ color: '#6F756C', fontSize: '1.05rem' }}>Start from scratch, or bring what you already have.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => onChoose('create')}
            className="card p-8 text-left hover:shadow-lg transition-all group"
            style={{ cursor: 'pointer' }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #F28A28, #D96D16)' }}>
              <Plus size={22} color="white" />
            </div>
            <h2 className="font-bold text-xl mb-2" style={{ color: '#1B211C' }}>Plan a new trip</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6F756C' }}>
              Tell us about your group, starting points, dates and preferences. We'll build the connected itinerary.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#F28A28' }}>
              Get started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onChoose('import')}
            className="card p-8 text-left hover:shadow-lg transition-all group"
            style={{ cursor: 'pointer' }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #A8C39A, #66855A)' }}>
              <Upload size={22} color="white" />
            </div>
            <h2 className="font-bold text-xl mb-2" style={{ color: '#1B211C' }}>Import existing bookings</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6F756C' }}>
              Already booked? Upload PDFs, screenshots, emails or SMS. YatraSarthi extracts and connects everything.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#66855A' }}>
              Import bookings <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateFromScratch({ onNavigate, onTripCreated, onBack }: { onNavigate: (p: string) => void; onTripCreated: () => void; onBack: () => void }) {
  const [step, setStep] = useState<CreateStep>(1);
  const [destination, setDestination] = useState('Goa');
  const [startDate, setStartDate] = useState('2024-09-24');
  const [endDate, setEndDate] = useState('2024-09-27');
  const [travelers, setTravelers] = useState<TravelerEntry[]>([
    { name: 'Harsh', origin: 'Mumbai', mode: 'flight' },
    { name: 'Tanvi', origin: 'Pune', mode: 'train' },
  ]);
  const [budget, setBudget] = useState('medium');
  const [travelPref, setTravelPref] = useState<string[]>(['beach', 'food']);
  const [showRecs, setShowRecs] = useState(false);

  const totalSteps = 6;

  const addTraveler = () => setTravelers(t => [...t, { name: '', origin: '', mode: 'flight' }]);
  const removeTraveler = (i: number) => setTravelers(t => t.filter((_, j) => j !== i));

  const interests = ['Beach', 'Food', 'Adventure', 'Culture', 'Nightlife', 'Nature', 'Relaxation', 'Shopping'];
  const modes = ['flight', 'train', 'bus', 'cab'];

  if (showRecs) {
    return (
      <div className="min-h-screen pb-20 md:pb-8" style={{ background: '#F7F5EC' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
          <button onClick={() => setShowRecs(false)} className="btn-ghost mb-6 text-sm">
            <ArrowLeft size={16} /> Back to review
          </button>
          <div className="mb-6">
            <h2 className="font-extrabold text-2xl mb-1" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>Recommendations for your group</h2>
            <p style={{ color: '#6F756C' }}>Based on {travelers.length} travelers, {destination}, and your preferences</p>
          </div>
          <Recommendations />
          <div className="mt-6 flex justify-end">
            <button onClick={() => { onTripCreated(); onNavigate('recovery'); }} className="btn-primary px-6 py-3">
              Save trip & continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ background: '#F7F5EC' }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8">

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={step > 1 ? () => setStep(s => (s - 1) as CreateStep) : onBack} className="btn-ghost text-sm" style={{ padding: '6px 8px' }}>
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#E3E2D7' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(step / totalSteps) * 100}%`, background: '#F28A28' }} />
          </div>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#6F756C' }}>{step} of {totalSteps}</span>
        </div>

        {/* Step content */}
        {step === 1 && (
          <StepCard title="Where are you going?" step="01">
            <label className="block text-sm font-medium mb-2" style={{ color: '#6F756C' }}>Destination</label>
            <input
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-base font-medium"
              style={{ border: '1px solid #E3E2D7', background: 'white', outline: 'none', color: '#1B211C' }}
              placeholder="e.g. Goa, Manali, Jaipur…"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {['Goa', 'Manali', 'Jaipur', 'Kerala', 'Ladakh', 'Coorg'].map(d => (
                <button key={d} onClick={() => setDestination(d)} className="px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{ background: destination === d ? 'rgba(242,138,40,0.1)' : '#EEF1E5', color: destination === d ? '#F28A28' : '#6F756C', fontWeight: destination === d ? 600 : 400, border: `1px solid ${destination === d ? 'rgba(242,138,40,0.3)' : '#E3E2D7'}` }}>
                  {d}
                </button>
              ))}
            </div>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="When are you traveling?" step="02">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6F756C' }}>From</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ border: '1px solid #E3E2D7', background: 'white', outline: 'none', color: '#1B211C' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6F756C' }}>To</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ border: '1px solid #E3E2D7', background: 'white', outline: 'none', color: '#1B211C' }} />
              </div>
            </div>
          </StepCard>
        )}

        {step === 3 && (
          <StepCard title="Who's coming — and from where?" step="03">
            <p className="text-sm mb-5" style={{ color: '#6F756C' }}>Each traveler can start from a different location and use a different transport mode.</p>
            <div className="flex flex-col gap-3">
              {travelers.map((t, i) => (
                <div key={i} className="card-inset p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: '#1B211C' }}>Traveler {i + 1}</span>
                    {travelers.length > 1 && (
                      <button onClick={() => removeTraveler(i)} className="btn-ghost text-xs" style={{ padding: '4px 6px', color: '#E45B4D' }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input value={t.name} onChange={e => setTravelers(tv => tv.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                      placeholder="Name" className="px-3 py-2 rounded-lg text-sm col-span-1"
                      style={{ border: '1px solid #E3E2D7', background: 'white', outline: 'none', color: '#1B211C' }} />
                    <input value={t.origin} onChange={e => setTravelers(tv => tv.map((x, j) => j === i ? { ...x, origin: e.target.value } : x))}
                      placeholder="Starting city" className="px-3 py-2 rounded-lg text-sm col-span-1"
                      style={{ border: '1px solid #E3E2D7', background: 'white', outline: 'none', color: '#1B211C' }} />
                    <select value={t.mode} onChange={e => setTravelers(tv => tv.map((x, j) => j === i ? { ...x, mode: e.target.value } : x))}
                      className="px-3 py-2 rounded-lg text-sm col-span-1 capitalize"
                      style={{ border: '1px solid #E3E2D7', background: 'white', outline: 'none', color: '#1B211C' }}>
                      {modes.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              <button onClick={addTraveler} className="btn-secondary py-2.5 text-sm w-full">
                <Plus size={14} /> Add traveler
              </button>
            </div>
          </StepCard>
        )}

        {step === 4 && (
          <StepCard title="What's your budget?" step="04">
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'budget', label: 'Budget', sub: 'Up to ₹5,000/day', icon: '💸' },
                { id: 'medium', label: 'Comfortable', sub: '₹5,000–₹15,000/day', icon: '✈️' },
                { id: 'premium', label: 'Premium', sub: '₹15,000+/day', icon: '⭐' },
              ].map(b => (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  className="p-4 rounded-xl text-center transition-all"
                  style={{
                    border: budget === b.id ? '2px solid #F28A28' : '1px solid #E3E2D7',
                    background: budget === b.id ? 'rgba(242,138,40,0.06)' : 'white',
                  }}
                >
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <div className="font-semibold text-sm" style={{ color: '#1B211C' }}>{b.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6F756C' }}>{b.sub}</div>
                </button>
              ))}
            </div>
          </StepCard>
        )}

        {step === 5 && (
          <StepCard title="What are you into?" step="05">
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => {
                const key = interest.toLowerCase();
                const active = travelPref.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => setTravelPref(p => active ? p.filter(x => x !== key) : [...p, key])}
                    className="px-4 py-2 rounded-full text-sm transition-all"
                    style={{
                      background: active ? 'rgba(242,138,40,0.1)' : '#EEF1E5',
                      border: `1px solid ${active ? 'rgba(242,138,40,0.35)' : '#E3E2D7'}`,
                      color: active ? '#F28A28' : '#6F756C',
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {active ? '✓ ' : ''}{interest}
                  </button>
                );
              })}
            </div>
          </StepCard>
        )}

        {step === 6 && (
          <StepCard title="Cancellation preference?" step="06">
            <div className="flex flex-col gap-3">
              {[
                { id: 'flexible', label: 'Fully flexible', sub: 'Slightly higher cost, free cancellation', icon: '🌿' },
                { id: 'moderate', label: 'Moderate flexibility', sub: 'Balanced cost and flexibility', icon: '⚖️' },
                { id: 'fixed', label: 'Non-refundable', sub: 'Best rates, no changes', icon: '🔒' },
              ].map(o => (
                <button key={o.id} className="p-4 rounded-xl flex items-center gap-3 text-left transition-all"
                  style={{ border: '1px solid #E3E2D7', background: 'white' }}>
                  <span className="text-2xl">{o.icon}</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#1B211C' }}>{o.label}</div>
                    <div className="text-xs" style={{ color: '#6F756C' }}>{o.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </StepCard>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button onClick={() => setStep(s => (s - 1) as CreateStep)} className="btn-secondary px-5 py-3 text-sm">
              <ArrowLeft size={15} /> Back
            </button>
          )}
          {step < totalSteps ? (
            <button
              onClick={() => setStep(s => (s + 1) as CreateStep)}
              className="btn-primary flex-1 py-3 text-sm"
            >
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={() => setShowRecs(true)}
              className="btn-primary flex-1 py-3 text-sm"
            >
              See recommendations →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({ title, step, children }: { title: string; step: string; children: React.ReactNode }) {
  return (
    <div className="animate-slide-up">
      <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: '#A8C39A', letterSpacing: '0.1em' }}>
        STEP {step}
      </div>
      <h2 className="font-extrabold mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1B211C', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   IMPORT FLOW
───────────────────────────────────────────────────────────── */
const extractedItems = [
  { type: 'Flight', icon: '✈', detail: 'IndiGo 6E-781 · Mumbai → Goa · 07:30', ref: '6E781MUM', confidence: 'high' },
  { type: 'Airport Cab', icon: '🚕', detail: 'Ola Prime · Airport pickup · 10:15', ref: 'OLA-88123', confidence: 'high' },
  { type: 'Hotel', icon: '🏨', detail: 'Grand Goa Resort · 3 nights · Check-in 11:00', ref: 'GGR-2024-09', confidence: 'high' },
  { type: 'Activity', icon: '🏝', detail: 'Dudhsagar Trek · 4 persons · 16:00', ref: 'GA-TREK-221', confidence: 'medium' },
  { type: 'Dinner', icon: '🍽', detail: 'Thalassa · Table for 4 · 19:30', ref: 'THA-VIP-6', confidence: 'medium' },
  { type: 'Traveler', icon: '👤', detail: 'Harsh', ref: '—', confidence: 'high' },
  { type: 'Traveler', icon: '👤', detail: 'Tanvi', ref: '—', confidence: 'high' },
];

function ImportFlow({ onNavigate, onTripCreated, onBack }: { onNavigate: (p: string) => void; onTripCreated: () => void; onBack: () => void }) {
  const [stage, setStage] = useState<ImportStage>('upload');
  const [dragging, setDragging] = useState(false);
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});
  const [extracting, setExtracting] = useState(false);

  const allConfirmed = extractedItems.every((_, i) => confirmed[i]);

  const triggerExtract = () => {
    setExtracting(true);
    setStage('extracting');
    setTimeout(() => { setExtracting(false); setStage('review'); }, 2200);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ background: '#F7F5EC' }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8">

        <button onClick={stage === 'upload' ? onBack : () => setStage('upload')} className="btn-ghost text-sm mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        {stage === 'upload' && (
          <div className="animate-slide-up">
            <h1 className="font-extrabold mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: '#1B211C', letterSpacing: '-0.02em' }}>
              Already booked?
            </h1>
            <p className="mb-8" style={{ color: '#6F756C' }}>Bring your itinerary to YatraSarthi. Import once — we handle the rest.</p>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); triggerExtract(); }}
              onClick={triggerExtract}
              className="p-10 rounded-2xl text-center cursor-pointer transition-all mb-6"
              style={{
                border: `2px dashed ${dragging ? '#F28A28' : '#E3E2D7'}`,
                background: dragging ? 'rgba(242,138,40,0.04)' : 'white',
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#EEF1E5' }}>
                <Upload size={22} style={{ color: '#66855A' }} />
              </div>
              <div className="font-semibold mb-1" style={{ color: '#1B211C' }}>Drop files here</div>
              <div className="text-sm" style={{ color: '#6F756C' }}>or click to browse — PDF, screenshot, image</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: FileText, label: 'Upload PDF', color: '#6D9EEB' },
                { icon: Image, label: 'Screenshot', color: '#A8C39A' },
                { icon: MessageSquare, label: 'SMS text', color: '#E5A43F' },
                { icon: Mail, label: 'Email', color: '#F28A28' },
              ].map(ch => (
                <button key={ch.label} onClick={triggerExtract}
                  className="card-sm p-3 flex flex-col items-center gap-2 text-center transition-all hover:shadow-md">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${ch.color}18` }}>
                    <ch.icon size={16} style={{ color: ch.color }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#6F756C' }}>{ch.label}</span>
                </button>
              ))}
            </div>

            <button onClick={triggerExtract} className="btn-secondary w-full py-3 text-sm">
              <PenLine size={15} />
              Add manually instead
            </button>

            {/* Privacy */}
            <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ background: '#EEF1E5' }}>
              <span className="text-lg">🔒</span>
              <p className="text-xs leading-relaxed" style={{ color: '#6F756C' }}>
                <strong style={{ color: '#1B211C' }}>Your data is protected.</strong> Minimum necessary information is collected. Each traveler controls their own data. Encrypted storage. Deleted after trip + claims period.
              </p>
            </div>
          </div>
        )}

        {stage === 'extracting' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-full border-4 border-t-transparent mb-6" style={{ borderColor: '#E3E2D7', borderTopColor: '#F28A28', animation: 'spin-slow 1s linear infinite' }} />
            <h2 className="font-bold text-xl mb-2" style={{ color: '#1B211C' }}>Extracting your bookings…</h2>
            <div className="flex flex-col gap-2 mt-6 text-sm" style={{ color: '#6F756C' }}>
              {['Parsing document…', 'Detecting travel segments…', 'Extracting booking references…', 'Building connections…'].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check size={13} style={{ color: '#62A86B' }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === 'review' && (
          <div className="animate-slide-up">
            <div className="p-4 rounded-xl mb-6 flex items-center gap-3" style={{ background: '#E6F4E8', border: '1px solid #B4D9B8' }}>
              <Check size={16} style={{ color: '#62A86B' }} />
              <span className="font-semibold text-sm" style={{ color: '#2D7836' }}>
                YatraSarthi found {extractedItems.length} travel components.
              </span>
            </div>

            <div className="flex flex-col gap-2.5 mb-6">
              {extractedItems.map((item, i) => (
                <div key={i} className="card-sm p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0" style={{ background: '#EEF1E5' }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm" style={{ color: '#1B211C' }}>{item.type}</div>
                    <div className="text-xs truncate" style={{ color: '#6F756C' }}>{item.detail}</div>
                    {item.ref !== '—' && <div className="text-xs" style={{ color: '#A8C39A', fontFamily: 'monospace' }}>{item.ref}</div>}
                  </div>
                  <div className="flex-shrink-0">
                    {item.confidence === 'high' ? (
                      <span className="text-xs font-semibold badge-confirmed px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={9} /> High
                      </span>
                    ) : (
                      <span className="text-xs font-semibold badge-pending px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle size={9} /> Review
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStage('confirm')} className="btn-primary w-full py-3 text-sm">
              Review & confirm → ({extractedItems.filter(i => i.confidence === 'medium').length} need review)
            </button>
          </div>
        )}

        {stage === 'confirm' && (
          <div className="animate-slide-up">
            <h2 className="font-extrabold text-2xl mb-1" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>Let's make sure we got this right.</h2>
            <p className="mb-6 text-sm" style={{ color: '#6F756C' }}>Confirm each component before it enters the dependency graph. Nothing is saved until you approve it.</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: '#6F756C' }}>{Object.values(confirmed).filter(Boolean).length} / {extractedItems.length} confirmed</span>
              <button onClick={() => setConfirmed(Object.fromEntries(extractedItems.map((_, i) => [i, true])))}
                className="text-xs font-semibold" style={{ color: '#F28A28' }}>Confirm all</button>
            </div>

            <div className="flex flex-col gap-2.5 mb-6">
              {extractedItems.map((item, i) => (
                <div key={i} className="card-sm p-3.5 flex items-center gap-3 transition-all"
                  style={{ border: `1px solid ${confirmed[i] ? '#62A86B' : '#E3E2D7'}` }}>
                  <div className="text-sm w-7 h-7 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: '#EEF1E5' }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm" style={{ color: '#1B211C' }}>{item.type}</div>
                    <div className="text-xs truncate" style={{ color: '#6F756C' }}>{item.detail}</div>
                  </div>
                  <button
                    onClick={() => setConfirmed(c => ({ ...c, [i]: !c[i] }))}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                    style={{ background: confirmed[i] ? '#62A86B' : 'white', border: `2px solid ${confirmed[i] ? '#62A86B' : '#E3E2D7'}` }}
                  >
                    {confirmed[i] && <Check size={13} color="white" />}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => { onTripCreated(); onNavigate('recovery'); }}
              disabled={!allConfirmed}
              className="btn-primary w-full py-3 text-sm"
              style={{ opacity: allConfirmed ? 1 : 0.5, cursor: allConfirmed ? 'pointer' : 'not-allowed' }}
            >
              Save trip & build graph →
            </button>

            {allConfirmed && (
              <div className="mt-3 text-xs text-center" style={{ color: '#62A86B' }}>
                ✓ Trip will be saved. No re-upload needed — YatraSarthi keeps your trip connected.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
