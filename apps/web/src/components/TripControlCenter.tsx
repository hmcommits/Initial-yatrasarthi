import { useState, useEffect } from 'react';
import { Share, Bell, Users, MapPin, ChevronDown, AlertTriangle, Clock, Check, RotateCcw, Settings, Compass, ShieldCheck } from 'lucide-react';
import type { TripData, UserPreferences, RecoveryOption } from '../types';
import { TripTimeline } from './TripTimeline';
import { DependencyGraph } from './DependencyGraph';
import { TripHealth } from './TripHealth';
import { RecoveryOptions } from './RecoveryOptions';
import { GroupPanel } from './GroupPanel';
import { VendorDraft } from './VendorDraft';
import { EventTimeline } from './EventTimeline';
import { DisruptionSimulator } from './DisruptionSimulator';
import { KutumbInviteModal } from './trips/KutumbInviteModal';
import { TripSettingsModal } from './trips/TripSettingsModal';
import IngestionHub from './ingestion/IngestionHub';

const defaultPreferences = { cost: 40, time: 80, bookings: 100 };

type Tab = 'overview' | 'journey' | 'group' | 'bookings' | 'recovery' | 'activity';

interface TripControlCenterProps {
  trip: TripData;
  onDisrupt: (scenarioId: string) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'journey', label: 'Journey' },
  { id: 'group', label: 'Group' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'activity', label: 'Activity' },
];

export function TripControlCenter({ trip: initialTrip, onDisrupt }: TripControlCenterProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();
  
  const [trip, setTrip] = useState(initialTrip);
  const [weakestEdge, setWeakestEdge] = useState<{ from: string; to: string; slack: number } | null>(null);
  const [fetchedRecoveryOptions, setFetchedRecoveryOptions] = useState<RecoveryOption[] | null>(null);
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [generatingLinks, setGeneratingLinks] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleGeneratePaymentLinks = async () => {
    setGeneratingLinks(true);
    try {
      const res = await fetch('/api/payments/create-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: initialTrip.id,
          actionId: 'mock_action_id',
          payers: trip.travellers.map(t => ({ memberId: t.id, amount: 500 }))
        })
      });
      const data = await res.json();
      if (data.links) setPaymentLinks(data.links);
    } finally {
      setGeneratingLinks(false);
    }
  };

  useEffect(() => {
    setTrip(initialTrip);
  }, [initialTrip]);

  useEffect(() => {
    if (initialTrip.id === 'default' || initialTrip.id === 'needs_attention') return;
    
    if (trip.status === 'needs_attention' || trip.status === 'resolving') {
      fetch(`/api/trips/${initialTrip.id}/recovery-options`)
        .then(r => r.json())
        .then(data => {
          if (data.recoveryOptions) setFetchedRecoveryOptions(data.recoveryOptions);
        })
        .catch(() => {});
    }
  }, [initialTrip.id, trip.status]);

  useEffect(() => {
    // Only poll if it's a real trip ID (not our mock data ids)
    if (initialTrip.id === 'default' || initialTrip.id === 'needs_attention') return;

    const fetchGraph = async () => {
      try {
        const res = await fetch(`/api/trips/${initialTrip.id}/graph`);
        if (res.ok) {
          const data = await res.json();
          setTrip(prev => {
            const newTrip = { ...prev };
            if (data.healthScore !== undefined) newTrip.health = data.healthScore;
            if (data.status) newTrip.status = data.status;
            
            if (data.nodes?.length > 0) {
              newTrip.nodes = data.nodes.map((n: any) => ({
                ...n,
                label: n.vendor || n.type,
                status: n.status === 'broken' ? 'disrupted' : n.status === 'scheduled' ? 'confirmed' : 'pending',
                scheduledTime: new Date(n.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                trustLevel: 'high'
              }));
            }
            if (data.edges?.length > 0) {
              newTrip.edges = data.edges.map((e: any) => ({
                ...e,
                from: e.fromNodeId,
                to: e.toNodeId,
                buffer: e.bufferMin,
                status: 'confirmed'
              }));
              
              const weakest = data.edges.reduce((prev: any, curr: any) => 
                 ((curr.bufferMin + curr.paddingMin) < (prev.bufferMin + prev.paddingMin) ? curr : prev)
              );
              setWeakestEdge({ from: weakest.fromNodeId, to: weakest.toNodeId, slack: weakest.bufferMin + weakest.paddingMin });
            }
            return newTrip;
          });
        }
      } catch (err) {}
    };

    fetchGraph();
    const interval = setInterval(fetchGraph, 5000);
    return () => clearInterval(interval);
  }, [initialTrip.id]);

  const isDisrupted = trip.status === 'needs_attention' || trip.status === 'resolving';
  const isSolo = trip.tripType === 'solo' || (!trip.tripType && (trip.travellers?.length === 1 || trip.memberIds?.length === 1));
  const healthColor = trip.health >= 80 ? '#62A86B' : trip.health >= 60 ? '#E5A43F' : '#E45B4D';
  const statusLabel = trip.status === 'healthy' ? 'Stable' : trip.status === 'needs_attention' ? 'Disrupted' : trip.status === 'resolving' ? 'Recovering' : 'Recovered';

  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ background: '#F5F2E8' }}>

      {/* ── Trip header ── */}
      <div style={{ background: '#EDE9D8', borderBottom: '1px solid #D5D9CC' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-3" style={{ color: '#5F665B' }}>
            <span>My Trips</span>
            <ChevronDown size={12} style={{ transform: 'rotate(-90deg)' }} />
            <span style={{ color: '#172017', fontWeight: 600 }}>{trip.name}</span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-6">
            {/* Trip identity */}
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1
                  className="font-extrabold"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#172017', letterSpacing: '-0.02em' }}
                >
                  {trip.name === 'Group Trip' ? 'Group Trip' : `${trip.name} → ${trip.destination}`}
                </h1>
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: isDisrupted ? '#FDECEA' : '#E8F0E2',
                    color: isDisrupted ? '#B03028' : '#2D7836',
                    border: `1px solid ${isDisrupted ? '#EFAAA5' : '#D5D9CC'}`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor }} />
                  {statusLabel}
                </span>
                {isSolo ? (
                  <span
                    className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                    style={{ background: '#172017', color: '#C5D82D' }}
                  >
                    <Compass size={13} /> Solo Explorer
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: '#EDE9D8', color: '#172017', border: '1px solid #D5D9CC' }}
                  >
                    <Users size={13} /> Kutumb Group
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm" style={{ color: '#5F665B' }}>
                  <MapPin size={13} />
                  {trip.startDate} – {trip.endDate}
                </div>
                <div className="flex items-center gap-1.5 text-sm" style={{ color: '#5F665B' }}>
                  {isSolo ? <Compass size={13} className="text-[#4E8752]" /> : <Users size={13} />}
                  {isSolo ? 'Solo Explorer (1 traveler)' : `${trip.travellers.length} travelers`}
                </div>
                <div className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#DCE8D2', color: '#172017', border: '1px solid #D5D9CC' }}>
                  ID: {trip.id}
                </div>
              </div>
            </div>

            {/* Health + actions */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs font-medium mb-0.5" style={{ color: '#5F665B' }}>Trip Health</div>
                <div className="font-extrabold" style={{ fontSize: '2.2rem', color: healthColor, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {trip.health}
                  <span className="text-base font-medium" style={{ color: '#D5D9CC' }}>/100</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="btn-ghost text-sm cursor-pointer flex items-center gap-1.5 border border-[#D5D9CC] rounded-xl px-3 py-2 bg-white"
                  title={isSolo ? "Share Live Tracking link with contacts" : "Invite members to Kutumb"}
                >
                  <Share size={15} />
                  {isSolo ? 'Share Tracking' : 'Kutumb Link'}
                </button>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="btn-ghost text-sm cursor-pointer flex items-center gap-1.5 border border-[#D5D9CC] rounded-xl px-3 py-2 bg-white"
                  title="Trip Settings"
                >
                  <Settings size={15} />
                  Settings
                </button>
                <button className="btn-ghost text-sm border border-[#D5D9CC] rounded-xl p-2 bg-white">
                  <Bell size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Disruption alert */}
          {isDisrupted && trip.disruption && (
            <div
              className="mt-4 p-4 rounded-2xl flex items-start gap-3 animate-slide-up"
              style={{ background: '#FDECEA', border: '1px solid #EFAAA5' }}
            >
              <AlertTriangle size={16} style={{ color: '#E45B4D', flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-0.5" style={{ color: '#B03028' }}>
                  Cascade detected · {trip.disruption.timestamp}
                  <span className="ml-2 text-xs font-normal opacity-70">Simulated event</span>
                </div>
                <div className="text-sm" style={{ color: '#6F756C' }}>{trip.disruption.description}</div>
              </div>
              <button
                onClick={() => setActiveTab('recovery')}
                className="btn-primary text-xs px-3 py-1.5 flex-shrink-0"
              >
                View recovery
              </button>
            </div>
          )}

          {/* Persistence note */}
          {!isDisrupted && (
            <div className="mt-4 flex items-center gap-2 text-xs font-medium" style={{ color: '#4E8752' }}>
              <Check size={12} />
              <span>
                {isSolo
                  ? 'Solo itinerary active: Live phantom micro-transit buffers and Suraksha emergency stand-by enabled.'
                  : 'Your itinerary is already connected. YatraSarthi is monitoring for disruptions.'}
              </span>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-0 mt-6 border-b" style={{ borderColor: '#D5D9CC' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-3 text-sm font-medium transition-all relative"
                style={{
                  color: activeTab === tab.id ? '#172017' : '#5F665B',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                                    marginBottom: -1,
                  background: 'none',
                  border: 'none',
                  borderBottomWidth: 3,
                  borderBottomStyle: 'solid',
                  borderBottomColor: activeTab === tab.id ? '#C5D82D' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
                {tab.id === 'recovery' && isDisrupted && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#E45B4D' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <TripHealth score={trip.health} status={trip.status} weakestEdge={weakestEdge} />
              {/* Graph preview */}
              <div className="card p-5 bg-white border" style={{ borderColor: '#D5D9CC' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base" style={{ color: '#172017' }}>Dependency Graph</h3>
                  <button onClick={() => setActiveTab('journey')} className="text-xs font-bold" style={{ color: '#172017' }}>
                    Full view →
                  </button>
                </div>
                <div className="w-full">
                  <DependencyGraph nodes={trip.nodes} edges={trip.edges} animating={isDisrupted} />
                </div>
                {isDisrupted && (
                  <div className="mt-3 flex items-center gap-2 text-xs p-3 rounded-xl" style={{ background: '#FDECEA', color: '#B03028' }}>
                    <AlertTriangle size={12} />
                    3 downstream components affected
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <GroupPanel travellers={trip.travellers} />
              {trip.eventLog.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm" style={{ color: '#172017' }}>Recent activity</span>
                    <button onClick={() => setActiveTab('activity')} className="text-xs font-bold" style={{ color: '#172017' }}>View all</button>
                  </div>
                  <EventTimeline events={trip.eventLog.slice(0, 3)} compact />
                </div>
              )}
            </div>
          </div>
        )}

        {/* JOURNEY */}
        {activeTab === 'journey' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <div className="card p-5 bg-white border" style={{ borderColor: '#D5D9CC' }}>
                <h3 className="font-bold text-base mb-5" style={{ color: '#172017' }}>Journey Timeline</h3>
                <TripTimeline nodes={trip.nodes} isDisrupted={isDisrupted} />
              </div>
            </div>
            <div className="lg:col-span-3 flex flex-col gap-5">
              <div className="card p-5 flex-1 bg-white border" style={{ borderColor: '#D5D9CC', minHeight: 360 }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base" style={{ color: '#172017' }}>Dependency Graph</h3>
                  <span className="text-xs" style={{ color: '#5F665B' }}>Hover nodes for details</span>
                </div>
                <DependencyGraph nodes={trip.nodes} edges={trip.edges} animating={isDisrupted} />
              </div>
              <DisruptionSimulator onDisrupt={onDisrupt} isDisrupted={isDisrupted} />
            </div>
          </div>
        )}

        {/* GROUP */}
        {activeTab === 'group' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GroupPanel travellers={trip.travellers} />
            <div className="card p-5 bg-white border" style={{ borderColor: '#D5D9CC' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: '#172017' }}>Group Decision</h3>
              {isDisrupted ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm" style={{ color: '#5F665B' }}>Plan B selected: Push the cab to 14:00</p>
                  {trip.travellers.map((t, i) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl card-inset">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: ['#172017', '#C5D82D', '#4E8752', '#858B80'][i % 4], color: i % 4 === 1 ? '#172017' : '#FFFFFF' }}>
                          {t.avatar}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: '#172017' }}>{t.name}</span>
                      </div>
                      <div>
                        {i !== 2 ? (
                          <span className="flex items-center gap-1 text-xs font-semibold badge-confirmed px-2 py-1 rounded-full">
                            <Check size={10} /> Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold badge-pending px-2 py-1 rounded-full">
                            <Clock size={10} /> Waiting
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl text-sm font-medium text-center" style={{ background: '#FDF2E0', color: '#9A5A00', border: '1px solid #EFD090' }}>
                    Group approved. Ready for payment.
                  </div>
                  {paymentLinks.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold" style={{ color: '#172017' }}>Payment Links Generated</p>
                      {paymentLinks.map(link => (
                        <div key={link.id} className="flex justify-between items-center text-xs p-2 border rounded-xl" style={{ borderColor: '#D5D9CC', background: '#F5F2E8' }}>
                          <span style={{ color: '#172017' }}>{trip.travellers.find(t => t.id === link.memberId)?.name || link.memberId}</span>
                          <a href={link.paymentUrl} target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: '#172017' }}>Pay ₹{link.amount}</a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <button onClick={handleGeneratePaymentLinks} disabled={generatingLinks} className="btn-primary py-3 text-sm">
                      {generatingLinks ? 'Generating...' : 'Generate Split Payment Links'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-sm" style={{ color: '#5F665B' }}>No active group decision. Start a disruption simulation to see group coordination.</div>
              )}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6">
            <IngestionHub tripId={trip.id} joinCode={trip.joinCode || ''} />
            <BookingsTab nodes={trip.nodes} />
          </div>
        )}

        {/* RECOVERY */}
        {activeTab === 'recovery' && (
          <div className="flex flex-col gap-6">
            {isDisrupted && trip.recoveryPlans ? (
              <>
                <RecoveryOptions
                  plans={fetchedRecoveryOptions || trip.recoveryPlans || []}
                  preferences={prefs}
                  onPreferencesChange={setPrefs}
                  selectedPlan={selectedPlan}
                  onSelectPlan={setSelectedPlan}
                />
                <VendorDraft />
              </>
            ) : (
              <div className="card p-12 text-center" style={{ background: '#FFFFFF', borderColor: '#D5D9CC' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border" style={{ background: '#DCE8D2', borderColor: '#D5D9CC' }}>
                  <RotateCcw size={24} style={{ color: '#172017' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#172017' }}>No active disruptions</h3>
                <p className="text-sm mb-6" style={{ color: '#5F665B' }}>Your trip is healthy. Use the disruption simulator to see how YatraSarthi responds.</p>
                <button onClick={() => setActiveTab('journey')} className="btn-secondary px-5 py-2.5 text-sm">
                  Go to Journey → Disruption Simulator
                </button>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="max-w-2xl">
            <EventTimeline events={trip.eventLog?.length > 0 ? trip.eventLog : [{ id: '0', tripId: trip.id, seq: 1, actor: 'system', ts: new Date().toISOString(), payload: { message: 'Trip created and saved. No events yet.' }, type: 'info' }]} />
          </div>
        )}
      </div>

      {/* Screen B3: Kutumb Invite Modal */}
      {showInviteModal && (
        <KutumbInviteModal
          trip={trip}
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {/* Screen B4: Trip Settings Modal */}
      {showSettingsModal && (
        <TripSettingsModal
          trip={trip}
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onTripUpdated={() => {
            fetch(`/api/trips/${trip.id}`).then(r => r.json()).then(d => {
              if (d.data) setTrip(prev => ({ ...prev, ...d.data }));
            });
          }}
          onOpenInvite={() => {
            setShowSettingsModal(false);
            setShowInviteModal(true);
          }}
        />
      )}
    </div>
  );
}

function BookingsTab({ nodes }: { nodes: any[] }) {
  const typeIcons: Record<string, string> = { flight: '✈', train: '🚆', bus: '🚌', cab: '🚕', hotel: '🏨', activity: '🏝', restaurant: '🍽', phantom: '📍', meetup: '🎯' };
  const sourceMap: Record<string, string> = { high: 'Provider API', medium: 'Vendor contact', low: 'User report' };

  return (
    <div className="flex flex-col gap-3">
      {nodes.map(node => (
        <div key={node.id} className="card p-5" style={{ background: '#FFFFFF', borderColor: '#D5D9CC' }}>
          <div className="flex items-start gap-4 flex-wrap">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border"
              style={{ background: '#DCE8D2', borderColor: '#D5D9CC' }}
            >
              {typeIcons[node.type] || '📌'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-bold" style={{ color: '#172017' }}>{node.label}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${node.status === 'confirmed' ? 'badge-confirmed' : node.status === 'needs_attention' ? 'badge-disrupted' : 'badge-pending'}`}
                >
                  {node.status === 'confirmed' ? 'Confirmed' : node.status === 'needs_attention' ? 'Disrupted' : 'At Risk'}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#5F665B' }}>
                <span>{node.vendor}</span>
                <span>{node.location}</span>
                <span>{node.scheduledTime}{node.delay ? ` (+${node.delay}m)` : ''}</span>
                {node.bookingRef && <span style={{ fontFamily: 'monospace' }}>{node.bookingRef}</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs mb-1" style={{ color: '#5F665B' }}>Source</div>
              <div className="text-xs font-semibold" style={{ color: '#172017' }}>{sourceMap[node.trustLevel]}</div>
              <div className="text-xs mt-0.5" style={{ color: node.trustLevel === 'high' ? '#2E7D32' : node.trustLevel === 'medium' ? '#C5D82D' : '#D93829' }}>
                {node.trustLevel.charAt(0).toUpperCase() + node.trustLevel.slice(1)} trust
              </div>
            </div>
          </div>
          {node.note && (
            <div className="mt-3 text-xs px-3 py-2 rounded-lg border" style={{ background: '#EDE9D8', color: '#172017', borderColor: '#D5D9CC' }}>
              ⚠ {node.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
