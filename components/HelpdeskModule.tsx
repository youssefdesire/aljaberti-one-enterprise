
import React, { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus, TicketMessage } from '../types';
import { LifeBuoy, AlertCircle, CheckCircle, Clock, Filter, Search, Plus, MoreHorizontal, ArrowLeft, Send, User, MessageCircle, X, Save } from 'lucide-react';

const mockTickets: Ticket[] = [
  { id: 'TKT-2024-001', subject: 'ERP Login Issue', requester: 'Sarah Jones', priority: TicketPriority.HIGH, status: TicketStatus.OPEN, createdDate: '2024-05-20', assignedTo: 'IT Support', department: 'Finance' },
  { id: 'TKT-2024-002', subject: 'Printer Malfunction', requester: 'Ahmed M.', priority: TicketPriority.MEDIUM, status: TicketStatus.IN_PROGRESS, createdDate: '2024-05-19', assignedTo: 'Facilities', department: 'Management' },
  { id: 'TKT-2024-003', subject: 'Payroll Discrepancy', requester: 'John Smith', priority: TicketPriority.CRITICAL, status: TicketStatus.OPEN, createdDate: '2024-05-21', assignedTo: 'HR Admin', department: 'Sales' },
  { id: 'TKT-2024-004', subject: 'New Laptop Request', requester: 'Rajesh Kumar', priority: TicketPriority.LOW, status: TicketStatus.RESOLVED, createdDate: '2024-05-15', assignedTo: 'IT Procurement', department: 'Projects' },
  { id: 'TKT-2024-005', subject: 'Update Tax Settings', requester: 'Finance Team', priority: TicketPriority.HIGH, status: TicketStatus.IN_PROGRESS, createdDate: '2024-05-18', assignedTo: 'Sys Admin', department: 'Finance' },
];

const mockMessages: TicketMessage[] = [
    { id: 'MSG-001', ticketId: 'TKT-2024-001', sender: 'Sarah Jones', message: 'I cannot login to the ERP. It says invalid password even though I reset it.', timestamp: '2024-05-20 09:30 AM', isInternal: false },
    { id: 'MSG-002', ticketId: 'TKT-2024-001', sender: 'IT Support', message: 'Hi Sarah, checking the logs now. Did you use the temporary password sent to your email?', timestamp: '2024-05-20 09:45 AM', isInternal: false },
    { id: 'MSG-003', ticketId: 'TKT-2024-001', sender: 'IT Support', message: 'Internal Note: AD Sync seems to be lagging.', timestamp: '2024-05-20 09:50 AM', isInternal: true },
];

const getPriorityStyle = (priority: TicketPriority) => {
  switch (priority) {
    case TicketPriority.CRITICAL: return 'bg-rose-100 text-rose-700 border-rose-200';
    case TicketPriority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
    case TicketPriority.MEDIUM: return 'bg-blue-100 text-blue-700 border-blue-200';
    case TicketPriority.LOW: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const HelpdeskModule: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>(mockMessages);
  const [replyText, setReplyText] = useState('');
  
  // Create Ticket State
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
      subject: '',
      priority: TicketPriority.MEDIUM,
      department: 'General',
      description: ''
  });

  const handleSendMessage = () => {
      if (!replyText.trim() || !selectedTicket) return;
      const newMessage: TicketMessage = {
          id: `MSG-${Date.now()}`,
          ticketId: selectedTicket.id,
          sender: 'You (Admin)',
          message: replyText,
          timestamp: new Date().toLocaleString(),
          isInternal: false
      };
      setMessages([...messages, newMessage]);
      setReplyText('');
  };

  const handleCreateTicket = () => {
      const ticket: Ticket = {
          id: `TKT-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, '0')}`,
          subject: newTicket.subject,
          requester: 'Current User', // Mock
          priority: newTicket.priority,
          status: TicketStatus.OPEN,
          createdDate: new Date().toISOString().split('T')[0],
          assignedTo: 'Unassigned',
          department: newTicket.department
      };
      
      // Auto-add description as first message
      if (newTicket.description) {
          const firstMsg: TicketMessage = {
              id: `MSG-${Date.now()}`,
              ticketId: ticket.id,
              sender: 'Current User',
              message: newTicket.description,
              timestamp: new Date().toLocaleString(),
              isInternal: false
          };
          setMessages([...messages, firstMsg]);
      }

      setTickets([ticket, ...tickets]);
      setIsNewTicketOpen(false);
      setNewTicket({ subject: '', priority: TicketPriority.MEDIUM, department: 'General', description: '' });
  };

  const currentMessages = selectedTicket ? messages.filter(m => m.ticketId === selectedTicket.id) : [];

  if (selectedTicket) {
      return (
          <div className="h-[calc(100vh-180px)] flex flex-col animate-in slide-in-from-right duration-300">
              <div className="mb-4">
                <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition">
                    <ArrowLeft className="w-4 h-4" /> Back to Tickets
                </button>
              </div>

              <div className="flex-1 flex gap-6 overflow-hidden">
                  {/* Ticket Details (Left) */}
                  <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                      <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                          <div>
                              <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityStyle(selectedTicket.priority)}`}>
                                      {selectedTicket.priority}
                                  </span>
                                  <span className="text-xs text-slate-400 font-mono">#{selectedTicket.id}</span>
                              </div>
                              <h2 className="text-xl font-bold text-slate-800">{selectedTicket.subject}</h2>
                          </div>
                          <div className="flex items-center gap-2">
                             <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 font-medium">
                                 <option>Open</option>
                                 <option>In Progress</option>
                                 <option>Resolved</option>
                                 <option>Closed</option>
                             </select>
                          </div>
                      </div>
                      
                      {/* Conversation */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                          {currentMessages.map(msg => (
                              <div key={msg.id} className={`flex gap-4 ${msg.sender === 'You (Admin)' ? 'flex-row-reverse' : ''}`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${msg.isInternal ? 'bg-amber-100 text-amber-700' : 'bg-white border border-slate-200 text-slate-600'}`}>
                                      {msg.isInternal ? <AlertCircle className="w-4 h-4" /> : msg.sender.charAt(0)}
                                  </div>
                                  <div className={`max-w-[80%] ${msg.sender === 'You (Admin)' ? 'items-end' : 'items-start'}`}>
                                      <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-bold text-slate-700">{msg.sender}</span>
                                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                                          {msg.isInternal && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1 rounded">Internal Note</span>}
                                      </div>
                                      <div className={`p-4 rounded-xl text-sm leading-relaxed shadow-sm ${
                                          msg.isInternal ? 'bg-amber-50 border border-amber-100 text-amber-900' :
                                          msg.sender === 'You (Admin)' ? 'bg-brand-600 text-white rounded-tr-none' : 
                                          'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                      }`}>
                                          {msg.message}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Reply Box */}
                      <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
                          <div className="relative">
                              <textarea 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                                className="w-full border border-slate-300 rounded-xl p-3 pr-12 focus:ring-2 focus:ring-brand-500 outline-none resize-none text-sm"
                                rows={3}
                              />
                              <button 
                                onClick={handleSendMessage}
                                disabled={!replyText.trim()}
                                className="absolute bottom-3 right-3 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition"
                              >
                                  <Send className="w-4 h-4" />
                              </button>
                          </div>
                          <div className="flex gap-2 mt-2">
                              <button className="text-xs font-bold text-slate-500 hover:text-brand-600 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Add Internal Note
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Sidebar (Right) */}
                  <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
                      <h3 className="font-bold text-slate-800 mb-4">Ticket Info</h3>
                      <div className="space-y-4">
                          <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">Requester</p>
                              <div className="flex items-center gap-2 mt-1">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs"><User className="w-3 h-3" /></div>
                                  <span className="text-sm font-medium text-slate-700">{selectedTicket.requester}</span>
                              </div>
                          </div>
                          <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">Department</p>
                              <p className="text-sm font-medium text-slate-700 mt-1">{selectedTicket.department}</p>
                          </div>
                          <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">Assigned To</p>
                              <select className="w-full mt-1 border border-slate-200 rounded p-1.5 text-sm">
                                  <option>{selectedTicket.assignedTo}</option>
                                  <option>Unassigned</option>
                              </select>
                          </div>
                          <hr className="border-slate-100" />
                          <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">SLA Timer</p>
                              <p className="text-sm font-mono font-bold text-rose-600 mt-1">Due in 4h 30m</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Open Tickets</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{tickets.filter(t => t.status === TicketStatus.OPEN).length}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg"><LifeBuoy className="w-5 h-5 text-blue-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Critical</p>
                <h3 className="text-2xl font-bold text-rose-600 mt-1">{tickets.filter(t => t.priority === TicketPriority.CRITICAL).length}</h3>
            </div>
            <div className="bg-rose-50 p-3 rounded-lg"><AlertCircle className="w-5 h-5 text-rose-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Avg Response</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">2.4h</h3>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg"><Clock className="w-5 h-5 text-emerald-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Resolved Today</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">8</h3>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg"><CheckCircle className="w-5 h-5 text-purple-600"/></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Support Tickets</h2>
            <p className="text-sm text-slate-500">Internal helpdesk and client support requests.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search tickets..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-64" />
            </div>
            <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" />
            </button>
            <button 
                onClick={() => setIsNewTicketOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
            >
                <Plus className="w-4 h-4" /> New Ticket
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Ticket Details</th>
                <th className="px-6 py-4">Requester</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {tickets.map(ticket => (
                    <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 text-sm group-hover:text-brand-600">{ticket.subject}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">{ticket.id} • {ticket.createdDate}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-700">{ticket.requester}</div>
                            <div className="text-xs text-slate-500">{ticket.department}</div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityStyle(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${ticket.status === 'Open' ? 'bg-blue-500' : ticket.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span className="text-sm text-slate-700">{ticket.status}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{ticket.assignedTo}</td>
                        <td className="px-6 py-4 text-center">
                            <button className="text-slate-400 hover:text-brand-600 p-1 hover:bg-slate-100 rounded transition">
                                <MessageCircle className="w-5 h-5" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <LifeBuoy className="w-5 h-5 text-brand-600" /> Create Support Ticket
                      </h3>
                      <button onClick={() => setIsNewTicketOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                          <input 
                            type="text" 
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                            placeholder="e.g. System not accepting my password"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                              <select 
                                value={newTicket.priority}
                                onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as TicketPriority})}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                              >
                                  {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                              <select 
                                value={newTicket.department}
                                onChange={(e) => setNewTicket({...newTicket, department: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                              >
                                  <option>General</option>
                                  <option>Finance</option>
                                  <option>HR</option>
                                  <option>Sales</option>
                                  <option>IT</option>
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                          <textarea 
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none h-32 resize-none" 
                            placeholder="Please describe your issue in detail..."
                          />
                      </div>
                      <div className="pt-2">
                          <button 
                            onClick={handleCreateTicket}
                            disabled={!newTicket.subject || !newTicket.description}
                            className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/20 disabled:opacity-50"
                          >
                              Submit Ticket
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default HelpdeskModule;
