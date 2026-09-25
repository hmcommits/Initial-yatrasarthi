import { useEffect, useRef, useState, useMemo } from 'react';
import type { TravelNode, GraphEdge } from '../types';

interface DependencyGraphProps {
  nodes: TravelNode[];
  edges: GraphEdge[];
  animating?: boolean;
}

const CARD_W = 152;
const CARD_H = 88;
const GAP_X = 64;

function statusColor(status: string) {
  if (status === 'disrupted') return '#E45B4D';
  if (status === 'pending') return '#E5A43F';
  if (status === 'confirmed' || status === 'safe') return '#62A86B';
  return '#C8C7BE';
}

function statusBg(status: string) {
  if (status === 'disrupted') return '#FFF5F4';
  if (status === 'pending') return '#FFFDF5';
  return '#FFFFFF';
}

export function DependencyGraph({ nodes, edges, animating = false }: DependencyGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      if (width > 0) setContainerWidth(width);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Compute horizontal topological ranking (Left-to-Right layout)
  const { nodePositions, totalWidth, totalHeight } = useMemo(() => {
    if (!nodes || nodes.length === 0) {
      return { nodePositions: {}, totalWidth: 500, totalHeight: 240 };
    }

    // 1. Calculate ranks based on directed edges
    const ranks: Record<string, number> = {};
    const inDegree: Record<string, number> = {};

    nodes.forEach(n => {
      ranks[n.id] = 0;
      inDegree[n.id] = 0;
    });

    edges.forEach(e => {
      if (inDegree[e.to] !== undefined) {
        inDegree[e.to] += 1;
      }
    });

    // Topological order traversal
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 10) {
      changed = false;
      iterations++;
      edges.forEach(e => {
        const fromRank = ranks[e.from] ?? 0;
        const currentToRank = ranks[e.to] ?? 0;
        if (currentToRank <= fromRank) {
          ranks[e.to] = fromRank + 1;
          changed = true;
        }
      });
    }

    // If no edges or all 0, arrange sequentially left-to-right
    const allZero = nodes.every(n => ranks[n.id] === 0);
    if (allZero && nodes.length > 1) {
      nodes.forEach((n, i) => {
        ranks[n.id] = i;
      });
    }

    // 2. Group nodes by rank
    const rankGroups: Record<number, TravelNode[]> = {};
    nodes.forEach(n => {
      const r = ranks[n.id] ?? 0;
      if (!rankGroups[r]) rankGroups[r] = [];
      rankGroups[r].push(n);
    });

    const rankKeys = Object.keys(rankGroups).map(Number).sort((a, b) => a - b);
    const maxRank = rankKeys.length > 0 ? Math.max(...rankKeys) : 0;
    const maxNodesInRank = Math.max(...Object.values(rankGroups).map(g => g.length), 1);

    const calculatedW = Math.max(containerWidth, (maxRank + 1) * (CARD_W + GAP_X) + 80);
    const calculatedH = Math.max(240, maxNodesInRank * (CARD_H + 34) + 60);

    // 3. Compute coordinates for each node
    const positions: Record<string, { x: number; y: number; rank: number }> = {};

    rankKeys.forEach((r, rankIdx) => {
      const group = rankGroups[r];
      const startX = 36 + rankIdx * (CARD_W + GAP_X);
      const totalGroupH = group.length * CARD_H + (group.length - 1) * 24;
      const startY = (calculatedH - totalGroupH) / 2;

      group.forEach((node, nodeIdx) => {
        const y = startY + nodeIdx * (CARD_H + 24);
        positions[node.id] = { x: startX, y, rank: r };
      });
    });

    return {
      nodePositions: positions,
      totalWidth: calculatedW,
      totalHeight: calculatedH,
    };
  }, [nodes, edges, containerWidth]);

  const activeHoveredNodeData = nodes.find(n => n.id === hoveredNode);

  return (
    <div ref={containerRef} className="w-full flex flex-col">
      {/* ── Subheader / Flow indicator & Legend ── */}
      <div className="flex items-center justify-between mb-3 px-1 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5 font-semibold" style={{ color: '#D96D16' }}>
          <span>➔ Horizontal Execution DAG</span>
          <span className="text-[11px] font-normal" style={{ color: '#6F756C' }}>· Left-to-right propagation flow</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#62A86B' }} />
            <span style={{ color: '#6F756C' }}>Confirmed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#E5A43F' }} />
            <span style={{ color: '#6F756C' }}>At Risk / Pending</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#E45B4D' }} />
            <span style={{ color: '#6F756C' }}>Disrupted</span>
          </span>
        </div>
      </div>

      {/* ── Horizontal Scroll Canvas ── */}
      <div
        className="w-full overflow-x-auto scroll-x rounded-2xl relative border"
        style={{
          background: '#FCFAF6',
          borderColor: '#E8E6DB',
          minHeight: 240,
        }}
      >
        <svg
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid dot pattern */}
            <pattern id="graph-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#E4E2D5" opacity="0.65" />
            </pattern>

            {/* Arrowheads for horizontal flow */}
            <marker id="arrow-confirmed" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M 0 1 L 6 3.5 L 0 6 z" fill="#62A86B" />
            </marker>
            <marker id="arrow-pending" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M 0 1 L 6 3.5 L 0 6 z" fill="#E5A43F" />
            </marker>
            <marker id="arrow-disrupted" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M 0 1 L 6 3.5 L 0 6 z" fill="#E45B4D" />
            </marker>
            <marker id="arrow-default" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M 0 1 L 6 3.5 L 0 6 z" fill="#C8C7BE" />
            </marker>

            {/* Pulse filter */}
            <filter id="glow-disrupted" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#E45B4D" floodOpacity="0.4" />
            </filter>
            <filter id="card-soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(27,33,28,0.06)" />
            </filter>
          </defs>

          {/* Background dot grid */}
          <rect width={totalWidth} height={totalHeight} fill="url(#graph-dots)" />

          {/* Horizontal Direction Guide Lines */}
          <g opacity="0.4">
            <line x1="20" y1="24" x2={totalWidth - 20} y2="24" stroke="#E3E2D7" strokeDasharray="4 4" strokeWidth="1" />
            <text x={totalWidth - 30} y="20" textAnchor="end" fontSize="9" fill="#9DA398" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600">
              TIMELINE / DEPENDENCY FLOW ➔
            </text>
          </g>

          {/* ── EDGES (Horizontal Bezier Curves) ── */}
          {edges.map((edge, i) => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
            if (!from || !to) return null;

            const x1 = from.x + CARD_W;
            const y1 = from.y + CARD_H / 2;
            const x2 = to.x;
            const y2 = to.y + CARD_H / 2;

            const dx = Math.max(20, x2 - x1);
            const cp1x = x1 + dx * 0.45;
            const cp2x = x2 - dx * 0.45;

            const pathD = `M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`;

            const edgeStatus = edge.status;
            const strokeColor = statusColor(edgeStatus);
            const marker = edgeStatus === 'disrupted' ? 'url(#arrow-disrupted)'
              : edgeStatus === 'pending' ? 'url(#arrow-pending)'
              : edgeStatus === 'confirmed' ? 'url(#arrow-confirmed)'
              : 'url(#arrow-default)';

            // Midpoint calculation for the badge
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const labelText = edge.label || (edge.buffer ? `${edge.buffer}m buffer` : null);

            return (
              <g key={`edge-${i}`}>
                {/* Connection line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={edgeStatus === 'disrupted' ? 2.5 : 2}
                  strokeDasharray={edgeStatus === 'pending' ? '5 3' : undefined}
                  markerEnd={marker}
                  className={edgeStatus === 'disrupted' ? 'animate-pulse' : ''}
                />

                {/* Edge Label Badge */}
                {labelText && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-42"
                      y="-11"
                      width="84"
                      height="22"
                      rx="11"
                      fill={edgeStatus === 'disrupted' ? '#FDECEA' : edgeStatus === 'pending' ? '#FFF4E5' : '#EEF7EE'}
                      stroke={strokeColor}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill={strokeColor}
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {labelText.length > 15 ? labelText.slice(0, 14) + '…' : labelText}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ── NODES (Horizontal Cards) ── */}
          {nodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isHovered = hoveredNode === node.id;
            const color = statusColor(node.status);
            const bg = statusBg(node.status);
            const isDisrupted = node.status === 'disrupted';

            const iconMap: Record<string, string> = {
              flight: '✈️',
              train: '🚆',
              cab: '🚕',
              hotel: '🏨',
              activity: '🏝️',
              restaurant: '🍽️',
              meetup: '📍',
            };
            const icon = iconMap[node.type] || '📍';

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Card Background */}
                <rect
                  x="0"
                  y="0"
                  width={CARD_W}
                  height={CARD_H}
                  rx="14"
                  fill={bg}
                  stroke={color}
                  strokeWidth={isDisrupted ? 2.2 : isHovered ? 2 : 1.5}
                  filter={isDisrupted && animating ? 'url(#glow-disrupted)' : 'url(#card-soft-shadow)'}
                />

                {/* Disrupted live pulse halo */}
                {isDisrupted && (
                  <circle cx={CARD_W - 14} cy="14" r="5" fill="#E45B4D">
                    {animating && (
                      <animate
                        attributeName="r"
                        values="5;11;5"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                )}

                {/* Top Row: Icon + Type Badge + Status Dot */}
                <text x="14" y="24" fontSize="16">
                  {icon}
                </text>

                {/* Constraint Pill */}
                <rect
                  x="38"
                  y="12"
                  width="44"
                  height="16"
                  rx="8"
                  fill={node.constraint === 'hard' ? '#FEECEB' : '#EDF4E9'}
                />
                <text
                  x="60"
                  y="23"
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="700"
                  fill={node.constraint === 'hard' ? '#C0392B' : '#4E7D47'}
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {node.constraint === 'hard' ? 'HARD' : 'SOFT'}
                </text>

                {/* Status Dot (Top-Right) */}
                <circle cx={CARD_W - 14} cy="14" r="4.5" fill={color} />

                {/* Middle: Node Title */}
                <text
                  x="14"
                  y="48"
                  fontSize="11.5"
                  fontWeight="700"
                  fill="#1B211C"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {node.label.length > 17 ? node.label.slice(0, 16) + '…' : node.label}
                </text>

                {/* Bottom Row: Time & Delay or Buffer */}
                <g transform="translate(14, 68)">
                  {node.delay ? (
                    <>
                      <rect x="-2" y="-9" width="62" height="15" rx="4" fill="#FDECEA" />
                      <text x="0" y="2" fontSize="9.5" fontWeight="700" fill="#E45B4D" fontFamily="Plus Jakarta Sans, sans-serif">
                        +{node.delay}m delay
                      </text>
                    </>
                  ) : (
                    <text x="0" y="2" fontSize="9.5" fontWeight="600" fill="#6F756C" fontFamily="Plus Jakarta Sans, sans-serif">
                      ⏱ {node.actualTime || node.scheduledTime}
                    </text>
                  )}

                  <text
                    x={CARD_W - 28}
                    y="2"
                    textAnchor="end"
                    fontSize="9"
                    fontWeight="500"
                    fill="#8A9084"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {node.buffer > 0 ? `${node.buffer}m buf` : '0m slack'}
                  </text>
                </g>

                {/* Hover Tooltip (rendered directly inside SVG if hovered) */}
                {isHovered && (
                  <g transform={`translate(${CARD_W / 2 - 80}, ${pos.y > 90 ? -74 : CARD_H + 8})`} className="pointer-events-none">
                    <rect width="160" height="66" rx="10" fill="#1C1917" filter="url(#card-soft-shadow)" />
                    <text x="12" y="18" fontSize="10" fill="white" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                      {node.vendor || node.label}
                    </text>
                    <text x="12" y="32" fontSize="9" fill="#F28A28" fontFamily="Plus Jakarta Sans, sans-serif">
                      Constraint: {node.constraint.toUpperCase()} · Buffer: {node.buffer}m
                    </text>
                    <text x="12" y="46" fontSize="8.5" fill="#D6D3D1" fontFamily="Plus Jakarta Sans, sans-serif">
                      {node.location || 'Location verified'}
                    </text>
                    <text x="12" y="58" fontSize="8" fill="#9DA398" fontFamily="Plus Jakarta Sans, sans-serif">
                      Source: {node.source || 'Direct API'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mini Inspector / Details Drawer under graph if node hovered */}
      {activeHoveredNodeData && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between text-xs animate-fade-in flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900">{activeHoveredNodeData.label}</span>
            <span className="text-stone-500">·</span>
            <span className="text-stone-600">{activeHoveredNodeData.vendor}</span>
            {activeHoveredNodeData.bookingRef && (
              <span className="px-2 py-0.5 rounded bg-white text-stone-700 font-mono text-[10px] border border-amber-200">
                {activeHoveredNodeData.bookingRef}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-600">
            <span>Buffer Slack: <strong className="text-stone-900">{activeHoveredNodeData.buffer} mins</strong></span>
            <span>Constraint: <strong className="text-stone-900">{activeHoveredNodeData.constraint}</strong></span>
            <span>Source: <strong className="text-amber-800">{activeHoveredNodeData.source}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
