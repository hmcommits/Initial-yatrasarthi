import { useState } from 'react';
import { AlertTriangle, Play, Loader, Clock, Ban, Train, Car, CloudRain, User } from 'lucide-react';
import { disruptionScenarios } from '../data/mockData';

interface DisruptionSimulatorProps {
  onDisrupt: (scenarioId: string) => void;
  isDisrupted: boolean;
}

const processingSteps = [
  'Detecting disruption…',
  'Tracing dependencies…',
  'Calculating available slack…',
  'Checking hard constraints…',
  'Checking vendor rules…',
  'Generating recovery options…',
];

const scenarioIcons: Record<string, React.ReactNode> = {
  flight_delay: <Clock size={15} />,
  flight_cancel: <Ban size={15} />,
  train_delay: <Train size={15} />,
  cab_unavail: <Car size={15} />,
  road_delay: <CloudRain size={15} />,
  user_late: <User size={15} />,
};

export function DisruptionSimulator({ onDisrupt, isDisrupted }: DisruptionSimulatorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const handleSimulate = () => {
    if (!selected || processing) return;
    setProcessing(true);
    setDone(false);
    setStep(0);

    const tick = (i: number) => {
      setStep(i);
      if (i < processingSteps.length - 1) {
        setTimeout(() => tick(i + 1), 550);
      } else {
        setTimeout(() => {
          setProcessing(false);
          setDone(true);
          onDisrupt(selected);
        }, 550);
      }
    };
    tick(0);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FDECEA' }}>
          <AlertTriangle size={16} style={{ color: '#E45B4D' }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: '#1B211C' }}>Disruption Simulator</h3>
          <p className="text-xs" style={{ color: '#6F756C' }}>See how your connected trip responds · Simulated data</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {disruptionScenarios.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => setSelected(scenario.id)}
            className="flex items-center gap-2.5 p-3 rounded-xl text-sm text-left transition-all"
            style={{
              background: selected === scenario.id ? 'rgba(228,91,77,0.06)' : '#F7F5EC',
              border: `1px solid ${selected === scenario.id ? '#E45B4D' : '#E3E2D7'}`,
              color: selected === scenario.id ? '#B03028' : '#6F756C',
              fontWeight: selected === scenario.id ? 600 : 400,
            }}
          >
            <span style={{ color: selected === scenario.id ? '#E45B4D' : '#6F756C' }}>
              {scenarioIcons[scenario.id]}
            </span>
            <span className="text-xs leading-tight">{scenario.label}</span>
          </button>
        ))}
      </div>

      {processing && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: '#EBF1FD', border: '1px solid #9DB8F0' }}>
          <div className="flex flex-col gap-1.5">
            {processingSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs transition-all"
                style={{ color: i <= step ? '#1B211C' : '#C4C9C2' }}>
                {i < step ? (
                  <span style={{ color: '#62A86B' }}>✓</span>
                ) : i === step ? (
                  <Loader size={11} style={{ color: '#6D9EEB', animation: 'spin-slow 1s linear infinite' }} />
                ) : (
                  <span className="w-3 h-3 rounded-full border" style={{ borderColor: '#E3E2D7' }} />
                )}
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {done && !processing && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: '#FDECEA', border: '1px solid #EFAAA5' }}>
          <div className="font-semibold text-sm mb-1" style={{ color: '#B03028' }}>Cascade detected</div>
          <div className="text-xs" style={{ color: '#6F756C' }}>3 components affected. Recovery options generated in Recovery tab.</div>
        </div>
      )}

      <button
        onClick={handleSimulate}
        disabled={!selected || processing}
        className="btn-primary w-full py-3 text-sm"
        style={{ opacity: !selected || processing ? 0.5 : 1, cursor: !selected || processing ? 'not-allowed' : 'pointer' }}
      >
        <Play size={14} />
        Simulate disruption
      </button>
    </div>
  );
}
