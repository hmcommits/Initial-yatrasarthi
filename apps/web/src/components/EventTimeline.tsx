import type { EventLogEntry } from '../types';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface EventTimelineProps {
  events: EventLogEntry[];
  compact?: boolean;
}

export function EventTimeline({ events, compact = false }: EventTimelineProps) {
  const iconMap: Record<string, React.ReactNode> = {
    info: <Info size={10} style={{ color: '#6D9EEB' }} />,
    warning: <AlertTriangle size={10} style={{ color: '#E5A43F' }} />,
    success: <CheckCircle size={10} style={{ color: '#62A86B' }} />,
    error: <XCircle size={10} style={{ color: '#E45B4D' }} />,
  };

  const dotColor: Record<string, string> = {
    info: '#6D9EEB',
    warning: '#E5A43F',
    success: '#62A86B',
    error: '#E45B4D',
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-3">
        {events.map((event, i) => {
          const t = event.type as string;
          const msg = event.payload?.message as string || 'Event logged';
          return (
            <div key={event.id || i} className="flex gap-2.5 items-start">
              <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ background: dotColor[t] || dotColor.info }} />
              <div>
                <p className="text-xs font-medium leading-snug" style={{ color: '#1B211C' }}>{msg}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#6F756C' }}>{event.ts ? new Date(event.ts).toLocaleTimeString() : ''}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-5" style={{ color: '#1B211C' }}>Event History</h3>
      <div className="relative pl-7">
        <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, #E45B4D 0%, #E3E2D7 100%)' }} />
        <div className="flex flex-col gap-4">
          {events.map((event, i) => {
            const t = event.type as string;
            const msg = event.payload?.message as string || 'Event logged';
            return (
              <div key={event.id || i} className="relative animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="absolute -left-8 top-2 w-4 h-4 rounded-full flex items-center justify-center bg-white border" style={{ borderColor: dotColor[t] || dotColor.info }}>
                  {iconMap[t] || iconMap.info}
                </div>
                <div className="pl-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold" style={{ color: '#6F756C', fontFamily: 'monospace' }}>{event.ts ? new Date(event.ts).toLocaleTimeString() : ''}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#1B211C' }}>{msg}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
