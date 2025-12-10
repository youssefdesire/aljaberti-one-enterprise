
import React, { useState } from 'react';
import { User, UserRole, CompanyProfile, PermissionItem, AutomationRule } from '../types';
import { Shield, Users, Bell, Lock, Mail, Search, MoreVertical, Plus, CheckCircle, XCircle, Database, Trash2, Edit, Building, Camera, Check, X, Key, AlertTriangle, Save, Layers, FileText, Activity, Download, Eye, AlertOctagon, Sliders, Globe, Server, ToggleLeft, ToggleRight, CreditCard, Workflow, Zap, HardDrive, RefreshCw, Palette, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const mockUsers: User[] = [
  { id: 'USR-001', name: 'Ahmed Al-Mansouri', email: 'ahmed@aljaberti.ae', role: UserRole.ADMIN, status: 'Active', lastLogin: 'Just now', department: 'Management', isOnline: true },
  { id: 'USR-002', name: 'Sarah Jones', email: 'sarah@aljaberti.ae', role: UserRole.MANAGER, status: 'Active', lastLogin: '2 hours ago', department: 'Finance', isOnline: true },
  { id: 'USR-003', name: 'Rajesh Kumar', email: 'rajesh@aljaberti.ae', role: UserRole.USER, status: 'Inactive', lastLogin: '2 days ago', department: 'Operations', isOnline: false },
  { id: 'USR-004', name: 'John Smith', email: 'john@aljaberti.ae', role: UserRole.VIEWER, status: 'Active', lastLogin: '5 hours ago', department: 'Sales', isOnline: false },
];

const mockAuditLogs = [
    { id: 'LOG-001', action: 'Login Success', user: 'Ahmed Al-Mansouri', module: 'Auth', timestamp: '2024-05-24 08:30:12', ip: '192.168.1.10', details: 'Via Chrome Windows' },
    { id: 'LOG-002', action: 'Created Invoice #INV-005', user: 'Sarah Jones', module: 'Finance', timestamp: '2024-05-24 09:15:00', ip: '192.168.1.15', details: 'Value: 32,000 AED' },
    { id: 'LOG-003', action: 'Updated Stock: Cement', user: 'Rajesh Kumar', module: 'Inventory', timestamp: '2024-05-23 14:20:11', ip: '10.0.0.5', details: 'Adjustment: -50 units' },
    { id: 'LOG-004', action: 'Permission Change', user: 'Ahmed Al-Mansouri', module: 'Settings', timestamp: '2024-05-23 11:00:05', ip: '192.168.1.10', details: 'Granted HR access to Manager role' },
    { id: 'LOG-005', action: 'Failed Login Attempt', user: 'Unknown', module: 'Auth', timestamp: '2024-05-22 23:45:00', ip: '45.33.22.11', details: 'Invalid Password' },
];

const mockAutomationRules: AutomationRule[] = [
    { id: 'RULE-001', name: 'High Value Expense Approval', module: 'Finance', trigger: 'New Expense Created', condition: 'Amount > 1000 AED', action: 'Require Manager Approval', active: true },
    { id: 'RULE-002', name: 'Low Stock Alert', module: 'Inventory', trigger: 'Stock Level Change', condition: 'Quantity < 20', action: 'Send Email to Procurement', active: true },
    { id: 'RULE-003', name: 'Welcome New Client', module: 'CRM', trigger: 'Deal Won', condition: 'Value > 50000 AED', action: 'Create Onboarding Project', active: false },
    { id: 'RULE-004', name: 'Contract Expiry Warning', module: 'HR', trigger: 'Daily Check', condition: 'Visa Expiry < 30 Days', action: 'Notify HR Manager', active: true },
];

let storedCategories: Record<string, string[]> = {
    'Departments': ['Management', 'Finance', 'Operations', 'Sales', 'HR', 'Projects'],
    'Job Grades': ['Entry', 'Junior', 'Mid', 'Senior', 'Executive', 'Director'],
    'Cost Centers': ['CC-100 (HQ)', 'CC-200 (Finance)', 'CC-300 (Projects)', 'CC-400 (Sales)'],
    'Expense Categories': ['Utilities', 'Rent', 'Office Supplies', 'Travel', 'Marketing', 'Software', 'Legal'],
    'Project Types': ['Renovation', 'Fitout', 'Maintenance', 'Consultancy'],
    'Ticket Priorities': ['Low', 'Medium', 'High', 'Critical']
};

interface SettingsViewProps {
    currentUserRole?: UserRole;
    permissions?: PermissionItem[];
    onTogglePermission?: (id: string, role: 'admin' | 'manager' | 'user' | 'viewer') => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentUserRole = UserRole.USER, permissions = [], onTogglePermission }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'config' | 'company' | 'security' | 'notifications' | 'master' | 'permissions' | 'audit' | 'automation' | 'data'>('users');
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  // Master Data State using Module-Level Variable for Persistence
  const [categories, setCategories] = useState<Record<string, string[]>>(storedCategories);
  const [selectedCategoryType, setSelectedCategoryType] = useState('Departments');
  const [newCategoryItem, setNewCategoryItem] = useState('');

  // Automation State
  const [rules, setRules] = useState<AutomationRule[]>(mockAutomationRules);

  // Sidebar Collapse State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Invitation Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(UserRole.USER);

  // Security State
  const [enable2FA, setEnable2FA] = useState(true);
  const [passMinLength, setPassMinLength] = useState(8);

  // Notification State
  const [emailNotifs, setEmailNotifs] = useState({ system: true, billing: true, tasks: false });

  // System Config State
  const [systemConfig, setSystemConfig] = useState({
      dateFormat: 'DD/MM/YYYY',
      timezone: 'GST (Gulf Standard Time)',
      fiscalYearStart: 'January',
      defaultCurrency: 'AED',
      vatRate: 5,
      expenseApprovalLimit: 1000,
      themeColor: 'Blue',
      maintenanceMode: false,
      modules: {
          hr: true,
          crm: true,
          inventory: true,
          projects: true,
          helpdesk: true
      },
      integration: {
          smtpHost: 'smtp.office365.com',
          smsGateway: 'Twilio'
      }
  });

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
      name: 'Aljaberti ONE',
      trn: '1002394857',
      address: 'P.O. Box 12345, Business Bay, Dubai, UAE',
      email: 'info@aljaberti.ae',
      phone: '+971 4 123 4567',
      logoUrl: ''
  });

  const roleKey = currentUserRole === UserRole.ADMIN ? 'admin' : 
      currentUserRole === UserRole.MANAGER ? 'manager' : 'user';

  // Dynamic Permissions Check
  const canInvite = permissions.find(p => p.name === 'Invite Users')?.[roleKey] || currentUserRole === UserRole.ADMIN;

  const toggleStatus = (id: string) => {
    if (currentUserRole !== UserRole.ADMIN) {
        alert("Permission Denied: Only Administrators can change user status.");
        return;
    }
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const handleSendInvite = () => {
      // Simulate invite
      alert(`Invitation sent to ${inviteEmail}. User will receive a secure setup link.`);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      // Optimistically add user as Pending
      const newUser: User = {
          id: `USR-${Date.now()}`,
          name: 'Pending User',
          email: inviteEmail,
          role: inviteRole,
          status: 'Inactive',
          lastLogin: 'Never',
          department: 'Unassigned',
          isOnline: false
      };
      setUsers([...users, newUser]);
  };

  const handleResetPassword = (email: string) => {
      if (currentUserRole !== UserRole.ADMIN) return;
      if (window.confirm(`Send password reset link to ${email}?`)) {
          alert("Reset link sent securely to user's email.");
      }
  };

  const handleAddCategory = () => {
      if (currentUserRole !== UserRole.ADMIN) return;

      if (!newCategoryItem.trim()) return;
      const currentList = categories[selectedCategoryType] || [];
      if (!currentList.includes(newCategoryItem)) {
          const updatedCategories = {
              ...categories,
              [selectedCategoryType]: [...currentList, newCategoryItem]
          };
          setCategories(updatedCategories);
          storedCategories = updatedCategories; 
      }
      setNewCategoryItem('');
  };

  const handleDeleteCategory = (item: string) => {
      if (currentUserRole !== UserRole.ADMIN) {
          alert("Access Denied: Only Super Admins can remove categories.");
          return;
      }

      if(window.confirm(`Delete ${item} from ${selectedCategoryType}?`)) {
          const updatedCategories = {
              ...categories,
              [selectedCategoryType]: categories[selectedCategoryType].filter(i => i !== item)
          };
          setCategories(updatedCategories);
          storedCategories = updatedCategories; 
      }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          setCompanyProfile({ ...companyProfile, logoUrl: url });
      }
  };

  const togglePermission = (id: string, role: 'admin' | 'manager' | 'user' | 'viewer') => {
      if (currentUserRole !== UserRole.ADMIN) {
          alert("Access Denied: Only Super Admins can modify permissions.");
          return;
      }
      if (onTogglePermission) {
          onTogglePermission(id, role);
      }
  };

  // Group permissions by Module for display
  const groupedPermissions = permissions.reduce((acc: Record<string, PermissionItem[]>, perm) => {
      if (!acc[perm.module]) acc[perm.module] = [];
      acc[perm.module].push(perm);
      return acc;
  }, {} as Record<string, PermissionItem[]>);

  const toggleModule = (moduleKey: keyof typeof systemConfig.modules) => {
      setSystemConfig(prev => ({
          ...prev,
          modules: {
              ...prev.modules,
              [moduleKey]: !prev.modules[moduleKey]
          }
      }));
  };

  const toggleRule = (id: string) => {
      setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleBackup = () => {
      alert("System backup initiated. You will receive a notification when the download is ready.");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <div className={`${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 h-fit lg:h-full flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          {!isSidebarCollapsed && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Settings</h3>}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition ml-auto hidden lg:block"
            title={isSidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>
        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'users' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Users & Roles' : ''}
          >
            <Users className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Users & Roles'}
          </button>
           <button 
            onClick={() => setActiveTab('permissions')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'permissions' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Access Control' : ''}
          >
            <Lock className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Access Control'}
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'config' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'System Config' : ''}
          >
            <Sliders className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'System Config'}
          </button>
          <button 
            onClick={() => setActiveTab('automation')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'automation' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Automation' : ''}
          >
            <Workflow className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Automation'}
          </button>
          <button 
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'company' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Company Profile' : ''}
          >
            <Building className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Company Profile'}
          </button>
          <button 
            onClick={() => setActiveTab('master')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'master' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Master Data' : ''}
          >
            <Database className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Master Data'}
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'data' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Data & Backup' : ''}
          >
            <HardDrive className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Data & Backup'}
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'audit' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Audit Logs' : ''}
          >
            <Activity className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Audit Logs'}
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'security' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Security' : ''}
          >
            <Shield className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Security'}
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeTab === 'notifications' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Notifications' : ''}
          >
            <Bell className="w-4 h-4 flex-shrink-0" /> {!isSidebarCollapsed && 'Notifications'}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {activeTab === 'users' && (
          <>
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">User Management</h2>
                <p className="text-sm text-slate-500">Manage access, roles, and permissions.</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Find user..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-64" />
                </div>
                {canInvite && (
                    <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
                    >
                        <Plus className="w-4 h-4" /> Invite User
                    </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Login</th>
                    {currentUserRole === UserRole.ADMIN && <th className="px-6 py-4 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-white text-xs font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.department}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleStatus(user.id)}
                          disabled={currentUserRole !== UserRole.ADMIN}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                            user.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          } ${currentUserRole !== UserRole.ADMIN ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                          {user.status === 'Active' ? <CheckCircle className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                          {user.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{user.lastLogin}</td>
                      {currentUserRole === UserRole.ADMIN && (
                          <td className="px-6 py-4 text-center flex justify-center gap-2">
                            <button 
                                onClick={() => handleResetPassword(user.email)}
                                className="p-1 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded"
                                title="Reset Password"
                            >
                                <Key className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* System Configuration Tab */}
        {activeTab === 'config' && (
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">System Configuration</h2>
                        <p className="text-sm text-slate-500">Global settings, regional preferences, and module visibility.</p>
                    </div>
                    {currentUserRole === UserRole.ADMIN && (
                       <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-sm">
                           <Save className="w-4 h-4" /> Save Changes
                       </button>
                    )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Regional Settings */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Globe className="w-4 h-4" /> Regional & Localization
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                                    <select 
                                        value={systemConfig.timezone} 
                                        onChange={(e) => setSystemConfig({...systemConfig, timezone: e.target.value})}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                                    >
                                        <option>GST (Gulf Standard Time)</option>
                                        <option>UTC (Coordinated Universal Time)</option>
                                        <option>EST (Eastern Standard Time)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Date Format</label>
                                    <select 
                                        value={systemConfig.dateFormat} 
                                        onChange={(e) => setSystemConfig({...systemConfig, dateFormat: e.target.value})}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                                    >
                                        <option>DD/MM/YYYY</option>
                                        <option>MM/DD/YYYY</option>
                                        <option>YYYY-MM-DD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Default Currency</label>
                                    <select 
                                        value={systemConfig.defaultCurrency} 
                                        onChange={(e) => setSystemConfig({...systemConfig, defaultCurrency: e.target.value})}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                                    >
                                        <option>AED</option>
                                        <option>USD</option>
                                        <option>SAR</option>
                                        <option>EUR</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Financial Controls */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                                <CreditCard className="w-4 h-4" /> Financial Rules
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Fiscal Year Start</label>
                                        <select 
                                            value={systemConfig.fiscalYearStart} 
                                            onChange={(e) => setSystemConfig({...systemConfig, fiscalYearStart: e.target.value})}
                                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                                        >
                                            <option>January</option>
                                            <option>April</option>
                                            <option>July</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Default VAT Rate (%)</label>
                                        <input 
                                            type="number" 
                                            value={systemConfig.vatRate} 
                                            onChange={(e) => setSystemConfig({...systemConfig, vatRate: parseFloat(e.target.value)})}
                                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Expense Approval Limit (Auto-Approve)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{systemConfig.defaultCurrency}</span>
                                        <input 
                                            type="number" 
                                            value={systemConfig.expenseApprovalLimit} 
                                            onChange={(e) => setSystemConfig({...systemConfig, expenseApprovalLimit: parseFloat(e.target.value)})}
                                            className="w-full border border-slate-300 rounded-lg p-2.5 pl-10 text-sm"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Expenses below this amount do not require manager approval.</p>
                                </div>
                            </div>
                        </div>

                        {/* Module Management */}
                        <div className="space-y-6 lg:col-span-2">
                            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Layers className="w-4 h-4" /> Module Management
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { key: 'hr', label: 'HR & Payroll', desc: 'Employee data, leave, WPS' },
                                    { key: 'crm', label: 'CRM & Sales', desc: 'Leads, deals, pipelines' },
                                    { key: 'inventory', label: 'Inventory & Stock', desc: 'Products, services, stock levels' },
                                    { key: 'projects', label: 'Project Management', desc: 'Tasks, gantt, risks' },
                                    { key: 'helpdesk', label: 'Helpdesk Support', desc: 'Ticketing system' }
                                ].map((mod) => (
                                    <div key={mod.key} className="flex items-start justify-between p-4 border border-slate-200 rounded-xl hover:border-brand-200 transition-colors bg-slate-50">
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm">{mod.label}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{mod.desc}</p>
                                        </div>
                                        <button 
                                            onClick={() => toggleModule(mod.key as keyof typeof systemConfig.modules)}
                                            className={`transition-colors ${systemConfig.modules[mod.key as keyof typeof systemConfig.modules] ? 'text-emerald-500' : 'text-slate-300'}`}
                                        >
                                            {systemConfig.modules[mod.key as keyof typeof systemConfig.modules] ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Branding & Theme */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Palette className="w-4 h-4" /> Branding & Theme
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">System Theme Color</label>
                                    <div className="flex gap-3">
                                        {['Blue', 'Purple', 'Emerald', 'Slate'].map(color => (
                                            <button 
                                                key={color}
                                                onClick={() => setSystemConfig({...systemConfig, themeColor: color})}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${systemConfig.themeColor === color ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color === 'Blue' ? '#0ea5e9' : color === 'Purple' ? '#8b5cf6' : color === 'Emerald' ? '#10b981' : '#64748b' }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">Maintenance Mode</p>
                                        <p className="text-xs text-slate-500">Prevent users from logging in.</p>
                                    </div>
                                    <button 
                                        onClick={() => setSystemConfig({...systemConfig, maintenanceMode: !systemConfig.maintenanceMode})}
                                        className={`transition-colors ${systemConfig.maintenanceMode ? 'text-brand-600' : 'text-slate-300'}`}
                                    >
                                        {systemConfig.maintenanceMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Integrations */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Server className="w-4 h-4" /> External Integrations
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Server (Email)</label>
                                    <input 
                                        type="text" 
                                        value={systemConfig.integration.smtpHost} 
                                        onChange={(e) => setSystemConfig({...systemConfig, integration: {...systemConfig.integration, smtpHost: e.target.value}})}
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">SMS Gateway Provider</label>
                                    <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white">
                                        <option>Twilio</option>
                                        <option>MessageBird</option>
                                        <option>AWS SNS</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Workflow Automation</h2>
                        <p className="text-sm text-slate-500">Define business rules and automatic triggers.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-sm">
                        <Plus className="w-4 h-4" /> Add Rule
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid gap-4">
                        {rules.map(rule => (
                            <div key={rule.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-brand-200 transition-colors shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${rule.active ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-bold ${rule.active ? 'text-slate-800' : 'text-slate-500'}`}>{rule.name}</h4>
                                            <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">{rule.module}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                            <span className="font-mono bg-slate-50 px-1 rounded">IF {rule.trigger}</span>
                                            <span>AND {rule.condition}</span>
                                            <span className="font-bold text-brand-600">THEN {rule.action}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => toggleRule(rule.id)}
                                        className={`transition-colors ${rule.active ? 'text-emerald-500' : 'text-slate-300'}`}
                                    >
                                        {rule.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                    </button>
                                    <button className="text-slate-400 hover:text-slate-600 p-1"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Data & Backup Tab */}
        {activeTab === 'data' && (
            <div className="p-8 max-w-4xl mx-auto w-full overflow-y-auto">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-800">Data Management</h2>
                    <p className="text-sm text-slate-500">Backup, restore, and data retention policies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600"><HardDrive className="w-6 h-6" /></div>
                            <h3 className="font-bold text-slate-800">System Backups</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-6">Create a full snapshot of your database including users, transactions, and settings.</p>
                        <div className="flex gap-3">
                            <button onClick={handleBackup} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-sm">
                                Create Backup Now
                            </button>
                            <button className="flex-1 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">
                                Schedule
                            </button>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Recent Backups</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>backup_2024_05_24.sql</span>
                                    <span className="font-mono">124 MB</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>backup_2024_05_20.sql</span>
                                    <span className="font-mono">122 MB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600"><RefreshCw className="w-6 h-6" /></div>
                            <h3 className="font-bold text-slate-800">Data Import/Export</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-6">Bulk import data from CSV/Excel or export system data for external reporting.</p>
                        <div className="space-y-3">
                            <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" /> Export All Data (CSV)
                            </button>
                            <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                                <Database className="w-4 h-4" /> Import Wizard
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="col-span-1 md:col-span-2 mt-4">
                        <div className="p-6 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-rose-700 text-sm flex items-center gap-2">
                                    <AlertOctagon className="w-4 h-4" /> Reset System Data
                                </h4>
                                <p className="text-xs text-rose-600 mt-1">This will permanently delete all records. This action cannot be undone.</p>
                            </div>
                            <button className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition shadow-sm">
                                Clear All Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">System Audit Logs</h2>
                        <p className="text-sm text-slate-500">Track all user activities and system events.</p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Module</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4 text-right">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockAuditLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 text-xs text-slate-500 font-mono">{log.timestamp}</td>
                                    <td className="px-6 py-3 text-sm font-medium text-slate-700">{log.action}</td>
                                    <td className="px-6 py-3 text-sm text-slate-600">{log.user}</td>
                                    <td className="px-6 py-3">
                                        <span className="text-[10px] uppercase font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">{log.module}</span>
                                    </td>
                                    <td className="px-6 py-3 text-xs text-slate-500 max-w-xs truncate">{log.details}</td>
                                    <td className="px-6 py-3 text-right text-xs text-slate-400 font-mono">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Master Data Tab */}
        {activeTab === 'master' && (
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">Master Data Management</h2>
                    <p className="text-sm text-slate-500">Configure global dropdown lists and categories.</p>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/3 border-r border-slate-200 bg-slate-50 p-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 px-2">Category Types</h4>
                        <div className="space-y-1">
                            {Object.keys(categories).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategoryType(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategoryType === cat ? 'bg-white shadow-sm text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">{selectedCategoryType}</h3>
                            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{categories[selectedCategoryType]?.length || 0} Items</span>
                        </div>
                        
                        <div className="mb-4 flex gap-2">
                            <input 
                                type="text" 
                                value={newCategoryItem} 
                                onChange={(e) => setNewCategoryItem(e.target.value)}
                                className="flex-1 border border-slate-300 rounded-lg p-2 text-sm" 
                                placeholder="Add new item..." 
                                disabled={currentUserRole !== UserRole.ADMIN}
                            />
                            {currentUserRole === UserRole.ADMIN && (
                                <button onClick={handleAddCategory} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700">Add</button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {categories[selectedCategoryType]?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-300 transition-colors group">
                                    <span className="text-sm text-slate-700 font-medium">{item}</span>
                                    {currentUserRole === UserRole.ADMIN && (
                                        <button onClick={() => handleDeleteCategory(item)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
           <div className="flex flex-col h-full">
               <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                   <div>
                       <h2 className="text-lg font-bold text-slate-800">Access Control Matrix</h2>
                       <p className="text-sm text-slate-500">Define granular permissions for modules, features, and sensitive data.</p>
                   </div>
                   <div className="flex gap-2">
                       {currentUserRole !== UserRole.ADMIN && (
                           <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 max-w-fit">
                               <AlertTriangle className="w-4 h-4" /> View Only Mode
                           </div>
                       )}
                       {currentUserRole === UserRole.ADMIN && (
                           <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-sm">
                               <Save className="w-4 h-4" /> Changes Applied
                           </button>
                       )}
                   </div>
               </div>
               
               <div className="flex-1 overflow-auto p-6">
                   <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                       <table className="w-full text-left border-collapse">
                           <thead className="bg-slate-100 border-b border-slate-200 text-xs uppercase text-slate-600 font-bold tracking-wider">
                               <tr>
                                   <th className="px-6 py-4 w-1/3">Permission Context</th>
                                   <th className="px-6 py-4 text-center w-32 border-l border-slate-200 bg-brand-50 text-brand-700">Admin</th>
                                   <th className="px-6 py-4 text-center w-32 border-l border-slate-200">Manager</th>
                                   <th className="px-6 py-4 text-center w-32 border-l border-slate-200">User</th>
                                   <th className="px-6 py-4 text-center w-32 border-l border-slate-200">Viewer</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100 bg-white">
                               {Object.entries(groupedPermissions).map(([module, perms]) => (
                                   <React.Fragment key={module}>
                                       {/* Module Header */}
                                       <tr className="bg-slate-50">
                                           <td colSpan={5} className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                               <Layers className="w-4 h-4" /> {module} Module
                                           </td>
                                       </tr>
                                       
                                       {/* Permissions */}
                                       {(perms as PermissionItem[]).map((perm) => (
                                           <tr key={perm.id} className="hover:bg-slate-50 transition-colors">
                                               <td className="px-6 py-4">
                                                   <div className="flex flex-col">
                                                       <span className={`font-medium text-sm ${perm.type === 'Critical' ? 'text-rose-600' : 'text-slate-700'}`}>{perm.name}</span>
                                                       <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                                                           {perm.type === 'Data' && <Shield className="w-3 h-3 text-emerald-500" />}
                                                           {perm.type === 'Feature' && <CheckCircle className="w-3 h-3 text-blue-500" />}
                                                           {perm.type === 'Access' && <Eye className="w-3 h-3 text-slate-500" />}
                                                           {perm.type === 'Critical' && <AlertOctagon className="w-3 h-3 text-rose-500" />}
                                                           {perm.type} Level
                                                       </span>
                                                   </div>
                                               </td>
                                               <td className="px-6 py-4 text-center border-l border-slate-100 bg-brand-50/30">
                                                   <div className="flex justify-center">
                                                       <div className="p-1 rounded bg-brand-100 text-brand-700">
                                                           <Check className="w-4 h-4" />
                                                       </div>
                                                   </div>
                                               </td>
                                               <td className="px-6 py-4 text-center border-l border-slate-100">
                                                   <button 
                                                       onClick={() => togglePermission(perm.id, 'manager')} 
                                                       className={`p-1 rounded transition-all ${perm.manager ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                                                   >
                                                       {perm.manager ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                   </button>
                                               </td>
                                               <td className="px-6 py-4 text-center border-l border-slate-100">
                                                   <button 
                                                       onClick={() => togglePermission(perm.id, 'user')} 
                                                       className={`p-1 rounded transition-all ${perm.user ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                                                   >
                                                       {perm.user ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                   </button>
                                               </td>
                                               <td className="px-6 py-4 text-center border-l border-slate-100">
                                                   <button 
                                                       onClick={() => togglePermission(perm.id, 'viewer')} 
                                                       className={`p-1 rounded transition-all ${perm.viewer ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                                                   >
                                                       {perm.viewer ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                   </button>
                                               </td>
                                           </tr>
                                       ))}
                                   </React.Fragment>
                               ))}
                           </tbody>
                       </table>
                   </div>
               </div>
           </div>
        )}

        {/* Company Profile Tab */}
        {activeTab === 'company' && (
            <div className="p-8 max-w-4xl mx-auto w-full overflow-y-auto">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                        {companyProfile.logoUrl ? (
                            <img src={companyProfile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Building className="w-12 h-12 text-slate-300" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white mb-1" />
                            <span className="text-[10px] text-white font-bold uppercase">Change Logo</span>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleLogoUpload} />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mt-4">{companyProfile.name}</h2>
                    <p className="text-sm text-slate-500">Manage your company branding and details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                        <input type="text" value={companyProfile.name} onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">TRN (Tax Registration)</label>
                        <input type="text" value={companyProfile.trn} onChange={(e) => setCompanyProfile({...companyProfile, trn: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-mono" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Office Address</label>
                        <textarea value={companyProfile.address} onChange={(e) => setCompanyProfile({...companyProfile, address: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" rows={2} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input type="email" value={companyProfile.email} onChange={(e) => setCompanyProfile({...companyProfile, email: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                        <input type="text" value={companyProfile.phone} onChange={(e) => setCompanyProfile({...companyProfile, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button disabled={currentUserRole !== UserRole.ADMIN} className="px-6 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50">Save Changes</button>
                </div>
            </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
            <div className="p-8 max-w-3xl mx-auto overflow-y-auto">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-800">Security Policies</h2>
                    <p className="text-sm text-slate-500">Configure password strength and authentication rules.</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                        <div>
                            <p className="font-bold text-slate-700">Two-Factor Authentication (2FA)</p>
                            <p className="text-xs text-slate-500">Require OTP for all admin logins.</p>
                        </div>
                        <button 
                            onClick={() => setEnable2FA(!enable2FA)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${enable2FA ? 'bg-brand-600' : 'bg-slate-200'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enable2FA ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-xl">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Password Length</label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                min="8" 
                                max="16" 
                                value={passMinLength} 
                                onChange={(e) => setPassMinLength(parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="text-lg font-bold text-brand-600 w-8">{passMinLength}</span>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                                <p className="font-bold text-amber-800 text-sm">Force Password Reset</p>
                                <p className="text-xs text-amber-700 mt-1 mb-3">Force all users to change their password on next login.</p>
                                <button className="text-xs bg-white border border-amber-300 text-amber-800 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-100">
                                    Trigger Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
            <div className="p-8 max-w-3xl mx-auto overflow-y-auto">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-800">Email Notifications</h2>
                    <p className="text-sm text-slate-500">Configure default email alerts for the organization.</p>
                </div>

                <div className="space-y-4">
                    {[
                        { id: 'system', label: 'System Maintenance Alerts', desc: 'Downtime and upgrade notices' },
                        { id: 'billing', label: 'Billing & Invoice Digests', desc: 'Daily summary of overdue invoices' },
                        { id: 'tasks', label: 'Task Assignment Emails', desc: 'Email users when assigned a project task' }
                    ].map(item => (
                        <div key={item.id} className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-brand-200 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={emailNotifs[item.id as keyof typeof emailNotifs]} 
                                onChange={() => setEmailNotifs({...emailNotifs, [item.id]: !emailNotifs[item.id as keyof typeof emailNotifs]})}
                                className="mt-1 w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                            />
                            <div>
                                <p className="font-bold text-slate-700 text-sm">{item.label}</p>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 flex justify-end">
                    <button className="px-6 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700">Save Preferences</button>
                </div>
            </div>
        )}

      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800">Invite New User</h3>
                      <button onClick={() => setIsInviteModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                          <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="colleague@company.com" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as UserRole)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white">
                              <option value={UserRole.ADMIN}>Super Admin</option>
                              <option value={UserRole.MANAGER}>Manager</option>
                              <option value={UserRole.USER}>User</option>
                              <option value={UserRole.VIEWER}>Viewer</option>
                          </select>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 border border-blue-100">
                          <p>User will receive an email with instructions to set their password.</p>
                      </div>
                      <button onClick={handleSendInvite} disabled={!inviteEmail} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50">Send Invitation</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SettingsView;
