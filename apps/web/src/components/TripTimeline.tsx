import type { TravelNode } from '../types';
import { StatusBadge, NodeIcon } from './StatusBadge';
import { Clock, Shield } from 'lucide-react';

interface TripTimelineProps {
  nodes: TravelNode[];
  horizontal?: boolean;
}

export function TripTimeline({ nodes, horizontal = false }: TripTimelineProps) {
  if (horizontal) {
    return <HorizontalTimeline nodes={nodes} />;
  }
  return <VerticalTimeline nodes={nodes} />;
}

function VerticalTimeline({ nodes }: { nodes: TravelNode[] }) {
  return (
    <div className="relative pl-10">
      <div className="timeline-line" />
      <div className="flex flex-col gap-0">
        {nodes.map((node, i) => (
          <div key={node.id} className="relative flex gap-4 pb-6">
            {/* Timeline dot */}
            <div
              className="absolute left-0 w-10 flex items-start justify-center pt-1"
              style={{ transform: 'translateX(-50%)', left: 20 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-base border-2 z-10 bg-white"
                style={{
                  borderColor: node.status === 'disrupted' ? '#E45B4D'
                    : node.status === 'pending' ? '#E7A943'
                    : '#63A66B',
                  boxShadow: node.status === 'disrupted' ? '0 0 0 4px rgba(228,91,77,0.15)' : 'none',
                }}
              >
                <NodeIcon type={node.type} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 ml-6">
              <div className="card-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm" style={{ color: '#1D211C' }}>{node.label}</span>
                      {node.delay && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#FDECEA', color: '#B53027' }}>
                          +{node.delay}m
                        </span>
                      )}
                    </div>
                    <div className="text-xs mb-2" style={{ color: '#73776E' }}>{node.vendor} · {node.location}</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#73776E' }}>
                        <Clock size={11} />
                        {node.actualTime || node.scheduledTime}
                        {node.actualTime && node.actualTime !== node.scheduledTime && (
                          <span className="line-through ml-1 opacity-50">{node.scheduledTime}</span>
                        )}
                      </div>
                      {node.buffer > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EEF1E4', color: '#65855A' }}>
                          {Math.floor(node.buffer / 60)}h {node.buffer % 60 > 0 ? `${node.buffer % 60}m` : ''} buffer
                        </span>
                      )}
                      {node.constraint === 'hard' && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: '#FDECEA', color: '#B53027' }}>
                          <Shield size={9} />
                          Hard constraint
                        </span>
                      )}
                    </div>
                    {node.note && (
                      <div className="mt-2 text-xs italic" style={{ color: '#73776E' }}>⚠️ {node.note}</div>
                    )}
                  </div>
                  <StatusBadge status={node.status} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalTimeline({ nodes }: { nodes: TravelNode[] }) {
  return (
    <div className="overflow-x-auto py-4">
      <div className="flex items-start gap-0 min-w-max px-4">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-start">
            {/* Node card */}
            <div className="flex flex-col items-center w-36">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-2 bg-white mb-2"
                style={{
                  borderColor: node.status === 'disrupted' ? '#E45B4D'
                    : node.status === 'pending' ? '#E7A943'
                    : '#63A66B',
                }}
              >
                <NodeIcon type={node.type} />
              </div>
              <div className="text-center">
                <div className="text-xs font-bold mb-0.5" style={{ color: '#1D211C' }}>{node.label}</div>
                <div className="text-xs mb-1" style={{ color: '#73776E' }}>{node.actualTime || node.scheduledTime}</div>
                <StatusBadge status={node.status} />
                {node.delay && (
                  <div className="text-xs mt-1 font-semibold" style={{ color: '#E45B4D' }}>+{node.delay}m</div>
                )}
              </div>
            </div>
            {/* Connector */}
            {i < nodes.length - 1 && (
              <div className="flex items-center pt-5 px-1">
                <div className="h-0.5 w-8" style={{ background: '#E3E2D7', borderStyle: 'dashed' }} />
                <span style={{ color: '#73776E', fontSize: 12 }}>›</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
