import type { Node, Edge } from '../types';

interface DependencyGraphProps {
  nodes: Node[];
  edges: Edge[];
  animating?: boolean;
}

export function DependencyGraph({ nodes, edges, animating }: DependencyGraphProps) {
  return (
    <div className="p-4 border rounded bg-gray-50 flex overflow-x-auto gap-4 items-center">
      {nodes.map(node => (
        <div key={node.id} className={`p-3 border rounded shadow-sm flex flex-col gap-2 min-w-[150px] bg-white ${node.status === 'broken' ? 'border-red-500' : node.status === 'at_risk' ? 'border-yellow-500' : 'border-green-500'}`}>
          <span className="font-semibold text-sm truncate">{node.label}</span>
          <span className="text-xs text-gray-500">{node.time ? new Date(node.time).toLocaleTimeString() : ''}</span>
          <span className="text-[10px] uppercase font-bold text-gray-400">{node.status.replace('_', ' ')}</span>
        </div>
      ))}
    </div>
  );
}
