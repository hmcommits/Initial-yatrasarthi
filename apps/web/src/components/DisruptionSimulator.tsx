import { useState } from 'react';
import { AlertTriangle, Play, Loader, Clock, Ban, Train, Car, CloudRain, User } from 'lucide-react';

export const disruptionScenarios = [
  {
    id: 'flight_delay',
    label: 'IndiGo 6E-204 Delayed',
    description: 'Flight delayed by 2h 15m. Impacts cab pickup and Airbnb check-in window.',
    icon: <Clock size={16} />,
    type: 'delay',
  },
  {
    id: 'train_delay',
    label: 'Vande Bharat Delayed',
    description: 'Delayed by 4 hours. Group misses Goa connecting cab.',
    icon: <Train size={16} />,
    type: 'delay',
  },
  {
    id: 'cab_cancel',
    label: 'Cab driver cancelled',
    description: 'Shared cab from airport cancelled 15 mins before arrival.',
    icon: <Ban size={16} />,
    type: 'cancel',
  },
  {
    id: 'weather',
    label: 'Heavy rain alert',
    description: 'Red alert in destination city. High risk of localized flooding.',
    icon: <CloudRain size={16} />,
    type: 'weather',
  },
  {
    id: 'member_sick',
    label: 'Member dropping out',
    description: 'Nupur reporting sick, dropping out. Requires split payment recalculation.',
    icon: <User size={16} />,
    type: 'member',
  }
];

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
    <div className="card p-6" style={{ background: '#FFFFFF', borderColor: '#D5D9CC' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center border" style={{ background: '#FDEDEC', borderColor: '#F5B7B1' }}>
          <AlertTriangle size={16} style={{ color: '#D93829' }} />
        </div>
        <div>
          <h3 className="font-bold" style={{ color: '#172017' }}>Disruption Simulator</h3>
          <p className="text-xs" style={{ color: '#5F665B' }}>See how your connected trip responds · Simulated data</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {disruptionScenarios.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => setSelected(scenario.id)}
            className="flex items-center gap-2.5 p-3 rounded-xl text-sm text-left transition-all"
            style={{
              background: selected === scenario.id ? '#FDEDEC' : '#F5F2E8',
              border: `1px solid ${selected === scenario.id ? '#D93829' : '#D5D9CC'}`,
              color: selected === scenario.id ? '#D93829' : '#5F665B',
              fontWeight: selected === scenario.id ? 600 : 500,
            }}
          >
            <span style={{ color: selected === scenario.id ? '#D93829' : '#5F665B' }}>
              {scenarioIcons[scenario.id]}
            </span>
            <span className="text-xs leading-tight">{scenario.label}</span>
          </button>
        ))}
      </div>

      {processing && (
        <div className="mb-4 p-4 rounded-xl border" style={{ background: '#EDE9D8', borderColor: '#D5D9CC' }}>
          <div className="flex flex-col gap-1.5">
            {processingSteps.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs transition-all"
                style={{ color: i <= step ? '#172017' : '#858B80' }}>
                {i < step ? (
                  <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>✓</span>
                ) : i === step ? (
                  <Loader size={11} style={{ color: '#172017', animation: 'spin-slow 1s linear infinite' }} />
                ) : (
                  <span className="w-3 h-3 rounded-full border" style={{ borderColor: '#D5D9CC' }} />
                )}
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {done && !processing && (
        <div className="mb-4 p-4 rounded-xl border" style={{ background: '#FDEDEC', borderColor: '#F5B7B1' }}>
          <div className="font-semibold text-sm mb-1" style={{ color: '#D93829' }}>Cascade detected</div>
          <div className="text-xs" style={{ color: '#5F665B' }}>3 components affected. Recovery options generated in Recovery tab.</div>
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
