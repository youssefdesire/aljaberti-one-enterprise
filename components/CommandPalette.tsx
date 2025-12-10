
import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, LayoutDashboard, Users, FileText, Box, CheckSquare, Calendar, HardHat, Briefcase, LifeBuoy, FolderOpen, Settings, User } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

// Mock Data to Index
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', group: 'Modules', icon: LayoutDashboard },
  { id: 'crm', label: 'CRM & Sales', group: 'Modules', icon: Users },
  { id: 'accounting', label: 'Finance & Accounting', group: 'Modules', icon: FileText },
  { id: 'inventory', label: 'Inventory Management', group: 'Modules', icon: Box },
  { id: 'projects', label: 'Projects', group: 'Modules', icon: CheckSquare },
  { id: 'events', label: 'Events', group: 'Modules', icon: Calendar },
  { id: 'operations', label: 'Operations', group: 'Modules', icon: HardHat },
  { id: 'hr', label: 'HR & Payroll', group: 'Modules', icon: Briefcase },
  { id: 'helpdesk', label: 'Helpdesk', group: 'Modules', icon: LifeBuoy },
  { id: 'documents', label: 'Documents', group: 'Modules', icon: FolderOpen },
  { id: 'settings', label: 'Settings', group: 'Modules', icon: Settings },
];

const quickActions = [
  { id: 'act-invoice', label: 'Create New Invoice', group: 'Actions', icon: PlusIcon, action: 'accounting' },
  { id: 'act-emp', label: 'Add Employee', group: 'Actions', icon: PlusIcon, action: 'hr' },
  { id: 'act-task', label: 'New Project Task', group: 'Actions', icon: PlusIcon, action: 'projects' },
];

function PlusIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = [
      ...navigationItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
      ...quickActions.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item: any) => {
      if (item.group === 'Modules') {
          onNavigate(item.id);
      } else if (item.group === 'Actions') {
          onNavigate(item.action);
          // In a real app, this would pass a state param to open the modal directly
      }
      onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh] px-4 text-slate-900 dark:text-slate-100" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            className="w-full py-4 px-3 text-lg bg-transparent border-none outline-none text-slate-700 dark:text-slate-100 placeholder-slate-400"
            placeholder="Type a command or search..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <div className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">ESC</div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No results found.
            </div>
          ) : (
            <div className="space-y-1 px-2">
              {filteredItems.map((item, index) => (
                <button
                  key={`${item.group}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm text-left transition-colors ${
                    index === selectedIndex 
                      ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${index === selectedIndex ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {index === selectedIndex && <ArrowRight className="w-4 h-4 text-brand-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-[10px] text-slate-400">
            <span>Aljaberti ONE Command</span>
            <div className="flex gap-3">
                <span className="flex items-center gap-1"><span className="bg-white dark:bg-slate-800 border rounded px-1">↑↓</span> to navigate</span>
                <span className="flex items-center gap-1"><span className="bg-white dark:bg-slate-800 border rounded px-1">↵</span> to select</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
