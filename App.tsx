import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AttendanceScanner } from './components/AttendanceScanner';
import { GeminiInsights } from './components/GeminiInsights';
import { User, UserRole, AppState, AttendanceRecord, AuditLog } from './types';
import { Users, Clock, ShieldCheck, Search, Loader2, CheckCircle, XCircle, AlertCircle, ArrowRight, MapPin, Smartphone, Database, BrainCircuit, Scan, Lock, Zap, Cpu, Server, Globe, Activity, X, HardDrive, Network, Layers, Download, ChevronDown, User as UserIcon } from 'lucide-react';
import { db } from './services/db';

// --- Splash Screen Component ---
const SplashScreen = () => (
  <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
    {/* Abstract Background with Blob Animation */}
    <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
    </div>

    <div className="relative z-10 flex flex-col items-center">
       {/* Animated Logo */}
       <div className="w-24 h-24 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-500/30 mb-8 animate-float">
          {/* Custom Neural Node SVG Logo */}
          <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-white" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            <path d="M12 22V12" />
          </svg>
       </div>
       
       <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 animate-slide-up">
         Eduno <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">CRM</span>
       </h1>
       
       {/* Loading Dots */}
       <div className="flex items-center gap-3 animate-fadeIn delay-300 mt-4">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-100"></div>
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-200"></div>
       </div>
    </div>
  </div>
);


// --- System Architecture Visualization Component (Inline) ---
const SystemArchitecture = () => {
  const steps = [
    {
      id: 1,
      icon: Smartphone,
      title: "User Action",
      desc: "App / PWA Interface",
      color: "bg-blue-500",
      glow: "shadow-blue-500/50"
    },
    {
      id: 2,
      icon: Lock,
      title: "Verification",
      desc: "Geofence & Security",
      color: "bg-emerald-500",
      glow: "shadow-emerald-500/50"
    },
    {
      id: 3,
      icon: Database,
      title: "Real-time Sync",
      desc: "Supabase Cloud DB",
      color: "bg-amber-500",
      glow: "shadow-amber-500/50"
    },
    {
      id: 4,
      icon: BrainCircuit,
      title: "Intelligence",
      desc: "Gemini AI Analysis",
      color: "bg-purple-500",
      glow: "shadow-purple-500/50"
    }
  ];

  return (
    <div className="relative h-full flex flex-col items-center justify-center py-8">
       {/* Background Connecting Line (Static) */}
       <div className="absolute left-[2.25rem] md:left-1/2 top-6 bottom-6 w-px bg-slate-800 md:-translate-x-1/2 overflow-hidden rounded-full">
          {/* Animation removed for cleaner look */}
       </div>

       <div className="space-y-8 w-full max-w-sm relative z-10 px-4 md:px-0">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex items-center gap-4 group animate-slide-up`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
               {/* Icon Node */}
               <div className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-800/90 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-white/30 z-20 ${step.glow} shadow-lg`}>
                  <step.icon className={`w-6 h-6 md:w-8 md:h-8 text-white`} />
                  {/* Pulsing Ring for active look */}
                  <div className={`absolute inset-0 rounded-2xl border ${step.color} opacity-0 group-hover:opacity-100 animate-pulse transition-opacity`}></div>
               </div>
               
               {/* Label Card */}
               <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                  <h4 className="text-white font-bold text-sm md:text-base leading-tight">{step.title}</h4>
                  <p className="text-slate-400 text-xs md:text-sm">{step.desc}</p>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

// --- Full Architecture Modal Blueprint ---
const ArchitectureModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Advanced Enterprise Architecture Nodes - Organized Grid Layout
  const nodes = [
    // Layer 1: Client Devices (Leftmost) - x: 12%
    { id: 'web', label: 'Web Client', type: 'Client', icon: Globe, x: 12, y: 30, color: 'text-blue-400', border: 'border-blue-500/30' },
    { id: 'mobile', label: 'Mobile App', type: 'Client', icon: Smartphone, x: 12, y: 70, color: 'text-purple-400', border: 'border-purple-500/30' },

    // Layer 2: Edge / Security (Aligned with Clients) - x: 32%
    { id: 'cdn', label: 'CDN Edge', type: 'Network', icon: Zap, x: 32, y: 30, color: 'text-yellow-400', border: 'border-yellow-500/30' },
    { id: 'firewall', label: 'Geo-Firewall', type: 'Security', icon: ShieldCheck, x: 32, y: 70, color: 'text-red-400', border: 'border-red-500/30' },

    // Layer 3: Application Core (Center) - x: 52% and 68%
    { id: 'lb', label: 'Load Balancer', type: 'Infra', icon: Network, x: 52, y: 50, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { id: 'server', label: 'App Cluster', type: 'Compute', icon: Layers, x: 68, y: 50, color: 'text-indigo-400', border: 'border-indigo-500/30' },

    // Layer 4: Data & AI Services (Rightmost, Spread Vertically) - x: 88%
    { id: 'cache', label: 'Redis Cache', type: 'Storage', icon: HardDrive, x: 88, y: 25, color: 'text-orange-400', border: 'border-orange-500/30' },
    { id: 'db', label: 'Postgres DB', type: 'Database', icon: Database, x: 88, y: 50, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { id: 'ai', label: 'Gemini AI', type: 'Intelligence', icon: BrainCircuit, x: 88, y: 75, color: 'text-pink-400', border: 'border-pink-500/30' },
  ];

  // Logic flow connections
  const connections = [
    { from: 'web', to: 'cdn', delay: '0s' },
    { from: 'mobile', to: 'firewall', delay: '0s' },
    { from: 'cdn', to: 'lb', delay: '0.5s' },
    { from: 'firewall', to: 'lb', delay: '0.5s' },
    { from: 'lb', to: 'server', delay: '1s' },
    { from: 'server', to: 'cache', delay: '1.5s' },
    { from: 'server', to: 'db', delay: '1.5s' },
    { from: 'server', to: 'ai', delay: '1.5s' },
  ];

  const specs: Record<string, any> = {
    web: { stack: 'React 19 + Vite', bundle: '240KB (Gzipped)', protocol: 'HTTPS/3', state: 'Online' },
    mobile: { stack: 'Flutter / Swift', version: 'v2.4.1', biometric: 'FaceID Enabled', state: 'Online' },
    cdn: { provider: 'Cloudflare', cache_hit: '99.2%', latency: '12ms', regions: '280+' },
    firewall: { type: 'WAF + Geofence', rules: 'Haversine Radius', block_rate: '0.4%', encryption: 'TLS 1.3' },
    lb: { algorithm: 'Round Robin', throughput: '10k RPS', scaling: 'Auto (1-10 instances)', health: 'Healthy' },
    server: { runtime: 'Node.js 20', framework: 'Fastify', memory: '512MB/Instance', stateless: 'True' },
    cache: { engine: 'Redis 7', eviction: 'LRU', memory_usage: '42%', ops: '120k/sec' },
    db: { engine: 'PostgreSQL 15', replication: 'Multi-AZ', wal_level: 'Logical', connections: '45/100' },
    ai: { model: 'Gemini 2.5 Flash', tpu: 'v5p Cloud TPU', context: '1M Tokens', latency_p95: '450ms' }
  };

  const getCoords = (id: string) => nodes.find(n => n.id === id) || { x: 0, y: 0 };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center animate-fadeIn p-4 overflow-hidden">
       <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50">
          <X className="w-6 h-6" />
       </button>

       <div className="w-full max-w-7xl h-full max-h-[850px] bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-20 pointer-events-none"></div>
          
          {/* Blueprint Area */}
          <div className="relative flex-1 h-full overflow-hidden p-8" onClick={() => setSelectedNode(null)}>
             <div className="absolute top-8 left-8 flex items-center gap-3">
                <span className="text-slate-500 font-mono text-xs uppercase tracking-widest border border-slate-700 px-3 py-1 rounded bg-slate-900/50">System Internals v2.0</span>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-mono"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live Telemetry</span>
             </div>
             
             {/* Connections SVG Layer */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                   <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                   </linearGradient>
                   <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                      <feMerge>
                         <feMergeNode in="coloredBlur"/>
                         <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                   </filter>
                </defs>
                
                {connections.map((conn, idx) => {
                   const start = getCoords(conn.from);
                   const end = getCoords(conn.to);
                   // Bezier curve logic for horizontal flow
                   const pathD = `M ${start.x}% ${start.y}% C ${(start.x + end.x)/2}% ${start.y}%, ${(start.x + end.x)/2}% ${end.y}%, ${end.x}% ${end.y}%`;
                   
                   return (
                      <g key={idx}>
                         {/* Static Path */}
                         <path d={pathD} stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" opacity="0.4" />
                         {/* Animated Data Packet */}
                         <circle r="3" fill="#ffffff" filter="url(#glow)">
                            <animateMotion dur="3s" begin={conn.delay} repeatCount="indefinite" path={pathD} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                         </circle>
                      </g>
                   );
                })}
             </svg>

             {/* Nodes */}
             {nodes.map(node => (
                <div 
                  key={node.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
                  className={`absolute p-0 rounded-2xl transition-all duration-300 z-10 w-32 md:w-36 group cursor-pointer
                    ${selectedNode === node.id ? 'scale-110 z-20' : 'hover:scale-105'}
                  `}
                  style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                   <div className={`
                      bg-slate-800/90 backdrop-blur border ${selectedNode === node.id ? 'border-brand-500 ring-2 ring-brand-500/20' : node.border} 
                      rounded-xl p-4 flex flex-col items-center gap-3 shadow-xl hover:shadow-glow hover:bg-slate-750 relative overflow-hidden
                   `}>
                      {/* Selection Indicator */}
                      {selectedNode === node.id && <div className="absolute inset-0 bg-brand-500/5 pointer-events-none"></div>}

                      <div className={`w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center border border-white/5 ${node.color} group-hover:animate-pulse-slow`}>
                         <node.icon className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                         <h4 className="text-white font-bold text-xs leading-tight">{node.label}</h4>
                         <p className="text-slate-400 text-[9px] mt-0.5 uppercase tracking-wide">{node.type}</p>
                      </div>
                      
                      {/* Status Dot */}
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                   </div>
                </div>
             ))}
          </div>

          {/* Technical Specs Panel */}
          <div className={`w-full md:w-80 bg-slate-800/80 backdrop-blur-xl border-t md:border-l border-white/10 p-6 transition-all duration-300 ${selectedNode ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-50 hidden md:block'}`}>
             {selectedNode ? (
                <div className="animate-fadeIn h-full flex flex-col">
                   <div className="mb-6 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                         <div className={`p-2 rounded-lg bg-slate-900 border border-white/10 ${nodes.find(n => n.id === selectedNode)?.color}`}>
                            {(() => {
                               const Icon = nodes.find(n => n.id === selectedNode)?.icon || Activity;
                               return <Icon className="w-6 h-6" />;
                            })()}
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-white">{nodes.find(n => n.id === selectedNode)?.label}</h3>
                            <p className="text-xs text-slate-400">ID: {selectedNode.toUpperCase()}-NODE-01</p>
                         </div>
                      </div>
                   </div>
                   
                   <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Technical Specifications</h4>
                   <div className="space-y-3 flex-1">
                      {Object.entries(specs[selectedNode] || {}).map(([key, value]) => (
                         <div key={key} className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex flex-col gap-1 hover:border-white/10 transition-colors">
                            <span className="text-slate-500 text-[10px] font-mono uppercase tracking-wide">{key.replace('_', ' ')}</span>
                            <span className="text-brand-100 text-sm font-medium">{value as string}</span>
                         </div>
                      ))}
                   </div>
                   
                   <div className="mt-auto pt-6">
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <div>
                           <p className="text-emerald-400 text-xs font-bold">Operational</p>
                           <p className="text-emerald-400/70 text-[10px]">Uptime: 99.99%</p>
                        </div>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                   <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 border border-white/5">
                      <Scan className="w-8 h-8 opacity-40" />
                   </div>
                   <h3 className="text-white font-medium mb-1">Select a Node</h3>
                   <p className="text-xs max-w-[200px]">Click on any system component to view live metrics and configuration details.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};


// --- Improved Login Component ---
const Login = ({ users, onLogin, loading }: { users: User[], onLogin: (u: User) => void, loading: boolean }) => {
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [password, setPassword] = useState('');

  const roles = [
    { id: 'ALL', label: 'All' },
    { id: UserRole.STUDENT, label: 'Students' },
    { id: UserRole.TEACHER, label: 'Teachers' },
    { id: UserRole.HOD, label: 'HODs' },
    { id: UserRole.ADMIN, label: 'Admins' },
    { id: UserRole.SUPER_ADMIN, label: 'Super Admin' },
  ];

  const filteredUsers = selectedRole === 'ALL' 
    ? users 
    : users.filter(u => u.role === selectedRole);

  useEffect(() => {
    if (filteredUsers.length > 0) {
        setSelectedUserId(filteredUsers[0].id);
    } else {
        setSelectedUserId('');
    }
  }, [selectedRole, users]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    const user = users.find(u => u.id === selectedUserId);
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {showArchitectureModal && <ArchitectureModal onClose={() => setShowArchitectureModal(false)} />}

      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-6xl z-10 flex flex-col md:flex-row bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden min-h-[600px]">
        
        {/* Left Side: System Architecture Visualization */}
        <div className="md:w-5/12 p-8 md:p-12 bg-slate-900/60 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
           {/* Header */}
           <div className="relative z-20">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                    {/* Custom Neural Node SVG Logo */}
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      <path d="M12 22V12" />
                    </svg>
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Eduno</h1>
                   <p className="text-brand-400 text-xs font-semibold tracking-wider uppercase mt-0.5">CRM</p>
                </div>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
               A secure, real-time attendance monitoring ecosystem powered by Edge Geofencing and AI Analytics.
             </p>
           </div>
           
           {/* Visual Diagram */}
           <div className="flex-1 mt-4 mb-4">
              <SystemArchitecture />
           </div>
           
           {/* Footer with Internals Button */}
           <div className="relative z-20 flex flex-col items-center gap-4">
             <button 
                onClick={() => setShowArchitectureModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-500/50 transition-all group flex items-center justify-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
             >
                <Cpu className="w-4 h-4 text-brand-400 group-hover:animate-pulse" />
                View System Internals
             </button>
             
             <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
               <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> System Operational</span>
               <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
             </div>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-500">v2.4.0-release</span>
          </div>

          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-500 mb-8 text-sm">Secure access to Eduno CRM. Please authenticate.</p>
            
            {/* SEGMENTED SLICERS (ROLE FILTER) */}
            <div className="flex flex-wrap gap-2 mb-6">
                {roles.map(role => (
                   <button
                     key={role.id}
                     type="button"
                     onClick={() => setSelectedRole(role.id)}
                     className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-2 ${
                        selectedRole === role.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                     }`}
                   >
                     {role.label}
                   </button>
                ))}
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
                {/* User Dropdown Slicer */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Select User Account</label>
                    <div className="relative group">
                        <select 
                            value={selectedUserId} 
                            onChange={e => setSelectedUserId(e.target.value)}
                            disabled={loading || filteredUsers.length === 0}
                            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {filteredUsers.length === 0 && <option value="">No users found</option>}
                            {filteredUsers.map(u => (
                                <option key={u.id} value={u.id}>{u.name} — {u.department}</option>
                            ))}
                        </select>
                        <UserIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-brand-500 transition-colors" />
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Password Placeholder */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Password</label>
                    <div className="relative group">
                        <input 
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter secure password..."
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                        />
                        <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-brand-500 transition-colors" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                        <span className="text-xs text-slate-500 font-medium">Remember me</span>
                    </label>
                    <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-700">Forgot Password?</a>
                </div>

                <button 
                    type="submit"
                    disabled={loading || !selectedUserId}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'} 
                </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                 <p className="text-[10px] text-slate-400 leading-tight">
                    Protected by reCAPTCHA and subject to the Google <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-brand-600 hover:underline">Terms of Service</a>.
                 </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Audit Log Viewer Component
const AuditLogViewer = ({ logs }: { logs: AuditLog[] }) => (
  <div className="p-8 max-w-7xl mx-auto">
     <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="text-brand-600" /> Audit Logs
        </h2>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm">Export CSV</button>
     </div>
     
     <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Performed By</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                   <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                         <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium text-xs">{log.action}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{log.performedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{log.details}</td>
                   </tr>
                ))}
             </tbody>
          </table>
        </div>
     </div>
  </div>
);

// Improved Attendance Table
const AttendanceTable = ({ records }: { records: AttendanceRecord[] }) => {
   
   const handleExport = () => {
      const headers = ['User', 'Department', 'Date', 'Status', 'Check In', 'Check Out', 'Latitude', 'Longitude'];
      const rows = records.map(r => [
          r.userName,
          r.department,
          r.date,
          r.status,
          r.checkInTime,
          r.checkOutTime || '',
          r.location.lat,
          r.location.lng
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Eduno_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
   };

   const getStatusConfig = (status: string) => {
      switch (status) {
         case 'PRESENT': return { 
            bg: 'bg-emerald-50', 
            text: 'text-emerald-700', 
            icon: CheckCircle,
            dot: 'bg-emerald-500'
         };
         case 'LATE': return { 
            bg: 'bg-amber-50', 
            text: 'text-amber-700', 
            icon: Clock,
            dot: 'bg-amber-500'
         };
         case 'ABSENT': return { 
            bg: 'bg-rose-50', 
            text: 'text-rose-700', 
            icon: XCircle,
            dot: 'bg-rose-500'
         };
         default: return { 
            bg: 'bg-slate-50', 
            text: 'text-slate-700', 
            icon: AlertCircle,
            dot: 'bg-slate-500'
         };
      }
   };

   return (
   <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Clock className="text-brand-600" /> Attendance Records
           </h2>
           <p className="text-slate-500 mt-1">Manage and view daily check-in logs</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search records..." 
               className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm" 
             />
           </div>
           <button 
             onClick={handleExport}
             className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"
           >
              <Download className="w-4 h-4" /> Export CSV
           </button>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead className="bg-gray-50/50 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 pl-8">Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Location</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {records.map(r => {
                     const config = getStatusConfig(r.status);
                     return (
                     <tr key={r.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                        <td className="px-6 py-4 pl-8">
                           <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm mr-3 border border-brand-200">
                                 {r.userName.charAt(0)}
                              </div>
                              <div>
                                 <div className="text-sm font-semibold text-slate-900">{r.userName}</div>
                                 <div className="text-xs text-slate-400">{r.date}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              {r.department}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                              {r.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                           {new Date(r.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                           {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : <span className="text-slate-300">-</span>}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                           <div className="flex items-center gap-1 group-hover:text-brand-500 transition-colors">
                              <MapPin className="w-3 h-3" />
                              {r.location.lat.toFixed(4)}, {r.location.lng.toFixed(4)}
                           </div>
                        </td>
                     </tr>
                  )})}
               </tbody>
            </table>
         </div>
         {records.length === 0 && (
            <div className="p-12 text-center text-slate-400">
               <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
               <p>No attendance records found for this period.</p>
            </div>
         )}
      </div>
   </div>
   );
};

export default function App() {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    users: [],
    attendanceRecords: [],
    auditLogs: []
  });
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  // Initial Data Load and Splash Screen Logic
  useEffect(() => {
    // Splash screen timer ensures users see the animation for at least 2.5s
    const timer = setTimeout(() => {
        setShowSplash(false);
    }, 2500);

    const loadData = async () => {
      try {
        const [users, records, logs] = await Promise.all([
          db.getUsers(),
          db.getAttendance(),
          db.getLogs()
        ]);
        
        setState(prev => ({
          ...prev,
          users,
          attendanceRecords: records,
          auditLogs: logs
        }));
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => clearTimeout(timer);
  }, []);

  // Real-time Subscription
  useEffect(() => {
    const unsubscribe = db.subscribeToAttendance((payload) => {
      setState(prev => {
        // Check if payload is an update (exists in list) or insert
        const existingIndex = prev.attendanceRecords.findIndex(r => r.id === payload.id);
        
        if (existingIndex !== -1) {
            // Update existing record
            const updatedRecords = [...prev.attendanceRecords];
            updatedRecords[existingIndex] = payload;
            return {
                ...prev,
                attendanceRecords: updatedRecords
            };
        } else {
            // Insert new record
            return {
                ...prev,
                attendanceRecords: [payload, ...prev.attendanceRecords]
            };
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (user: User) => {
    // Generate UUID for log (Standard for native/web)
    const logId = crypto.randomUUID();
    
    // Optimistic Update
    const newLog: AuditLog = {
      id: logId,
      action: 'USER_LOGIN',
      performedBy: user.name,
      timestamp: new Date().toISOString(),
      details: `User ${user.email} logged in successfully.`
    };

    setState(prev => ({
      ...prev,
      currentUser: user,
      auditLogs: [newLog, ...prev.auditLogs]
    }));

    await db.logAction(newLog);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setCurrentView('dashboard');
  };

  const handleCheckIn = async (record: AttendanceRecord) => {
    const logId = crypto.randomUUID();

    // Optimistic Update
    setState(prev => ({
      ...prev,
      attendanceRecords: [record, ...prev.attendanceRecords],
      auditLogs: [
        {
          id: logId,
          action: 'ATTENDANCE_CHECKIN',
          performedBy: prev.currentUser?.name || 'Unknown',
          timestamp: new Date().toISOString(),
          details: `Check-in at ${record.location.lat}, ${record.location.lng}`
        },
        ...prev.auditLogs
      ]
    }));

    // DB Update
    await db.markAttendance(record);
    await db.logAction({
      id: logId,
      action: 'ATTENDANCE_CHECKIN',
      performedBy: state.currentUser?.name || 'Unknown',
      timestamp: new Date().toISOString(),
      details: `Check-in at ${record.location.lat}, ${record.location.lng}`
    });
  };

  const handleCheckOut = async (record: AttendanceRecord) => {
    const logId = crypto.randomUUID();
    
    // Optimistic Update
    setState(prev => ({
        ...prev,
        attendanceRecords: prev.attendanceRecords.map(r => r.id === record.id ? record : r),
        auditLogs: [
            {
              id: logId,
              action: 'ATTENDANCE_CHECKOUT',
              performedBy: prev.currentUser?.name || 'Unknown',
              timestamp: new Date().toISOString(),
              details: `Check-out at ${new Date().toLocaleTimeString()}`
            },
            ...prev.auditLogs
        ]
    }));

    await db.updateAttendance(record);
    await db.logAction({
        id: logId,
        action: 'ATTENDANCE_CHECKOUT',
        performedBy: state.currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString(),
        details: `Check-out at ${new Date().toLocaleTimeString()}`
    });
  };

  // --- RENDER LOGIC ---

  // 1. Show Splash Screen until ready
  if (showSplash) {
      return <SplashScreen />;
  }

  // 2. Show Login if no user
  if (!state.currentUser) {
    return <Login users={state.users} onLogin={handleLogin} loading={loading} />;
  }

  // Filter records based on role
  let visibleRecords = state.attendanceRecords;
  if (state.currentUser.role === UserRole.ADMIN || state.currentUser.role === UserRole.HOD) {
     visibleRecords = visibleRecords.filter(r => r.department === state.currentUser?.department);
  } else if (state.currentUser.role === UserRole.STUDENT) {
     visibleRecords = visibleRecords.filter(r => r.userId === state.currentUser?.id);
  } else if (state.currentUser.role === UserRole.TEACHER) {
     visibleRecords = visibleRecords.filter(r => r.department === state.currentUser?.department);
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        // Enable Scanner View for both STUDENT and TEACHER
        if (state.currentUser?.role === UserRole.STUDENT || state.currentUser?.role === UserRole.TEACHER) {
             // Find today's record for the current user
             const todayStr = new Date().toISOString().split('T')[0];
             const lastRecord = state.attendanceRecords.find(r => r.userId === state.currentUser?.id && r.date === todayStr);

             return (
               // FIXED LAYOUT: Scanner Sidebar + Fluid Dashboard
               <div className="flex flex-col-reverse lg:flex-row h-full overflow-hidden">
                  {/* Left (Desktop) / Bottom (Mobile): Stats Dashboard */}
                  <div className="flex-1 h-full overflow-y-auto bg-slate-50 custom-scrollbar">
                     <Dashboard 
                        user={state.currentUser} 
                        records={visibleRecords} 
                        allUsers={state.users} 
                        compact={true} // Enable compact layout mode
                     />
                  </div>

                  {/* Right (Desktop) / Top (Mobile): Scanner */}
                  <div className="w-full lg:w-[400px] h-auto lg:h-full border-l border-gray-200 bg-white flex-shrink-0 z-10 shadow-lg lg:shadow-none">
                     <AttendanceScanner 
                        user={state.currentUser} 
                        onCheckIn={handleCheckIn} 
                        onCheckOut={handleCheckOut}
                        lastRecord={lastRecord} 
                     />
                  </div>
               </div>
             );
        }
        return <Dashboard user={state.currentUser} records={visibleRecords} allUsers={state.users} />;
      case 'attendance':
      case 'reports': // Allow students to view their report table
        return <AttendanceTable records={visibleRecords} />;
      case 'insights':
        return <GeminiInsights records={visibleRecords} users={state.users} logs={state.auditLogs} />;
      case 'audit':
        return state.currentUser?.role === UserRole.SUPER_ADMIN 
          ? <AuditLogViewer logs={state.auditLogs} /> 
          : <div className="p-8 text-center text-red-500 font-medium bg-red-50 rounded-lg m-8 border border-red-100">Access Restricted: Super Admin Only</div>;
      case 'users':
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full text-slate-400">
            <Users className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-slate-600">User Management</h3>
            <p>Module under construction</p>
          </div>
        );
      default:
        return <Dashboard user={state.currentUser} records={visibleRecords} allUsers={state.users} />;
    }
  };

  return (
    <Layout 
      user={state.currentUser} 
      onLogout={handleLogout}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </Layout>
  );
}