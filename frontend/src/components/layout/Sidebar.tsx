import React from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  ShieldAlert,
  Flame,
  PieChart,
  FolderOpen,
  FileText,
  Settings,
  HeartPulse,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'patients'
  | 'diseases'
  | 'risk'
  | 'lifestyle'
  | 'demographics'
  | 'explorer'
  | 'reports'
  | 'settings';

interface Props {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  totalPatients?: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  totalPatients = 1500
}) => {
  const navItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'patients' as NavTab, label: 'Patient Analytics', icon: Users, badge: totalPatients > 0 ? `${totalPatients}` : undefined },
    { id: 'diseases' as NavTab, label: 'Disease Analysis', icon: Activity },
    { id: 'risk' as NavTab, label: 'Risk Assessment', icon: ShieldAlert, highlight: true },
    { id: 'lifestyle' as NavTab, label: 'Lifestyle Insights', icon: Flame },
    { id: 'demographics' as NavTab, label: 'Demographics', icon: PieChart },
    { id: 'explorer' as NavTab, label: 'Data Explorer', icon: FolderOpen },
    { id: 'reports' as NavTab, label: 'Reports', icon: FileText },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                Health<span className="text-teal-400">360</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Clinical Analytics
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden lg:flex items-center justify-center"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                isActive
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 group-hover:bg-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !item.badge && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse shrink-0 ml-1" />
          {!collapsed && (
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-semibold text-slate-200 truncate">Clinical Engine Active</p>
              <p className="text-[10px] text-slate-400 truncate">FastAPI + Scikit-Learn</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
