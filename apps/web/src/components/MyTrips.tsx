import { Plus, ArrowRight, MapPin, Users, ChevronRight } from 'lucide-react';
import type { TripData } from '../types';

interface MyTripsProps {
  trips: TripData[];
  onSelectTrip: (id: string) => void;
  onNavigate: (page: string) => void;
}

export function MyTrips({ trips, onSelectTrip, onNavigate }: MyTripsProps) {
  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ background: '#F7F5EC' }}>
      <div style={{ background: '#EEF1E5', borderBottom: '1px solid #E3E2D7', padding: '32px 0 28px' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-extrabold text-3xl mb-1" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>My Trips</h1>
            <p style={{ color: '#6F756C' }}>{trips.length} saved {trips.length === 1 ? 'trip' : 'trips'} · YatraSarthi keeps them connected</p>
          </div>
          <button
            onClick={() => onNavigate('new-trip')}
            className="btn-primary px-5 py-2.5 text-sm"
          >
            <Plus size={15} />
            New trip
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        {/* Persistence note */}
        <div className="flex items-center gap-2 text-xs mb-6 p-3 rounded-xl" style={{ background: '#E6F4E8', color: '#2D7836' }}>
          <span>✓</span>
          <span>Your itineraries are saved and connected. YatraSarthi monitors them continuously — no re-upload needed.</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {trips.map(trip => <TripCard key={trip.id} trip={trip} onSelect={() => onSelectTrip(trip.id)} />)}

          {/* New trip CTA card */}
          <button
            onClick={() => onNavigate('new-trip')}
            className="rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-md group"
            style={{ border: '2px dashed #E3E2D7', background: 'transparent', cursor: 'pointer', minHeight: 200 }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ background: '#EEF1E5' }}>
              <Plus size={22} style={{ color: '#F28A28' }} />
            </div>
            <span className="font-semibold text-sm" style={{ color: '#6F756C' }}>Plan another trip</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip, onSelect }: { trip: TripData; onSelect: () => void }) {
  const healthColor = trip.health >= 80 ? '#62A86B' : trip.health >= 60 ? '#E5A43F' : '#E45B4D';
  const statusLabel = trip.status === 'healthy' ? 'Healthy' : trip.status === 'needs_attention' ? 'Needs Attention' : trip.status === 'resolving' ? 'Resolving' : 'Completed';
  const isDisrupted = trip.status === 'needs_attention';
  const nextNode = trip.nodes[0];

  const typeIcons: Record<string, string> = { flight: '✈', train: '🚆', bus: '🚌', cab: '🚕', hotel: '🏨', activity: '🏝', restaurant: '🍽' };

  return (
    <button
      onClick={onSelect}
      className="card p-6 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 group"
      style={{ border: isDisrupted ? '1px solid #EFAAA5' : '1px solid #E3E2D7' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-xl mb-1" style={{ color: '#1B211C', letterSpacing: '-0.01em' }}>
            {trip.name || trip.destination}
          </h3>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6F756C' }}>
            <MapPin size={12} />
            {trip.startDate} – {trip.endDate}
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            background: isDisrupted ? '#FDECEA' : '#E6F4E8',
            color: isDisrupted ? '#B03028' : '#2D7836',
            border: `1px solid ${isDisrupted ? '#EFAAA5' : '#B4D9B8'}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor }} />
          {statusLabel}
        </div>
      </div>

      {/* Health bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6F756C' }}>
            <Users size={12} />
            {trip.travellers.length} travelers
          </div>
          <span className="font-bold text-xl" style={{ color: healthColor, letterSpacing: '-0.02em' }}>
            {trip.health}<span className="text-sm font-normal" style={{ color: '#E3E2D7' }}>/100</span>
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: '#E3E2D7' }}>
          <div className="h-full rounded-full" style={{ width: `${trip.health}%`, background: healthColor, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Node strip */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {trip.nodes.map(node => {
          const nodeColor = node.status === 'confirmed' || node.status === 'on_track' ? '#62A86B' : node.status === 'broken' ? '#E45B4D' : '#E5A43F';
          return (
            <div
              key={node.id}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
              style={{ background: '#F7F5EC', border: `1px solid ${nodeColor}25` }}
            >
              <span style={{ fontSize: 11 }}>{typeIcons[node.type] || '📌'}</span>
              <span style={{ color: '#6F756C' }}>{node.time ? new Date(node.time).toLocaleTimeString() : ''}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: nodeColor }} />
            </div>
          );
        })}
      </div>

      {/* Next event */}
      {nextNode && (
        <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: '#EEF1E5' }}>
          <span className="text-sm">{typeIcons[nextNode.type] || '📌'}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: '#1B211C' }}>{nextNode.label}</div>
            <div className="text-xs" style={{ color: '#6F756C' }}>{nextNode.time ? new Date(nextNode.time).toLocaleTimeString() : ''}</div>
          </div>
          <span className="text-xs font-medium flex-shrink-0" style={{ color: '#6F756C' }}>Next</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: '#6F756C' }}>{trip.id}</span>
        <div className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: '#F28A28' }}>
          Open trip <ChevronRight size={14} />
        </div>
      </div>
    </button>
  );
}
