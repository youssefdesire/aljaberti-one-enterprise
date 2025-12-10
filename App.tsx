
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AccountingView from './components/AccountingView';
import CRMBoard from './components/CRMBoard';
import InventoryModule from './components/InventoryModule';
import HRModule from './components/HRModule';
import ProjectsModule from './components/ProjectsModule';
import SettingsView from './components/SettingsView';
import HelpdeskModule from './components/HelpdeskModule';
import DocumentsModule from './components/DocumentsModule';
import CommunicationModule from './components/CommunicationModule';
import ClientsModule from './components/ClientsModule'; 
import ServiceRequestForm from './components/ServiceRequestForm';
import OperationsModule from './components/OperationsModule';
import EventsModule from './components/EventsModule';
import GeminiAssistant from './components/GeminiAssistant';
import LoginView from './components/LoginView';
import LandingPage from './components/LandingPage';
import { UserRole, PermissionItem } from './types';
import { ShieldAlert } from 'lucide-react';

// Enhanced Granular Permissions Matrix - Initial State
const initialPermissions: PermissionItem[] = [
  // Dashboard
  { id: 'p0', module: 'System', type: 'Access', name: 'Access Dashboard', admin: true, manager: true, user: false, viewer: false },

  // CRM Module
  { id: 'p1', module: 'CRM', type: 'Access', name: 'Access CRM Module', admin: true, manager: true, user: true, viewer: true },
  { id: 'p2', module: 'CRM', type: 'Feature', name: 'Create/Edit Deals', admin: true, manager: true, user: true, viewer: false },
  { id: 'p3', module: 'CRM', type: 'Data', name: 'View Deal Value', admin: true, manager: true, user: true, viewer: true },
  { id: 'p4', module: 'CRM', type: 'Critical', name: 'Delete Deals', admin: true, manager: false, user: false, viewer: false },
  
  // Finance Module
  { id: 'p5', module: 'Finance', type: 'Access', name: 'Access Finance Module', admin: true, manager: true, user: false, viewer: false },
  { id: 'p6', module: 'Finance', type: 'Feature', name: 'Create Invoices', admin: true, manager: true, user: false, viewer: false },
  { id: 'p7', module: 'Finance', type: 'Feature', name: 'Approve Expenses', admin: true, manager: true, user: false, viewer: false },
  { id: 'p8', module: 'Finance', type: 'Data', name: 'View Financial Reports', admin: true, manager: true, user: false, viewer: false },
  { id: 'p8b', module: 'Finance', type: 'Critical', name: 'Delete Invoices', admin: true, manager: false, user: false, viewer: false },

  // HR Module
  { id: 'p9', module: 'HR', type: 'Access', name: 'Access HR Module', admin: true, manager: true, user: true, viewer: false },
  { id: 'p11', module: 'HR', type: 'Feature', name: 'Edit Employee Records', admin: true, manager: true, user: false, viewer: false },
  { id: 'p12', module: 'HR', type: 'Feature', name: 'Process Payroll', admin: true, manager: false, user: false, viewer: false },
  { id: 'p10', module: 'HR', type: 'Data', name: 'View Salary Data', admin: true, manager: true, user: false, viewer: false },
  { id: 'p100', module: 'HR', type: 'Data', name: 'View Personal Contact Info', admin: true, manager: true, user: true, viewer: false },
  { id: 'p101', module: 'HR', type: 'Feature', name: 'Edit Compensation', admin: true, manager: false, user: false, viewer: false },
  { id: 'p12b', module: 'HR', type: 'Critical', name: 'Delete Employee Records', admin: true, manager: false, user: false, viewer: false },

  // Inventory Module
  { id: 'p13', module: 'Inventory', type: 'Access', name: 'Access Inventory', admin: true, manager: true, user: true, viewer: true },
  { id: 'p14', module: 'Inventory', type: 'Feature', name: 'Adjust Stock Levels', admin: true, manager: true, user: true, viewer: false },
  { id: 'p15', module: 'Inventory', type: 'Data', name: 'View Cost Prices', admin: true, manager: true, user: false, viewer: false },
  { id: 'p15b', module: 'Inventory', type: 'Critical', name: 'Delete Inventory Items', admin: true, manager: false, user: false, viewer: false },

  // Projects
  { id: 'p16', module: 'Projects', type: 'Access', name: 'Access Projects', admin: true, manager: true, user: true, viewer: true },
  { id: 'p17', module: 'Projects', type: 'Feature', name: 'Create Projects', admin: true, manager: true, user: false, viewer: false },
  { id: 'p18', module: 'Projects', type: 'Critical', name: 'Delete Projects', admin: true, manager: false, user: false, viewer: false },

  // Events
  { id: 'p30', module: 'Events', type: 'Access', name: 'Access Events', admin: true, manager: true, user: true, viewer: true },
  { id: 'p31', module: 'Events', type: 'Feature', name: 'Manage Events', admin: true, manager: true, user: true, viewer: false },

  // Operations
  { id: 'p27', module: 'Operations', type: 'Access', name: 'Access Operations', admin: true, manager: true, user: true, viewer: true },
  { id: 'p28', module: 'Operations', type: 'Feature', name: 'Manage Fleet', admin: true, manager: true, user: false, viewer: false },
  { id: 'p29', module: 'Operations', type: 'Feature', name: 'Manage Maintenance', admin: true, manager: true, user: true, viewer: false },

  // Clients
  { id: 'p21', module: 'Clients', type: 'Access', name: 'Access Clients', admin: true, manager: true, user: true, viewer: true },
  { id: 'p21b', module: 'Clients', type: 'Feature', name: 'Create/Edit Clients', admin: true, manager: true, user: true, viewer: false },
  { id: 'p21c', module: 'Clients', type: 'Critical', name: 'Delete Clients', admin: true, manager: false, user: false, viewer: false },

  // Service Requests
  { id: 'p26', module: 'Services', type: 'Access', name: 'Access Service Requests', admin: true, manager: true, user: true, viewer: true },

  // Documents
  { id: 'p23', module: 'Documents', type: 'Access', name: 'Access Documents', admin: true, manager: true, user: true, viewer: true },
  { id: 'p23b', module: 'Documents', type: 'Feature', name: 'Upload Files', admin: true, manager: true, user: true, viewer: false },
  { id: 'p23c', module: 'Documents', type: 'Critical', name: 'Delete Files', admin: true, manager: false, user: false, viewer: false },

  // Helpdesk
  { id: 'p22', module: 'Helpdesk', type: 'Access', name: 'Access Helpdesk', admin: true, manager: true, user: true, viewer: true },
  { id: 'p22b', module: 'Helpdesk', type: 'Feature', name: 'Manage Tickets', admin: true, manager: true, user: true, viewer: false },

  // Communication
  { id: 'p24', module: 'Communication', type: 'Access', name: 'Access Team Chat', admin: true, manager: true, user: true, viewer: true },

  // System
  { id: 'p19', module: 'System', type: 'Access', name: 'Access Settings', admin: true, manager: false, user: false, viewer: false },
  { id: 'p20', module: 'System', type: 'Critical', name: 'Manage Users & Permissions', admin: true, manager: false, user: false, viewer: false },
  { id: 'p25', module: 'System', type: 'Feature', name: 'Invite Users', admin: true, manager: true, user: false, viewer: false },
];

// Mapping nav IDs to Permission Names
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

const App: React.FC = () => {
  // Navigation State
  const [viewState, setViewState] = useState<'landing' | 'login' | 'app'>('landing');

  // Auth State
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.USER);
  const [currentUserName, setCurrentUserName] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [permissions, setPermissions] = useState<PermissionItem[]>(initialPermissions);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiInitialMessage, setAiInitialMessage] = useState('');

  const handleLogin = (role: UserRole, name: string) => {
    setCurrentUserRole(role);
    setCurrentUserName(name);
    setViewState('app');
    
    const roleKey = role === UserRole.ADMIN ? 'admin' : 
                    role === UserRole.MANAGER ? 'manager' : 
                    role === UserRole.USER ? 'user' : 'viewer';

    const hasDashboardAccess = permissions.find(p => p.name === 'Access Dashboard')?.[roleKey];
    if (hasDashboardAccess) {
        setActiveTab('dashboard');
    } else {
        const firstAccessible = Object.entries(navPermissionMap).find(([key, permName]) => {
            return permissions.find(p => p.name === permName)?.[roleKey];
        });
        if (firstAccessible) {
            setActiveTab(firstAccessible[0]);
        } else {
            setActiveTab('no-access');
        }
    }
  };

  const handleLogout = () => {
    setViewState('landing');
    setCurrentUserRole(UserRole.USER);
    setCurrentUserName('');
  };

  const handleOpenAI = (message?: string) => {
      if (message) setAiInitialMessage(message);
      else setAiInitialMessage('');
      setIsAIOpen(true);
  };

  const handleTogglePermission = (id: string, role: 'admin' | 'manager' | 'user' | 'viewer') => {
      setPermissions(prev => prev.map(perm => {
          if (perm.id === id) {
              return { ...perm, [role]: !perm[role] };
          }
          return perm;
      }));
  };

  const hasAccess = (permissionName: string) => {
      const perm = permissions.find(p => p.name === permissionName);
      if (!perm) return false;
      
      switch (currentUserRole) {
          case UserRole.ADMIN: return perm.admin;
          case UserRole.MANAGER: return perm.manager;
          case UserRole.USER: return perm.user;
          case UserRole.VIEWER: return perm.viewer;
          default: return false;
      }
  };

  // Helper passed to components to check specific feature permissions
  const checkPermission = (permissionName: string): boolean => {
      return hasAccess(permissionName);
  };

  const getContextSummary = () => {
    switch(activeTab) {
        case 'dashboard': 
            return `Executive Overview for ${currentUserName} (${currentUserRole}). Revenue 1.2M AED.`;
        case 'accounting': 
            return "Finance Module: VAT Period ending soon. Cash on hand 452k AED. 12 Overdue invoices totaling 89k AED.";
        case 'clients':
            return "Clients Registry: 154 Active corporate clients. Top client: Hilton JBR.";
        case 'service-request':
            return "Service Request Form: Users are drafting project scopes.";
        case 'crm': 
            return "Sales Pipeline: 5 active deals. Key opportunity: Hilton JBR Renovation (150k AED).";
        case 'inventory': 
            return "Inventory: 2405 SKUs. 15 Low stock alerts. Copper Cabling is critical.";
        case 'hr': 
            return "HR & Payroll: 142 Total employees. Next WPS payroll run on 28th May.";
        case 'projects':
            return "Projects: 3 Active projects. 'Warehouse Expansion' is delayed.";
        case 'events':
            return "Events: 2 Upcoming events. Annual Tech Summit is confirmed.";
        case 'operations':
            return "Operations: 3 Active sites. Fleet usage at 85%. 2 Maintenance requests pending.";
        case 'helpdesk':
            return "IT Support: 12 Open tickets. 3 Critical issues.";
        case 'communication':
            return "Team Chat: Active discussions in #general and #projects-alpha.";
        default: 
            return "General System Menu.";
    }
  };

  const renderContent = () => {
    const permissionName = navPermissionMap[activeTab];
    if (permissionName && !hasAccess(permissionName)) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <ShieldAlert className="w-16 h-16 mb-4 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-600">Access Restricted</h3>
                <p>You do not have permission to view this module.</p>
                <p className="text-xs mt-2">Contact your administrator to request access.</p>
            </div>
        );
    }

    if (activeTab === 'no-access') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <ShieldAlert className="w-16 h-16 mb-4 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-600">Account Pending</h3>
                <p>You do not have access to any modules yet.</p>
            </div>
        );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientsModule currentUserRole={currentUserRole} />;
      case 'service-request':
        return <ServiceRequestForm />;
      case 'crm':
        return <CRMBoard checkPermission={checkPermission} />;
      case 'projects':
        return <ProjectsModule currentUserRole={currentUserRole} currentUserName={currentUserName} checkPermission={checkPermission} />;
      case 'events':
        return <EventsModule checkPermission={checkPermission} currentUserRole={currentUserRole} />;
      case 'operations':
        return <OperationsModule checkPermission={checkPermission} />;
      case 'accounting':
        return <AccountingView onOpenAI={handleOpenAI} checkPermission={checkPermission} />;
      case 'inventory':
        return <InventoryModule checkPermission={checkPermission} />;
      case 'hr':
        return <HRModule checkPermission={checkPermission} />;
      case 'helpdesk':
        return <HelpdeskModule />;
      case 'documents':
        return <DocumentsModule currentUserRole={currentUserRole} currentUserName={currentUserName} />;
      case 'settings':
        return <SettingsView 
            currentUserRole={currentUserRole} 
            permissions={permissions} 
            onTogglePermission={handleTogglePermission} 
        />;
      case 'communication':
        return <CommunicationModule />;
      default:
        return <Dashboard />;
    }
  };

  // --- View Routing ---
  if (viewState === 'landing') {
      return <LandingPage onLoginClick={() => setViewState('login')} />;
  }

  if (viewState === 'login') {
      return <LoginView onLogin={handleLogin} onBack={() => setViewState('landing')} />;
  }

  // App View
  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onOpenAI={() => handleOpenAI()}
      userRole={currentUserRole}
      userName={currentUserName}
      onLogout={handleLogout}
      permissions={permissions}
    >
      {renderContent()}
      
      <GeminiAssistant 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
        contextSummary={getContextSummary()}
        initialMessage={aiInitialMessage}
      />
    </Layout>
  );
};

export default App;
