
import React, { useState } from 'react';
import { Client, ClientContact, UserRole } from '../types';
import { 
  Building, MapPin, Globe, Phone, Mail, Search, Filter, Plus, 
  MoreHorizontal, CreditCard, Users, FileText, CheckCircle, XCircle, 
  Edit, Trash2, X, Download, Upload, Briefcase, TrendingUp, RefreshCw
} from 'lucide-react';

// Extensive list of Countries
const COUNTRIES = [
  "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain",
  "United States", "United Kingdom", "Canada", "Germany", "France", "India", "Pakistan", 
  "China", "Japan", "Australia", "Singapore", "Egypt", "Jordan", "Lebanon"
];

// Major Cities (Focused on UAE + Regional/Global hubs)
const CITIES: Record<string, string[]> = {
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Al Ain"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Chennai"],
  // Default/Generic fallback handled in logic
};

const SERVICE_TYPES = [
    "General Contracting",
    "Construction Management",
    "Consultancy Services",
    "Interior Design & Fitout",
    "Facility Maintenance",
    "MEP Works",
    "IT Solutions",
    "Supply Chain Management"
];

const mockClients: Client[] = [
  { 
    id: 'CUST-001', code: 'C-101', name: 'Hilton Hotels JBR', industry: 'Hospitality', type: 'Corporate', status: 'Active', serviceType: 'Facility Maintenance',
    email: 'accounts@hiltonjbr.com', phone: '+971 4 123 4567', website: 'www.hilton.com',
    address: 'The Walk, JBR, Dubai, UAE', city: 'Dubai', country: 'United Arab Emirates',
    trn: '100-2233-4455-667', currency: 'AED', paymentTerms: 'Net 30', creditLimit: 500000, outstandingBalance: 45000,
    accountManager: 'Ahmed Al-Mansouri', since: '2022-01-15',
    contacts: [
      { id: 'CC-1', name: 'David Smith', role: 'Director of Ops', email: 'david@hilton.com', phone: '+971 50 111 2222', isPrimary: true },
      { id: 'CC-2', name: 'Sarah Connor', role: 'Finance Manager', email: 'finance@hilton.com', phone: '+971 50 333 4444', isPrimary: false }
    ],
    notes: 'Key account. Requires monthly site visits.'
  },
  { 
    id: 'CUST-002', code: 'C-102', name: 'Tech Solutions LLC', industry: 'Technology', type: 'Corporate', status: 'Active', serviceType: 'IT Solutions',
    email: 'info@techsol.ae', phone: '+971 4 987 6543', website: 'www.techsol.ae',
    address: 'Office 204, DIC, Dubai', city: 'Dubai', country: 'United Arab Emirates',
    trn: '100-9988-7766-554', currency: 'AED', paymentTerms: 'Immediate', creditLimit: 50000, outstandingBalance: 0,
    accountManager: 'Sarah Jones', since: '2023-05-10',
    contacts: [
      { id: 'CC-3', name: 'Rajesh Koothrappali', role: 'CTO', email: 'raj@techsol.ae', phone: '+971 55 555 5555', isPrimary: true }
    ]
  },
  { 
    id: 'CUST-003', code: 'C-103', name: 'Ministry of Education', industry: 'Government', type: 'Government', status: 'Active', serviceType: 'Consultancy Services',
    email: 'procurement@moe.gov.ae', phone: '+971 4 222 3333', website: 'www.moe.gov.ae',
    address: 'Al Nahda, Dubai', city: 'Dubai', country: 'United Arab Emirates',
    trn: '100-1111-2222-333', currency: 'AED', paymentTerms: 'Net 60', creditLimit: 1000000, outstandingBalance: 120000,
    accountManager: 'Ahmed Al-Mansouri', since: '2021-11-20',
    contacts: [
      { id: 'CC-4', name: 'Fatima Al-Kaabi', role: 'Procurement Officer', email: 'fatima@moe.gov.ae', phone: '+971 50 999 8888', isPrimary: true }
    ]
  },
];

interface ClientsModuleProps {
    currentUserRole?: UserRole;
}

const ClientsModule: React.FC<ClientsModuleProps> = ({ currentUserRole = UserRole.USER }) => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
      industry: 'All',
      type: 'All',
      country: 'All',
      status: 'All'
  });
  
  // Detailed Form State
  const [activeTab, setActiveTab] = useState<'identity' | 'people' | 'financials' | 'system'>('identity');
  const [formData, setFormData] = useState<Partial<Client>>({});

  // Helper to handle form updates
  const updateForm = (field: keyof Client, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenAddModal = () => {
      setEditingClient(null);
      setFormData({ 
          status: 'Active', type: 'Corporate', country: 'United Arab Emirates', city: 'Dubai', 
          currency: 'AED', paymentTerms: 'Net 30', contacts: [],
          since: new Date().toISOString().split('T')[0]
      });
      setActiveTab('identity');
      setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
      setEditingClient(client);
      setFormData(JSON.parse(JSON.stringify(client))); // Deep copy
      setActiveTab('identity');
      setIsModalOpen(true);
  };

  const handleSave = () => {
      if (editingClient) {
          setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...formData } as Client : c));
      } else {
          const newClient: Client = {
              ...formData as Client,
              id: `CUST-${String(clients.length + 1).padStart(3, '0')}`,
              code: formData.code || `C-${100 + clients.length + 1}`,
              outstandingBalance: 0
          };
          setClients([...clients, newClient]);
      }
      setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if (currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.MANAGER) {
          alert("Permission Denied.");
          return;
      }
      if(window.confirm("Are you sure you want to delete this client?")) {
          setClients(clients.filter(c => c.id !== id));
      }
  };

  // Filter Logic
  const filteredClients = clients.filter(c => {
      const matchSearch = 
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchIndustry = filters.industry === 'All' || c.industry === filters.industry;
      const matchType = filters.type === 'All' || c.type === filters.type;
      const matchCountry = filters.country === 'All' || c.country === filters.country;
      const matchStatus = filters.status === 'All' || c.status === filters.status;

      return matchSearch && matchIndustry && matchType && matchCountry && matchStatus;
  });

  const clearFilters = () => {
      setFilters({ industry: 'All', type: 'All', country: 'All', status: 'All' });
      setSearchTerm('');
  };

  const uniqueIndustries = Array.from(new Set(clients.map(c => c.industry)));
  const uniqueCountries = Array.from(new Set(clients.map(c => c.country)));

  // Sub-component for adding contacts in modal
  const addContact = () => {
      const newContact: ClientContact = {
          id: `NEW-${Date.now()}`, name: '', role: '', email: '', phone: '', isPrimary: false
      };
      setFormData(prev => ({ ...prev, contacts: [...(prev.contacts || []), newContact] }));
  };

  const updateContact = (index: number, field: keyof ClientContact, value: any) => {
      const updatedContacts = [...(formData.contacts || [])];
      updatedContacts[index] = { ...updatedContacts[index], [field]: value };
      setFormData(prev => ({ ...prev, contacts: updatedContacts }));
  };

  const removeContact = (index: number) => {
      const updatedContacts = [...(formData.contacts || [])];
      updatedContacts.splice(index, 1);
      setFormData(prev => ({ ...prev, contacts: updatedContacts }));
  };

  // Helper to get cities based on selected country
  const availableCities = formData.country && CITIES[formData.country] ? CITIES[formData.country] : [];

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Total Clients</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{clients.length}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg"><Building className="w-5 h-5 text-blue-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Active Accounts</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1">{clients.filter(c => c.status === 'Active').length}</h3>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Total Receivables</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">AED {(clients.reduce((acc, c) => acc + c.outstandingBalance, 0) / 1000).toFixed(0)}k</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg"><CreditCard className="w-5 h-5 text-amber-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Government</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{clients.filter(c => c.type === 'Government').length}</h3>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg"><Briefcase className="w-5 h-5 text-purple-600"/></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col border-b border-slate-200">
            <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
               <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-600" /> Client Registry
               </h2>
               <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                        type="text" 
                        placeholder="Search clients..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-64" 
                     />
                  </div>
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 border rounded-lg transition-colors ${isFilterOpen ? 'bg-brand-50 border-brand-200 text-brand-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                    title="Filter"
                  >
                     <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
                     <Download className="w-4 h-4" />
                  </button>
                  {(currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.MANAGER) && (
                      <button 
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
                      >
                         <Plus className="w-4 h-4" /> Add Client
                      </button>
                  )}
               </div>
            </div>

            {/* Advanced Filters */}
            {isFilterOpen && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Industry</label>
                        <select 
                            value={filters.industry}
                            onChange={(e) => setFilters({...filters, industry: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        >
                            <option value="All">All Industries</option>
                            {uniqueIndustries.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client Type</label>
                        <select 
                            value={filters.type}
                            onChange={(e) => setFilters({...filters, type: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        >
                            <option value="All">All Types</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Government">Government</option>
                            <option value="Individual">Individual</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Country</label>
                        <select 
                            value={filters.country}
                            onChange={(e) => setFilters({...filters, country: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        >
                            <option value="All">All Countries</option>
                            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                        <select 
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Prospect">Prospect</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={clearFilters}
                            className="w-full py-2 bg-white border border-slate-300 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 hover:text-rose-600 transition flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-3 h-3" /> Reset Filters
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                     <th className="px-6 py-4">Client Name</th>
                     <th className="px-6 py-4">Contact Info</th>
                     <th className="px-6 py-4">Service & Account</th>
                     <th className="px-6 py-4">Balance</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredClients.map(client => (
                      <tr key={client.id} className="hover:bg-slate-50 group transition-colors">
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                      {client.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                      <div className="font-bold text-slate-800 text-sm group-hover:text-brand-600 transition-colors">{client.name}</div>
                                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                          <span className="font-mono">{client.code}</span>
                                          <span>•</span>
                                          <span>{client.city}, {client.country}</span>
                                      </div>
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                              <div className="text-sm text-slate-700 flex items-center gap-2">
                                  <Mail className="w-3 h-3 text-slate-400" /> {client.email}
                              </div>
                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                  <Phone className="w-3 h-3 text-slate-400" /> {client.phone}
                              </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                              <div className="font-medium text-slate-700">{client.serviceType || 'General'}</div>
                              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                  <span>Mgr:</span>
                                  {client.accountManager}
                              </div>
                          </td>
                          <td className="px-6 py-4">
                              <div className={`text-sm font-bold font-mono ${client.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                  AED {client.outstandingBalance.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-slate-400">Limit: {client.creditLimit?.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                                  client.status === 'Inactive' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'
                              }`}>
                                  {client.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleOpenEditModal(client)} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded">
                                      <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDelete(client.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
               </tbody>
            </table>
            {filteredClients.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Filter className="w-12 h-12 mb-3 opacity-20" />
                    <p>No clients match your current filters.</p>
                    <button onClick={clearFilters} className="text-brand-600 hover:underline text-sm mt-2 font-bold">Clear Filters</button>
                </div>
            )}
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Building className="w-5 h-5 text-brand-600" /> 
                        {editingClient ? 'Edit Client Profile' : 'Add New Client'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6">
                    {['identity', 'people', 'financials', 'system'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'system' | 'identity' | 'people' | 'financials')}
                            className={`px-4 py-3 text-sm font-bold capitalize border-b-2 transition-colors ${
                                activeTab === tab ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    {/* Tab: Identity */}
                    {activeTab === 'identity' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <label className="text-sm font-bold text-slate-700">Client Status</label>
                                <select 
                                    value={formData.status} 
                                    onChange={e => updateForm('status', e.target.value)} 
                                    className={`border rounded-lg p-2 text-sm font-bold ${formData.status === 'Active' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-600 border-slate-200'}`}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Prospect">Prospect</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                                    <input type="text" value={formData.name || ''} onChange={e => updateForm('name', e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Industry</label>
                                    <input type="text" value={formData.industry || ''} onChange={e => updateForm('industry', e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client Type</label>
                                    <select value={formData.type} onChange={e => updateForm('type', e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white">
                                        <option>Corporate</option>
                                        <option>Government</option>
                                        <option>Individual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Provided</label>
                                    <select value={formData.serviceType} onChange={e => updateForm('serviceType', e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white">
                                        <option value="">Select Service Type...</option>
                                        {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Address</label>
                                    <textarea value={formData.address || ''} onChange={e => updateForm('address', e.target.value)} rows={2} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Country</label>
                                    <select 
                                        value={formData.country} 
                                        onChange={e => {
                                            updateForm('country', e.target.value);
                                            updateForm('city', ''); // Reset city on country change
                                        }} 
                                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                                    >
                                        <option value="">Select Country...</option>
                                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                                    {availableCities.length > 0 ? (
                                        <select 
                                            value={formData.city} 
                                            onChange={e => updateForm('city', e.target.value)} 
                                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                                        >
                                            <option value="">Select City...</option>
                                            {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                    ) : (
                                        <input 
                                            type="text" 
                                            value={formData.city || ''} 
                                            onChange={e => updateForm('city', e.target.value)} 
                                            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" 
                                            placeholder="Enter City"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Website</label>
                                    <div className="relative">
                                        <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" value={formData.website || ''} onChange={e => updateForm('website', e.target.value)} className="w-full pl-9 pr-3 border border-slate-300 rounded-lg p-2.5 text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Email</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="email" value={formData.email || ''} onChange={e => updateForm('email', e.target.value)} className="w-full pl-9 pr-3 border border-slate-300 rounded-lg p-2.5 text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Main Phone</label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" value={formData.phone || ''} onChange={e => updateForm('phone', e.target.value)} className="w-full pl-9 pr-3 border border-slate-300 rounded-lg p-2.5 text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: People */}
                    {activeTab === 'people' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700">Contact Persons</h4>
                                <button onClick={addContact} className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">
                                    <Plus className="w-3 h-3" /> Add Contact
                                </button>
                            </div>
                            
                            {formData.contacts?.map((contact, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                                    <button onClick={() => removeContact(index)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Name</label>
                                            <input type="text" value={contact.name} onChange={e => updateContact(index, 'name', e.target.value)} className="w-full border border-slate-200 rounded p-2 text-sm" placeholder="Full Name" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Role / Job Title</label>
                                            <input type="text" value={contact.role} onChange={e => updateContact(index, 'role', e.target.value)} className="w-full border border-slate-200 rounded p-2 text-sm" placeholder="e.g. Manager" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email</label>
                                            <input type="email" value={contact.email} onChange={e => updateContact(index, 'email', e.target.value)} className="w-full border border-slate-200 rounded p-2 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</label>
                                            <input type="text" value={contact.phone} onChange={e => updateContact(index, 'phone', e.target.value)} className="w-full border border-slate-200 rounded p-2 text-sm" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input type="checkbox" checked={contact.isPrimary} onChange={e => updateContact(index, 'isPrimary', e.target.checked)} id={`primary-${index}`} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                                        <label htmlFor={`primary-${index}`} className="text-xs text-slate-600 font-medium cursor-pointer">Set as Primary Contact</label>
                                    </div>
                                </div>
                            ))}

                            {(!formData.contacts || formData.contacts.length === 0) && (
                                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                    No contacts added yet.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Financials */}
                    {activeTab === 'financials' && (
                        <div className="space-y-6">
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start gap-3">
                                <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-800">Credit Control</h4>
                                    <p className="text-xs text-amber-700">Settings here affect invoicing and credit limits.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">TRN (Tax ID)</label>
                                    <input type="text" value={formData.trn || ''} onChange={e => updateForm('trn', e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="100-XXXX-XXXX-XXX" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Currency</label>
                                    <select value={formData.currency} onChange={e => updateForm('currency', e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white">
                                        <option>AED</option>
                                        <option>USD</option>
                                        <option>EUR</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Terms</label>
                                    <select value={formData.paymentTerms} onChange={e => updateForm('paymentTerms', e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white">
                                        <option>Immediate</option>
                                        <option>Net 15</option>
                                        <option>Net 30</option>
                                        <option>Net 60</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Credit Limit (AED)</label>
                                    <input type="number" value={formData.creditLimit || ''} onChange={e => updateForm('creditLimit', parseFloat(e.target.value))} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: System */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Manager</label>
                                    <input type="text" value={formData.accountManager || ''} onChange={e => updateForm('accountManager', e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client Code (System ID)</label>
                                    <input type="text" value={formData.code || ''} readOnly className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-sm font-mono text-slate-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Internal Notes</label>
                                    <textarea value={formData.notes || ''} onChange={e => updateForm('notes', e.target.value)} rows={4} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="Any special instructions..." />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 rounded-b-xl">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20">
                        {editingClient ? 'Update Client' : 'Create Client'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ClientsModule;
