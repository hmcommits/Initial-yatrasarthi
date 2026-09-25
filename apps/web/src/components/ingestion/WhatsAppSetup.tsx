'use client';

interface WhatsAppSetupProps {
  tripId: string;
  joinCode: string;
  onBack: () => void;
}

export default function WhatsAppSetup({ joinCode, onBack }: WhatsAppSetupProps) {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+1 (555) 000-0000';
  const instructions = [
    'Copy this address.',
    'Send any booking confirmation (PDF, screenshot, text) to it on WhatsApp.',
    "We'll pull out the details and ask you to confirm before adding them.",
  ];

  const handleCopy = () => navigator.clipboard.writeText(waNumber);

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={onBack}>← Back</button>
      <h2 style={styles.heading}>Forward booking emails here</h2>

      {/* Join code */}
      <div style={styles.card}>
        <p style={styles.cardLabel}>Your trip join code</p>
        <div style={styles.codeRow}>
          <span style={styles.code}>{joinCode}</span>
          <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(joinCode)}>Copy</button>
        </div>
        <p style={styles.note}>Send this code once to the WhatsApp number below to link your account.</p>
      </div>

      {/* WhatsApp number */}
      <div style={styles.card}>
        <p style={styles.cardLabel}>WhatsApp number</p>
        <div style={styles.codeRow}>
          <span style={styles.code}>{waNumber}</span>
          <button style={styles.copyBtn} onClick={handleCopy}>Copy</button>
        </div>
      </div>

      {/* Steps */}
      <div style={styles.steps}>
        {instructions.map((step, i) => (
          <div key={i} style={styles.step}>
            <span style={styles.stepNum}>{i + 1}</span>
            <span style={styles.stepText}>{step}</span>
          </div>
        ))}
      </div>

      <p style={styles.note}>Only messages from your linked number are accepted.</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px', maxWidth: 480, margin: '0 auto', fontFamily: 'Inter, sans-serif' },
  back: { background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 14, padding: 0, marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 24 },
  card: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px', marginBottom: 16 },
  cardLabel: { fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 },
  codeRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  code: { fontSize: 18, fontWeight: 700, color: '#0f172a', letterSpacing: '0.04em' },
  copyBtn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 },
  steps: { marginBottom: 20 },
  step: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  stepNum: { width: 24, height: 24, background: '#6366f1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, lineHeight: '24px', textAlign: 'center' as const },
  stepText: { fontSize: 14, color: '#475569', lineHeight: 1.5, paddingTop: 2 },
  note: { fontSize: 12, color: '#94a3b8', lineHeight: 1.5 },
};
