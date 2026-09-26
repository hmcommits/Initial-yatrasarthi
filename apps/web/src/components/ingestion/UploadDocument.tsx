'use client';

import { useState } from 'react';
import type { Node } from '@yatrasarthi/types';

type Tab = 'photo' | 'file' | 'text';

interface UploadDocumentProps {
  tripId: string;
  onUploaded: (node: Node) => void;
  onBack: () => void;
}

export default function UploadDocument({ tripId, onUploaded, onBack }: UploadDocumentProps) {
  const [tab, setTab] = useState<Tab>('file');
  const [pastedText, setPastedText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    setError('');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('tripId', tripId);
      if (tab === 'text' && pastedText) {
        form.append('text', pastedText);
      } else if (file) {
        form.append('file', file);
      } else {
        setError('Please provide a file or paste some text.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/ingest/upload', { method: 'POST', body: form });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message || "We couldn't read that clearly. Try a clearer photo, or enter the details yourself.");
        return;
      }

      onUploaded(json.data as Node);
    } catch {
      setError("We couldn't read that clearly. Try a clearer photo, or enter the details yourself.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={onBack}>← Back</button>
      <h2 style={styles.heading}>Upload a booking</h2>

      {/* Tabs */}
      <div style={styles.tabs}>
        {(['file', 'photo', 'text'] as Tab[]).map(t => (
          <button key={t} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }} onClick={() => setTab(t)}>
            {t === 'file' ? 'Choose file' : t === 'photo' ? 'Take photo' : 'Paste text'}
          </button>
        ))}
      </div>

      {/* Input area */}
      {tab === 'text' ? (
        <textarea
          style={styles.textarea}
          placeholder="Paste your SMS, PNR, or booking details here…"
          value={pastedText}
          onChange={e => setPastedText(e.target.value)}
          rows={6}
        />
      ) : (
        <label style={styles.dropzone}>
          {file ? (
            <span style={styles.fileName}>{file.name}</span>
          ) : (
            <>
              <span style={styles.dropIcon}>{tab === 'photo' ? '📷' : '📄'}</span>
              <span style={styles.dropText}>{tab === 'photo' ? 'Take or choose a photo' : 'Choose PDF or image'}</span>
            </>
          )}
          <input
            type="file"
            accept={tab === 'photo' ? 'image/*' : 'application/pdf,image/*'}
            capture={tab === 'photo' ? 'environment' : undefined}
            style={{ display: 'none' }}
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
      )}

      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button style={styles.manualLink} onClick={onBack}>Enter manually</button>
        </div>
      )}

      {loading && <p style={styles.processing}>Reading your booking…</p>}

      <button style={{ ...styles.extractBtn, opacity: loading ? 0.6 : 1 }} onClick={handleExtract} disabled={loading}>
        {loading ? 'Extracting…' : 'Extract details'}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px', maxWidth: 480, margin: '0 auto', fontFamily: 'Inter, sans-serif' },
  back: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 14, padding: 0, marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 20 },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: { flex: 1, padding: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#475569' },
  tabActive: { background: '#6366f1', color: '#fff', border: '1px solid #6366f1' },
  dropzone: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, height: 160, border: '2px dashed #cbd5e1', borderRadius: 12, cursor: 'pointer', marginBottom: 20, background: '#f8fafc' },
  dropIcon: { fontSize: 40 },
  dropText: { fontSize: 14, color: '#64748b', fontWeight: 500 },
  fileName: { fontSize: 14, color: '#6366f1', fontWeight: 600 },
  textarea: { width: '100%', borderRadius: 12, border: '1px solid #e2e8f0', padding: '12px', fontSize: 14, color: '#0f172a', fontFamily: 'Inter, sans-serif', resize: 'vertical', marginBottom: 20, boxSizing: 'border-box' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16 },
  manualLink: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 13, padding: 0, marginTop: 6, fontWeight: 600 },
  processing: { textAlign: 'center', color: '#6366f1', fontSize: 14, fontStyle: 'italic', marginBottom: 16 },
  extractBtn: { width: '100%', padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
};
