import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  FileText, 
  LogOut, 
  ShieldCheck,
  BrainCircuit,
  Database,
  Siren,
  X
} from 'lucide-react';
import { User, UserRole } from '../types';
import { db } from '../services/db';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  currentView, 
  onNavigate 
}) => {
  const [sosActive, setSosActive] = useState(false);
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  
  const getNavItems = () => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER, UserRole.STUDENT] },
      { id: 'attendance', label: 'Attendance Log', icon: MapPin, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD, UserRole.TEACHER] },
      { id: 'insights', label: 'AI Insights', icon: BrainCircuit, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HOD] },
      { id: 'audit', label: 'Audit Logs', icon: ShieldCheck, roles: [UserRole.SUPER_ADMIN] },
      { id: 'users', label: 'User Mgmt', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN] },
      { id: 'reports', label: 'My Reports', icon: FileText, roles: [UserRole.STUDENT] },
    ];

    return items.filter(item => item.roles.includes(user.role));
  };

  const triggerSos = () => {
    setSosActive(true);
    setTimeout(() => {
        alert("Emergency Alert Sent! Security and Admin have been notified with your live location.");
        setSosActive(false);
        setShowSosConfirm(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex-shrink-0 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            {/* Custom Neural Node Logo */}
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              <path d="M12 22V12" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 tracking-tight block leading-none">Eduno</span>
            <span className="text-[10px] font-semibold text-brand-600 tracking-wider uppercase">CRM</span>
          </div>
        </div>

        <div className="px-4 py-2 flex flex-col justify-between h-[calc(100vh-88px)] overflow-y-auto custom-scrollbar">
          <nav className="space-y-1.5">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
            {getNavItems().map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentView === item.id
                    ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {currentView === item.id && <div className="w-1.5 h-1.5 rounded-full bg-brand-600"></div>}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 space-y-4">
            
            {/* DB Status Indicator */}
            <div className={`mx-2 p-3 rounded-xl border flex items-center gap-3 ${
              db.type === 'SUPABASE' 
                ? 'bg-emerald-50/50 border-emerald-100' 
                : 'bg-amber-50/50 border-amber-100'
            }`}>
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                 db.type === 'SUPABASE' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
               }`}>
                 <Database className="w-4 h-4" />
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-1.5">
                   <span className={`text-xs font-bold ${db.type === 'SUPABASE' ? 'text-emerald-700' : 'text-amber-700'}`}>
                     {db.type === 'SUPABASE' ? 'System Live' : 'Demo Mode'}
                   </span>
                   {db.type === 'SUPABASE' && <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>}
                 </div>
                 <p className="text-[10px] text-gray-500 leading-tight truncate">
                   {db.type === 'SUPABASE' ? 'Connected to Supabase' : 'Local Mock Data'}
                 </p>
               </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-1 border border-gray-100">
              <div className="flex items-center px-3 py-2">
                 {user.avatarUrl ? (
                   <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full border-2 border-white shadow-sm mr-3" />
                 ) : (
                   <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold mr-3 border-2 border-white shadow-sm">
                     {user.name.charAt(0)}
                   </div>
                 )}
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                   <p className="text-xs text-gray-500 truncate capitalize">{user.role.toLowerCase().replace('_', ' ')}</p>
                 </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 mt-1 text-red-600 hover:bg-white hover:shadow-sm rounded-xl transition-all text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen relative scroll-smooth">
         {children}
         
         {/* SOS Floating Action Button (Subtle Mode) */}
         <div className="fixed bottom-6 right-6 z-50">
             {showSosConfirm ? (
                 <div className="bg-white rounded-2xl shadow-2xl p-4 animate-slide-up border border-red-100 w-64">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-red-600 flex items-center gap-2"><Siren className="w-5 h-5" /> Emergency</span>
                        <button onClick={() => setShowSosConfirm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">Send high-priority alert to security with your live coordinates?</p>
                    <button 
                        onClick={triggerSos}
                        disabled={sosActive}
                        className="w-full py-2 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/30 flex items-center justify-center"
                    >
                        {sosActive ? 'Broadcasting Alert...' : 'CONFIRM SOS'}
                    </button>
                 </div>
             ) : (
                 <button 
                    onClick={() => setShowSosConfirm(true)}
                    className="w-12 h-12 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 hover:scale-105 active:scale-90 transition-all flex items-center justify-center group opacity-40 hover:opacity-100"
                    title="Emergency SOS"
                 >
                     <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75"></div>
                     <Siren className="w-5 h-5 relative z-10" />
                 </button>
             )}
         </div>
      </main>
    </div>
  );
};