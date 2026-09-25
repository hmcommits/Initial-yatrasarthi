import type { EventLog } from '../types';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface EventTimelineProps {
  events: EventLog[];
  compact?: boolean;
}

export function EventTimeline({ events, compact = false }: EventTimelineProps) {
  const iconMap = {
    info: <Info size={12} style={{ color: '#6D9EEB' }} />,
    warning: <AlertTriangle size={12} style={{ color: '#E5A43F' }} />,
    success: <CheckCircle size={12} style={{ color: '#62A86B' }} />,
    error: <XCircle size={12} style={{ color: '#E45B4D' }} />,
  };
  const dotColor = { info: '#6D9EEB', warning: '#E5A43F', success: '#62A86B', error: '#E45B4D' };

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {events.map(event => (
          <div key={event.id} className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: dotColor[event.type] }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono" style={{ color: '#6F756C' }}>{event.time}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#6F756C' }}>{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-5" style={{ color: '#1B211C' }}>Event History</h3>
      <div className="relative pl-7">
        <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, #E45B4D 0%, #E3E2D7 100%)' }} />
        <div className="flex flex-col gap-4">
          {events.map((event, i) => (
            <div key={event.id} className="relative animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="absolute -left-8 top-2 w-4 h-4 rounded-full flex items-center justify-center bg-white border" style={{ borderColor: dotColor[event.type] }}>
                {iconMap[event.type]}
              </div>
              <div className="pl-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: '#6F756C', fontFamily: 'monospace' }}>{event.time}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#1B211C' }}>{event.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
