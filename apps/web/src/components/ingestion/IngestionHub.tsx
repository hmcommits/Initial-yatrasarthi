'use client';


import { useEffect, useState, useCallback } from 'react';
import type { Node } from '@yatrasarthi/types';
import UploadDocument from './UploadDocument';
import ExtractionReview from './ExtractionReview';
import AddPhantomNode from './AddPhantomNode';
import BookingDetail from './BookingDetail';
import WhatsAppSetup from './WhatsAppSetup';

type View = 'hub' | 'whatsapp' | 'upload' | 'review' | 'phantom' | 'detail';

interface IngestionHubProps {
  tripId: string;
  joinCode: string;
}

export default function IngestionHub({ tripId, joinCode }: IngestionHubProps) {
  const [view, setView] = useState<View>('hub');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [pendingNode, setPendingNode] = useState<Node | null>(null);


  const fetchNodes = useCallback(async () => {
    const res = await fetch(`/api/trips/${tripId}/nodes`);
    if (res.ok) {
      const json = await res.json();
      setNodes(json.data?.nodes ?? []);
    }
  }, [tripId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchNodes(); }, [fetchNodes]);

  // Called after upload — go to extraction review with the new pending node
  const onUploaded = (node: Node) => {
    setPendingNode(node);
    setView('review');
  };

  // Called after confirm — refresh list, back to hub
  const onConfirmed = () => {
    fetchNodes();
    setPendingNode(null);
    setView('hub');
  };

  if (view === 'whatsapp') return <WhatsAppSetup tripId={tripId} joinCode={joinCode} onBack={() => setView('hub')} />;
  if (view === 'upload') return <UploadDocument tripId={tripId} onUploaded={onUploaded} onBack={() => setView('hub')} />;
  if (view === 'review' && pendingNode) return <ExtractionReview node={pendingNode} onConfirmed={onConfirmed} onBack={() => setView('hub')} onPhantom={() => setView('phantom')} />;
  if (view === 'phantom') return <AddPhantomNode tripId={tripId} onAdded={onConfirmed} onBack={() => setView('hub')} />;
  if (view === 'detail' && selectedNode) return <BookingDetail nodeId={selectedNode.id} onBack={() => setView('hub')} onDeleted={onConfirmed} />;

  // Group nodes by date
  const grouped = nodes.reduce<Record<string, Node[]>>((acc, node) => {
    const date = node.time ? new Date(node.time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Unknown';
    (acc[date] ??= []).push(node);
    return acc;
  }, {});

  const statusTag: Record<string, { label: string; color: string }> = {
    pending_review: { label: 'Needs your review', color: '#f59e0b' },
    on_track:       { label: 'Confirmed',          color: '#22c55e' },
    at_risk:        { label: 'At risk',             color: '#f97316' },
    broken:         { label: 'Broken',              color: '#ef4444' },
    confirmed:      { label: 'Confirmed',           color: '#22c55e' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Add what you&apos;ve booked</h2>
      </div>

      {/* Add options */}
      <div style={styles.addGrid}>
        {[
          { icon: '💬', label: 'Forward via WhatsApp', action: () => setView('whatsapp') },
          { icon: '📄', label: 'Upload a file or screenshot', action: () => setView('upload') },
          { icon: '✏️', label: 'Paste an SMS / PNR', action: () => setView('upload') },
          { icon: '🚶', label: 'Add a manual leg', action: () => setView('phantom') },
        ].map(({ icon, label, action }) => (
          <button key={label} style={styles.addTile} onClick={action}>
            <span style={styles.tileIcon}>{icon}</span>
            <span style={styles.tileLabel}>{label}</span>
          </button>
        ))}
      </div>

      {/* Node list */}
      {nodes.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nothing added yet. Forward a booking email or upload a screenshot to get started.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dateNodes]) => (
          <div key={date} style={styles.group}>
            <p style={styles.groupDate}>{date}</p>
            {dateNodes.map(node => {
              const tag = statusTag[node.status] ?? { label: node.status, color: '#6b7280' };
              return (
                <button
                  key={node.id}
                  style={styles.nodeRow}
                  onClick={() => { setSelectedNode(node); setView('detail'); }}
                >
                  <span style={styles.nodeIcon}>{nodeIcon(node.type)}</span>
                  <div style={styles.nodeInfo}>
                    <span style={styles.nodeLabel}>{node.label}</span>
                    <span style={styles.nodeTime}>{node.time ? new Date(node.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <span style={{ ...styles.statusTag, background: tag.color + '20', color: tag.color }}>{tag.label}</span>
                </button>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

function nodeIcon(type: string) {
  const map: Record<string, string> = { flight: '✈️', train: '🚂', bus: '🚌', cab: '🚕', hotel: '🏨', phantom: '🚶' };
  return map[type] ?? '📍';
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px', maxWidth: 480, margin: '0 auto', fontFamily: 'Inter, sans-serif' },
  header: { marginBottom: 20 },
  heading: { fontSize: 22, fontWeight: 700, color: '#0f172a', margin: 0 },
  addGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 },
  addTile: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s' },
  tileIcon: { fontSize: 24 },
  tileLabel: { fontSize: 13, color: '#475569', textAlign: 'center', fontWeight: 500 },
  emptyState: { textAlign: 'center', color: '#94a3b8', padding: '40px 20px', background: '#f8fafc', borderRadius: 12, fontSize: 14 },
  group: { marginBottom: 20 },
  groupDate: { fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 },
  nodeRow: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 8, cursor: 'pointer', textAlign: 'left' },
  nodeIcon: { fontSize: 20, flexShrink: 0 },
  nodeInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  nodeLabel: { fontSize: 14, fontWeight: 600, color: '#0f172a' },
  nodeTime: { fontSize: 12, color: '#94a3b8' },
  statusTag: { fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' },
};
