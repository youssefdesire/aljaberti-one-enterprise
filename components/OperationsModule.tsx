
import React, { useState } from 'react';
import { FixedAsset, MaintenanceRequest, OperationLog } from '../types';
import { 
  HardHat, Truck, PenTool as Tool, AlertTriangle, CheckCircle, 
  Clock, MapPin, Calendar, Plus, Search, Filter, Wrench, 
  Activity, Users, FileText, ChevronRight, Fuel
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// Mock Assets (Subset of FixedAssets for Ops)
const mockFleet: FixedAsset[] = [
    { id: 'AST-001', assetTag: 'VH-001', name: 'Toyota Land Cruiser', category: 'Vehicle', purchaseDate: '2022-01-15', purchaseCost: 280000, currentValue: 195000, status: 'Active', condition: 'Good', serialNumber: 'VIN123', assignedTo: 'Ahmed Al-Mansouri', location: 'Site A' },
    { id: 'AST-003', assetTag: 'MC-012', name: 'Caterpillar Excavator', category: 'Machinery', purchaseDate: '2021-11-20', purchaseCost: 450000, currentValue: 320000, status: 'Under Maintenance', condition: 'Fair', serialNumber: 'CAT-99', location: 'Site B' },
    { id: 'AST-006', assetTag: 'VH-005', name: 'Ford Transit Van', category: 'Vehicle', purchaseDate: '2023-03-10', purchaseCost: 120000, currentValue: 100000, status: 'Active', condition: 'Good', serialNumber: 'VIN456', assignedTo: 'Logistics Team', location: 'Warehouse' },
];

const mockMaintenance: MaintenanceRequest[] = [
    { id: 'MNT-001', assetId: 'AST-003', assetName: 'Caterpillar Excavator', reportedBy: 'Site Foreman', dateReported: '2024-05-20', issue: 'Hydraulic leak detected', priority: 'High', status: 'In Progress', cost: 2500 },
    { id: 'MNT-002', assetId: 'AST-001', assetName: 'Toyota Land Cruiser', reportedBy: 'Ahmed Al-Mansouri', dateReported: '2024-05-22', issue: 'Regular Service (10k)', priority: 'Medium', status: 'Open' },
];

const mockLogs: OperationLog[] = [
    { id: 'LOG-001', date: '2024-05-24', site: 'Hilton JBR Renovation', supervisor: 'Rajesh Kumar', workersCount: 15, weather: 'Sunny, 38°C', notes: 'Demolition phase completed. Debris removal in progress.', incidents: 'None' },
    { id: 'LOG-002', date: '2024-05-23', site: 'Tech Corp Office', supervisor: 'Ali Hassan', workersCount: 8, weather: 'Sunny, 36°C', notes: 'Partition framing started. Material delivery delayed by 2 hours.', incidents: 'Minor injury (First aid applied)' },
];

interface OperationsModuleProps {
    checkPermission?: (name: string) => boolean;
}

const OperationsModule: React.FC<OperationsModuleProps> = ({ checkPermission }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'maintenance' | 'logs'>('dashboard');
  const [fleet, setFleet] = useState<FixedAsset[]>(mockFleet);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(mockMaintenance);
  const [logs, setLogs] = useState<OperationLog[]>(mockLogs);

  // New Entry States
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newLog, setNewLog] = useState<Partial<OperationLog>>({ date: new Date().toISOString().split('T')[0] });

  const activeFleet = fleet.filter(f => f.status === 'Active').length;
  const maintenanceCount = fleet.filter(f => f.status === 'Under Maintenance').length;

  const handleSaveLog = () => {
      const log: OperationLog = {
          id: `LOG-${Date.now()}`,
          date: newLog.date!,
          site: newLog.site || 'Unknown Site',
          supervisor: newLog.supervisor || 'Current User',
          workersCount: newLog.workersCount || 0,
          weather: newLog.weather || '',
          notes: newLog.notes || '',
          incidents: newLog.incidents || 'None'
      };
      setLogs([log, ...logs]);
      setIsLogModalOpen(false);
      setNewLog({ date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-slate-900 dark:text-slate-100">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-6 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'dashboard' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}
            >
                <Activity className="w-4 h-4" /> Ops Dashboard
            </button>
            <button 
                onClick={() => setActiveTab('fleet')}
                className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'fleet' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}
            >
                <Truck className="w-4 h-4" /> Fleet & Machinery
            </button>
            <button 
                onClick={() => setActiveTab('maintenance')}
                className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'maintenance' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}
            >
                <Wrench className="w-4 h-4" /> Maintenance
            </button>
            <button 
                onClick={() => setActiveTab('logs')}
                className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'logs' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}
            >
                <FileText className="w-4 h-4" /> Site Logs
            </button>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-blue-700 uppercase">Active Fleet</p>
                            <h3 className="text-2xl font-bold text-blue-800">{activeFleet}/{fleet.length}</h3>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm"><Truck className="w-6 h-6 text-blue-600" /></div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-amber-700 uppercase">In Maintenance</p>
                            <h3 className="text-2xl font-bold text-amber-800">{maintenanceCount}</h3>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm"><Wrench className="w-6 h-6 text-amber-600" /></div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-emerald-700 uppercase">Active Sites</p>
                            <h3 className="text-2xl font-bold text-emerald-800">3</h3>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm"><MapPin className="w-6 h-6 text-emerald-600" /></div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-purple-700 uppercase">Staff on Site</p>
                            <h3 className="text-2xl font-bold text-purple-800">45</h3>
                        </div>
                        <div className="bg-white p-2 rounded-lg shadow-sm"><Users className="w-6 h-6 text-purple-600" /></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Fuel className="w-5 h-5 text-rose-500" /> Fuel Consumption
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Vehicle A', usage: 120 },
                                    { name: 'Excavator', usage: 350 },
                                    { name: 'Van 1', usage: 90 },
                                    { name: 'Gen Set', usage: 200 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="usage" fill="#f43f5e" radius={[4,4,0,0]} barSize={40} name="Liters" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <HardHat className="w-5 h-5 text-amber-500" /> Recent Site Activities
                        </h3>
                        <div className="space-y-4">
                            {logs.slice(0,3).map(log => (
                                <div key={log.id} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start w-full">
                                            <h4 className="text-sm font-bold text-slate-700">{log.site}</h4>
                                            <span className="text-[10px] text-slate-400">{log.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{log.notes}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                                                Supervisor: {log.supervisor}
                                            </span>
                                            {log.incidents !== 'None' && (
                                                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold border border-rose-100">
                                                    Incident Reported
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Fleet View */}
        {activeTab === 'fleet' && (
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Fleet Management</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search vehicle..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700">
                            <Plus className="w-4 h-4" /> Add Vehicle
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Asset</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {fleet.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{item.assetTag} • {item.serialNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{item.assignedTo}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-brand-600 hover:underline text-xs font-bold">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Maintenance View */}
        {activeTab === 'maintenance' && (
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Maintenance Requests</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700">
                        <Plus className="w-4 h-4" /> New Request
                    </button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Asset</th>
                                <th className="px-6 py-4">Issue</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Reported By</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {maintenance.map(req => (
                                <tr key={req.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{req.assetName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{req.issue}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            req.priority === 'High' ? 'bg-rose-100 text-rose-700' : 
                                            req.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {req.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            req.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{req.reportedBy}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{req.dateReported}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Site Logs View */}
        {activeTab === 'logs' && (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Daily Site Logs</h3>
                    <button 
                        onClick={() => setIsLogModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-md"
                    >
                        <Plus className="w-4 h-4" /> Add Daily Log
                    </button>
                </div>
                
                <div className="space-y-4">
                    {logs.map(log => (
                        <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-brand-300 transition-colors shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-lg font-bold text-slate-800">{log.site}</h4>
                                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{log.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Supervisor: <span className="font-medium text-slate-700">{log.supervisor}</span></p>
                                </div>
                                <div className="flex gap-4 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-slate-400" /> 
                                        <span className="font-bold">{log.workersCount}</span> Workers
                                    </div>
                                    <div className="w-px h-4 bg-slate-200"></div>
                                    <div className="flex items-center gap-1">
                                        <Activity className="w-4 h-4 text-slate-400" /> 
                                        <span>{log.weather}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 leading-relaxed mb-3">
                                {log.notes}
                            </div>

                            {log.incidents && log.incidents !== 'None' ? (
                                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                                    <AlertTriangle className="w-4 h-4" /> Incident Reported: {log.incidents}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                                    <CheckCircle className="w-4 h-4" /> No Incidents
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Add Log Modal */}
      {isLogModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-brand-600" /> New Daily Log
                      </h3>
                      <button onClick={() => setIsLogModalOpen(false)}><ChevronRight className="w-5 h-5 text-slate-400 rotate-90" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Site Name</label>
                          <input type="text" value={newLog.site || ''} onChange={e => setNewLog({...newLog, site: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" placeholder="e.g. Hilton JBR" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                              <input type="date" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Workers Count</label>
                              <input type="number" value={newLog.workersCount || ''} onChange={e => setNewLog({...newLog, workersCount: parseInt(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weather Conditions</label>
                          <input type="text" value={newLog.weather || ''} onChange={e => setNewLog({...newLog, weather: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" placeholder="e.g. Sunny, 40C" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Progress Notes</label>
                          <textarea value={newLog.notes || ''} onChange={e => setNewLog({...newLog, notes: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm h-24 resize-none" placeholder="What was accomplished today?" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Incidents (Optional)</label>
                          <input type="text" value={newLog.incidents || ''} onChange={e => setNewLog({...newLog, incidents: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" placeholder="Describe any accidents or issues" />
                      </div>
                      <button onClick={handleSaveLog} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition">Save Log Entry</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default OperationsModule;
