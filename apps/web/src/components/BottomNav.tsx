import { Home, LayoutDashboard, RotateCcw, Users, Shield } from 'lucide-react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const items = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'group', label: 'Group', icon: Users },
  { id: 'recovery', label: 'Recover', icon: RotateCcw },
  { id: 'suraksha', label: 'Suraksha', icon: Shield },
];

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{ background: 'rgba(245,243,232,0.97)', backdropFilter: 'blur(12px)', borderColor: '#E3E2D7' }}
    >
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {items.map(({ id, label, icon: Icon }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
              style={{ color: active ? '#F28C28' : '#73776E' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ background: active ? 'rgba(242,140,40,0.12)' : 'transparent' }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className="text-xs font-medium" style={{ fontSize: 10 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
