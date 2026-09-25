import type { Traveller } from '../types';
import { CheckCircle, Clock, Send } from 'lucide-react';

interface GroupPanelProps {
  travellers: Traveller[];
  totalAmount?: number;
  paymentWindow?: string;
}

export function GroupPanel({ travellers, totalAmount = 2400, paymentWindow = '08:42' }: GroupPanelProps) {
  const paid = travellers.filter(t => t.paymentStatus === 'paid').length;
  const progress = (paid / travellers.length) * 100;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold" style={{ color: '#1D211C' }}>Group Coordination</h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: '#EEF1E4', color: '#65855A' }}>
          {travellers.length} travellers
        </span>
      </div>

      {/* Members */}
      <div className="flex flex-col gap-3 mb-5">
        {travellers.map(t => (
          <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F5F3E8' }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: ['#F28C28', '#6D9EEB', '#A9C39A', '#F4D35E'][travellers.indexOf(t) % 4] }}
            >
              {t.avatar}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm" style={{ color: '#1D211C' }}>{t.name}</div>
              <div className="text-xs" style={{ color: '#73776E' }}>Share: ₹{t.amount}</div>
            </div>
            <div>
              {t.paymentStatus === 'paid' ? (
                <span className="flex items-center gap-1 text-xs font-semibold status-confirmed px-2 py-1 rounded-full">
                  <CheckCircle size={11} /> Paid
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold status-pending px-2 py-1 rounded-full">
                  <Clock size={11} /> Awaiting
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: '#73776E' }}>Payment progress</span>
          <span className="text-sm font-bold" style={{ color: '#1D211C' }}>{paid}/{travellers.length} paid</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#E3E2D7' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: '#63A66B' }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: '#73776E' }}>Total: ₹{totalAmount.toLocaleString()}</span>
          <span className="text-xs font-medium" style={{ color: '#E7A943' }}>⏱ {paymentWindow} remaining</span>
        </div>
      </div>

      <button className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm">
        <Send size={14} />
        Request payment from group
      </button>

      <p className="text-xs mt-3 text-center" style={{ color: '#73776E' }}>
        Each member receives an individual payment link. Recovery executes only after all payments confirmed.
      </p>
    </div>
  );
}
