'use client';

import { useState, useEffect, useRef } from 'react';
import type { PhantomMode } from '@yatrasarthi/types';

const MODES: { value: PhantomMode; label: string; icon: string }[] = [
  { value: 'auto_cab', label: 'Auto / Cab', icon: '🚕' },
  { value: 'walk', label: 'Walk', icon: '🚶' },
  { value: 'local_train', label: 'Local train', icon: '🚇' },
  { value: 'bus', label: 'Bus', icon: '🚌' },
  { value: 'other', label: 'Other', icon: '🛤️' },
];

interface AddPhantomNodeProps {
  tripId: string;
  onAdded: () => void;
  onBack: () => void;
}

export default function AddPhantomNode({ tripId, onAdded, onBack }: AddPhantomNodeProps) {
  const [mode, setMode] = useState<PhantomMode>('auto_cab');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [paddingMin, setPaddingMin] = useState(0);
  const [estimatedMin, setEstimatedMin] = useState<number | null>(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live routing estimate when from/to are both filled
  useEffect(() => {
    if (!from || !to) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setEstimating(true);
      try {
        const res = await fetch(`/api/routing/estimate?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
        if (res.ok) {
          const json = await res.json();
          setEstimatedMin(json.data?.estimatedMin ?? null);
          setFallbackUsed(json.data?.fallbackUsed ?? false);
        }
      } finally {
        setEstimating(false);
      }
    }, 600);
  }, [from, to]);

  const totalMin = (estimatedMin ?? 0) + paddingMin;

  const handleAdd = async () => {
    if (!from || !to) { setError('From and To are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/nodes/phantom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, mode, fromLabel: from, toLabel: to, paddingMin }),
      });
      if (!res.ok) { setError('Failed to add leg.'); return; }
      onAdded();
    } catch {
      setError('Failed to add leg.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={onBack}>← Back</button>
      <h2 style={styles.heading}>Add an unbooked leg</h2>

      {/* Mode selector */}
      <p style={styles.label}>Mode of travel</p>
      <div style={styles.modeGrid}>
        {MODES.map(m => (
          <button
            key={m.value}
            style={{ ...styles.modeTile, ...(mode === m.value ? styles.modeTileActive : {}) }}
            onClick={() => setMode(m.value)}
          >
            <span style={styles.modeIcon}>{m.icon}</span>
            <span style={styles.modeLabel}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* From / To */}
      <div style={styles.row}>
        <div style={styles.field}>
          <p style={styles.label}>From</p>
          <input style={styles.input} placeholder="e.g. Andheri Station" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div style={styles.field}>
          <p style={styles.label}>To</p>
          <input style={styles.input} placeholder="e.g. BOM Airport" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>

      {/* Estimated time */}
      {(estimating || estimatedMin !== null) && (
        <div style={styles.estimate}>
          {estimating ? (
            <span style={styles.estimating}>Estimating travel time…</span>
          ) : (
            <>
              <span>
                Estimated: <strong>{estimatedMin} min</strong>
                {fallbackUsed && <span style={styles.fallbackNote}> (estimate — lower confidence)</span>}
              </span>
            </>
          )}
        </div>
      )}

      {/* Buffer / padding */}
      <div style={styles.section}>
        <p style={styles.label}>Add buffer</p>
        <p style={styles.hint}>Indian traffic can run long — pad this if you&apos;d rather be early.</p>
        <div style={styles.stepperRow}>
          <button style={styles.stepBtn} onClick={() => setPaddingMin(p => Math.max(0, p - 5))}>−</button>
          <span style={styles.stepValue}>{paddingMin} min buffer</span>
          <button style={styles.stepBtn} onClick={() => setPaddingMin(p => p + 5)}>+</button>
        </div>
        {estimatedMin !== null && <p style={styles.total}>Total: <strong>{totalMin} min</strong></p>}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button style={{ ...styles.addBtn, opacity: loading ? 0.6 : 1 }} onClick={handleAdd} disabled={loading}>
        {loading ? 'Adding…' : 'Add leg'}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px', maxWidth: 480, margin: '0 auto', fontFamily: 'Inter, sans-serif' },
  back: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 14, padding: 0, marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 },
  modeGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 24 },
  modeTile: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer' },
  modeTileActive: { background: '#eef2ff', borderColor: '#6366f1' },
  modeIcon: { fontSize: 20 },
  modeLabel: { fontSize: 10, color: '#475569', fontWeight: 500, textAlign: 'center' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  field: {},
  input: { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: '#0f172a', boxSizing: 'border-box' },
  estimate: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#0369a1', marginBottom: 16 },
  estimating: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },
  fallbackNote: { fontSize: 12, color: '#f59e0b' },
  section: { marginBottom: 24 },
  hint: { fontSize: 13, color: '#64748b', marginBottom: 10 },
  stepperRow: { display: 'flex', alignItems: 'center', gap: 16 },
  stepBtn: { width: 36, height: 36, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepValue: { fontSize: 14, fontWeight: 600, color: '#0f172a', minWidth: 100, textAlign: 'center' },
  total: { fontSize: 13, color: '#475569', marginTop: 8 },
  error: { color: '#ef4444', fontSize: 14, marginBottom: 12 },
  addBtn: { width: '100%', padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
};
