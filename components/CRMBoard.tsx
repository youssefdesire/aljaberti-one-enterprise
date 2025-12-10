
import React, { useState } from 'react';
import { Deal, DealStage, Contact, DealActivity, Quote } from '../types';
import { MoreHorizontal, Plus, Users, LayoutDashboard, Search, Filter, Phone, Mail, Building, X, Clock, Calendar, CheckCircle, ArrowRight, Send, Paperclip, FileText, Download, Trash2, Edit, RefreshCw } from 'lucide-react';

const mockDeals: Deal[] = [
  { id: '1', title: 'Hotel Renovation', company: 'Hilton JBR', value: 150000, stage: DealStage.QUALIFIED, probability: 40, owner: 'Ahmed', lastActivity: 'Call 2h ago' },
  { id: '2', title: 'Office Fitout', company: 'Tech Corp', value: 45000, stage: DealStage.NEGOTIATION, probability: 80, owner: 'Sara', lastActivity: 'Email 1d ago' },
  { id: '3', title: 'Villa Maintenance', company: 'Private Client', value: 12000, stage: DealStage.LEAD, probability: 20, owner: 'John', lastActivity: 'Created 3d ago' },
  { id: '4', title: 'Warehouse AC', company: 'Logistics LLC', value: 85000, stage: DealStage.PROPOSAL, probability: 60, owner: 'Ahmed', lastActivity: 'Proposal sent' },
  { id: '5', title: 'IT Infrastructure', company: 'Startup Hub', value: 250000, stage: DealStage.CLOSED_WON, probability: 100, owner: 'Sara', lastActivity: 'Won 1w ago' },
];

const mockActivities: DealActivity[] = [
  { id: 'a1', type: 'call', content: 'Discussed project scope with Facility Manager. Interested in eco-friendly options.', date: '2024-05-22 10:30 AM', user: 'Ahmed' },
  { id: 'a2', type: 'email', content: 'Sent updated quotation v2.3 based on feedback.', date: '2024-05-21 04:15 PM', user: 'Ahmed' },
  { id: 'a3', type: 'meeting', content: 'Site survey completed. Measurements taken.', date: '2024-05-18 09:00 AM', user: 'Site Team' },
];

const mockQuotes: Quote[] = [
    { id: 'Q-2024-005', dealId: '1', reference: 'QT-1001', amount: 150000, date: '2024-05-20', status: 'Sent' },
    { id: 'Q-2024-001', dealId: '4', reference: 'QT-1002', amount: 85000, date: '2024-05-22', status: 'Draft' }
];

const mockContacts: Contact[] = [
  { id: 'C1', name: 'Mohammed Ali', company: 'Hilton JBR', email: 'm.ali@hilton.com', phone: '+971 50 123 4567', type: 'Customer', lastContact: '2 days ago' },
  { id: 'C2', name: 'Sarah Jenkins', company: 'Tech Corp', email: 's.jenkins@techcorp.ae', phone: '+971 55 987 6543', type: 'Customer', lastContact: 'Yesterday' },
  { id: 'C3', name: 'Abdullah Khan', company: 'Logistics LLC', email: 'a.khan@logistics.ae', phone: '+971 52 333 4444', type: 'Partner', lastContact: '1 week ago' },
  { id: 'C4', name: 'John Doe', company: 'Startup Hub', email: 'john@startup.com', phone: '+971 56 111 2222', type: 'Customer', lastContact: '3 days ago' },
];

interface CRMBoardProps {
    checkPermission?: (name: string) => boolean;
}

const CRMModule: React.FC<CRMBoardProps> = ({ checkPermission }) => {
  const [viewMode, setViewMode] = useState<'pipeline' | 'contacts'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  
  // Advanced Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
      minValue: '',
      maxValue: '',
      owner: 'All',
      minProbability: 0
  });

  // Interaction State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // Local state for updates
  const [activities, setActivities] = useState<DealActivity[]>(mockActivities);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  
  // Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [newQuoteAmount, setNewQuoteAmount] = useState<string>('');

  const stages = Object.values(DealStage);

  // Permissions Checks
  const canViewValue = checkPermission ? checkPermission('View Deal Value') : true;
  const canCreateEdit = checkPermission ? checkPermission('Create/Edit Deals') : true;
  const canDelete = checkPermission ? checkPermission('Delete Deals') : true;

  const uniqueOwners = Array.from(new Set(mockDeals.map(d => d.owner)));

  const filteredDeals = mockDeals.filter(d => {
    const matchSearch = 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchMinVal = filters.minValue ? d.value >= parseFloat(filters.minValue) : true;
    const matchMaxVal = filters.maxValue ? d.value <= parseFloat(filters.maxValue) : true;
    const matchOwner = filters.owner === 'All' || d.owner === filters.owner;
    const matchProb = d.probability >= filters.minProbability;

    return matchSearch && matchMinVal && matchMaxVal && matchOwner && matchProb;
  });

  const filteredContacts = mockContacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearFilters = () => {
      setFilters({ minValue: '', maxValue: '', owner: 'All', minProbability: 0 });
      setSearchQuery('');
  };

  const handleSendEmail = () => {
      const newActivity: DealActivity = {
          id: `a-${Date.now()}`,
          type: 'email',
          content: `Email: ${emailSubject} - ${emailBody}`,
          date: 'Just now',
          user: 'You'
      };
      setActivities([newActivity, ...activities]);
      setIsEmailModalOpen(false);
      setEmailSubject('');
      setEmailBody('');
  };

  const handleCreateQuote = () => {
      if (!selectedDeal || !newQuoteAmount) return;
      const newQuote: Quote = {
          id: `Q-${Date.now()}`,
          dealId: selectedDeal.id,
          reference: `QT-${1000 + quotes.length + 1}`,
          amount: parseFloat(newQuoteAmount),
          date: new Date().toISOString().split('T')[0],
          status: 'Draft'
      };
      setQuotes([newQuote, ...quotes]);
      setNewQuoteAmount('');
      setIsQuoteModalOpen(false);
  };

  const dealQuotes = selectedDeal ? quotes.filter(q => q.dealId === selectedDeal.id) : [];

  return (
    <div className="h-full flex flex-col space-y-4 text-slate-900 dark:text-slate-100">
      {/* Toolbar */}
      <div className="flex flex-col">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center z-10 relative">
            <div className="flex gap-4 items-center">
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('pipeline')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'pipeline' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <LayoutDashboard className="w-4 h-4" /> Pipeline
                </button>
                <button 
                    onClick={() => setViewMode('contacts')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'contacts' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Users className="w-4 h-4" /> Contacts
                </button>
            </div>
            
            <div className="relative hidden md:block group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500" />
                <input 
                    type="text" 
                    placeholder={viewMode === 'pipeline' ? "Filter by name, company, owner..." : "Search contacts..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm w-72 focus:ring-1 focus:ring-brand-500 outline-none transition-all" 
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
            {viewMode === 'pipeline' && (
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-1.5 border rounded-lg transition-colors ${isFilterOpen ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                    title="Advanced Filters"
                >
                    <Filter className="w-4 h-4" />
                </button>
            )}
            </div>
            {canCreateEdit && (
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20">
                    <Plus className="w-4 h-4" /> {viewMode === 'pipeline' ? 'New Deal' : 'Add Contact'}
                </button>
            )}
        </div>

        {/* Filter Panel */}
        {isFilterOpen && viewMode === 'pipeline' && (
            <div className="mt-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Owner</label>
                    <select 
                        value={filters.owner}
                        onChange={(e) => setFilters({...filters, owner: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-slate-50"
                    >
                        <option value="All">All Owners</option>
                        {uniqueOwners.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deal Value Range</label>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            placeholder="Min" 
                            value={filters.minValue} 
                            onChange={(e) => setFilters({...filters, minValue: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs" 
                        />
                        <input 
                            type="number" 
                            placeholder="Max" 
                            value={filters.maxValue} 
                            onChange={(e) => setFilters({...filters, maxValue: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs" 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Min Probability</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="range" 
                            min="0" max="100" step="10"
                            value={filters.minProbability} 
                            onChange={(e) => setFilters({...filters, minProbability: parseInt(e.target.value)})}
                            className="w-full" 
                        />
                        <span className="text-xs font-bold text-slate-700 w-8">{filters.minProbability}%</span>
                    </div>
                </div>
                <div className="flex items-end">
                    <button 
                        onClick={clearFilters}
                        className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 hover:text-rose-600 transition flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-3 h-3" /> Reset Filters
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'pipeline' ? (
          <div className="h-full overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-4 min-w-[1200px] h-full">
              {stages.map((stage) => {
                const dealsInStage = filteredDeals.filter(d => d.stage === stage);
                const totalValue = dealsInStage.reduce((acc, curr) => acc + curr.value, 0);

                return (
                  <div key={stage} className="flex-1 min-w-[280px] bg-slate-100/80 rounded-xl p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{stage}</h3>
                      <span className="bg-white text-slate-500 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">
                        {dealsInStage.length}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mb-4 font-medium border-b border-slate-200 pb-2">
                      Total: AED {canViewValue ? totalValue.toLocaleString() : '****'}
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                      {dealsInStage.map(deal => (
                        <div 
                          key={deal.id} 
                          onClick={() => setSelectedDeal(deal)}
                          className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group relative hover:border-brand-300"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">
                              {deal.company}
                            </span>
                            {canCreateEdit && (
                                <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            )}
                          </div>
                          <h4 className="font-semibold text-slate-800 mb-2">{deal.title}</h4>
                          
                          {/* Probability Bar */}
                          <div className="mb-3">
                              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                  <span>Probability</span>
                                  <span>{deal.probability}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${deal.probability > 75 ? 'bg-emerald-500' : deal.probability > 40 ? 'bg-brand-500' : 'bg-amber-500'}`} 
                                    style={{width: `${deal.probability}%`}}
                                  ></div>
                              </div>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                            <span className="text-sm font-bold text-slate-700">AED {canViewValue ? deal.value.toLocaleString() : '****'}</span>
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-bold border border-white" title={deal.owner}>
                              {deal.owner.charAt(0)}
                            </div>
                          </div>
                          {deal.lastActivity && (
                             <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {deal.lastActivity}
                             </p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {canCreateEdit && (
                        <button className="mt-3 w-full py-2 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-slate-300 border-dashed">
                            <Plus className="w-4 h-4 mr-2" /> Add Deal
                        </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
             <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Last Contact</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                              {contact.name.charAt(0)}
                           </div>
                           <span className="font-bold text-slate-800 text-sm">{contact.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                        <Building className="w-3 h-3 text-slate-400" />
                        {contact.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                         <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {contact.email}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                         <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {contact.phone}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${contact.type === 'Customer' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                           {contact.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{contact.lastContact}</td>
                      <td className="px-6 py-4 text-center">
                        {canCreateEdit && (
                            <button className="text-slate-400 hover:text-brand-600 transition">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </div>
        )}
      </div>

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full md:w-[600px] bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
                <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50 sticky top-0 z-10">
                    <div>
                        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded mb-2 inline-block">
                           {selectedDeal.company}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-800">{selectedDeal.title}</h2>
                    </div>
                    <div className="flex gap-2">
                        {canDelete && (
                            <button onClick={() => alert("Delete Deal")} className="p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-full">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                        <button 
                           onClick={() => setSelectedDeal(null)}
                           className="p-1 hover:bg-slate-200 rounded-full"
                        >
                           <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6 space-y-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold">Value</p>
                            <p className="text-2xl font-bold text-slate-800">AED {canViewValue ? selectedDeal.value.toLocaleString() : '****'}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold">Probability</p>
                            <p className="text-2xl font-bold text-slate-800">{selectedDeal.probability}%</p>
                        </div>
                    </div>

                    {/* Stage Progress */}
                    <div>
                       <p className="text-sm font-bold text-slate-700 mb-2">Deal Stage</p>
                       <div className="flex items-center gap-1">
                          {stages.map((s, idx) => {
                             const currentIdx = stages.indexOf(selectedDeal.stage);
                             const isCompleted = idx <= currentIdx;
                             const isCurrent = idx === currentIdx;
                             
                             return (
                                <div key={s} className={`h-2 flex-1 rounded-full ${isCompleted ? 'bg-brand-500' : 'bg-slate-200'} ${isCurrent ? 'ring-2 ring-brand-200' : ''}`} title={s}></div>
                             );
                          })}
                       </div>
                       <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                          <span>Lead</span>
                          <span className="text-brand-600 font-bold">{selectedDeal.stage}</span>
                          <span>Closed</span>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                       <button 
                            onClick={() => setIsEmailModalOpen(true)}
                            className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                       >
                          <Mail className="w-4 h-4" /> Email
                       </button>
                       {canCreateEdit && (
                           <>
                               <button className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20">
                                  Won
                               </button>
                               <button className="flex-1 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/20">
                                  Move Stage
                               </button>
                           </>
                       )}
                    </div>

                    {/* Quotes Section (Functional) */}
                    <div>
                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-brand-600" /> Quotes & Proposals
                            </h3>
                            {canCreateEdit && (
                                <button 
                                    onClick={() => setIsQuoteModalOpen(true)}
                                    className="text-xs text-brand-600 font-bold bg-brand-50 px-2 py-1 rounded hover:bg-brand-100 transition"
                                >
                                    + New Quote
                                </button>
                            )}
                        </div>
                        {dealQuotes.length > 0 ? (
                            <div className="space-y-3">
                                {dealQuotes.map(quote => (
                                    <div key={quote.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-300 transition cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{quote.reference}</p>
                                                <p className="text-xs text-slate-400">{quote.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-800">AED {canViewValue ? quote.amount.toLocaleString() : '****'}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${quote.status === 'Sent' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {quote.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                <p className="text-xs text-slate-400">No quotes created yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Activity Feed */}
                    <div>
                       <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                          <h3 className="font-bold text-slate-800">Activity History</h3>
                          {canCreateEdit && (
                              <button className="text-xs text-brand-600 font-medium flex items-center gap-1">
                                 <Plus className="w-3 h-3" /> Add Note
                              </button>
                          )}
                       </div>
                       <div className="relative border-l-2 border-slate-100 pl-4 space-y-6">
                          {activities.map(activity => (
                             <div key={activity.id} className="relative">
                                <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 border-white ${
                                   activity.type === 'call' ? 'bg-blue-400' : 
                                   activity.type === 'email' ? 'bg-purple-400' : 'bg-amber-400'
                                }`}></div>
                                <div className="flex justify-between items-start mb-1">
                                   <p className="text-xs font-bold text-slate-700 uppercase">{activity.type}</p>
                                   <span className="text-[10px] text-slate-400">{activity.date}</span>
                                </div>
                                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                                   {activity.content}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">by {activity.user}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Email Composer Modal */}
      {isEmailModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-brand-500" /> Compose Email
                      </h3>
                      <button onClick={() => setIsEmailModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To</label>
                          <div className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-50 text-slate-700">
                              contact@{selectedDeal?.company.toLowerCase().replace(/\s/g, '')}.com
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                          <input 
                            type="text" 
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="e.g. Follow up on proposal"
                            className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                           />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                          <textarea 
                            rows={5}
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            placeholder="Write your message here..."
                            className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
                           />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                          <button className="text-slate-400 hover:text-brand-600">
                              <Paperclip className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={handleSendEmail}
                            disabled={!emailSubject || !emailBody}
                            className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition disabled:opacity-50"
                          >
                              <Send className="w-4 h-4" /> Send
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* New Quote Modal */}
      {isQuoteModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800">Create Quote</h3>
                      <button onClick={() => setIsQuoteModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quote Amount (AED)</label>
                          <input 
                            type="number" 
                            value={newQuoteAmount}
                            onChange={(e) => setNewQuoteAmount(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                            placeholder="0.00"
                          />
                      </div>
                      <button 
                        onClick={handleCreateQuote}
                        disabled={!newQuoteAmount}
                        className="w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition disabled:opacity-50"
                      >
                          Create Draft
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CRMModule;
