import { Shield, MapPin, Battery, Phone, Share2, MessageSquare } from 'lucide-react';

export function SurakshaPanel() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F28C28, #D96F16)' }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h2 className="font-extrabold text-2xl" style={{ color: '#1D211C' }}>🛡️ Suraksha</h2>
            <p className="text-sm" style={{ color: '#73776E' }}>Your trip's emergency communication layer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Status cards */}
          <div className="p-4 rounded-2xl" style={{ background: '#EEF1E4' }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} style={{ color: '#65855A' }} />
              <span className="font-semibold text-sm" style={{ color: '#1D211C' }}>Last Known Location</span>
            </div>
            <p className="text-sm" style={{ color: '#73776E' }}>Madgaon Railway Station, Goa</p>
            <p className="text-xs mt-1" style={{ color: '#A9C39A' }}>Updated 3 min ago</p>
          </div>

          <div className="p-4 rounded-2xl" style={{ background: '#EEF1E4' }}>
            <div className="flex items-center gap-2 mb-3">
              <Battery size={16} style={{ color: '#65855A' }} />
              <span className="font-semibold text-sm" style={{ color: '#1D211C' }}>Device Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 rounded-full overflow-hidden" style={{ background: '#E3E2D7' }}>
                <div className="h-full rounded-full" style={{ width: '62%', background: '#63A66B' }} />
              </div>
              <span className="text-sm font-bold" style={{ color: '#1D211C' }}>62%</span>
            </div>
          </div>
        </div>

        {/* Journey progress */}
        <div className="p-4 rounded-2xl mb-6" style={{ background: '#F5F3E8', border: '1px solid #E3E2D7' }}>
          <div className="font-semibold text-sm mb-3" style={{ color: '#1D211C' }}>Journey progress</div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full mb-1" style={{ background: '#63A66B' }} />
              <span className="text-xs" style={{ color: '#73776E' }}>✅ Mumbai CSMT</span>
            </div>
            <div className="flex-1 h-0.5" style={{ background: '#E3E2D7' }} />
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full mb-1" style={{ background: '#E7A943' }} />
              <span className="text-xs" style={{ color: '#73776E' }}>📍 Madgaon</span>
            </div>
            <div className="flex-1 h-0.5" style={{ background: '#E3E2D7', borderStyle: 'dashed' }} />
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full mb-1" style={{ background: '#E3E2D7' }} />
              <span className="text-xs" style={{ color: '#73776E' }}>Novotel Hotel</span>
            </div>
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="mb-6">
          <div className="font-semibold text-sm mb-3" style={{ color: '#1D211C' }}>Emergency numbers</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: 'National Emergency', number: '112' },
              { label: 'Police', number: '100' },
              { label: 'Ambulance', number: '108' },
              { label: 'Goa Police', number: '0832-2224444' },
              { label: 'Tourist Helpline', number: '1800-111-363' },
            ].map(c => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="p-3 rounded-xl text-center transition-all hover:scale-105"
                style={{ background: '#FDECEA', border: '1px solid #F0A9A5' }}
              >
                <div className="font-bold text-lg" style={{ color: '#B53027' }}>{c.number}</div>
                <div className="text-xs" style={{ color: '#73776E' }}>{c.label}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-105 btn-secondary">
            <Share2 size={18} style={{ color: '#F28C28' }} />
            <div>
              <div className="font-semibold text-sm" style={{ color: '#1D211C' }}>Share location</div>
              <div className="text-xs" style={{ color: '#73776E' }}>Send current GPS to group</div>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-105 btn-secondary">
            <MessageSquare size={18} style={{ color: '#F28C28' }} />
            <div>
              <div className="font-semibold text-sm" style={{ color: '#1D211C' }}>Emergency SMS</div>
              <div className="text-xs" style={{ color: '#73776E' }}>Requires your tap to send</div>
            </div>
          </button>
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: '#A9C39A' }}>
          Suraksha does not optimise for safety. It provides emergency access and communication tools.
        </p>
      </div>
    </div>
  );
}
