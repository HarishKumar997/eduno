import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { User, AttendanceRecord, Department, UserRole } from '../types';
import { Clock, Users, AlertCircle, MapPin, GraduationCap, CheckCircle, XCircle, TrendingUp, Calendar, ArrowUpRight, BarChart3, PieChart as PieIcon, Filter, ChevronDown, ChevronLeft, ChevronRight, Radar, Radio } from 'lucide-react';

interface DashboardProps {
  user: User;
  records: AttendanceRecord[];
  allUsers: User[];
  compact?: boolean;
}

// --- Live Geo-Radar Visualization ---
const LiveGeoRadar = ({ records }: { records: AttendanceRecord[] }) => {
    // Simulate mapping relative to a center point
    const recentRecords = records.slice(0, 8); // Last 8 check-ins
    
    return (
        <div className="w-full h-full min-h-[250px] relative bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
            {/* Grid Lines */}
            <div className="absolute inset-0 border border-slate-700/50 rounded-full m-8"></div>
            <div className="absolute inset-0 border border-slate-700/30 rounded-full m-20"></div>
            <div className="absolute inset-0 border border-slate-700/20 rounded-full m-32"></div>
            
            {/* Crosshairs */}
            <div className="absolute w-full h-px bg-slate-700/50"></div>
            <div className="absolute h-full w-px bg-slate-700/50"></div>
            
            {/* Scanning Line */}
            <div className="absolute w-[50%] h-[50%] bg-gradient-to-r from-transparent to-brand-500/20 top-0 right-0 origin-bottom-left animate-radar-spin border-b border-brand-500/50 rounded-tr-full"></div>

            {/* Center Beacon */}
            <div className="absolute w-3 h-3 bg-brand-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"></div>
            
            {/* Data Points */}
            {recentRecords.map((r, i) => {
                // Mock simple random positions for the demo visualization
                // In a real app, this would use (r.location.lat - centerLat) scaling
                const rng = (seed: number) => {
                    const x = Math.sin(seed) * 10000;
                    return x - Math.floor(x);
                }
                const seed = r.checkInTime.length + i;
                const top = 20 + rng(seed) * 60; 
                const left = 20 + rng(seed + 1) * 60;
                
                return (
                    <div 
                        key={r.id} 
                        className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                        style={{ top: `${top}%`, left: `${left}%` }}
                    >
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-emerald-200 whitespace-nowrap bg-black/50 px-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                             {r.userName}
                         </div>
                    </div>
                )
            })}
            
            <div className="absolute bottom-3 left-4 text-xs font-mono text-brand-400 flex items-center gap-2">
                <Radio className="w-3 h-3 animate-pulse" />
                LIVE GEO-FEED
            </div>
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ user, records, allUsers, compact = false }) => {
  const isStudent = user.role === UserRole.STUDENT;
  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

  // --- Slicer State ---
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStudentId, setSelectedStudentId] = useState<string>(isStudent ? user.id : 'ALL');

  // --- Slicer Helpers ---
  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  const availableStudents = useMemo(() => {
    if (isStudent) return [];
    let students = allUsers.filter(u => u.role === UserRole.STUDENT);
    if (user.role === UserRole.ADMIN || user.role === UserRole.HOD) {
      students = students.filter(u => u.department === user.department);
    }
    return students;
  }, [allUsers, user, isStudent]);

  // --- Data Filtering Logic ---
  
  // 1. Determine Mode
  const isIndividualView = selectedStudentId !== 'ALL' || isStudent;

  // 2. Filter Records based on Slicers
  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Filter by Student
    if (selectedStudentId !== 'ALL') {
        filtered = filtered.filter(r => r.userId === selectedStudentId);
    } else if (user.role === UserRole.ADMIN || user.role === UserRole.HOD) {
        filtered = filtered.filter(r => r.department === user.department);
    }

    // Filter by Month (For Aggregate views, we typically compare Current vs Last, 
    // but for Individual view we want the specific selected month)
    if (isIndividualView) {
        filtered = filtered.filter(r => {
            const d = new Date(r.date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });
    }

    return filtered;
  }, [records, selectedStudentId, selectedMonth, selectedYear, user, isIndividualView]);


  // --- Stats Calculation ---

  // Common Stats
  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let attendanceRate = 0;

  // AGGREGATE VIEW LOGIC (Admin/HOD overview)
  // We use the original 'records' prop for historical comparison to keep the "Last Month vs This Month" charts working
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const lastMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1;

  const currentMonthRecords = records.filter(r => new Date(r.date).getMonth() === currentMonthIdx);
  const lastMonthRecords = records.filter(r => new Date(r.date).getMonth() === lastMonthIdx);

  const calculateStats = (recs: AttendanceRecord[]) => {
      const total = recs.length;
      if (total === 0) return { present: 0, late: 0, absent: 0, rate: 0 };
      const p = recs.filter(r => r.status === 'PRESENT').length;
      const l = recs.filter(r => r.status === 'LATE').length;
      return {
          present: p,
          late: l,
          absent: recs.filter(r => r.status === 'ABSENT').length,
          rate: Math.round(((p + l) / total) * 100)
      };
  };

  const currentStats = calculateStats(currentMonthRecords);
  const lastStats = calculateStats(lastMonthRecords);

  // INDIVIDUAL VIEW LOGIC
  if (isIndividualView) {
      const total = filteredRecords.length;
      presentCount = filteredRecords.filter(r => r.status === 'PRESENT').length;
      lateCount = filteredRecords.filter(r => r.status === 'LATE').length;
      absentCount = filteredRecords.filter(r => r.status === 'ABSENT').length;
      attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;
  } else {
      // Aggregate Dashboard Stats
      attendanceRate = currentStats.rate;
      presentCount = currentMonthRecords.filter(r => r.status === 'PRESENT').length;
      lateCount = currentMonthRecords.filter(r => r.status === 'LATE').length;
      absentCount = currentMonthRecords.filter(r => r.status === 'ABSENT').length;
  }

  // --- Chart Data Preparation ---

  // 1. Status Distribution
  const statusData = [
    { name: 'Present', value: presentCount, color: '#10b981' }, 
    { name: 'Late', value: lateCount, color: '#f59e0b' },    
    { name: 'Absent', value: absentCount, color: '#f43f5e' }, 
  ].filter(item => item.value > 0);
  if (statusData.length === 0) statusData.push({ name: 'No Data', value: 1, color: '#e2e8f0' });

  // 2. Trend Lines (Arrival Time for Individual)
  const arrivalTrendData = useMemo(() => {
    if (!isIndividualView) return [];
    return filteredRecords
        .filter(r => r.status !== 'ABSENT')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(r => {
            const date = new Date(r.checkInTime);
            const decimalTime = date.getHours() + date.getMinutes() / 60;
            return {
                date: new Date(r.date).getDate(),
                time: decimalTime,
                status: r.status
            };
        });
  }, [filteredRecords, isIndividualView]);

  // 3. Department Data (Super Admin Aggregate)
  const deptData = [
    { name: 'CS', value: records.filter(r => r.department === Department.CS && r.status !== 'ABSENT').length },
    { name: 'EE', value: records.filter(r => r.department === Department.EE && r.status !== 'ABSENT').length },
    { name: 'ME', value: records.filter(r => r.department === Department.ME && r.status !== 'ABSENT').length },
    { name: 'BA', value: records.filter(r => r.department === Department.BA && r.status !== 'ABSENT').length },
  ];

  // 4. Monthly Comparison (Aggregate)
  const monthlyComparisonData = [
    { name: 'Last Month', present: lastStats.present, late: lastStats.late, absent: lastStats.absent },
    { name: 'This Month', present: currentStats.present, late: currentStats.late, absent: currentStats.absent },
  ];

  // --- Calendar Heatmap Generator ---
  const generateCalendar = () => {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const firstDay = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sun
      const days = [];
      
      // Empty slots for start of month
      for (let i = 0; i < firstDay; i++) {
          days.push(<div key={`empty-${i}`} className="h-10 md:h-14 bg-transparent"></div>);
      }

      for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = new Date(selectedYear, selectedMonth, day).toISOString().split('T')[0];
          const record = filteredRecords.find(r => r.date === dateStr);
          const isWeekend = new Date(selectedYear, selectedMonth, day).getDay() === 0 || new Date(selectedYear, selectedMonth, day).getDay() === 6;

          let bgClass = isWeekend ? 'bg-slate-50' : 'bg-gray-100';
          let borderClass = 'border-transparent';
          let textClass = isWeekend ? 'text-slate-300' : 'text-slate-400';
          let statusDot = null;
          let tooltip = 'No Record';

          if (record) {
              textClass = 'text-slate-700';
              if (record.status === 'PRESENT') {
                  bgClass = 'bg-emerald-50 hover:bg-emerald-100';
                  borderClass = 'border-emerald-200';
                  statusDot = 'bg-emerald-500';
                  tooltip = `Present\nIn: ${new Date(record.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
              } else if (record.status === 'LATE') {
                  bgClass = 'bg-amber-50 hover:bg-amber-100';
                  borderClass = 'border-amber-200';
                  statusDot = 'bg-amber-500';
                  tooltip = `Late\nIn: ${new Date(record.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
              } else if (record.status === 'ABSENT') {
                  bgClass = 'bg-rose-50 hover:bg-rose-100';
                  borderClass = 'border-rose-200';
                  statusDot = 'bg-rose-500';
                  tooltip = 'Absent';
              }
          }

          days.push(
              <div key={day} className={`group relative h-10 md:h-14 rounded-lg border ${borderClass} ${bgClass} flex flex-col items-center justify-center transition-all cursor-default`}>
                  <span className={`text-xs md:text-sm font-semibold ${textClass}`}>{day}</span>
                  {statusDot && <div className={`w-1.5 h-1.5 rounded-full ${statusDot} mt-1`}></div>}
                  
                  {/* Tooltip */}
                  {record && (
                      <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 w-max px-2 py-1 bg-slate-800 text-white text-[10px] rounded shadow-lg whitespace-pre-line text-center">
                          {tooltip}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                      </div>
                  )}
              </div>
          );
      }
      return days;
  };

  const StatCard = ({ title, value, icon: Icon, color, bg, trend }: any) => (
    <div className={`bg-white rounded-2xl shadow-soft border border-gray-50 flex items-start justify-between transition-transform hover:-translate-y-1 duration-300 ${compact ? 'p-4' : 'p-6'}`}>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 tracking-tight`}>{value}</h3>
        {trend && !isIndividualView && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                {Math.abs(trend)}% vs last month
            </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className={`${compact ? 'p-6 space-y-6' : 'p-8 space-y-8'} max-w-7xl mx-auto`}>
      
      {/* Header & Slicers */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            {isIndividualView ? (
                 selectedStudentId === 'ALL' ? 'My Overview' : allUsers.find(u => u.id === selectedStudentId)?.name || 'Student Report'
            ) : 'Dashboard'}
          </h1>
          <p className="text-gray-500 mt-1">
             {isIndividualView 
                ? `Performance report for ${months[selectedMonth]} ${selectedYear}`
                : "Overview of campus activity and analytics"
             }
          </p>
        </div>
        
        {/* SLICERS */}
        <div className="flex flex-wrap items-center gap-3">
             {/* Student Selector (Admin Only) */}
             {!isStudent && (
                 <div className="relative group">
                     <select 
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 hover:border-brand-300 transition-colors shadow-sm cursor-pointer"
                     >
                        <option value="ALL">Overview (Aggregate)</option>
                        {availableStudents.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
                        ))}
                     </select>
                     <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-brand-500" />
                 </div>
             )}

             {/* Month Selector */}
             <div className="relative group">
                 <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 hover:border-brand-300 transition-colors shadow-sm cursor-pointer"
                 >
                    {months.map((m, idx) => (
                        <option key={m} value={idx}>{m}</option>
                    ))}
                 </select>
                 <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-brand-500" />
             </div>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${compact ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-4 md:gap-6`}>
        <StatCard 
          title={isIndividualView ? "Attendance Rate" : "Avg Rate"}
          value={`${attendanceRate}%`} 
          icon={TrendingUp} 
          bg="bg-blue-50" 
          color="text-blue-600"
          trend={!isIndividualView ? (currentStats.rate - lastStats.rate) : null}
        />
        <StatCard 
          title="Present" 
          value={presentCount} 
          icon={CheckCircle} 
          bg="bg-emerald-50" 
          color="text-emerald-600"
        />
        <StatCard 
          title="Late" 
          value={lateCount} 
          icon={Clock} 
          bg="bg-amber-50" 
          color="text-amber-600"
        />
        <StatCard 
          title="Absent" 
          value={absentCount} 
          icon={XCircle} 
          bg="bg-rose-50" 
          color="text-rose-600"
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className={`grid grid-cols-1 ${compact ? 'lg:grid-cols-1 xl:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
        
        {/* LEFT COLUMN: Main Visualization */}
        <div className={`${compact ? '' : 'lg:col-span-2'} flex flex-col gap-8`}>
            
            {/* 1. INDIVIDUAL: Attendance Calendar Heatmap */}
            {isIndividualView && (
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                           <Calendar className="w-5 h-5 text-brand-500" />
                           Attendance Calendar
                        </h3>
                        <div className="flex gap-4 text-xs font-medium text-gray-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Late</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Absent</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {generateCalendar()}
                    </div>
                </div>
            )}

            {/* 2. AGGREGATE OR INDIVIDUAL: Time/Comparison Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex-1 min-h-[350px]">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {isIndividualView ? 'Arrival Time Trend' : 'Monthly Comparison'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {isIndividualView ? 'Punctuality check over the month' : 'Comparing performance vs last month'}
                        </p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {isIndividualView ? (
                            <AreaChart data={arrivalTrendData}>
                                <defs>
                                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" label={{ value: 'Day', position: 'insideBottomRight', offset: -5, fontSize: 10 }} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis domain={[7, 11]} label={{ value: 'Hour (AM)', angle: -90, position: 'insideLeft', fontSize: 10 }} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                    formatter={(val: number) => [`${Math.floor(val)}:${Math.round((val % 1) * 60).toString().padStart(2, '0')}`, 'Arrival Time']}
                                />
                                <Area type="monotone" dataKey="time" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
                                {/* Reference Line for 9 AM */}
                                <Line type="monotone" dataKey={() => 9} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={1} dot={false} activeDot={false} />
                            </AreaChart>
                        ) : (
                            <BarChart data={monthlyComparisonData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="absent" name="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Pie Charts & Status OR Radar */}
        {(!compact || !isIndividualView) && (
        <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {compact ? 'Campus Live' : (isIndividualView ? 'Status Distribution' : (isSuperAdmin ? "Department Leaderboard" : "Today's Status"))}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    {compact ? 'Real-time geo-tracking' : (isIndividualView ? `Summary for ${months[selectedMonth]}` : 'Live snapshot')}
                </p>
                
                <div className="flex-1 min-h-[250px] flex items-center justify-center relative">
                    {/* Compact Mode shows RADAR for "Wow" factor */}
                    {compact ? (
                        <LiveGeoRadar records={records} />
                    ) : (
                    <ResponsiveContainer width="100%" height="100%">
                    {!isIndividualView && isSuperAdmin ? (
                        <BarChart data={deptData} layout="vertical" margin={{ left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" axisLine={false} tickLine={false} hide />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} width={30} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    ) : (
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                cornerRadius={8}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    )}
                    </ResponsiveContainer>
                    )}
                    
                    {/* Donut Center Text */}
                    {(!isSuperAdmin || isIndividualView) && !compact && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                            <div className="text-center">
                                <span className="text-4xl font-bold text-slate-800">
                                    {isIndividualView ? (presentCount + lateCount) : (presentCount + lateCount)}
                                </span>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    Days Active
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Quick Actions / Insights (Placeholder) */}
            {!compact && (
                <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-brand-500/20">
                   <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><ArrowUpRight className="w-5 h-5" /> Quick Insight</h4>
                   <p className="text-brand-100 text-sm leading-relaxed opacity-90">
                       {isIndividualView 
                         ? attendanceRate > 80 
                            ? "Student is maintaining good attendance. Eligible for exams." 
                            : "Attendance is below threshold. Intervention recommended."
                         : "Overall campus attendance is up 4% compared to last week."
                       }
                   </p>
                </div>
            )}
        </div>
        )}
      </div>
    </div>
  );
};