import type { Node, Edge } from '../types';

interface DependencyGraphProps {
  nodes: Node[];
  edges: Edge[];
  animating?: boolean;
}

function safeStr(val: unknown, fallback = ''): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return (val as any)?.value ?? fallback;
  return String(val);
}

export function DependencyGraph({ nodes, edges, animating }: DependencyGraphProps) {
  return (
    <div className="p-4 border rounded bg-gray-50 flex overflow-x-auto gap-4 items-center">
      {nodes.map((node: any, i: number) => {
        const label = safeStr(node.label, node.type ?? 'Node');
        const status = safeStr(node.status, 'unknown');
        return (
          <div key={node.id || node._id || i} className={`p-3 border rounded shadow-sm flex flex-col gap-2 min-w-[150px] bg-white ${status === 'broken' ? 'border-red-500' : status === 'at_risk' ? 'border-yellow-500' : 'border-green-500'}`}>
            <span className="font-semibold text-sm truncate">{label}</span>
            <span className="text-xs text-gray-500">{node.time ? (isNaN(new Date(node.time).getTime()) ? String(node.time) : new Date(node.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : ''}</span>
            <span className="text-[10px] uppercase font-bold text-gray-400">{status.replace('_', ' ')}</span>
          </div>
        );
      })}
    </div>
  );
}
