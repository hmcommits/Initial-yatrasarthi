import type { Node } from '../types';
import { StatusBadge, NodeIcon } from './StatusBadge';

export function TripTimeline({ nodes, isDisrupted }: { nodes: Node[], isDisrupted: boolean }) {
  return (
    <div className="flex flex-col">
      {nodes.map((node, i) => {
        const isLast = i === nodes.length - 1;
        const borderColor =
          node.status === 'confirmed' || node.status === 'on_track'
            ? '#62A86B'
            : node.status === 'at_risk'
            ? '#E7A943'
            : '#E45B4D';

        return (
          <div key={`${node.id}-${i}`} className="flex gap-4">
            {/* Left: icon + vertical connector */}
            <div className="flex flex-col items-center" style={{ width: 36, flexShrink: 0 }}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 z-10"
                style={{ borderColor }}
              >
                <NodeIcon type={node.type} />
              </div>
              {!isLast && (
                <div className="flex-1 w-0.5 my-1" style={{ background: '#E0E4DC', minHeight: 24 }} />
              )}
            </div>

            {/* Right: content */}
            <div className="flex-1 pb-6 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 leading-snug">{node.label}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={node.status} />
                  </div>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <div className="font-mono font-semibold text-gray-900 text-sm">
                    {node.time ? new Date(node.time).toLocaleTimeString() : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
