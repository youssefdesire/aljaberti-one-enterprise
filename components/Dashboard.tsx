
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, AlertCircle, Globe, Activity, FileText, 
  CheckSquare, Zap, Briefcase, UserCheck, HardHat, Truck, Monitor, UserPlus,
  CheckCircle, Rocket, Calendar, Plus, ArrowRight, Clock, ChevronDown, Filter,
  Trophy, Award, Target, Star, Quote, Medal, Crown, Download, RefreshCw,
  Bell, Wifi, MoreHorizontal, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { ChartData, SystemActivity, User, UserRole } from '../types';

// --- MOCK REAL-TIME DATA SIMULATION ---

const mockOnlineUsers: User[] = [
    { id: 'USR-001', name: 'Ahmed Al-Mansouri', email: 'ahmed@aljaberti.ae', role: UserRole.ADMIN, status: 'Active', lastLogin: 'Now', department: 'Management', isOnline: true },
    { id: 'USR-002', name: 'Sarah Jones', email: 'sarah@aljaberti.ae', role: UserRole.MANAGER, status: 'Active', lastLogin: '5m ago', department: 'Finance', isOnline: true },
    { id: 'USR-003', name: 'Rajesh Kumar', email: 'rajesh@aljaberti.ae', role: UserRole.USER, status: 'Active', lastLogin: '12m ago', department: 'Operations', isOnline: false },
    { id: 'USR-004', name: 'Maria Rodriguez', email: 'maria@aljaberti.ae', role: UserRole.MANAGER, status: 'Active', lastLogin: 'Now', department: 'HR', isOnline: true },
    { id: 'USR-005', name: 'John Smith', email: 'john@aljaberti.ae', role: UserRole.VIEWER, status: 'Active', lastLogin: '1h ago', department: 'Sales', isOnline: false },
];

const mockRecentActivity: SystemActivity[] = [
    { id: 'ACT-1', type: 'invoice', description: 'Created Invoice #INV-2024-006 for Hilton JBR', time: '5 mins ago', user: 'Sarah Jones' },
    { id: 'ACT-2', type: 'task', description: 'Completed "Site Survey" task for Project Alpha', time: '12 mins ago', user: 'Rajesh Kumar' },
    { id: 'ACT-3', type: 'user', description: 'New employee "Fatima Al-Ali" onboarded', time: '1 hour ago', user: 'Maria Rodriguez' },
    { id: 'ACT-4', type: 'alert', description: 'Stock Alert: Cement reached reorder level', time: '2 hours ago', user: 'System' },
];

const topEmployees = [
    { id: 1, name: 'Sarah Jones', role: 'Senior Accountant', score: 98, trend: '+2.4%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 2, name: 'Rajesh Kumar', role: 'Site Engineer', score: 96, trend: '+1.1%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh' },
    { id: 3, name: 'Ali Hassan', role: 'Sales Executive', score: 94, trend: '+4.5%', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali' },
];

const employeeOfTheMonth = {
    name: 'Sarah Jones',
    role: 'Senior Accountant',
    reason: 'Exceptional handling of Q2 VAT audit and cost-saving initiatives.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    month: 'May 2024'
};

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulating Real-time Data Updates
  const [financialData, setFinancialData] = useState<ChartData[]>([
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600, prediction: 4100 },
    { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602, prediction: 3200 },
    { name: 'Mar', revenue: 2000, expenses: 9800, profit: -7800, prediction: 2500 },
    { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128, prediction: 2900 },
    { name: 'May', revenue: 1890, expenses: 4800, profit: -2910, prediction: 2100 },
    { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410, prediction: 2600 },
    { name: 'Jul', revenue: 3490, expenses: 4300, profit: -810, prediction: 3600 },
  ]);

  const [hrStats, setHrStats] = useState({
      attendance: 94,
      productivity: 88,
      turnover: 2.1,
      late: 3,
      absent: 2
  });

  const [assetHealth, setAssetHealth] = useState({
      total: 145,
      active: 138,
      maintenance: 5,
      warrantyExpiring: 3
  });

  const refreshData = () => {
      setIsRefreshing(true);
      setTimeout(() => {
          // Simulate data variation
          setFinancialData(prev => prev.map(d => ({
              ...d,
              revenue: d.revenue + (Math.random() * 200 - 100)
          })));
          setHrStats(prev => ({
              attendance: Math.min(100, Math.max(80, prev.attendance + (Math.random() * 2 - 1))),
              productivity: prev.productivity,
              turnover: prev.turnover,
              late: Math.max(0, prev.late + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
              absent: prev.absent
          }));
          setLastUpdated(new Date());
          setIsRefreshing(false);
      }, 800);
  };

  // Auto-refresh simulation
  useEffect(() => {
      const interval = setInterval(refreshData, 30000); // Update every 30s
      return () => clearInterval(interval);
  }, []);

  const onlineCount = mockOnlineUsers.filter(u => u.isOnline).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 text-slate-900 dark:text-slate-100">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-6">
          <div>
              <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Executive Command Center</h2>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  Real-time synchronization active • Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                onClick={refreshData}
                className={`p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all ${isRefreshing ? 'animate-spin text-brand-600' : ''}`}
                title="Refresh Data"
              >
                  <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                  <button 
                    onClick={() => setDateRange('This Month')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${dateRange === 'This Month' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                      Month
                  </button>
                  <button 
                    onClick={() => setDateRange('Quarter')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${dateRange === 'Quarter' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                      Quarter
                  </button>
                  <button 
                    onClick={() => setDateRange('Year')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${dateRange === 'Year' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                      Year
                  </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition shadow-sm">
                  <Download className="w-4 h-4" /> Export Report
              </button>
          </div>
      </div>

      {/* NEW: REAL-TIME OPERATIONS & ASSETS ROW */}
      <section>
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" /> Real-Time Operations
              </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Attendance Live Monitor */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h4 className="font-bold text-slate-800">Attendance Live</h4>
                          <p className="text-xs text-slate-500">Today's Check-ins</p>
                      </div>
                      <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
                      </div>
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                      <h2 className="text-4xl font-bold text-slate-800">{Math.round(hrStats.attendance)}%</h2>
                      <p className="text-sm text-slate-500 mb-1">Present</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                      <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${hrStats.attendance}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-amber-50 p-2 rounded-lg">
                          <p className="text-lg font-bold text-amber-700">{hrStats.late}</p>
                          <p className="text-[10px] uppercase font-bold text-amber-600">Late Arrivals</p>
                      </div>
                      <div className="bg-rose-50 p-2 rounded-lg">
                          <p className="text-lg font-bold text-rose-700">{hrStats.absent}</p>
                          <p className="text-[10px] uppercase font-bold text-rose-600">Absent</p>
                      </div>
                  </div>
              </div>

              {/* Asset Health Monitor */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h4 className="font-bold text-slate-800">Asset Health</h4>
                          <p className="text-xs text-slate-500">Fleet & IT Status</p>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="text-sm font-bold text-slate-700">Active</span>
                          </div>
                          <span className="text-sm font-mono font-bold">{assetHealth.active}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg border border-amber-100">
                          <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span className="text-sm font-bold text-slate-700">Maintenance</span>
                          </div>
                          <span className="text-sm font-mono font-bold">{assetHealth.maintenance}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-rose-50 rounded-lg border border-rose-100 animate-pulse">
                          <div className="flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3 text-rose-500" />
                              <span className="text-sm font-bold text-slate-700">Warranty Expiring</span>
                          </div>
                          <span className="text-sm font-mono font-bold text-rose-600">{assetHealth.warrantyExpiring}</span>
                      </div>
                  </div>
              </div>

              {/* Who's Online Widget */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-emerald-500" /> Team Online
                      </h3>
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{onlineCount} Active</span>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[180px] pr-2 space-y-3 custom-scrollbar">
                      {mockOnlineUsers.map(user => (
                          <div key={user.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className="relative">
                                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                          {user.name.charAt(0)}
                                      </div>
                                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  <div>
                                      <p className="text-xs font-bold text-slate-700">{user.name}</p>
                                      <p className="text-[10px] text-slate-400">{user.department}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* 1. PROJECT KPIs MODULE */}
      <section>
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-600" /> Projects Health & Performance
              </h3>
              <span className="text-xs font-bold bg-brand-50 text-brand-700 px-2 py-1 rounded border border-brand-100">3 Active Projects</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Health Score */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Activity className="w-24 h-24 text-brand-600" />
                  </div>
                  <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Overall Portfolio Health</p>
                      <div className="flex items-end gap-2 mt-2">
                          <h4 className="text-4xl font-bold text-slate-800">85<span className="text-lg text-slate-400">/100</span></h4>
                          <span className="text-sm font-bold text-emerald-600 mb-1 flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" /> +2.4%
                          </span>
                      </div>
                  </div>
                  
                  <div className="mt-6">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                          <span>Budget Usage</span>
                          <span>72%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 w-[72%] rounded-full"></div>
                      </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
                          <p className="text-lg font-bold text-emerald-700">12</p>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">On Track</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-2 text-center border border-amber-100">
                          <p className="text-lg font-bold text-amber-700">3</p>
                          <p className="text-[10px] font-bold text-amber-600 uppercase">Risk</p>
                      </div>
                      <div className="bg-rose-50 rounded-lg p-2 text-center border border-rose-100 animate-pulse">
                          <p className="text-lg font-bold text-rose-700">1</p>
                          <p className="text-[10px] font-bold text-rose-600 uppercase">Critical</p>
                      </div>
                  </div>
              </div>

              {/* Workload Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                      <p className="text-xs font-bold text-slate-500 uppercase">Resource Allocation & Workload</p>
                      <button className="text-[10px] font-bold text-brand-600 hover:underline">View All Teams</button>
                  </div>
                  <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                              { team: 'Frontend', workload: 85, capacity: 100 },
                              { team: 'Backend', workload: 92, capacity: 100 },
                              { team: 'Design', workload: 45, capacity: 100 },
                              { team: 'QA', workload: 60, capacity: 100 },
                              { team: 'DevOps', workload: 30, capacity: 100 },
                          ]} layout="vertical" margin={{ left: 30 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="team" type="category" tick={{fontSize: 11, fill: '#64748b'}} width={60} />
                              <Tooltip cursor={{fill: 'transparent'}} />
                              <Legend iconType="circle" wrapperStyle={{fontSize: '10px'}} />
                              <Bar dataKey="workload" name="Current Load (%)" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                              <Bar dataKey="capacity" name="Total Capacity" fill="#f1f5f9" radius={[0, 4, 4, 0]} barSize={16} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      </section>

      {/* 2. HR & PERFORMANCE MODULE */}
      <section>
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" /> Workforce Performance KPIs
              </h3>
              <div className="flex gap-2">
                  <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">Attendance: {hrStats.attendance}%</span>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">Productivity: {hrStats.productivity}%</span>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee of the Month */}
              <div className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Trophy className="w-32 h-32 text-white" />
                  </div>
                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-xs font-bold text-brand-200 uppercase tracking-widest">Employee of the Month</p>
                              <p className="text-xl font-bold text-white">{employeeOfTheMonth.month}</p>
                          </div>
                          <Crown className="w-8 h-8 text-yellow-300" />
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-white/20">
                              <img src={employeeOfTheMonth.avatar} alt="Employee" className="w-full h-full object-cover" />
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-white">{employeeOfTheMonth.name}</h3>
                              <p className="text-sm text-brand-100">{employeeOfTheMonth.role}</p>
                          </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                          <div className="flex gap-2 mb-1">
                              <Quote className="w-4 h-4 text-brand-200" />
                              <p className="text-sm text-white italic leading-relaxed">
                                  {employeeOfTheMonth.reason}
                              </p>
                          </div>
                      </div>
                  </div>
                  <button className="mt-4 w-full py-2 bg-white text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-50 transition shadow-sm">
                      Send Congratulations
                  </button>
              </div>

              {/* Top Performers Leaderboard */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <Medal className="w-5 h-5 text-amber-500" /> Top Performers Leaderboard
                      </h4>
                      <button className="text-slate-400 hover:text-brand-600">
                          <MoreHorizontal className="w-4 h-4" />
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                          <thead className="text-xs text-slate-500 uppercase font-bold border-b border-slate-100">
                              <tr>
                                  <th className="pb-2 pl-2">Rank</th>
                                  <th className="pb-2">Employee</th>
                                  <th className="pb-2 text-right">KPI Score</th>
                                  <th className="pb-2 text-right">Trend</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {topEmployees.map((emp, index) => (
                                  <tr key={emp.id} className="group hover:bg-slate-50 transition-colors">
                                      <td className="py-3 pl-2">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                              index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                              index === 1 ? 'bg-slate-200 text-slate-600' :
                                              index === 2 ? 'bg-amber-100 text-amber-700' : 'text-slate-400'
                                          }`}>
                                              {index + 1}
                                          </div>
                                      </td>
                                      <td className="py-3">
                                          <div className="flex items-center gap-3">
                                              <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full bg-slate-100" />
                                              <div>
                                                  <p className="text-sm font-bold text-slate-700">{emp.name}</p>
                                                  <p className="text-[10px] text-slate-400">{emp.role}</p>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="py-3 text-right">
                                          <span className="font-bold text-slate-800">{emp.score}</span>
                                          <span className="text-xs text-slate-400">/100</span>
                                      </td>
                                      <td className="py-3 text-right">
                                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                              {emp.trend}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </section>

      {/* 3. FINANCIAL FORECAST MODULE */}
      <section>
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> Financial Intelligence
              </h3>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">AI Prediction Active</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Financial Chart with Prediction */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h4 className="font-bold text-slate-800">Revenue Forecast</h4>
                          <p className="text-xs text-slate-500">Actual vs Predicted Growth</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500"></span> Actual</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 border border-dashed"></span> AI Predicted</span>
                      </div>
                  </div>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={financialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                              <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                              <Area type="monotone" dataKey="prediction" stroke="#a855f7" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Expense Breakdown Pie */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <h4 className="font-bold text-slate-800 mb-4">Expense Distribution</h4>
                  <div className="flex-1 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={[
                                      { name: 'Salaries', value: 45000 },
                                      { name: 'Materials', value: 32000 },
                                      { name: 'Marketing', value: 15000 },
                                      { name: 'Ops', value: 8000 },
                                  ]}
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                              >
                                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((color, index) => (
                                      <Cell key={`cell-${index}`} fill={color} />
                                  ))}
                              </Pie>
                              <Tooltip formatter={(val) => `AED ${val.toLocaleString()}`} />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '11px'}} />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                      <p className="text-xs text-slate-500">Total Expenses (MoM)</p>
                      <p className="text-xl font-bold text-slate-800">AED 100,000</p>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
};

export default Dashboard;
