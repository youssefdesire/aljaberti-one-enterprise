
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Users, Box, CheckSquare, 
  Settings, Menu, Bell, Search, Sparkles, LogOut, ChevronRight,
  Briefcase, LifeBuoy, FolderOpen, UserCircle, X, Camera, MessageSquare, Building,
  PanelLeftClose, PanelLeftOpen, Wifi, ClipboardList, HardHat, Calendar,
  Moon, Sun, Command
} from 'lucide-react';
import { NavItem, UserRole, PermissionItem, User } from '../types';
import CommandPalette from './CommandPalette';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAI: (message?: string) => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
  permissions: PermissionItem[];
}

const allNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'communication', label: 'Team Chat', icon: MessageSquare }, 
  { id: 'service-request', label: 'Service Requests', icon: ClipboardList },
  { id: 'clients', label: 'Clients', icon: Building },
  { id: 'crm', label: 'CRM & Sales', icon: Users },
  { id: 'projects', label: 'Projects', icon: CheckSquare },
  { id: 'events', label: 'Events & Planning', icon: Calendar },
  { id: 'operations', label: 'Operations', icon: HardHat },
  { id: 'accounting', label: 'Finance & VAT', icon: FileText },
  { id: 'inventory', label: 'Inventory & Stock', icon: Box },
  { id: 'hr', label: 'HR & Payroll', icon: Briefcase },
  { id: 'helpdesk', label: 'Support & Tickets', icon: LifeBuoy },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const navPermissionMap: Record<string, string> = {
  'dashboard': 'Access Dashboard',
  'communication': 'Access Team Chat',
  'service-request': 'Access Service Requests',
  'clients': 'Access Clients',
  'crm': 'Access CRM Module',
  'projects': 'Access Projects',
  'events': 'Access Events',
  'operations': 'Access Operations',
  'accounting': 'Access Finance Module',
  'inventory': 'Access Inventory',
  'hr': 'Access HR Module',
  'helpdesk': 'Access Helpdesk',
  'documents': 'Access Documents',
  'settings': 'Access Settings'
};

const mockOnlineUsers: User[] = [
    { id: 'USR-001', name: 'Ahmed Al-Mansouri', email: 'ahmed@aljaberti.ae', role: UserRole.ADMIN, status: 'Active', lastLogin: 'Now', department: 'Management', isOnline: true },
    { id: 'USR-002', name: 'Sarah Jones', email: 'sarah@aljaberti.ae', role: UserRole.MANAGER, status: 'Active', lastLogin: '5m ago', department: 'Finance', isOnline: true },
    { id: 'USR-003', name: 'Rajesh Kumar', email: 'rajesh@aljaberti.ae', role: UserRole.USER, status: 'Active', lastLogin: '12m ago', department: 'Operations', isOnline: false },
    { id: 'USR-004', name: 'Maria Rodriguez', email: 'maria@aljaberti.ae', role: UserRole.MANAGER, status: 'Active', lastLogin: 'Now', department: 'HR', isOnline: true },
    { id: 'USR-005', name: 'John Smith', email: 'john@aljaberti.ae', role: UserRole.VIEWER, status: 'Active', lastLogin: '1h ago', department: 'Sales', isOnline: false },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onOpenAI, userRole, userName, onLogout, permissions }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOnlineUsersModalOpen, setIsOnlineUsersModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(''); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  useEffect(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Keyboard shortcut for Command Palette
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsCommandPaletteOpen(prev => !prev);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const roleKey = userRole === UserRole.ADMIN ? 'admin' : 
                  userRole === UserRole.MANAGER ? 'manager' : 
                  userRole === UserRole.USER ? 'user' : 'viewer';

  const navItems = allNavItems.filter(item => {
      const permName = navPermissionMap[item.id];
      const permission = permissions.find(p => p.name === permName);
      return permission ? permission[roleKey] : false;
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setAvatarUrl(url);
      }
  };

  const handleTakePhoto = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          
          // Create a modal-like container for the camera stream
          const container = document.createElement('div');
          container.style.position = 'fixed';
          container.style.top = '0';
          container.style.left = '0';
          container.style.width = '100%';
          container.style.height = '100%';
          container.style.backgroundColor = 'rgba(0,0,0,0.8)';
          container.style.zIndex = '9999';
          container.style.display = 'flex';
          container.style.flexDirection = 'column';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          
          container.appendChild(video);
          
          const btn = document.createElement('button');
          btn.innerText = "Capture Photo";
          btn.className = "mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg font-bold";
          btn.onclick = () => {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas.getContext('2d')?.drawImage(video, 0, 0);
              const url = canvas.toDataURL('image/png');
              setAvatarUrl(url);
              
              stream.getTracks().forEach(track => track.stop());
              document.body.removeChild(container);
          };
          container.appendChild(btn);
          
          const closeBtn = document.createElement('button');
          closeBtn.innerText = "Cancel";
          closeBtn.className = "mt-2 text-white underline";
          closeBtn.onclick = () => {
              stream.getTracks().forEach(track => track.stop());
              document.body.removeChild(container);
          };
          container.appendChild(closeBtn);

          document.body.appendChild(container);

      } catch (err) {
          alert("Camera access denied or not available.");
      }
  };

  return (
    <div className="flex h-screen bg-slate-50 w-full dark:bg-slate-900 transition-colors duration-200">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-slate-900 text-slate-300 transform transition-all duration-300 ease-in-out 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:relative 
          ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'} 
          w-64 flex flex-col border-r border-slate-800
        `}
      >
        <div className={`flex items-center gap-3 h-16 border-b border-slate-800 transition-all ${isSidebarCollapsed ? 'justify-center p-0' : 'p-6'}`}>
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30 flex-shrink-0">
            A1
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">Aljaberti ONE</h1>
              <span className="text-[10px] uppercase text-brand-400 font-semibold tracking-wider">Enterprise</span>
            </div>
          )}
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar flex-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full rounded-lg text-sm font-medium transition-all duration-200 group relative
                  ${isSidebarCollapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' 
                    : 'hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-colors flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} ${!isSidebarCollapsed && 'mr-3'}`} />
                
                {!isSidebarCollapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </>
                )}
                
                {/* Tooltip for collapsed state */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-slate-800 bg-slate-900 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
           <button 
             onClick={onLogout}
             title={isSidebarCollapsed ? "Sign Out" : ""}
             className={`flex items-center w-full text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors
               ${isSidebarCollapsed ? 'justify-center p-3' : 'px-4 py-3'}
             `}
            >
             <LogOut className={`w-5 h-5 flex-shrink-0 ${!isSidebarCollapsed && 'mr-3'}`} />
             {!isSidebarCollapsed && "Sign Out"}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 z-30 shadow-sm transition-colors text-slate-900 dark:text-slate-100">
          <div className="flex items-center gap-4">
             <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Desktop Sidebar Toggle */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:block p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            {/* Global Search / Command Trigger */}
            <div className="hidden md:flex relative group cursor-pointer" onClick={() => setIsCommandPaletteOpen(true)}>
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-500 transition-colors" />
              <div className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-full text-sm w-64 lg:w-96 text-slate-500 dark:text-slate-400 flex justify-between items-center hover:bg-white hover:ring-2 hover:ring-brand-100 transition-all">
                  <span>Search or run command...</span>
                  <div className="flex gap-1">
                      <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-500">Ctrl</span>
                      <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-500">K</span>
                  </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
               title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             <button 
               onClick={() => onOpenAI()}
               className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-brand-600 text-white rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
             >
               <Sparkles className="w-3.5 h-3.5" />
               Ask AI
             </button>

             {/* Online Users Trigger */}
             <button 
                onClick={() => setIsOnlineUsersModalOpen(true)}
                className="p-2 relative text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full transition-colors hidden md:block"
                title="Who is Online"
             >
                <Wifi className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></span>
             </button>
             
             {/* Notifications */}
             <div className="relative group">
                 <button className="p-2 relative text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full transition-colors">
                   <Bell className="w-5 h-5" />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
                 </button>
                 <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-2 hidden group-hover:block z-50">
                     <p className="text-xs font-bold text-slate-400 uppercase px-3 py-2">Notifications</p>
                     <div className="space-y-1">
                         <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                             <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Invoice #INV-005 Paid</p>
                             <p className="text-[10px] text-slate-500 dark:text-slate-400">2 mins ago • Finance</p>
                         </div>
                         <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                             <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Stock Alert: Cement</p>
                             <p className="text-[10px] text-slate-500 dark:text-slate-400">1 hour ago • Inventory</p>
                         </div>
                     </div>
                 </div>
             </div>

             <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 ml-2" onClick={() => setIsProfileModalOpen(true)}>
               <div className="text-right hidden lg:block cursor-pointer">
                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 transition">{userName}</p>
                 <p className="text-[10px] text-slate-500 dark:text-slate-400">{userRole} • Dubai HQ</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden cursor-pointer hover:ring-2 ring-brand-500 transition-all">
                  {avatarUrl ? (
                      <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                  ) : (
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" className="w-full h-full object-cover" />
                  )}
               </div>
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900 scroll-smooth">
           <div className="max-w-7xl mx-auto pb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                   <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h1>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aljaberti ONE Management Console</p>
                </div>
                <div className="text-right hidden md:block">
                   <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                   <p className="text-xs text-brand-600 font-bold mt-0.5">UAE 5% VAT APPLICABLE</p>
                </div>
              </div>
              {children}
           </div>
        </main>
      </div>

      {/* Online Users Modal (Drawer) */}
      {isOnlineUsersModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex justify-end">
              <div className="bg-white dark:bg-slate-800 w-full max-w-sm h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-200 dark:border-slate-700">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <Wifi className="w-5 h-5 text-emerald-500" /> Team Presence
                      </h3>
                      <button onClick={() => setIsOnlineUsersModalOpen(false)} className="hover:bg-slate-200 dark:hover:bg-slate-700 p-1 rounded-full"><X className="w-5 h-5 text-slate-500 dark:text-slate-400" /></button>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                      <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" placeholder="Filter users..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200" />
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                      {mockOnlineUsers.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors group">
                              <div className="flex items-center gap-3">
                                  <div className="relative">
                                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                          {user.name.charAt(0)}
                                      </div>
                                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${user.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.role} • {user.department}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${user.isOnline ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>
                                      {user.isOnline ? 'Online' : user.lastLogin}
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center">
                      <p className="text-xs text-slate-400">{mockOnlineUsers.filter(u => u.isOnline).length} Active Users</p>
                  </div>
              </div>
          </div>
      )}

      {/* User Profile Modal */}
      {isProfileModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-brand-600 to-purple-600 relative">
                      <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-1 rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="px-6 pb-6 relative">
                      {/* Avatar */}
                      <div className="absolute -top-12 left-6">
                          <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-lg relative group">
                              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative">
                                  {avatarUrl ? (
                                      <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                                  ) : (
                                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" className="w-full h-full object-cover" />
                                  )}
                                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                      <label className="text-white text-[10px] font-bold cursor-pointer hover:underline mb-1">
                                          Upload
                                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                      </label>
                                      <button onClick={handleTakePhoto} className="text-white text-[10px] font-bold hover:underline">
                                          Camera
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="mt-14 mb-6">
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{userName}</h2>
                          <div className="flex items-center gap-2 mt-1">
                              <span className="bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 text-xs font-bold px-2 py-0.5 rounded border border-brand-100 dark:border-brand-800">{userRole}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">Dubai HQ</span>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                              <UserCircle className="w-5 h-5 text-slate-400" />
                              <div className="flex-1">
                                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Account ID</p>
                                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">USR-{Math.floor(Math.random()*1000)}</p>
                              </div>
                          </div>
                          
                          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                              <p className="text-xs text-slate-400 mb-2 font-bold uppercase">Account Security</p>
                              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-xs text-blue-700 dark:text-blue-300 mb-3">
                                  To change your password or email, please contact the System Administrator.
                              </div>
                              <button 
                                onClick={() => alert("Admin notified of password reset request.")}
                                className="w-full py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 mb-2"
                              >
                                Request Password Reset
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
      />
    </div>
  );
};

export default Layout;
