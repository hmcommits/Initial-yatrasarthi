import { useState, useEffect } from 'react';
import { 
  Users, MapPin, Clock, AlertTriangle, Check, 
  Plus, RotateCcw, Zap, Sparkles, CheckCircle2, 
  ArrowRight, ShieldCheck, ChevronRight, X
} from 'lucide-react';
import { groupTravelers as defaultTravelers, meetupPoint as defaultMeetup, type TravelerJourney } from '../data/mockData';

export function GroupJourney() {
  // Dynamic travelers list: initialize with the default 4 demo travelers
  const [travelers, setTravelers] = useState<TravelerJourney[]>(defaultTravelers);
  const [activeTab, setActiveTab] = useState<'demo' | 'connected' | 'individual' | 'manage'>('demo');
  const [activeTravelerId, setActiveTravelerId] = useState<string>('tanvi');
  
  // Interactive demo simulation state (Solution v2 Demo Script)
  const [demoState, setDemoState] = useState<{
    rahulDelayed: boolean;
    cabPushed: boolean;
    driverConfirmed: boolean;
  }>({
    rahulDelayed: true,
    cabPushed: false,
    driverConfirmed: false,
  });

  // Modal for adding dynamic member
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    origin: '',
    mode: 'flight' as 'flight' | 'train' | 'bus' | 'cab',
    modeLabel: '',
    departureTime: '08:00',
    arrivalTime: '09:30',
  });

  const activeTraveler = travelers.find(t => t.id === activeTravelerId) || travelers[0];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.origin) return;

    const id = `user_${Date.now()}`;
    const colors = ['#8E44AD', '#16A085', '#D35400', '#2980B9', '#27AE60', '#C0392B'];
    const assignedColor = colors[travelers.length % colors.length];

    const traveler: TravelerJourney = {
      id,
      name: newMember.name,
      avatar: newMember.name.charAt(0).toUpperCase(),
      origin: newMember.origin,
      mode: newMember.mode,
      modeLabel: newMember.modeLabel || `${newMember.mode.toUpperCase()} Express`,
      departureTime: newMember.departureTime,
      arrivalTime: newMember.arrivalTime,
      booking: `BK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: 'on_track',
      color: assignedColor,
      preferences: { cost: 50, time: 50, comfort: 50, flexibility: 50 },
    };

    setTravelers(prev => [...prev, traveler]);
    setShowAddModal(false);
    setNewMember({ name: '', origin: '', mode: 'flight', modeLabel: '', departureTime: '08:00', arrivalTime: '09:30' });
    setActiveTravelerId(id);
  };

  const handleQuickAdd = (preset: { name: string; origin: string; mode: 'flight' | 'train' | 'bus'; label: string; dep: string; arr: string }) => {
    const id = `user_${Date.now()}`;
    const colors = ['#8E44AD', '#16A085', '#D35400', '#2980B9', '#27AE60'];
    const assignedColor = colors[travelers.length % colors.length];

    const traveler: TravelerJourney = {
      id,
      name: preset.name,
      avatar: preset.name.charAt(0).toUpperCase(),
      origin: preset.origin,
      mode: preset.mode,
      modeLabel: preset.label,
      departureTime: preset.dep,
      arrivalTime: preset.arr,
      booking: `BK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: 'on_track',
      color: assignedColor,
      preferences: { cost: 40, time: 60, comfort: 50, flexibility: 50 },
    };

    setTravelers(prev => [...prev, traveler]);
  };

  const handleResetToDemo = () => {
    setTravelers(defaultTravelers);
    setActiveTravelerId('tanvi');
    setDemoState({
      rahulDelayed: true,
      cabPushed: false,
      driverConfirmed: false,
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12" style={{ background: '#F7F5EC' }}>

      {/* ── Top Header ── */}
      <div style={{ background: '#EEF1E5', borderBottom: '1px solid #E3E2D7', padding: '24px 0 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-2xl" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>
                  Group Journey Orchestrator
                </h1>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(242,138,40,0.12)', color: '#D96D16', border: '1px solid rgba(242,138,40,0.25)' }}
                >
                  No Member Limits · Dynamic Multi-DAG
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: '#6F756C' }}>
                <span className="font-bold text-gray-900">{travelers.length} individual journeys</span> converging at Goa Meetup → synchronizing shared cab, hotel & activities.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={14} /> Add Group Member
              </button>
              <button
                onClick={handleResetToDemo}
                className="btn-secondary text-xs px-3 py-2 flex items-center gap-1"
                title="Reset to default 4-member Priya & Rahul demo"
              >
                <RotateCcw size={13} /> Reset Demo
              </button>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div className="flex gap-2 overflow-x-auto pb-px scroll-x">
            <button
              onClick={() => setActiveTab('demo')}
              className="flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeTab === 'demo' ? '#F7F5EC' : 'transparent',
                color: activeTab === 'demo' ? '#F28A28' : '#6F756C',
                border: activeTab === 'demo' ? '1px solid #E3E2D7' : '1px solid transparent',
                borderBottom: activeTab === 'demo' ? '1px solid #F7F5EC' : '1px solid transparent',
                marginBottom: activeTab === 'demo' ? -1 : 0,
              }}
            >
              🎬 Demo: Convergence Route Graph (from Home)
            </button>

            <button
              onClick={() => setActiveTab('connected')}
              className="flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeTab === 'connected' ? '#F7F5EC' : 'transparent',
                color: activeTab === 'connected' ? '#F28A28' : '#6F756C',
                border: activeTab === 'connected' ? '1px solid #E3E2D7' : '1px solid transparent',
                borderBottom: activeTab === 'connected' ? '1px solid #F7F5EC' : '1px solid transparent',
                marginBottom: activeTab === 'connected' ? -1 : 0,
              }}
            >
              🕸️ Connected Group DAG ({travelers.length} Members)
            </button>

            <button
              onClick={() => setActiveTab('individual')}
              className="flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeTab === 'individual' ? '#F7F5EC' : 'transparent',
                color: activeTab === 'individual' ? '#F28A28' : '#6F756C',
                border: activeTab === 'individual' ? '1px solid #E3E2D7' : '1px solid transparent',
                borderBottom: activeTab === 'individual' ? '1px solid #F7F5EC' : '1px solid transparent',
                marginBottom: activeTab === 'individual' ? -1 : 0,
              }}
            >
              👤 Member Journey Breakdown
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className="flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeTab === 'manage' ? '#F7F5EC' : 'transparent',
                color: activeTab === 'manage' ? '#F28A28' : '#6F756C',
                border: activeTab === 'manage' ? '1px solid #E3E2D7' : '1px solid transparent',
                borderBottom: activeTab === 'manage' ? '1px solid #F7F5EC' : '1px solid transparent',
                marginBottom: activeTab === 'manage' ? -1 : 0,
              }}
            >
              ⚙️ Manage Group & Permissions ({travelers.length})
            </button>
          </div>

        </div>
      </div>

      {/* ── Main View Content ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">

        {/* ── TAB 1: FEATURED DEMO WITH HOME PAGE CONVERGENCE GRAPH ── */}
        {activeTab === 'demo' && (
          <div className="space-y-6">
            
            {/* Interactive Demo Controller Bar */}
            <div className="card p-5 border-l-4" style={{ borderLeftColor: '#F28A28' }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="font-extrabold text-base text-gray-900">
                      Priya & Rahul Demo: Signal Failure at Pune (Train +4h Delay)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 max-w-3xl leading-relaxed">
                    <strong>Solution v2 Demo Script:</strong> Rahul's Rajdhani slips 4 hours. The shared cab at Madgaon has a fixed 30m hard constraint buffer. YatraSarthi detects the cascade, calculates slack across Tanvi, Priya & Aarav, and triggers honest state recovery.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!demoState.cabPushed ? (
                    <button
                      onClick={() => setDemoState(prev => ({ ...prev, cabPushed: true }))}
                      className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
                    >
                      <Zap size={13} /> 1. Push Shared Cab to 14:00 (Amber State)
                    </button>
                  ) : !demoState.driverConfirmed ? (
                    <button
                      onClick={() => setDemoState(prev => ({ ...prev, driverConfirmed: true }))}
                      className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
                      style={{ background: '#2D7A34' }}
                    >
                      <CheckCircle2 size={13} /> 2. Verify Driver WhatsApp Proof (Green State)
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check size={14} /> Trip Fully Recovered & Verified
                      </span>
                      <button
                        onClick={() => setDemoState({ rahulDelayed: true, cabPushed: false, driverConfirmed: false })}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        Replay
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${demoState.rahulDelayed ? 'bg-red-500' : 'bg-gray-400'}`}>
                    1
                  </span>
                  <span className={demoState.rahulDelayed ? 'text-red-900 font-bold' : 'text-gray-500'}>
                    Rahul's Train Delayed +4h (Red)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${demoState.cabPushed ? 'bg-amber-500' : 'bg-gray-400'}`}>
                    2
                  </span>
                  <span className={demoState.cabPushed ? 'text-amber-900 font-bold' : 'text-gray-500'}>
                    Cab Push Request Sent (Amber)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${demoState.driverConfirmed ? 'bg-emerald-600' : 'bg-gray-400'}`}>
                    3
                  </span>
                  <span className={demoState.driverConfirmed ? 'text-emerald-900 font-bold' : 'text-gray-500'}>
                    Driver Verified with Proof (Green)
                  </span>
                </div>
              </div>
            </div>

            {/* Embedded Convergence Graph Card (from Home Page) */}
            <div className="card p-6 bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🗺️</span>
                    <h3 className="font-extrabold text-lg text-gray-900">
                      Live Convergence Graph · Visual Journey Map
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    As featured on the Home Page, visualizing individual travel origins merging into shared group services.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Confirmed
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Awaiting ACK
                  </span>
                  <span className="flex items-center gap-1 text-red-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Disrupted
                  </span>
                </div>
              </div>

              {/* Enhanced Convergence Map SVG */}
              <GroupConvergenceMapSvg demoState={demoState} />

              {/* Explanatory Cards beneath graph */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-3.5 rounded-xl bg-[#F7F5EC] border border-gray-200 text-xs">
                  <div className="font-bold text-gray-900 mb-1">✈️ Tanvi & Aarav (Flights)</div>
                  <p className="text-gray-600">Arrive Goa 08:00 & 08:45 on schedule. 5h buffer before meetup. Slack absorbs waiting without booking impact.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs">
                  <div className="font-bold text-red-900 mb-1">🚆 Rahul (Rajdhani 12223)</div>
                  <p className="text-red-700">Delayed from 10:00 → 14:00 (+4h). Exceeds shared cab 30m buffer. Weakest link triggers group coordination.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="font-bold text-emerald-900 mb-1">🚕 Shared Cab Recovery</div>
                  <p className="text-emerald-700">
                    {demoState.driverConfirmed 
                      ? '✓ Driver Suresh acknowledged WhatsApp confirmation. Pickup moved to 14:00 at Madgaon.'
                      : demoState.cabPushed 
                        ? '⏱ Reschedule sent to Sai Tours. Awaiting signed proof (honest intermediate state).'
                        : 'Action required: Cab will leave without Rahul unless pickup is rescheduled.'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: CONNECTED GROUP DAG (DYNAMIC N-TRAVELERS) ── */}
        {activeTab === 'connected' && (
          <div className="space-y-6">
            <DynamicConnectedGraph travelers={travelers} />
          </div>
        )}

        {/* ── TAB 3: INDIVIDUAL MEMBER BREAKDOWN ── */}
        {activeTab === 'individual' && (
          <div className="space-y-6">
            {/* Traveler Selector Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scroll-x">
              {travelers.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTravelerId(t.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    activeTravelerId === t.id ? 'bg-white shadow-sm border-amber-500 text-gray-900' : 'bg-transparent border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold" style={{ background: t.color }}>
                    {t.avatar}
                  </div>
                  {t.name} ({t.origin})
                  {t.status === 'delayed' && (
                    <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">+4h</span>
                  )}
                </button>
              ))}
            </div>

            <TravelerDetail traveler={activeTraveler} />
          </div>
        )}

        {/* ── TAB 4: MANAGE GROUP (NO LIMIT OF 4) ── */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900">
                    Group Roster & Permissions ({travelers.length} Members)
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    No limit of 4! Add family, friends, or corporate colleagues from any city. YatraSarthi computes multi-origin convergence automatically.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> Add New Member
                </button>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                      <th className="pb-3">Traveler</th>
                      <th className="pb-3">Origin</th>
                      <th className="pb-3">Transport Mode</th>
                      <th className="pb-3">Departure & Arrival</th>
                      <th className="pb-3">Booking PNR</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {travelers.map(t => (
                      <tr key={t.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: t.color }}>
                              {t.avatar}
                            </div>
                            <span className="font-bold text-gray-900">{t.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-gray-700 font-medium">{t.origin}</td>
                        <td className="py-3.5 text-gray-700">
                          {t.mode === 'flight' ? '✈️ Flight' : t.mode === 'train' ? '🚆 Train' : t.mode === 'bus' ? '🚌 Bus' : '🚕 Cab'} · {t.modeLabel}
                        </td>
                        <td className="py-3.5 font-mono text-[11px] text-gray-600">
                          {t.departureTime} → {t.arrivalTime}
                        </td>
                        <td className="py-3.5 font-mono text-[11px] text-gray-500">{t.booking}</td>
                        <td className="py-3.5">
                          <span 
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{
                              background: t.status === 'delayed' ? '#FDF2E0' : '#E8F5EA',
                              color: t.status === 'delayed' ? '#9A5A00' : '#2D7A34'
                            }}
                          >
                            {t.status === 'delayed' ? '● Delayed (+4h)' : '● Confirmed'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => { setActiveTravelerId(t.id); setActiveTab('individual'); }}
                            className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                          >
                            View Journey →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Add Presets */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">
                  Quick Add Verified Travelers (Expand Beyond 4)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleQuickAdd({ name: 'Rohan Mehta', origin: 'Delhi', mode: 'flight', label: 'IndiGo 6E-204', dep: '06:00', arr: '08:45' })}
                    className="p-3 rounded-xl bg-white border border-gray-200 text-left hover:border-amber-400 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-gray-900">+ Rohan (Delhi)</div>
                      <div className="text-[11px] text-gray-500">IndiGo 6E-204 · Flight</div>
                    </div>
                    <Plus size={14} className="text-amber-600" />
                  </button>

                  <button
                    onClick={() => handleQuickAdd({ name: 'Ananya Rao', origin: 'Hyderabad', mode: 'train', label: 'Vande Bharat 20701', dep: '05:30', arr: '11:15' })}
                    className="p-3 rounded-xl bg-white border border-gray-200 text-left hover:border-amber-400 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-gray-900">+ Ananya (Hyderabad)</div>
                      <div className="text-[11px] text-gray-500">Vande Bharat 20701 · Train</div>
                    </div>
                    <Plus size={14} className="text-amber-600" />
                  </button>

                  <button
                    onClick={() => handleQuickAdd({ name: 'Vikram Joshi', origin: 'Ahmedabad', mode: 'bus', label: 'Paulo Travels Sleeper', dep: '04:00', arr: '10:30' })}
                    className="p-3 rounded-xl bg-white border border-gray-200 text-left hover:border-amber-400 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-gray-900">+ Vikram (Ahmedabad)</div>
                      <div className="text-[11px] text-gray-500">Paulo Travels · AC Bus</div>
                    </div>
                    <Plus size={14} className="text-amber-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Modal: Add Member ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card p-6 bg-white max-w-md w-full relative animate-slide-up shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <h3 className="font-extrabold text-lg text-gray-900 mb-1">Add Group Traveler</h3>
            <p className="text-xs text-gray-500 mb-4">
              Expand your group trip without limit. The system maps their arrival slack into the group meetup.
            </p>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Malhotra"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Starting Origin City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai, Kolkata, Jaipur"
                  value={newMember.origin}
                  onChange={e => setNewMember({ ...newMember, origin: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Transport Mode</label>
                  <select
                    value={newMember.mode}
                    onChange={e => setNewMember({ ...newMember, mode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="flight">✈️ Flight</option>
                    <option value="train">🚆 Train</option>
                    <option value="bus">🚌 Bus</option>
                    <option value="cab">🚕 Cab</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Carrier / PNR</label>
                  <input
                    type="text"
                    placeholder="e.g. 6E-551 or Train 12951"
                    value={newMember.modeLabel}
                    onChange={e => setNewMember({ ...newMember, modeLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Departure Time</label>
                  <input
                    type="time"
                    value={newMember.departureTime}
                    onChange={e => setNewMember({ ...newMember, departureTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Arrival Time at Goa</label>
                  <input
                    type="time"
                    value={newMember.arrivalTime}
                    onChange={e => setNewMember({ ...newMember, arrivalTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 font-bold"
                >
                  Add Traveler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURED CONVERGENCE MAP SVG (From Home Page, with Demo State)
───────────────────────────────────────────────────────────── */
function GroupConvergenceMapSvg({ demoState }: { demoState: { rahulDelayed: boolean; cabPushed: boolean; driverConfirmed: boolean } }) {
  const W = 640;
  const H = 420;

  // The 4 Core Demo Travelers
  const travelers = [
    { id: 'tanvi', name: 'Tanvi', origin: 'Mumbai', mode: 'Flight', color: '#F28A28', startX: 60, startY: 60, status: 'confirmed' },
    { id: 'rahul', name: 'Rahul', origin: 'Pune', mode: 'Train', color: '#6D9EEB', startX: 60, startY: 155, status: demoState.rahulDelayed ? 'disrupted' : 'confirmed' },
    { id: 'priya', name: 'Priya', origin: 'Nashik', mode: 'Bus', color: '#A8C39A', startX: 60, startY: 250, status: 'confirmed' },
    { id: 'aarav', name: 'Aarav', origin: 'Bangalore', mode: 'Flight', color: '#E5A43F', startX: 60, startY: 345, status: 'confirmed' },
  ];

  const meetupX = 350;
  const meetupY = 200;

  // Shared Services
  const cabStatus = demoState.driverConfirmed ? 'confirmed' : demoState.cabPushed ? 'amber' : 'disrupted';
  const shared = [
    { id: 'cab', label: 'Shared Cab', icon: '🚕', x: 520, y: 140, status: cabStatus, note: demoState.cabPushed ? 'Pickup 14:00' : 'Pickup 10:30' },
    { id: 'hotel', label: 'Hotel', icon: '🏨', x: 520, y: 220, status: demoState.cabPushed ? 'confirmed' : 'pending', note: 'Novotel Candolim' },
    { id: 'dinner', label: 'Dinner', icon: '🍽️', x: 520, y: 300, status: 'confirmed', note: 'Shore Bar 20:00' },
  ];

  const statusColor = (s: string) => s === 'confirmed' ? '#2D7A34' : s === 'amber' ? '#A05B00' : '#B53027';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E3E2D7] bg-[#FAF8F2] p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ aspectRatio: `${W}/${H}` }}>
        <defs>
          <filter id="demo-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(27,33,28,0.12)" />
          </filter>
          {travelers.map(t => (
            <marker key={t.id} id={`demo-arr-${t.id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={t.color} />
            </marker>
          ))}
          <marker id="demo-arr-shared" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill="#66855A" />
          </marker>
          <pattern id="demo-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#E3E2D7" strokeWidth="0.4" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="url(#demo-grid)" rx="12" />

        {/* ─── Converging route lines from origins ─── */}
        {travelers.map(t => {
          const cx = (t.startX + meetupX) / 2;
          const isRahul = t.id === 'rahul';
          const strokeColor = isRahul && demoState.rahulDelayed ? '#E45B4D' : t.color;
          const d = `M ${t.startX + 32} ${t.startY} C ${cx} ${t.startY} ${cx} ${meetupY} ${meetupX - 32} ${meetupY}`;

          return (
            <path
              key={t.id}
              d={d}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isRahul ? 2.5 : 2}
              strokeDasharray={isRahul ? "5 3" : undefined}
              strokeLinecap="round"
              opacity="0.85"
              markerEnd={`url(#demo-arr-${t.id})`}
            />
          );
        })}

        {/* ─── Shared service lines ─── */}
        {shared.map(s => (
          <line
            key={s.id}
            x1={meetupX + 32} y1={meetupY}
            x2={s.x - 22} y2={s.y}
            stroke={statusColor(s.status)}
            strokeWidth="2"
            strokeDasharray={s.status !== 'confirmed' ? "4 3" : undefined}
            strokeLinecap="round"
            opacity="0.8"
            markerEnd="url(#demo-arr-shared)"
          />
        ))}

        {/* ─── Traveler origin nodes ─── */}
        {travelers.map(t => {
          const isRahul = t.id === 'rahul';
          return (
            <g key={t.id} transform={`translate(${t.startX - 22}, ${t.startY - 22})`}>
              <rect
                x="0" y="0" width="56" height="44" rx="10"
                fill="white"
                stroke={isRahul ? '#E45B4D' : t.color}
                strokeWidth={isRahul ? 2 : 1.5}
                filter="url(#demo-shadow)"
              />
              <circle
                cx="46" cy="10" r="4.5"
                fill={isRahul ? '#E45B4D' : '#2D7A34'}
              />
              <text x="28" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={t.color} fontFamily="Plus Jakarta Sans, sans-serif">
                {t.name}
              </text>
              <text x="28" y="31" textAnchor="middle" fontSize="8" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif">
                {t.origin}
              </text>
              <text x="28" y="40" textAnchor="middle" fontSize="7" fill={t.color} fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
                {t.mode}
              </text>
            </g>
          );
        })}

        {/* Rahul's Delay Badge */}
        {demoState.rahulDelayed && (
          <g transform={`translate(${travelers[1].startX + 40}, ${travelers[1].startY - 14})`}>
            <rect x="0" y="0" width="72" height="18" rx="9" fill="#FDECEA" stroke="#E45B4D" strokeWidth="1" />
            <text x="36" y="12" textAnchor="middle" fontSize="8.5" fill="#B53027" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
              🚨 Train +4h Delay
            </text>
          </g>
        )}

        {/* ─── Meetup node (Goa Hub) ─── */}
        <g transform={`translate(${meetupX - 32}, ${meetupY - 32})`}>
          <circle cx="32" cy="32" r="38" fill="rgba(242,138,40,0.08)" />
          <circle cx="32" cy="32" r="28" fill="rgba(242,138,40,0.15)" />
          <rect x="0" y="4" width="64" height="56" rx="14" fill="white" stroke="#F28A28" strokeWidth="2.2" filter="url(#demo-shadow)" />
          <text x="32" y="25" textAnchor="middle" fontSize="12" fill="#F28A28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800">GOA</text>
          <text x="32" y="37" textAnchor="middle" fontSize="8" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif">MEETUP</text>
          <line x1="12" y1="42" x2="52" y2="42" stroke="#E3E2D7" strokeWidth="0.8" />
          <text x="32" y="52" textAnchor="middle" fontSize="8" fill={demoState.cabPushed ? '#2D7A34' : '#A05B00'} fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
            {demoState.cabPushed ? '14:05 (Synced)' : '14:30 (Waiting)'}
          </text>
        </g>

        {/* ─── Shared service nodes ─── */}
        {shared.map(s => {
          const color = statusColor(s.status);
          return (
            <g key={s.id} transform={`translate(${s.x - 22}, ${s.y - 20})`}>
              <rect x="0" y="0" width="70" height="42" rx="10" fill="white" stroke={color} strokeWidth="1.6" filter="url(#demo-shadow)" />
              <circle cx="62" cy="9" r="4" fill={color} />
              <text x="35" y="16" textAnchor="middle" fontSize="13">{s.icon}</text>
              <text x="35" y="28" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#1B211C" fontFamily="Plus Jakarta Sans, sans-serif">
                {s.label}
              </text>
              <text x="35" y="38" textAnchor="middle" fontSize="7" fill={color} fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
                {s.status.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Bottom Banner */}
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="10" fill="#65855A" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" letterSpacing="0.06em">
          PRIYA & RAHUL DEMO · REAL-TIME MULTI-VENDOR DISRUPTION RECOVERY
        </text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DYNAMIC CONNECTED GRAPH (Supports ANY number of travelers)
───────────────────────────────────────────────────────────── */
function DynamicConnectedGraph({ travelers }: { travelers: TravelerJourney[] }) {
  const W = 760;
  // Compute height dynamically based on traveler count to avoid collision
  const H = Math.max(480, travelers.length * 80 + 60);

  const mx = 380;
  const my = H / 2;

  // Calculate dynamic traveler positions on left
  const tNodes = travelers.map((t, i) => {
    const spacing = (H - 120) / Math.max(1, travelers.length - 1);
    const y = 60 + i * spacing;
    return {
      ...t,
      x: 80,
      y,
      sub: `${t.origin} · ${t.modeLabel}`,
    };
  });

  const shared = [
    { id: 'cab', label: 'Shared Cab', x: 610, y: my - 90, status: 'pending', time: '14:00' },
    { id: 'hotel', label: 'Hotel Check-in', x: 610, y: my, status: 'pending', time: '15:30' },
    { id: 'dinner', label: 'Group Dinner', x: 610, y: my + 90, status: 'confirmed', time: '20:00' },
  ];

  const statusColor = (s: string) => s === 'confirmed' ? '#2D7A34' : s === 'delayed' || s === 'pending' ? '#A05B00' : '#B53027';

  return (
    <div className="card p-6 bg-white">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            Connected Multi-DAG Architecture ({travelers.length} Travelers)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Dynamically recalculating slack absorption and weakest-link dependencies across all {travelers.length} journeys.
          </p>
        </div>

        <div className="flex gap-3 text-xs">
          {[['Confirmed', '#2D7A34'], ['At Risk / Pending', '#A05B00'], ['Disrupted', '#B53027']].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: c }} />
              <span className="text-gray-600 font-medium">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scroll-x">
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 540, height: 'auto', aspectRatio: `${W}/${H}` }}>
          <defs>
            {tNodes.map(t => (
              <marker key={t.id} id={`arr-dyn-${t.id}`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M 0 0 L 5 2.5 L 0 5 z" fill={t.color} opacity="0.8" />
              </marker>
            ))}
            <marker id="arr-dyn-shared" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#66855A" opacity="0.8" />
            </marker>
            <pattern id="grid-dyn" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E3E2D7" strokeWidth="0.4" />
            </pattern>
          </defs>

          <rect width={W} height={H} fill="url(#grid-dyn)" rx="12" opacity="0.5" />

          {/* Convergence lines */}
          {tNodes.map(t => {
            const cx = (t.x + mx) / 2;
            const d = `M ${t.x + 50} ${t.y + 20} C ${cx + 20} ${t.y + 20} ${cx - 20} ${my + 20} ${mx - 32} ${my + 20}`;
            return (
              <path
                key={t.id}
                d={d}
                fill="none"
                stroke={t.color}
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.75"
                markerEnd={`url(#arr-dyn-${t.id})`}
              />
            );
          })}

          {/* Shared service lines */}
          {shared.map(s => (
            <line
              key={s.id}
              x1={mx + 34} y1={my + 20}
              x2={s.x - 30} y2={s.y + 16}
              stroke="#66855A"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.7"
              markerEnd="url(#arr-dyn-shared)"
            />
          ))}

          {/* Traveler Nodes */}
          {tNodes.map(t => (
            <g key={t.id} transform={`translate(${t.x}, ${t.y})`}>
              <rect
                x="0" y="0" width="104" height="42" rx="10"
                fill="white"
                stroke={t.color}
                strokeWidth="1.6"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(27,33,28,0.08))' }}
              />
              <circle cx="94" cy="9" r="4.5" fill={statusColor(t.status)} />
              <text x="52" y="17" textAnchor="middle" fontSize="11" fontWeight="700" fill={t.color} fontFamily="Plus Jakarta Sans, sans-serif">
                {t.name}
              </text>
              <text x="52" y="31" textAnchor="middle" fontSize="8" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif">
                {t.sub}
              </text>
            </g>
          ))}

          {/* Central Meetup Node */}
          <g transform={`translate(${mx - 36}, ${my - 14})`}>
            <circle cx="36" cy="36" r="42" fill="rgba(242,138,40,0.08)" />
            <rect
              x="0" y="6" width="72" height="60" rx="14"
              fill="white"
              stroke="#F28A28"
              strokeWidth="2.2"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(242,138,40,0.18))' }}
            />
            <text x="36" y="27" textAnchor="middle" fontSize="11" fontWeight="800" fill="#F28A28" fontFamily="Plus Jakarta Sans, sans-serif">GOA</text>
            <text x="36" y="40" textAnchor="middle" fontSize="8" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif">MEETUP</text>
            <text x="36" y="54" textAnchor="middle" fontSize="8" fill="#A05B00" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">14:05</text>
          </g>

          {/* Shared service nodes */}
          {shared.map(s => (
            <g key={s.id} transform={`translate(${s.x - 30}, ${s.y})`}>
              <rect
                x="0" y="0" width="76" height="38" rx="10"
                fill="white"
                stroke="#E3E2D7"
                strokeWidth="1.4"
                style={{ filter: 'drop-shadow(0 1px 4px rgba(27,33,28,0.06))' }}
              />
              <circle cx="68" cy="8" r="4" fill={statusColor(s.status)} />
              <text x="38" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1B211C" fontFamily="Plus Jakarta Sans, sans-serif">
                {s.label}
              </text>
              <text x="38" y="28" textAnchor="middle" fontSize="8" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif">
                {s.time}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   INDIVIDUAL TRAVELER DETAIL VIEW
───────────────────────────────────────────────────────────── */
function TravelerDetail({ traveler }: { traveler: TravelerJourney }) {
  const modeIcons: Record<string, string> = { flight: '✈️', train: '🚆', bus: '🚌', cab: '🚕' };

  const nodes = [
    { label: traveler.origin, type: 'origin', time: 'Start', status: 'confirmed', note: `${traveler.name}'s origin hub` },
    { label: traveler.modeLabel, type: traveler.mode, time: traveler.departureTime, status: traveler.status === 'delayed' ? 'disrupted' : 'confirmed', note: traveler.delay ? `+${Math.floor(traveler.delay / 60)}h delay near Pune` : 'On schedule' },
    { label: 'Goa Arrival Hub', type: 'arrival', time: traveler.status === 'delayed' ? '14:00 (Delayed)' : traveler.arrivalTime, status: traveler.status === 'delayed' ? 'pending' : 'confirmed', note: traveler.status === 'delayed' ? 'Delayed ETA' : 'On-time buffer intact' },
    { label: 'Goa Group Meetup', type: 'meetup', time: '14:05', status: 'pending', note: 'Group convergence node' },
    { label: 'Shared Cab to Hotel', type: 'cab', time: '14:35', status: traveler.status === 'delayed' ? 'pending' : 'confirmed', note: 'Shared with group' },
    { label: 'Novotel Candolim', type: 'hotel', time: '15:30', status: traveler.status === 'delayed' ? 'pending' : 'confirmed', note: 'Group accommodation' },
  ];

  const statusColor = (s: string) => s === 'confirmed' ? '#2D7A34' : s === 'disrupted' ? '#B53027' : '#A05B00';
  const statusBg = (s: string) => s === 'confirmed' ? '#E8F5EA' : s === 'disrupted' ? '#FDECEA' : '#FDF2E0';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Traveler Bio Card */}
      <div className="space-y-4">
        <div className="card p-5 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-sm"
              style={{ background: traveler.color }}
            >
              {traveler.avatar}
            </div>
            <div>
              <div className="font-extrabold text-lg text-gray-900">{traveler.name}</div>
              <div className="text-xs text-gray-500">{traveler.origin} → Goa Escape</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F7F5EC] flex justify-between">
              <span className="text-gray-500">Transport:</span>
              <span className="font-bold text-gray-900">{modeIcons[traveler.mode]} {traveler.modeLabel}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F7F5EC] flex justify-between">
              <span className="text-gray-500">Departure:</span>
              <span className="font-bold text-gray-900">{traveler.departureTime}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F7F5EC] flex justify-between">
              <span className="text-gray-500">Scheduled Arrival:</span>
              <span className="font-bold text-gray-900">{traveler.arrivalTime}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F7F5EC] flex justify-between">
              <span className="text-gray-500">Booking Reference:</span>
              <span className="font-mono text-gray-800">{traveler.booking}</span>
            </div>
          </div>

          {traveler.status === 'delayed' && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
              <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Delay Alert: </span>
                Rajdhani 12223 running +4h late. Disrupted downstream cab pickup constraint.
              </div>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="card p-5 bg-white">
          <div className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">
            Travel Priorities
          </div>
          {[
            { label: 'Budget Sensitivity', val: traveler.preferences.cost },
            { label: 'Time Optimization', val: traveler.preferences.time },
            { label: 'Comfort & Class', val: traveler.preferences.comfort },
            { label: 'Schedule Flexibility', val: traveler.preferences.flexibility },
          ].map(p => (
            <div key={p.label} className="mb-2.5 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">{p.label}</span>
                <span className="font-bold text-gray-900">{p.val}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.val}%`, background: traveler.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Node Chain */}
      <div className="lg:col-span-2 card p-6 bg-white">
        <h4 className="font-bold text-base text-gray-900 mb-4">
          {traveler.name}'s Sequential Dependency Chain
        </h4>

        <div className="space-y-3 relative pl-6 border-l-2 border-amber-300">
          {nodes.map((node, i) => (
            <div 
              key={i}
              className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              style={{
                background: statusBg(node.status),
                borderColor: statusColor(node.status) + '40'
              }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">{node.label}</span>
                  {node.type === 'meetup' && (
                    <span className="px-2 py-0.2 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                      Group Convergence Node
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">{node.note}</div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold" style={{ color: statusColor(node.status) }}>
                  {node.time}
                </div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">
                  {node.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

