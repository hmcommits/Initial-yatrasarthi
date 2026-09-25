import { useState } from 'react';
import { 
  Shield, CheckCircle2, 
  CreditCard, FileText, 
  Users, Check,
} from 'lucide-react';
import type { TripData } from '../types';

interface UserDashboardProps {
  trips: TripData[];
  activeTrip: TripData;
  onSelectTrip: (id: string) => void;
  onNavigate: (page: string) => void;
}

export function UserDashboard({ trips, activeTrip, onSelectTrip, onNavigate }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'dgca' | 'payments' | 'vault' | 'settings'>('overview');
  
  return (
    <div className="min-h-screen pb-24 md:pb-12" style={{ background: '#F7F5EC' }}>
      <div style={{ background: '#EEF1E5', borderBottom: '1px solid #E3E2D7', paddingTop: '2rem', paddingBottom: '1.5rem' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md relative"
                style={{ background: 'linear-gradient(135deg, #F28A28 0%, #D96D16 100%)' }}
              >
                H
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <Check size={12} strokeWidth={3} className="text-white" />
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold" style={{ color: '#1B211C', letterSpacing: '-0.02em' }}>
                  Harsh
                </h1>
                <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5" style={{ color: '#6F756C' }}>
                  <Shield size={14} style={{ color: '#62A86B' }} />
                  YatraSarthi Prime Member
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-8 overflow-x-auto no-scrollbar border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'dgca', label: 'DGCA Rights' },
              { id: 'payments', label: 'Split Payments' },
              { id: 'vault', label: 'Document Vault' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="pb-3 text-sm font-semibold transition-all whitespace-nowrap"
                style={{
                  color: activeTab === tab.id ? '#1B211C' : '#8B9085',
                  borderBottom: activeTab === tab.id ? '2px solid #F28A28' : '2px solid transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="text-center py-12 text-gray-500">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Welcome to YatraSarthi</h3>
            <p>Your dashboard is currently syncing with the backend...</p>
          </div>
        )}
        {activeTab === 'dgca' && <div className="text-center py-12 text-gray-500">DGCA Compensation Data will appear here once connected to APIs.</div>}
        {activeTab === 'payments' && <div className="text-center py-12 text-gray-500">Payment splits will appear here. No mock data.</div>}
        {activeTab === 'vault' && <div className="text-center py-12 text-gray-500">Document vault is empty.</div>}
      </div>
    </div>
  );
}
