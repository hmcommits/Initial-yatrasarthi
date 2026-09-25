import { useState, useEffect } from 'react';
import { Users, MapPin, AlertTriangle } from 'lucide-react';

interface GroupJourneyProps {
  tripId: string;
}

export function GroupJourney({ tripId }: GroupJourneyProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/trips/${tripId}/group`)
      .then(res => res.json())
      .then(d => {
        setData(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tripId]);

  if (loading) return <div className="p-8 text-center">Loading group journey...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load group data</div>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Users size={24} style={{ color: '#1B211C' }} />
        <h2 className="text-2xl font-bold text-gray-900">Group Journey Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members Status */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-gray-800">Traveler Status</h3>
          <div className="flex flex-col gap-4">
            {data.members?.map((m: any) => (
              <div key={m.memberId} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {m.name}
                    {m.memberId === data.weakestLinkMemberId && (
                      <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Weakest Link</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Current: {m.currentLeg}</div>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                  m.status === 'on_track' ? 'bg-green-100 text-green-700' :
                  m.status === 'at_risk' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {m.status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Nodes */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-gray-800">Shared Meetup Points</h3>
          <div className="flex flex-col gap-3">
            {data.sharedNodes?.map((sn: any) => (
              <div key={sn.nodeId} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <MapPin size={18} className="text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">{sn.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{sn.sharedByCount} travelers converging here</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
