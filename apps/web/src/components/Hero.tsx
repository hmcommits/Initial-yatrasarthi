import { ArrowRight, ChevronRight, Shield, Zap, Sparkles, CheckCircle2, CreditCard } from 'lucide-react';
import { useState } from 'react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

/* ──────────────────────────────────────────────
   BEACH SCENE — signature hero visual
────────────────────────────────────────────── */
function BeachScene() {
  const W = 560;
  const H = 420;

  return (
    <div className="relative w-full" style={{ maxWidth: 560 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative w-full rounded-3xl"
        style={{ height: 'auto', aspectRatio: `${W}/${H}`, display: 'block', overflow: 'hidden' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky gradient — warm golden hour */}
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9A3C" />
            <stop offset="35%" stopColor="#FFB347" />
            <stop offset="70%" stopColor="#FFD580" />
            <stop offset="100%" stopColor="#FFF0C0" />
          </linearGradient>
          {/* Sea gradient */}
          <linearGradient id="sea-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A8FD8" />
            <stop offset="60%" stopColor="#0E6FAA" />
            <stop offset="100%" stopColor="#064F82" />
          </linearGradient>
          {/* Sand gradient */}
          <linearGradient id="sand-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5D87C" />
            <stop offset="100%" stopColor="#E8B84B" />
          </linearGradient>
          {/* Sun glow */}
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFEF60" />
            <stop offset="60%" stopColor="#FFB83F" />
            <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
          </radialGradient>
          {/* Water shimmer */}
          <linearGradient id="shimmer-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="card-shadow">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.12)" />
          </filter>
          <clipPath id="scene-clip">
            <rect width={W} height={H} rx="24" />
          </clipPath>
        </defs>

        <g clipPath="url(#scene-clip)">

          {/* ── Sky ── */}
          <rect width={W} height={H} fill="url(#sky-grad)" />

          {/* ── Sun with glow ── */}
          <circle cx="430" cy="85" r="55" fill="url(#sun-grad)" opacity="0.5" className="animate-sun-pulse" />
          <circle cx="430" cy="85" r="32" fill="#FFEF60" opacity="0.9" />
          <circle cx="430" cy="85" r="22" fill="#FFF3A0" />
          {/* Sun reflection strip on water */}
          <ellipse cx="430" cy="268" rx="24" ry="40" fill="rgba(255,220,60,0.22)" className="animate-wave-wash" />

          {/* ── Horizon haze ── */}
          <rect x="0" y="218" width={W} height="14" fill="rgba(255,200,80,0.18)" />

          {/* ── Sea ── */}
          <rect x="0" y="228" width={W} height="192" fill="url(#sea-grad)" />

          {/* ── Wave layers (animated) ── */}
          <g className="animate-wave-1" style={{ transformOrigin: '280px 240px' }}>
            <path
              d="M -30 240 Q 50 234 120 240 Q 200 246 280 240 Q 360 234 440 240 Q 510 246 590 240 L 590 248 Q 510 254 440 248 Q 360 242 280 248 Q 200 254 120 248 Q 50 242 -30 248 Z"
              fill="rgba(255,255,255,0.28)"
            />
          </g>
          <g className="animate-wave-2" style={{ transformOrigin: '280px 265px' }}>
            <path
              d="M -20 268 Q 70 262 150 268 Q 240 274 320 268 Q 400 262 480 268 Q 540 274 590 268 L 590 276 Q 540 282 480 276 Q 400 270 320 276 Q 240 282 150 276 Q 70 270 -20 276 Z"
              fill="rgba(255,255,255,0.22)"
            />
          </g>
          <g className="animate-wave-3" style={{ transformOrigin: '280px 290px' }}>
            <path
              d="M -30 292 Q 60 286 140 292 Q 220 298 300 292 Q 380 286 460 292 Q 530 298 590 292 L 590 300 Q 530 306 460 300 Q 380 294 300 300 Q 220 306 140 300 Q 60 294 -30 300 Z"
              fill="rgba(255,255,255,0.18)"
            />
          </g>

          {/* ── Boat (bobbing) ── */}
          <g className="animate-boat" style={{ transformOrigin: '340px 285px' }}>
            {/* Hull */}
            <path d="M 296 298 Q 340 310 384 298 L 378 308 Q 340 318 302 308 Z" fill="#C0392B" />
            <path d="M 302 308 Q 340 318 378 308 L 376 312 Q 340 320 304 312 Z" fill="#922B21" />
            {/* Deck */}
            <rect x="296" y="290" width="88" height="8" rx="2" fill="#E8E8D0" />
            {/* Mast */}
            <line x1="340" y1="288" x2="340" y2="248" stroke="#8B4513" strokeWidth="2.5" />
            {/* Sail */}
            <path d="M 340 250 L 368 260 L 368 285 L 340 282 Z" fill="rgba(255,250,240,0.95)" stroke="rgba(200,180,120,0.5)" strokeWidth="1" />
            {/* Flag */}
            <path d="M 340 250 L 352 245 L 340 254 Z" fill="#F28A28" />
            {/* Cabin */}
            <rect x="312" y="282" width="28" height="10" rx="2" fill="#D4AC70" />
            <rect x="316" y="284" width="7" height="6" rx="1" fill="#87CEEB" opacity="0.7" />
          </g>

          {/* ── Water shimmer strips ── */}
          <rect x="0" y="310" width={W} height="6" fill="url(#shimmer-grad)" className="animate-wave-wash" style={{ animationDelay: '0.5s' }} />
          <rect x="0" y="340" width={W} height="4" fill="url(#shimmer-grad)" className="animate-wave-wash" style={{ animationDelay: '1.2s' }} />
          <rect x="0" y="370" width={W} height="3" fill="url(#shimmer-grad)" className="animate-wave-wash" style={{ animationDelay: '0.8s' }} />

          {/* ── Shore / Beach ── */}
          <path
            d="M -20 390 Q 80 376 180 382 Q 280 388 380 376 Q 460 368 590 378 L 590 420 L -20 420 Z"
            fill="url(#sand-grad)"
          />
          {/* Wet sand edge */}
          <path
            d="M -20 390 Q 80 376 180 382 Q 280 388 380 376 Q 460 368 590 378 L 590 392 Q 460 382 380 390 Q 280 400 180 396 Q 80 390 -20 404 Z"
            fill="rgba(180,140,60,0.35)"
          />

          {/* ── Palm trees ── */}
          {/* Palm 1 - left */}
          <line x1="68" y1="420" x2="72" y2="340" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
          <line x1="72" y1="342" x2="40" y2="318" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="72" y1="342" x2="104" y2="315" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="72" y1="342" x2="72" y2="308" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="40" cy="316" rx="16" ry="8" fill="#2E7D32" opacity="0.85" transform="rotate(-20, 40, 316)" />
          <ellipse cx="104" cy="313" rx="18" ry="8" fill="#388E3C" opacity="0.85" transform="rotate(15, 104, 313)" />
          <ellipse cx="72" cy="307" rx="16" ry="8" fill="#43A047" opacity="0.85" />
          {/* Coconuts */}
          <circle cx="74" cy="342" r="4" fill="#795548" />
          <circle cx="68" cy="346" r="4" fill="#6D4C41" />

          {/* Palm 2 - right edge */}
          <line x1="488" y1="420" x2="492" y2="348" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
          <line x1="492" y1="350" x2="460" y2="326" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="492" y1="350" x2="525" y2="322" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="460" cy="324" rx="17" ry="8" fill="#2E7D32" opacity="0.85" transform="rotate(-18, 460, 324)" />
          <ellipse cx="525" cy="320" rx="18" ry="8" fill="#388E3C" opacity="0.85" transform="rotate(14, 525, 320)" />
          <circle cx="493" cy="351" r="4" fill="#795548" />

          {/* ── Beach umbrella ── */}
          <line x1="200" y1="420" x2="200" y2="378" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 160 384 Q 200 368 240 384 Q 200 374 160 384 Z" fill="#F28A28" />
          <path d="M 160 384 Q 178 376 200 374 Q 200 374 160 384 Z" fill="#FFB347" opacity="0.7" />
          {/* Beach chair */}
          <rect x="184" y="400" width="30" height="5" rx="2" fill="#BC8A5F" />
          <rect x="182" y="396" width="32" height="6" rx="2" fill="#D4A574" />
          <line x1="186" y1="402" x2="184" y2="412" stroke="#BC8A5F" strokeWidth="2" />
          <line x1="212" y1="402" x2="214" y2="412" stroke="#BC8A5F" strokeWidth="2" />

          {/* ── Seagulls (animated) ── */}
          <g className="animate-seagull" style={{ transformOrigin: '280px 180px' }}>
            {/* Seagull 1 */}
            <path d="M 250 175 Q 258 170 266 175" fill="none" stroke="#1B211C" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 266 175 Q 274 170 282 175" fill="none" stroke="#1B211C" strokeWidth="1.8" strokeLinecap="round" />
            {/* Seagull 2 (smaller, slightly behind) */}
            <path d="M 290 162 Q 296 158 302 162" fill="none" stroke="#3A3A3A" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
            <path d="M 302 162 Q 308 158 314 162" fill="none" stroke="#3A3A3A" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          </g>

          {/* Static distant seagulls */}
          <path d="M 100 155 Q 106 151 112 155" fill="none" stroke="#555" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <path d="M 112 155 Q 118 151 124 155" fill="none" stroke="#555" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
          <path d="M 480 140 Q 485 137 490 140" fill="none" stroke="#555" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />

          {/* ── Clouds (warm-tinted) ── */}
          <g className="animate-wave-1" style={{ transformOrigin: '160px 95px' }}>
            <ellipse cx="160" cy="102" rx="55" ry="20" fill="rgba(255,255,240,0.88)" />
            <ellipse cx="135" cy="106" rx="34" ry="17" fill="rgba(255,255,240,0.82)" />
            <ellipse cx="186" cy="106" rx="38" ry="17" fill="rgba(255,255,240,0.82)" />
            <ellipse cx="160" cy="94" rx="44" ry="19" fill="rgba(255,255,248,0.92)" />
          </g>
          <g className="animate-wave-2" style={{ transformOrigin: '390px 65px' }}>
            <ellipse cx="390" cy="68" rx="42" ry="16" fill="rgba(255,240,220,0.80)" />
            <ellipse cx="368" cy="72" rx="26" ry="14" fill="rgba(255,240,220,0.74)" />
            <ellipse cx="414" cy="72" rx="30" ry="14" fill="rgba(255,240,220,0.74)" />
            <ellipse cx="390" cy="60" rx="34" ry="15" fill="rgba(255,248,230,0.88)" />
          </g>

          {/* ── Floating info cards ── */}
          {/* Card 1: Trip Health */}
          <g transform="translate(30, 226)" className="animate-float" style={{ animationDelay: '0s' }} filter="url(#card-shadow)">
            <rect width="126" height="58" rx="14" fill="white" opacity="0.97" />
            <rect width="126" height="58" rx="14" fill="none" stroke="#E3E2D7" strokeWidth="1" />
            <text x="10" y="18" fontSize="8" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">TRIP HEALTH</text>
            <text x="10" y="36" fontSize="17" fill="#F28A28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800">94%</text>
            <text x="10" y="50" fontSize="7" fill="#62A86B" fontFamily="Plus Jakarta Sans, sans-serif">● All connections safe</text>
            <rect x="60" y="29" width="56" height="6" rx="3" fill="#EEF1E5" />
            <rect x="60" y="29" width="53" height="6" rx="3" fill="#F28A28" opacity="0.65" />
          </g>

          {/* Card 2: Group */}
          <g transform="translate(394, 238)" className="animate-float" style={{ animationDelay: '1.8s' }} filter="url(#card-shadow)">
            <rect width="140" height="62" rx="14" fill="white" opacity="0.97" />
            <rect width="140" height="62" rx="14" fill="none" stroke="#E3E2D7" strokeWidth="1" />
            <text x="10" y="18" fontSize="8" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">GROUP JOURNEY</text>
            <text x="10" y="34" fontSize="11" fill="#1B211C" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">Goa Trip · 14:30</text>
            <g transform="translate(10, 40)">
              {['#F28A28','#62A86B','#6D9EEB','#E5A43F'].map((c,i)=>(
                <circle key={i} cx={i*14} cy="8" r="6" fill={c} stroke="white" strokeWidth="1.5" />
              ))}
            </g>
            <text x="72" y="52" fontSize="8" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif">4 travelers</text>
          </g>

          {/* ── Bottom label ── */}
          <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.65)" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" letterSpacing="0.08em">
            YATRASARTHI · INTELLIGENT JOURNEY PROTECTION
          </text>

        </g>
      </svg>
    </div>
  );
}


/* ──────────────────────────────────────────────
   STAT
────────────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <div className="font-extrabold text-2xl tracking-tight" style={{ color: '#1B211C' }}>{value}</div>
      <div className="text-sm mt-0.5" style={{ color: '#6F756C' }}>{label}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   HERO
────────────────────────────────────────────── */
export function Hero({ onNavigate }: HeroProps) {
  return (
    <>
      {/* ── LIVE ADVISORY TICKER ── */}
      <div style={{ background: '#1C1917' }} className="text-white py-1.5 px-4 text-xs overflow-hidden border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-[11px]" style={{ color: '#F28A28' }}>Live Travel Radar:</span>
          </div>
          <div className="overflow-x-auto whitespace-nowrap font-medium text-[11px] scroll-x" style={{ color: '#D6D3D1' }}>
            🌧️ Western Ghats Monsoon Advisory: Konkan Railway speed restriction · Trains operating with dynamic slack buffers · Mumbai CSIA (BOM) departure hold 20m · YatraSarthi 24/7 Cascade Recovery ACTIVE
          </div>
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="text-[11px] font-bold shrink-0 hidden sm:inline text-amber-400 hover:text-amber-300"
          >
            Check My Trips →
          </button>
        </div>
      </div>

      {/* ── SECTION 1: Hero (compact spacing & refined text size) ── */}
      <section style={{ background: '#F7F5EC', paddingTop: '1.5rem', paddingBottom: '3rem' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">

          {/* Left */}
          <div className="flex-1 text-center lg:text-left" style={{ maxWidth: 530 }}>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-wide"
              style={{ background: 'rgba(242,138,40,0.1)', color: '#D96D16', border: '1px solid rgba(242,138,40,0.25)', letterSpacing: '0.04em' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#F28A28' }} />
              INTELLIGENT GROUP TRAVEL RECOVERY
            </div>

            <h1
              className="font-extrabold leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.1rem)', color: '#1B211C', letterSpacing: '-0.025em', lineHeight: 1.1 }}
            >
              Your trip can change.
              <br />
              <span className="text-gradient">Your plans</span>
              <br />
              don't have to.
            </h1>

            <p className="mb-6 leading-relaxed text-sm sm:text-[15px]" style={{ color: '#6F756C', maxWidth: 440 }}>
              YatraSarthi watches the connections between your flights, trains, cabs, hotels and activities — analyzing dependencies, calculating slack, and coordinating verified vendor actions when disruptions strike.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <button
                onClick={() => onNavigate('new-trip')}
                className="btn-primary px-5 py-3 text-sm flex items-center justify-center gap-2 shadow-md"
              >
                Plan a trip
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-secondary px-4 py-3 text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles size={15} className="text-amber-600" />
                User Dashboard
              </button>

              <button
                onClick={() => onNavigate('recovery')}
                className="btn-secondary px-4 py-3 text-sm flex items-center justify-center gap-1.5"
              >
                See Recovery
                <ChevronRight size={15} style={{ color: '#6F756C' }} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <Stat value="4.8k+" label="Trips protected" />
              <div className="w-px self-stretch" style={{ background: '#E3E2D7' }} />
              <Stat value="94%" label="Recovery success" />
              <div className="w-px self-stretch" style={{ background: '#E3E2D7' }} />
              <Stat value="2.3 min" label="Avg. detection time" />
              <div className="w-px self-stretch" style={{ background: '#E3E2D7' }} />
              <Stat value="100%" label="Honest state proof" />
            </div>
            <p className="text-xs mt-2" style={{ color: '#66855A' }}>✓ Built for Indian multi-modal group journeys</p>
          </div>

          {/* Right — beach scene */}
          <div className="flex-1 w-full flex justify-center">
            <BeachScene />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Solution v2 Architectural Pillars ── */}
      <SolutionV2PillarsSection onNavigate={onNavigate} />

      {/* ── SECTION 3: Group Journey ── */}
      <GroupJourneySection onNavigate={onNavigate} />

      {/* ── SECTION 4: Plan or Import ── */}
      <PlanOrImportSection onNavigate={onNavigate} />

      {/* ── SECTION 5: How it works ── */}
      <HowItWorksSection />

      {/* ── SECTION 6: Disruption story ── */}
      <DisruptionStorySection onNavigate={onNavigate} />

      {/* ── SECTION 7: Final CTA ── */}
      <FinalCTASection onNavigate={onNavigate} />
    </>
  );
}

/* ──────────────────────────────────────────────
   SECTION: Solution v2 Pillars
────────────────────────────────────────────── */
function SolutionV2PillarsSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <section style={{ background: '#FAF8F2', padding: '4.5rem 0', borderTop: '1px solid #E3E2D7', borderBottom: '1px solid #E3E2D7' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: '#F28A28', letterSpacing: '0.1em' }}>
            ENGINEERED FOR REAL INDIAN TRAVEL
          </div>
          <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-900 mb-3 tracking-tight">
            What makes YatraSarthi v2 different
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            It doesn't just guess or alert. It understands what breaks, calculates buffer slack, orchestrates regulated aggregator payments, and enforces honest vendor confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Pillar 1 */}
          <div className="card p-5 bg-white border border-gray-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold mb-3">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-1.5">Honest State Engine</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your itinerary turns <strong className="text-emerald-700">Green</strong> only when the vendor confirms with real API proof or signed response. Never on user tap alone. Red = broken, Amber = awaiting vendor.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="card p-5 bg-white border border-gray-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 font-bold mb-3">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-1.5">Slack-Aware Cascade</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Delays flow through buffers. Hard constraints (fixed cabs, flight departures) break; soft constraints (hotel check-in windows, dinner reservations) absorb the delay gracefully without false alarms.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="card p-5 bg-white border border-gray-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold mb-3">
              <CreditCard size={20} />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-1.5">Aggregator Split-Pay Rail</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Compliant with RBI digital lending & UPI P2P collect regulations (October 2025). Unique payment links via Razorpay/Cashfree class aggregators with signed webhooks and auto-refund timeouts.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="card p-5 bg-white border border-gray-200 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700 font-bold mb-3">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-1.5">DGCA Passenger Rights</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Models statutory compensation under CAR Section 3, Series M, Part IV. Distinguishes airline fault from extraordinary monsoon/ATC circumstances without misleadingly netting compensation into quotes.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: Group Journey
────────────────────────────────────────────── */
function GroupJourneySection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const travelers = [
    { name: 'Harsh', origin: 'Mumbai', mode: 'Flight', color: '#F28A28', status: 'on_track' },
    { name: 'Tanvi', origin: 'Pune', mode: 'Train', color: '#E45B4D', status: 'delayed', delay: '+4h' },
    { name: 'Nupur', origin: 'Nashik', mode: 'Bus', color: '#62A86B', status: 'on_track' },
    { name: 'Shravani', origin: 'Bangalore', mode: 'Flight', color: '#E5A43F', status: 'on_track' },
  ];

  return (
    <section style={{ background: '#FAF8F2', padding: '5rem 0' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Text side */}
          <div className="flex-1" style={{ maxWidth: 460 }}>
            <div className="text-xs font-semibold tracking-widest mb-4" style={{ color: '#D96D16', letterSpacing: '0.1em' }}>
              THE GROUP JOURNEY
            </div>
            <h2
              className="font-extrabold mb-4 leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#1B211C', letterSpacing: '-0.02em' }}
            >
              Four travelers.
              <br />
              Four starting points.
              <br />
              <span style={{ color: '#F28A28' }}>One journey.</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: '#6F756C' }}>
              YatraSarthi understands every traveler individually — then connects the journeys that depend on each other. A group trip is not one itinerary. It's multiple journeys becoming one connected trip.
            </p>
            <button
              onClick={() => onNavigate('group')}
              className="btn-primary px-5 py-3 text-sm flex items-center gap-2"
            >
              See group journey
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Visual side */}
          <div className="flex-1 w-full" style={{ maxWidth: 500 }}>
            <div className="space-y-3">
              {/* Individual travelers */}
              {travelers.map(t => (
                <div
                  key={t.name}
                  className="card-sm px-4 py-3 flex items-center gap-4 bg-white"
                  style={{ borderLeft: `3px solid ${t.color}` }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: '#1B211C' }}>{t.name}</span>
                      {t.delay && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold badge-pending">{t.delay}</span>
                      )}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#6F756C' }}>{t.origin} → {t.mode} → Goa</div>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: t.status === 'on_track' ? '#62A86B' : '#E5A43F' }}
                  />
                </div>
              ))}

              {/* Convergence arrow */}
              <div className="flex items-center gap-3 py-1 px-4">
                <div className="flex-1 h-px" style={{ background: '#E3E2D7' }} />
                <div className="text-xs font-semibold" style={{ color: '#D96D16' }}>All routes converge</div>
                <div className="flex-1 h-px" style={{ background: '#E3E2D7' }} />
              </div>

              {/* Meetup */}
              <div className="card px-4 py-4 border-2 bg-white" style={{ borderColor: '#F28A28' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold" style={{ color: '#D96D16', fontSize: 13, letterSpacing: '0.06em' }}>GOA MEETUP POINT</span>
                  <span className="text-xs font-semibold badge-pending px-2 py-1 rounded-full">14:30</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: 'Shared Cab', icon: '🚕' },
                    { label: 'Hotel', icon: '🏨' },
                    { label: 'Sunset Dinner', icon: '🌅' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#FDF2E6', color: '#D96D16' }}>
                      <span>{s.icon}</span>
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: Plan or Import
────────────────────────────────────────────── */
function PlanOrImportSection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <section style={{ background: '#F5F2E8', padding: '5rem 0' }}>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center mb-10">
        <div className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: '#D96D16', letterSpacing: '0.1em' }}>
          GET STARTED
        </div>
        <h2 className="font-extrabold mb-3" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#1B211C', letterSpacing: '-0.02em' }}>
          Start from scratch — or bring your bookings.
        </h2>
        <p style={{ color: '#6F756C', fontSize: '1rem' }}>
          YatraSarthi works with what you have.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create from scratch */}
        <div className="card p-7 flex flex-col bg-white">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #F28A28, #D96D16)' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 3v16M3 11h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="font-bold text-xl mb-2" style={{ color: '#1B211C' }}>Plan a new trip</h3>
          <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: '#6F756C' }}>
            Tell YatraSarthi where each traveler is coming from, set preferences, and get connected itinerary recommendations — flights, trains, hotels and more.
          </p>
          <ul className="flex flex-col gap-2 mb-6">
            {['Set destinations & dates', 'Add multiple travelers + origins', 'Get personalized recommendations', 'Build the connected graph'].map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#6F756C' }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FDF2E6' }}>
                  <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4L3.5 6L6.5 2" stroke="#D96D16" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate('new-trip')} className="btn-primary py-3 text-sm w-full">
            Plan a trip <ArrowRight size={14} />
          </button>
        </div>

        {/* Import */}
        <div className="card p-7 flex flex-col bg-white">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #FF9E50, #F28A28)' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M19 14v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <polyline points="7 10 11 14 15 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="11" y1="14" x2="11" y2="3" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="font-bold text-xl mb-2" style={{ color: '#1B211C' }}>Import existing bookings</h3>
          <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: '#6F756C' }}>
            Already have bookings? Import them once. YatraSarthi extracts, connects, and monitors them. No re-upload needed when disruptions happen.
          </p>
          <ul className="flex flex-col gap-2 mb-6">
            {['PDF, screenshot, SMS, email', 'Automatic extraction + review', 'Connections built once', 'Trip saved — always ready'].map(f => (
              <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: '#6F756C' }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FDF2E6' }}>
                  <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4L3.5 6L6.5 2" stroke="#D96D16" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate('new-trip')} className="btn-secondary py-3 text-sm w-full">
            Import itinerary
            <ArrowRight size={14} style={{ color: '#6F756C' }} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: How it works
────────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    { n: '01', title: 'Connect', desc: 'Import or plan your trip once. Every traveler\'s journey is mapped individually into a connected graph.' },
    { n: '02', title: 'Monitor', desc: 'YatraSarthi watches live status across flights, trains, roads, and bookings — continuously.' },
    { n: '03', title: 'Detect', desc: 'A disruption triggers cascade analysis. Only actually affected nodes are marked at risk — not everything.' },
    { n: '04', title: 'Recover', desc: 'Feasible recovery paths are ranked by your group\'s preferences. The group approves. Vendors are coordinated.' },
  ];

  return (
    <section style={{ background: '#FAF8F2', padding: '5rem 0' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: '#D96D16', letterSpacing: '0.1em' }}>HOW IT WORKS</div>
          <h2 className="font-extrabold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#1B211C', letterSpacing: '-0.02em' }}>
            Plan → Connect → Monitor → Recover
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 relative">
          {/* Connector line */}
          <div
            className="hidden lg:block absolute top-8 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, #E3E2D7, #E3E2D7, transparent)', top: 24 }}
          />

          {steps.map((s) => (
            <div key={s.n} className="flex flex-col items-center lg:items-start px-6 py-5 relative">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base mb-4 relative z-10"
                style={{ background: '#FDF2E6', border: '2px solid #F7C59F', color: '#D96D16', fontVariantNumeric: 'tabular-nums' }}
              >
                {s.n}
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#1B211C' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6F756C' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: Disruption story
────────────────────────────────────────────── */
function DisruptionStorySection({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [active, setActive] = useState<number>(0);

  const states = [
    {
      label: 'Healthy trip',
      nodes: [
        { label: "Tanvi's Train", status: 'confirmed', note: 'On time' },
        { label: 'Shared Cab', status: 'confirmed', note: 'Booked' },
        { label: 'Hotel Check-in', status: 'confirmed', note: 'Confirmed' },
        { label: 'Group Dinner', status: 'confirmed', note: 'Reserved' },
      ],
    },
    {
      label: 'Disruption detected',
      nodes: [
        { label: "Tanvi's Train", status: 'disrupted', note: '+4h delay' },
        { label: 'Shared Cab', status: 'disrupted', note: 'Buffer exceeded' },
        { label: 'Hotel Check-in', status: 'pending', note: 'AT RISK' },
        { label: 'Group Dinner', status: 'confirmed', note: '6h buffer · SAFE' },
      ],
    },
    {
      label: 'Recovery approved',
      nodes: [
        { label: "Tanvi's Train", status: 'disrupted', note: '+4h delay' },
        { label: 'Cab pushed to 14:00', status: 'pending', note: 'Pending vendor' },
        { label: 'Hotel Check-in', status: 'pending', note: 'Notified' },
        { label: 'Group Dinner', status: 'confirmed', note: 'Preserved' },
      ],
    },
    {
      label: 'Trip recovered',
      nodes: [
        { label: "Tanvi's Train", status: 'disrupted', note: '+4h (arrived)' },
        { label: 'Cab rescheduled', status: 'confirmed', note: 'Vendor confirmed' },
        { label: 'Hotel Check-in', status: 'confirmed', note: 'Confirmed 14:30' },
        { label: 'Group Dinner', status: 'confirmed', note: 'Preserved' },
      ],
    },
  ];

  const colorMap: Record<string, string> = { confirmed: '#62A86B', pending: '#E5A43F', disrupted: '#E45B4D' };
  const bgMap: Record<string, string> = { confirmed: '#E6F4E8', pending: '#FDF2E0', disrupted: '#FDECEA' };

  return (
    <section style={{ background: '#F5F2E8', padding: '5rem 0' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left text */}
          <div className="flex-1" style={{ maxWidth: 430 }}>
            <div className="text-xs font-semibold tracking-widest mb-3 uppercase" style={{ color: '#D96D16', letterSpacing: '0.1em' }}>
              DISRUPTION RECOVERY
            </div>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)', color: '#1B211C', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Only what breaks
              <br />
              gets flagged.
              <br />
              <span style={{ color: '#F28A28' }}>The rest stays safe.</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: '#6F756C' }}>
              YatraSarthi calculates the actual slack in each connection. A delayed train doesn't automatically break dinner — only the nodes with exhausted buffers are affected.
            </p>

            {/* Step pills */}
            <div className="flex flex-col gap-2 mb-6">
              {states.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
                  style={{
                    background: active === i ? 'white' : 'transparent',
                    border: active === i ? '1px solid #F28A28' : '1px solid transparent',
                    color: active === i ? '#1B211C' : '#6F756C',
                    fontWeight: active === i ? 600 : 500,
                    boxShadow: active === i ? '0 2px 10px rgba(242,138,40,0.12)' : 'none',
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: active === i ? '#F28A28' : '#FDF2E6',
                      color: active === i ? 'white' : '#D96D16',
                    }}
                  >
                    {i + 1}
                  </span>
                  {s.label}
                </button>
              ))}
            </div>

            <button onClick={() => onNavigate('recovery')} className="btn-primary px-5 py-3 text-sm">
              Simulate a disruption →
            </button>
          </div>

          {/* Right — state visualization */}
          <div className="flex-1 w-full" style={{ maxWidth: 420 }}>
            <div className="card p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-sm" style={{ color: '#1B211C' }}>
                  {states[active].label}
                </span>
                {active > 0 && (
                  <span className="text-xs font-semibold badge-pending px-2.5 py-1 rounded-full">
                    Simulated
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                {states[active].nodes.map((node, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all animate-fade-in"
                    style={{ background: bgMap[node.status] }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colorMap[node.status] }} />
                    <div className="flex-1">
                      <div className="font-medium text-sm" style={{ color: '#1B211C' }}>{node.label}</div>
                      <div className="text-xs font-semibold" style={{ color: colorMap[node.status] }}>{node.note}</div>
                    </div>
                  </div>
                ))}
              </div>

              {active === 3 && (
                <div className="mt-4 p-3 rounded-xl text-center" style={{ background: '#E6F4EE' }}>
                  <div className="font-bold text-sm" style={{ color: '#1A6B3A' }}>Trip Health: 91/100 ↑</div>
                  <div className="text-xs mt-0.5" style={{ color: '#2D7A34' }}>Recovered — all bookings preserved</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: Final CTA
────────────────────────────────────────────── */
function FinalCTASection({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <section style={{ background: 'linear-gradient(135deg, #1C1917 0%, #2A1D16 50%, #1C1917 100%)', padding: '6rem 0' }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <h2
          className="font-extrabold mb-4"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'white', letterSpacing: '-0.03em', lineHeight: 1.15 }}
        >
          Travel changes.
          <br />
          <span style={{ color: '#F28A28' }}>Your plans don't have to fall apart.</span>
        </h2>
        <p className="text-base sm:text-lg mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Connect your journey once. YatraSarthi takes care of the changes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onNavigate('new-trip')}
            className="btn-primary px-7 py-3.5 text-sm"
          >
            Plan my trip <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onNavigate('new-trip')}
            className="btn-secondary px-7 py-3.5 text-sm"
          >
            Import itinerary
          </button>
        </div>
      </div>
    </section>
  );
}
