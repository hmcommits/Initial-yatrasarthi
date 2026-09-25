import { useState } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle2, 
  CreditCard, ArrowRight, RefreshCw, FileText, 
  Users, Phone, Zap, ChevronRight, Check,
  Sparkles, AlertCircle
} from 'lucide-react';
import type { TripData } from '../types';

interface UserDashboardProps {
  trips: TripData[];
  activeTrip: TripData;
  onSelectTrip: (id: string) => void;
  onNavigate: (page: string) => void;
}

export function UserDashboard({ trips, activeTrip, onSelectTrip, onNavigate }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'dgca' | 'payments' | 'vault' | 'settings'>('overview');
  
  // Interactive state for Payment Webhook simulation (Solution v2 Section 7)
  const [paymentMembers, setPaymentMembers] = useState([
    { id: 'tanvi', name: 'Tanvi Sharma', role: 'Trip Organizer', amount: 1200, status: 'paid', link: 'https://rzp.io/l/ys-tanvi-goa', webhookId: 'whk_8812a_paid', time: '10:14 AM' },
    { id: 'priya', name: 'Priya Verma', role: 'Member', amount: 1200, status: 'paid', link: 'https://rzp.io/l/ys-priya-goa', webhookId: 'whk_8813b_paid', time: '10:18 AM' },
    { id: 'aarav', name: 'Aarav Patel', role: 'Member', amount: 1200, status: 'paid', link: 'https://rzp.io/l/ys-aarav-goa', webhookId: 'whk_8814c_paid', time: '10:20 AM' },
    { id: 'rahul', name: 'Rahul Joshi', role: 'Member (Delayed Train)', amount: 1200, status: 'pending', link: 'https://rzp.io/l/ys-rahul-goa', webhookId: null, time: 'Expires in 11m' },
  ]);

  // Interactive state for Honest State verification (Solution v2 Section 4)
  const [vendorActions, setVendorActions] = useState([
    {
      id: 'act-cab-01',
      title: 'Reschedule Sai Tours Airport Cab to 14:00',
      vendor: 'Sai Tours Goa',
      type: 'Cab',
      state: 'amber' as 'red' | 'amber' | 'green',
      statusText: 'Sent to driver · Awaiting WhatsApp ACK',
      proof: null as string | null,
      notes: 'Solution v2 Rule: Action stays Amber until vendor confirms with proof. User tap does not force green.'
    },
    {
      id: 'act-hotel-01',
      title: 'Late Check-in Notice at Novotel Candolim',
      vendor: 'Novotel Goa',
      type: 'Hotel',
      state: 'green' as 'red' | 'amber' | 'green',
      statusText: 'Confirmed by Hotel API',
      proof: 'Booking notes updated: Late arrival 15:30 approved without no-show penalty.',
      notes: 'API-executable action auto-confirms'
    }
  ]);

  const handleSimulateWebhook = (memberId: string) => {
    setPaymentMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          status: 'paid',
          webhookId: `whk_${Math.random().toString(36).substring(2, 9)}_verified`,
          time: 'Just now (Webhook Confirmed)'
        };
      }
      return m;
    }));
  };

  const handleVerifyVendorAck = (actionId: string) => {
    setVendorActions(prev => prev.map(a => {
      if (a.id === actionId) {
        return {
          ...a,
          state: 'green',
          statusText: 'Verified by Vendor WhatsApp Proof',
          proof: 'Driver Suresh (+91 98221 44521): "Haanji ma\'am, Madgaon 14:00 pickup note ho gaya hai. Ertiga ready rahegi."'
        };
      }
      return a;
    }));
  };

  const allPaidCount = paymentMembers.filter(m => m.status === 'paid').length;
  const totalPool = paymentMembers.reduce((sum, m) => sum + m.amount, 0);
  const collectedPool = paymentMembers.filter(m => m.status === 'paid').reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="min-h-screen pb-24 md:pb-12" style={{ background: '#F7F5EC' }}>
      
      {/* ── Top Header Profile Banner ── */}
      <div style={{ background: '#EEF1E5', borderBottom: '1px solid #E3E2D7', paddingTop: '2rem', paddingBottom: '1.5rem' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md relative"
                style={{ background: 'linear-gradient(135deg, #F28A28 0%, #D96D16 100%)' }}
              >
                TS
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <Check size={12} strokeWidth={3} className="text-white" />
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold" style={{ color: '#1B211C' }}>
                    Tanvi Sharma
                  </h1>
                  <span 
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(242,138,40,0.12)', color: '#D96D16', border: '1px solid rgba(242,138,40,0.25)' }}
                  >
                    <Sparkles size={11} /> Pro Organizer
                  </span>
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: '#E8F5EA', color: '#2D7A34', border: '1px solid #B8DDB9' }}
                  >
                    <Shield size={11} /> 24/7 Disruption Watch
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-1" style={{ color: '#6F756C' }}>
                  tanvi.s@yatrasarthi.ai · DPDP Consent Verified · Aggregator Merchant Rail Linked
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigate('new-trip')}
                className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
              >
                + Plan New Trip
              </button>
              <button 
                onClick={() => onNavigate('suraksha')}
                className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm text-red-600 border-red-200 hover:border-red-400"
              >
                <Phone size={14} /> Suraksha SOS
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="card p-3.5 bg-white">
              <div className="text-xs font-medium" style={{ color: '#6F756C' }}>Trips Monitored</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-0.5" style={{ color: '#1B211C' }}>
                {trips.length} Active
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">● 1 healthy · 1 recovering</div>
            </div>

            <div className="card p-3.5 bg-white">
              <div className="text-xs font-medium" style={{ color: '#6F756C' }}>Recovery Success</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-0.5" style={{ color: '#1B211C' }}>
                94%
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-0.5">Avg resolution 2.3 min</div>
            </div>

            <div className="card p-3.5 bg-white">
              <div className="text-xs font-medium" style={{ color: '#6F756C' }}>Disruptions Prevented</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-0.5" style={{ color: '#1B211C' }}>
                ₹14,800
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Saved in penalties & rebooking</div>
            </div>

            <div className="card p-3.5 bg-white">
              <div className="text-xs font-medium" style={{ color: '#6F756C' }}>DGCA Claims Status</div>
              <div className="text-xl sm:text-2xl font-extrabold mt-0.5" style={{ color: '#1B211C' }}>
                2 Active
              </div>
              <div className="text-[11px] text-blue-700 font-medium mt-0.5">CAR Series M Part IV compliant</div>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto mt-6 pt-2 border-b scroll-x" style={{ borderColor: '#E3E2D7' }}>
            {[
              { id: 'overview', label: 'Trip Command & Cascade' },
              { id: 'payments', label: 'Aggregator Split-Pay Rail' },
              { id: 'dgca', label: 'DGCA Passenger Rights' },
              { id: 'vault', label: 'Booking Vault & PNR Ingest' },
              { id: 'settings', label: 'Traveler Preferences' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  color: activeTab === tab.id ? '#1B211C' : '#6F756C',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  borderBottom: activeTab === tab.id ? '2px solid #F28A28' : '2px solid transparent',
                  background: activeTab === tab.id ? '#F7F5EC' : 'transparent',
                  borderRadius: '8px 8px 0 0'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── Main Content Tabs ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">

        {/* ── TAB 1: OVERVIEW & ACTIVE TRIPS ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Honest State Machine Banner (Solution v2 Section 4) */}
            <div className="card p-5 border-l-4" style={{ borderLeftColor: '#F28A28' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="font-bold text-sm sm:text-base" style={{ color: '#1B211C' }}>
                    Solution v2 Honest State Engine: Active Recovery Workflow
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Green: Vendor Confirmed
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Amber: Awaiting Proof
                  </span>
                  <span className="flex items-center gap-1 text-red-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Red: Disrupted
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-600 mb-4">
                In YatraSarthi v2, clicking or tapping never turns an itinerary node green. Actions remain in 
                <span className="font-semibold text-amber-800"> Amber (Pending Vendor)</span> until real API confirmation or verified proof (driver WhatsApp response, hotel confirmation) is recorded.
              </p>

              {/* Vendor Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorActions.map(action => (
                  <div 
                    key={action.id} 
                    className="p-4 rounded-xl border transition-all"
                    style={{
                      background: action.state === 'green' ? '#F2F8F3' : '#FDF6E9',
                      borderColor: action.state === 'green' ? '#B8DDB9' : '#F0C97A'
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2 py-0.5 rounded text-[11px] font-bold"
                          style={{
                            background: action.state === 'green' ? '#2D7A34' : '#A05B00',
                            color: 'white'
                          }}
                        >
                          {action.state.toUpperCase()}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-gray-900">{action.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{action.vendor}</span>
                    </div>

                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Status:</strong> {action.statusText}
                    </p>

                    {action.proof && (
                      <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs text-emerald-900 mb-3 font-mono">
                        ✓ Proof: {action.proof}
                      </div>
                    )}

                    {action.state === 'amber' && (
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleVerifyVendorAck(action.id)}
                          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={13} /> Simulate Driver WhatsApp Confirmation Proof
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active Trips Portfolio */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-lg" style={{ color: '#1B211C' }}>
                    Active Journeys Under Protection
                  </h3>
                  <p className="text-xs" style={{ color: '#6F756C' }}>
                    Live slack propagation & multi-modal dependency graphs
                  </p>
                </div>
                <button 
                  onClick={() => onNavigate('trips')}
                  className="text-xs font-semibold flex items-center gap-1" 
                  style={{ color: '#F28A28' }}
                >
                  View All Trips <ChevronRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {trips.map(trip => {
                  const isCurrent = trip.id === activeTrip.id;
                  const isDisrupted = trip.status === 'disrupted' || trip.status === 'recovering';
                  const healthColor = trip.health >= 80 ? '#2D7A34' : trip.health >= 60 ? '#A05B00' : '#B53027';

                  return (
                    <div 
                      key={trip.id}
                      className="card p-5 relative overflow-hidden transition-all hover:shadow-md"
                      style={{ border: isCurrent ? '2px solid #F28A28' : '1px solid #E3E2D7' }}
                    >
                      {isCurrent && (
                        <div className="absolute top-0 right-0 bg-[#F28A28] text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
                          CURRENT VIEW
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-base text-gray-900">{trip.name}</h4>
                            <span 
                              className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{
                                background: isDisrupted ? '#FDECEA' : '#E8F5EA',
                                color: isDisrupted ? '#B53027' : '#2D7A34'
                              }}
                            >
                              {isDisrupted ? 'Disruption Active' : 'Stable'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {trip.origin} → {trip.destination} · {trip.startDate} – {trip.endDate}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] text-gray-500 font-semibold">TRIP HEALTH</div>
                          <div className="text-2xl font-extrabold" style={{ color: healthColor }}>
                            {trip.health}
                            <span className="text-xs font-normal text-gray-400">/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Disruption Alert Tag if disrupted */}
                      {isDisrupted && trip.disruption && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 mb-4 flex items-start gap-2">
                          <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Cascade Detected: </span>
                            {trip.disruption.description}
                          </div>
                        </div>
                      )}

                      {/* Itinerary Nodes Snapshot */}
                      <div className="space-y-1.5 mb-4">
                        {trip.nodes.slice(0, 3).map(node => (
                          <div key={node.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#F7F5EC]">
                            <div className="flex items-center gap-2">
                              <span>
                                {node.type === 'flight' ? '✈️' : node.type === 'train' ? '🚆' : node.type === 'cab' ? '🚕' : '🏨'}
                              </span>
                              <span className="font-medium text-gray-800">{node.label}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-gray-500 font-mono">
                                {node.constraint === 'hard' ? 'Hard Constraint' : 'Soft'}
                              </span>
                            </div>
                            <span 
                              className="font-semibold text-[11px]"
                              style={{
                                color: node.status === 'confirmed' ? '#2D7A34' : node.status === 'disrupted' ? '#B53027' : '#A05B00'
                              }}
                            >
                              {node.status}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => { onSelectTrip(trip.id); onNavigate('recovery'); }}
                          className="btn-primary text-xs flex-1 py-2 flex items-center justify-center gap-1.5"
                        >
                          <Zap size={13} /> Open Recovery Center
                        </button>
                        <button
                          onClick={() => onNavigate('group')}
                          className="btn-secondary text-xs px-3 py-2 flex items-center gap-1"
                        >
                          <Users size={13} /> Group View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Link to Group Convergence Demo */}
            <div 
              className="card p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ background: 'linear-gradient(135deg, #F28A2810 0%, #A8C39A15 100%)', borderColor: '#F28A2840' }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗺️</span>
                  <h4 className="font-bold text-base text-gray-900">
                    Group Convergence & Multi-Journey Synchronization
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
                  Inspect Tanvi, Rahul, Priya, Aarav (and dynamic new members) converging from multiple cities into Goa with real-time slack calculation.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('group')}
                className="btn-primary text-xs sm:text-sm px-5 py-2.5 whitespace-nowrap flex items-center gap-1.5"
              >
                Launch Group Convergence Graph <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}

        {/* ── TAB 2: AGGREGATOR SPLIT-PAY (SOLUTION V2 SECTION 7) ── */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-amber-600" size={20} />
                    <h3 className="font-extrabold text-lg text-gray-900">
                      Aggregator Split-Pay Rail (Razorpay / Cashfree Merchant Class)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Compliant with RBI digital lending & UPI P2P collect regulations (October 2025). No raw deep links; each member receives an authenticated payment link verified via signed webhooks.
                  </p>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-xs text-gray-500 font-semibold">SETTLEMENT ESCROW POOL</div>
                  <div className="text-2xl font-extrabold text-emerald-700">
                    ₹{collectedPool.toLocaleString()} <span className="text-xs text-gray-400">/ ₹{totalPool.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {allPaidCount} of {paymentMembers.length} members confirmed
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden mb-6">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(collectedPool / totalPool) * 100}%` }}
                />
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                      <th className="pb-3">Traveler</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Split Share</th>
                      <th className="pb-3">Aggregator Link Status</th>
                      <th className="pb-3">Webhook Verification</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paymentMembers.map(member => (
                      <tr key={member.id} className="hover:bg-[#FDFBF7]">
                        <td className="py-3.5 font-bold text-gray-900">{member.name}</td>
                        <td className="py-3.5 text-gray-600">{member.role}</td>
                        <td className="py-3.5 font-bold text-gray-800">₹{member.amount.toLocaleString()}</td>
                        <td className="py-3.5">
                          <span 
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{
                              background: member.status === 'paid' ? '#E8F5EA' : '#FDF3E3',
                              color: member.status === 'paid' ? '#2D7A34' : '#A05B00'
                            }}
                          >
                            {member.status === 'paid' ? '● Paid & Settled' : '⏱ Awaiting Webhook'}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-[11px] text-gray-500">
                          {member.webhookId || 'Pending callback'}
                        </td>
                        <td className="py-3.5 text-right">
                          {member.status === 'pending' ? (
                            <button
                              onClick={() => handleSimulateWebhook(member.id)}
                              className="btn-primary text-xs px-3 py-1 inline-flex items-center gap-1 shadow-sm"
                            >
                              <RefreshCw size={11} /> Simulate Webhook Success
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-semibold text-xs flex items-center justify-end gap-1">
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fail-safe & Refund Rule Note */}
              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Solution v2 Fail-Safe Protocol: </span>
                  If any member does not complete payment before the 15-minute countdown timeout, the aggregator automatically triggers 100% source-account refunds for all paid members, or prompts the trip organizer to cover the remaining split.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: DGCA PASSENGER RIGHTS (SOLUTION V2 SECTION 8) ── */}
        {activeTab === 'dgca' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-blue-600" size={20} />
                <h3 className="font-extrabold text-lg text-gray-900">
                  DGCA Civil Aviation Requirements (CAR Section 3, Series M, Part IV)
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-6">
                YatraSarthi strictly implements the statutory rights for Indian airline passengers. In accordance with Section 8 of the v2 design, compensation is calculated honestly without falsely netting it into immediate rebooking quotes.
              </p>

              {/* DGCA Statutory Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white border border-gray-200">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                    Denied Boarding
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 mb-1">Up to ₹20,000</div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Based on block time and alternate flight delay. If alternate flight is within 1 hour, no cash compensation is mandatory.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                    Last-Minute Cancellation
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 mb-1">₹5,000 – ₹10,000</div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Capped by base fare. Plus full refund or free rerouting if informed less than 24h prior.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    Flight Delay &gt; 4h
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 mb-1">Meals & Hotel</div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Free refreshments. Hotel accommodation for overnight delay. Cash compensation is not statutory for pure delay.
                  </p>
                </div>
              </div>

              {/* Extraordinary Circumstances Banner */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <span className="font-bold">Monsoon & Extraordinary Circumstances Flag: </span>
                Delays due to Western Ghats monsoon weather, ATC slot congestion, or security directives are categorized under Extraordinary Circumstances. Compensation is marked as "Possible / Discretionary" rather than guaranteed.
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: BOOKING VAULT & INGESTION (SOLUTION V2 SECTION 12) ── */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-emerald-600" size={20} />
                    <h3 className="font-extrabold text-lg text-gray-900">
                      AI Ingestion & Multi-Source Booking Vault
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Forward tickets, boarding passes, or IRCTC SMS to your unique trip email. Claude AI extracts structured parameters with confidence scores.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F7F5EC] border border-gray-200 text-xs font-mono">
                  Inbox: <span className="text-amber-800 font-bold">goa-escape-88@forward.yatrasarthi.ai</span>
                </div>
              </div>

              {/* Extracted Documents List */}
              <div className="space-y-3">
                {[
                  { title: 'IndiGo 6E-781 Flight Confirmation (PDF)', type: 'Flight', pnr: '6E781MUM', confidence: 99, status: 'Verified', extracted: 'Departure: 07:30 BOM, Arrival: 08:45 GOI' },
                  { title: 'IRCTC e-Ticket: Rajdhani 12223 (SMS Ingest)', type: 'Train', pnr: '2247881', confidence: 94, status: 'Verified', extracted: 'Pune 06:00 → Madgaon 10:00 (Delayed +4h)' },
                  { title: 'Novotel Goa Candolim Booking Voucher (Email Forward)', type: 'Hotel', pnr: 'NVT-22419', confidence: 96, status: 'Verified', extracted: 'Check-in: 14:00, Free cancellation till 18:00' },
                  { title: 'Sai Tours Shared Group Cab (WhatsApp Screenshot)', type: 'Cab', pnr: 'SAI-GRP-404', confidence: 89, status: 'User Confirmed', extracted: 'Pickup: 10:30 Madgaon Station (Rescheduled to 14:00)' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#FDFBF7] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{doc.title}</span>
                        <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                          {doc.confidence}% Confidence
                        </span>
                      </div>
                      <div className="text-gray-500 font-mono mt-0.5">
                        PNR: {doc.pnr} · {doc.extracted}
                      </div>
                    </div>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={13} /> {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => onNavigate('new-trip')}
                  className="btn-primary text-xs px-4 py-2.5 flex items-center justify-center gap-2"
                >
                  + Upload New Document / SMS
                </button>
                <div className="text-[11px] text-gray-500 flex items-center">
                  🔒 DPDP Act 2023 Compliant: PII encrypted at rest, per-member consent enforced.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: TRAVELER PREFERENCES ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">
                Recovery Ranking Weights & Safety Profile
              </h3>
              <p className="text-xs text-gray-600 mb-6">
                When delays occur, YatraSarthi normalizes cost, arrival time, and dropped bookings according to your calibrated preference profile.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Cost Sensitivity</span>
                    <span className="text-amber-600">60%</span>
                  </div>
                  <input type="range" defaultValue={60} className="preference-slider w-full" />
                  <p className="text-[11px] text-gray-500 mt-1">Prefers budget re-routing over flight switches.</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Time Preservation</span>
                    <span className="text-blue-600">20%</span>
                  </div>
                  <input type="range" defaultValue={20} className="preference-slider w-full" />
                  <p className="text-[11px] text-gray-500 mt-1">Willing to wait up to 3h to keep group together.</p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Itinerary Protection</span>
                    <span className="text-emerald-600">20%</span>
                  </div>
                  <input type="range" defaultValue={20} className="preference-slider w-full" />
                  <p className="text-[11px] text-gray-500 mt-1">Prioritize hotel & dinner reservations.</p>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <button className="btn-primary text-xs px-4 py-2">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
