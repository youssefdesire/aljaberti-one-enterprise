
import React, { useState, useEffect, useMemo } from 'react';
import { Invoice, InvoiceStatus, Expense, ExpenseStatus, InvoiceItem, PurchaseOrder, FixedAsset, AssetCategory } from '../types';
import { 
  FileText, Plus, MoreVertical, CreditCard, PieChart, Upload, X, Receipt, 
  Calendar, Building, Banknote, Sparkles, Filter, CheckCircle, Search, Loader2,
  AlertTriangle, Calculator, Download, Trash2, Save, ShoppingCart, ArrowUpRight,
  Printer, Share2, Wallet, TrendingUp, TrendingDown, BookOpen, Layers, HardHat, Car, Laptop, Smartphone, Armchair, Key, MapPin, Check,
  ListPlus, Undo2, ArrowUp, ArrowDown
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid, LineChart, Line, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

// Mock Expenses
const mockExpenses: Expense[] = [
  { id: 'EXP-001', vendor: 'Etisalat', category: 'Utilities', amount: 450, currency: 'AED', vatAmount: 22.5, date: '2024-05-20', status: ExpenseStatus.APPROVED, receiptAttached: true, description: 'Monthly Internet' },
  { id: 'EXP-002', vendor: 'Zoom Market', category: 'Office Supplies', amount: 120, currency: 'AED', vatAmount: 6, date: '2024-05-22', status: ExpenseStatus.PENDING, receiptAttached: false, description: 'Pantry restocking' },
  { id: 'EXP-003', vendor: 'Careem', category: 'Travel', amount: 65, currency: 'AED', vatAmount: 3.25, date: '2024-05-23', status: ExpenseStatus.REJECTED, receiptAttached: true, description: 'Client meeting transport' },
];

const mockInvoices: Invoice[] = [
  { id: 'INV-2024-0001', customerName: 'Hilton JBR', amount: 15750.00, date: '2024-05-01', dueDate: '2024-05-15', status: InvoiceStatus.PAID, items: 3, paymentDate: '2024-05-14', paymentMethod: 'Bank Transfer' },
  { id: 'INV-2024-0002', customerName: 'Tech Corp', amount: 4500.00, date: '2024-05-10', dueDate: '2024-05-24', status: InvoiceStatus.SENT, items: 1 },
];

const mockAssets: FixedAsset[] = [
    { id: 'AST-001', assetTag: 'VH-001', name: 'Toyota Land Cruiser', category: 'Vehicle', purchaseDate: '2022-01-15', purchaseCost: 280000, currentValue: 195000, status: 'Active', condition: 'Good', serialNumber: 'VIN123456789', assignedTo: 'Ahmed Al-Mansouri', location: 'Dubai HQ', warrantyExpiry: '2025-01-15' },
    { id: 'AST-002', assetTag: 'IT-045', name: 'MacBook Pro M2', category: 'IT Equipment', purchaseDate: '2023-05-10', purchaseCost: 8500, currentValue: 6800, status: 'Active', condition: 'New', serialNumber: 'MBP-2023-XX', assignedTo: 'Sarah Jones', location: 'Dubai HQ', warrantyExpiry: '2024-05-10' },
    { id: 'AST-003', assetTag: 'MC-012', name: 'Caterpillar Excavator', category: 'Machinery', purchaseDate: '2021-11-20', purchaseCost: 450000, currentValue: 320000, status: 'Under Maintenance', condition: 'Fair', serialNumber: 'CAT-EX-99', location: 'Site A', warrantyExpiry: '2023-11-20' },
    { id: 'AST-004', assetTag: 'SIM-099', name: 'Etisalat Business SIM', category: 'SIM Card', purchaseDate: '2023-01-01', purchaseCost: 0, currentValue: 0, status: 'Active', condition: 'Good', serialNumber: '0501234567', assignedTo: 'Sales Team', location: 'Dubai HQ' },
    { id: 'AST-005', assetTag: 'FUR-101', name: 'Ergonomic Office Chair', category: 'Furniture', purchaseDate: '2023-06-15', purchaseCost: 1200, currentValue: 900, status: 'Active', condition: 'Good', serialNumber: 'HM-AERON-22', location: 'Office 204' },
];

const ASSET_CATEGORIES: AssetCategory[] = ['Vehicle', 'IT Equipment', 'Furniture', 'Machinery', 'SIM Card', 'Access Control', 'Building'];

// Module-level variables to persist custom data across re-renders/navigation
let storedVendors = ['Etisalat', 'DEWA', 'Zoom Market', 'Careem', 'Emirates Airlines', 'Office Rock', 'Al Futtaim', 'Emaar'];
let storedExpenseCategories = ['Utilities', 'Rent', 'Office Supplies', 'Travel', 'Marketing', 'Software', 'Legal', 'Consultancy'];

interface AccountingViewProps {
  onOpenAI: (prompt?: string) => void;
  checkPermission?: (name: string) => boolean;
}

const AccountingView: React.FC<AccountingViewProps> = ({ onOpenAI, checkPermission }) => {
  const [activeView, setActiveView] = useState<'invoices' | 'expenses' | 'pos' | 'assets' | 'reports'>('expenses');
  
  // Invoice State
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({});
  const [pendingSequence, setPendingSequence] = useState<number>(0); // Store next sequence to commit on save

  // Asset State
  const [assets, setAssets] = useState<FixedAsset[]>(mockAssets);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [assetFilter, setAssetFilter] = useState({ search: '', category: 'All', status: 'All' });
  const [newAsset, setNewAsset] = useState<Partial<FixedAsset>>({
      category: 'IT Equipment', status: 'Active', condition: 'New', purchaseDate: new Date().toISOString().split('T')[0]
  });

  // Expense State
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isConfirmExpenseOpen, setIsConfirmExpenseOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({ currency: 'AED', date: new Date().toISOString().split('T')[0] });
  const [expenseReceipt, setExpenseReceipt] = useState<File | null>(null);
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('All');
  
  // Custom Category & Vendor State
  const [availableCategories, setAvailableCategories] = useState<string[]>(storedExpenseCategories);
  const [availableVendors, setAvailableVendors] = useState<string[]>(storedVendors);
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' } | null>(null);

  // Analytics Helpers
  const invoiceStats = useMemo(() => {
      const paid = invoices.filter(i => i.status === InvoiceStatus.PAID).reduce((acc, i) => acc + i.amount, 0);
      const outstanding = invoices.filter(i => i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.OVERDUE).reduce((acc, i) => acc + i.amount, 0);
      const draft = invoices.filter(i => i.status === InvoiceStatus.DRAFT).reduce((acc, i) => acc + i.amount, 0);
      
      const statusCounts = [
          { name: 'Paid', value: invoices.filter(i => i.status === InvoiceStatus.PAID).length, color: '#10b981' },
          { name: 'Sent', value: invoices.filter(i => i.status === InvoiceStatus.SENT).length, color: '#3b82f6' },
          { name: 'Overdue', value: invoices.filter(i => i.status === InvoiceStatus.OVERDUE).length, color: '#ef4444' },
          { name: 'Draft', value: invoices.filter(i => i.status === InvoiceStatus.DRAFT).length, color: '#94a3b8' }
      ].filter(d => d.value > 0);

      const revenueData = [
          { name: 'Revenue', amount: paid },
          { name: 'Outstanding', amount: outstanding }
      ];

      return { paid, outstanding, draft, statusCounts, revenueData };
  }, [invoices]);

  // Helper: Auto-generate Sequential Invoice Number
  const generateNextInvoiceNumber = () => {
      const currentYear = new Date().getFullYear().toString();
      const storedYear = localStorage.getItem('invoice_year');
      let seq = 1;

      if (storedYear === currentYear) {
          const storedSeq = localStorage.getItem('invoice_seq');
          if (storedSeq) seq = parseInt(storedSeq) + 1;
      } else {
          // Reset for new year
          localStorage.setItem('invoice_year', currentYear);
      }

      // Format: INV-YYYY-NNNN (e.g., INV-2024-0001)
      const formattedSeq = String(seq).padStart(4, '0');
      return {
          id: `INV-${currentYear}-${formattedSeq}`,
          seq: seq
      };
  };

  const handleOpenCreateInvoice = () => {
      const { id, seq } = generateNextInvoiceNumber();
      setNewInvoice({
          id: id,
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default Net 14
          status: InvoiceStatus.DRAFT,
          amount: 0,
          items: 0
      });
      setPendingSequence(seq);
      setIsInvoiceModalOpen(true);
  };

  const handleSaveInvoice = () => {
      if (!newInvoice.customerName || !newInvoice.amount) {
          alert("Please fill in Customer Name and Amount");
          return;
      }

      // Update localStorage with the used sequence number
      localStorage.setItem('invoice_seq', pendingSequence.toString());
      localStorage.setItem('invoice_year', new Date().getFullYear().toString());

      const invoice: Invoice = {
          ...newInvoice as Invoice,
          items: 1 // Mock item count
      };

      setInvoices([invoice, ...invoices]);
      setIsInvoiceModalOpen(false);
  };

  // Helper for Asset Icon
  const getAssetIcon = (category: string) => {
      switch(category) {
          case 'Vehicle': return <Car className="w-4 h-4 text-blue-500" />;
          case 'IT Equipment': return <Laptop className="w-4 h-4 text-purple-500" />;
          case 'SIM Card': return <Smartphone className="w-4 h-4 text-emerald-500" />;
          case 'Furniture': return <Armchair className="w-4 h-4 text-amber-500" />;
          case 'Access Control': return <Key className="w-4 h-4 text-slate-500" />;
          default: return <HardHat className="w-4 h-4 text-slate-500" />;
      }
  };

  // Filter Assets
  const filteredAssets = useMemo(() => {
      return assets.filter(asset => {
          const matchSearch = asset.name.toLowerCase().includes(assetFilter.search.toLowerCase()) || 
                              asset.assetTag.toLowerCase().includes(assetFilter.search.toLowerCase()) ||
                              asset.assignedTo?.toLowerCase().includes(assetFilter.search.toLowerCase());
          const matchCat = assetFilter.category === 'All' || asset.category === assetFilter.category;
          const matchStatus = assetFilter.status === 'All' || asset.status === assetFilter.status;
          return matchSearch && matchCat && matchStatus;
      });
  }, [assets, assetFilter]);

  // Filter Expenses
  const filteredExpenses = useMemo(() => {
      return expenses.filter(exp => {
          const matchSearch = exp.vendor.toLowerCase().includes(expenseSearch.toLowerCase()) || exp.description?.toLowerCase().includes(expenseSearch.toLowerCase());
          const matchCat = expenseCategoryFilter === 'All' || exp.category === expenseCategoryFilter;
          return matchSearch && matchCat;
      });
  }, [expenses, expenseSearch, expenseCategoryFilter]);

  // Sort Expenses
  const sortedExpenses = useMemo(() => {
    let sortableItems = [...filteredExpenses];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        // Handle generic sorting
        if (aVal === undefined || bVal === undefined) return 0;

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredExpenses, sortConfig]);

  const requestSort = (key: keyof Expense) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSaveAsset = () => {
      const asset: FixedAsset = {
          ...newAsset as FixedAsset,
          id: `AST-${Date.now()}`,
          assetTag: newAsset.assetTag || `TAG-${Math.floor(Math.random() * 10000)}`,
          currentValue: newAsset.purchaseCost || 0,
      };
      setAssets([...assets, asset]);
      setIsAssetModalOpen(false);
  };

  const handleInitiateSaveExpense = () => {
      if (!newExpense.vendor || !newExpense.amount || !newExpense.category || !newExpense.date) {
          alert("Please fill in all required fields.");
          return;
      }
      setIsConfirmExpenseOpen(true);
  };

  const handleFinalizeSaveExpense = () => {
      // Add custom category to list if it's new
      if (newExpense.category && !availableCategories.includes(newExpense.category)) {
          const updatedCategories = [...availableCategories, newExpense.category];
          setAvailableCategories(updatedCategories);
          storedExpenseCategories = updatedCategories; // Update global variable
      }

      // Add custom vendor to list if it's new
      if (newExpense.vendor && !availableVendors.includes(newExpense.vendor)) {
          const updatedVendors = [...availableVendors, newExpense.vendor];
          setAvailableVendors(updatedVendors);
          storedVendors = updatedVendors; // Update global variable
      }

      const expense: Expense = {
          id: `EXP-${Date.now()}`,
          vendor: newExpense.vendor!,
          amount: newExpense.amount!,
          category: newExpense.category!,
          date: newExpense.date!,
          status: ExpenseStatus.PENDING,
          receiptAttached: !!expenseReceipt,
          description: newExpense.description || '',
          currency: newExpense.currency || 'AED',
          vatAmount: (newExpense.amount! * 0.05) 
      };
      setExpenses([expense, ...expenses]);
      setIsConfirmExpenseOpen(false);
      setIsAddExpenseOpen(false);
      
      // Reset Form
      setNewExpense({ currency: 'AED', date: new Date().toISOString().split('T')[0] });
      setExpenseReceipt(null);
      setIsCustomCategoryMode(false);
  };

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === 'NEW_CATEGORY_OPTION') {
          setIsCustomCategoryMode(true);
          setNewExpense({ ...newExpense, category: '' });
      } else {
          setNewExpense({ ...newExpense, category: val });
      }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setExpenseReceipt(e.target.files[0]);
          // Simulate OCR processing
          setTimeout(() => {
              // Mock extracted data
              // setNewExpense(prev => ({ ...prev, vendor: 'Scanned Vendor', amount: 150 }));
          }, 1000);
      }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-6 overflow-x-auto">
            <button onClick={() => setActiveView('expenses')} className={`pb-2 text-sm font-semibold transition-colors ${activeView === 'expenses' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}>Expenses & Bills</button>
            <button onClick={() => setActiveView('invoices')} className={`pb-2 text-sm font-semibold transition-colors ${activeView === 'invoices' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}>Invoices</button>
            <button onClick={() => setActiveView('assets')} className={`pb-2 text-sm font-semibold transition-colors ${activeView === 'assets' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500'}`}>Company Assets</button>
        </div>

        {/* --- EXPENSES VIEW --- */}
        {activeView === 'expenses' && (
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-brand-600" /> Expense Tracker
                    </h3>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search Expenses..." 
                                value={expenseSearch}
                                onChange={(e) => setExpenseSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-brand-500 outline-none" 
                            />
                        </div>
                        <select 
                            value={expenseCategoryFilter}
                            onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                        >
                            <option value="All">All Categories</option>
                            {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button 
                            onClick={() => setIsAddExpenseOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-md whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" /> Add Expense
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('vendor')}>
                                    <div className="flex items-center gap-1">
                                        Vendor 
                                        {sortConfig?.key === 'vendor' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('category')}>
                                    <div className="flex items-center gap-1">
                                        Category
                                        {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('date')}>
                                    <div className="flex items-center gap-1">
                                        Date
                                        {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('amount')}>
                                    <div className="flex items-center gap-1">
                                        Amount
                                        {sortConfig?.key === 'amount' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('status')}>
                                    <div className="flex items-center gap-1">
                                        Status
                                        {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {sortedExpenses.map(exp => (
                                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800 text-sm">{exp.vendor}</div>
                                        <div className="text-xs text-slate-500">{exp.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{exp.category}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{exp.date}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        {exp.currency} {exp.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            exp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                            exp.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {exp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {exp.receiptAttached ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-slate-300">-</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- ASSETS REGISTRY --- */}
        {activeView === 'assets' && (
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-brand-600" /> Master Asset Registry
                    </h3>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by Tag, Name, Employee..." 
                                value={assetFilter.search}
                                onChange={(e) => setAssetFilter({...assetFilter, search: e.target.value})}
                                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-brand-500 outline-none" 
                            />
                        </div>
                        <select 
                            value={assetFilter.category}
                            onChange={(e) => setAssetFilter({...assetFilter, category: e.target.value})}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                        >
                            <option value="All">All Categories</option>
                            {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button 
                            onClick={() => setIsAssetModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-md whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" /> Register Asset
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Asset Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4">Purchase Date</th>
                                <th className="px-6 py-4">Warranty</th>
                                <th className="px-6 py-4">Condition</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredAssets.map(asset => {
                                const isWarrantyExpired = asset.warrantyExpiry && new Date(asset.warrantyExpiry) < new Date();
                                return (
                                    <tr key={asset.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 text-sm">{asset.name}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{asset.assetTag} • SN: {asset.serialNumber || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                {getAssetIcon(asset.category)} {asset.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-700">{asset.assignedTo || 'Unassigned'}</div>
                                            <div className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> {asset.location}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{asset.purchaseDate}</td>
                                        <td className="px-6 py-4">
                                            {asset.warrantyExpiry ? (
                                                <div className={`flex items-center gap-1 text-xs font-bold ${isWarrantyExpired ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    {isWarrantyExpired && <AlertTriangle className="w-3 h-3" />}
                                                    {asset.warrantyExpiry}
                                                </div>
                                            ) : <span className="text-slate-400 text-xs">-</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                asset.condition === 'New' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                asset.condition === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {asset.condition}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                asset.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                                                asset.status === 'Under Maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-slate-400 hover:text-brand-600 p-1 hover:bg-slate-100 rounded">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- INVOICE VIEW --- */}
        {activeView === 'invoices' && (
             <div className="p-6">
                 {/* Financial Analytics Dashboard */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-in slide-in-from-top-4">
                     {/* Revenue Chart */}
                     <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                         <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-emerald-600" /> Revenue vs Outstanding
                         </h4>
                         <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={invoiceStats.revenueData} layout="vertical" margin={{ left: 20 }}>
                                     <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                     <XAxis type="number" tickFormatter={(val) => `${val/1000}k`} />
                                     <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                                     <Tooltip formatter={(val) => `AED ${val.toLocaleString()}`} cursor={{fill: 'transparent'}} />
                                     <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={32}>
                                         {invoiceStats.revenueData.map((entry, index) => (
                                             <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f59e0b'} />
                                         ))}
                                     </Bar>
                                 </BarChart>
                             </ResponsiveContainer>
                         </div>
                     </div>

                     {/* Status Pie & KPIs */}
                     <div className="space-y-6">
                         {/* KPI Cards */}
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                 <p className="text-xs font-bold text-emerald-800 uppercase">Collected</p>
                                 <p className="text-lg font-bold text-emerald-700 mt-1">AED {invoiceStats.paid.toLocaleString()}</p>
                             </div>
                             <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                 <p className="text-xs font-bold text-amber-800 uppercase">Outstanding</p>
                                 <p className="text-lg font-bold text-amber-700 mt-1">AED {invoiceStats.outstanding.toLocaleString()}</p>
                             </div>
                         </div>

                         {/* Status Chart */}
                         <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col items-center">
                             <h4 className="font-bold text-slate-800 text-sm mb-2 w-full">Invoice Status</h4>
                             <div className="h-40 w-full">
                                 <ResponsiveContainer width="100%" height="100%">
                                     <RePieChart>
                                         <Pie
                                             data={invoiceStats.statusCounts}
                                             cx="50%"
                                             cy="50%"
                                             innerRadius={40}
                                             outerRadius={60}
                                             paddingAngle={5}
                                             dataKey="value"
                                         >
                                             {invoiceStats.statusCounts.map((entry, index) => (
                                                 <Cell key={`cell-${index}`} fill={entry.color} />
                                             ))}
                                         </Pie>
                                         <Tooltip />
                                         <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{fontSize: '10px'}} />
                                     </RePieChart>
                                 </ResponsiveContainer>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText className="w-5 h-5 text-brand-600"/> All Invoices</h3>
                     <button 
                        onClick={handleOpenCreateInvoice}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-md transition-all hover:scale-105"
                     >
                         <Plus className="w-4 h-4" /> Create Invoice
                     </button>
                 </div>
                 <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono font-medium text-slate-700">{inv.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{inv.customerName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{inv.date}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{inv.dueDate}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">AED {inv.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${inv.status === InvoiceStatus.PAID ? 'bg-emerald-100 text-emerald-700' : inv.status === InvoiceStatus.OVERDUE ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-slate-400 hover:text-brand-600 p-1 hover:bg-slate-100 rounded">
                                            <Printer className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800">Add New Expense</h3>
                      <button onClick={() => setIsAddExpenseOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      {/* Vendor Autocomplete */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vendor Name</label>
                          <input 
                            list="vendors"
                            type="text" 
                            value={newExpense.vendor || ''} 
                            onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})} 
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                            placeholder="Select or type vendor..."
                          />
                          <datalist id="vendors">
                              {availableVendors.map(v => <option key={v} value={v} />)}
                          </datalist>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                              {isCustomCategoryMode ? (
                                  <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        value={newExpense.category} 
                                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                                        className="w-full border border-brand-300 ring-1 ring-brand-200 rounded-lg p-2 text-sm focus:outline-none"
                                        placeholder="Type new category..."
                                        autoFocus
                                      />
                                      <button 
                                        onClick={() => { setIsCustomCategoryMode(false); setNewExpense({...newExpense, category: ''}); }}
                                        className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition"
                                        title="Cancel custom category"
                                      >
                                          <Undo2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              ) : (
                                  <select 
                                    value={newExpense.category || ''} 
                                    onChange={handleCategorySelectChange}
                                    className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white cursor-pointer"
                                  >
                                      <option value="">Select Category</option>
                                      {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                      <option disabled>──────────</option>
                                      <option value="NEW_CATEGORY_OPTION" className="font-bold text-brand-600">+ Add New Category</option>
                                  </select>
                              )}
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                              <input 
                                type="date" 
                                value={newExpense.date || ''} 
                                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} 
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                              />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                              <input 
                                type="number" 
                                value={newExpense.amount || ''} 
                                onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})} 
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                                placeholder="0.00"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Currency</label>
                              <select 
                                value={newExpense.currency} 
                                onChange={(e) => setNewExpense({...newExpense, currency: e.target.value})} 
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
                              >
                                  <option>AED</option>
                                  <option>USD</option>
                                  <option>EUR</option>
                              </select>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description / Notes</label>
                          <textarea 
                            value={newExpense.description || ''} 
                            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} 
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm h-20 resize-none" 
                            placeholder="What was this expense for?"
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Receipt Attachment</label>
                          <label className="flex items-center gap-2 p-3 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                              <Upload className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{expenseReceipt ? expenseReceipt.name : 'Upload Receipt'}</span>
                              <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleReceiptUpload} />
                          </label>
                      </div>

                      <button onClick={handleInitiateSaveExpense} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition">Save Expense</button>
                  </div>
              </div>
          </div>
      )}

      {/* Confirmation Dialog */}
      {isConfirmExpenseOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Confirm Expense</h3>
                      <p className="text-sm text-slate-500 mb-6">Are you sure you want to submit this expense?</p>
                      
                      <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left border border-slate-100">
                          <div className="flex justify-between mb-2">
                              <span className="text-xs text-slate-500">Vendor:</span>
                              <span className="text-xs font-bold text-slate-700">{newExpense.vendor}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                              <span className="text-xs text-slate-500">Amount:</span>
                              <span className="text-xs font-bold text-slate-700">{newExpense.currency} {newExpense.amount?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                              <span className="text-xs text-slate-500">VAT (5%):</span>
                              <span className="text-xs font-bold text-slate-700">{newExpense.currency} {((newExpense.amount || 0) * 0.05).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-xs text-slate-500">Category:</span>
                              <span className="text-xs font-bold text-slate-700">{newExpense.category}</span>
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <button onClick={() => setIsConfirmExpenseOpen(false)} className="flex-1 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition">Cancel</button>
                          <button onClick={handleFinalizeSaveExpense} className="flex-1 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">Confirm</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Create Invoice Modal */}
      {isInvoiceModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800">Create New Invoice</h3>
                      <button onClick={() => setIsInvoiceModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500 uppercase">Invoice ID</span>
                          <span className="font-mono font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">{newInvoice.id}</span>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                          <input 
                            type="text" 
                            value={newInvoice.customerName || ''} 
                            onChange={(e) => setNewInvoice({...newInvoice, customerName: e.target.value})} 
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                            placeholder="e.g. Hilton JBR"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issue Date</label>
                              <input 
                                type="date" 
                                value={newInvoice.date || ''} 
                                onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})} 
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                              <input 
                                type="date" 
                                value={newInvoice.dueDate || ''} 
                                onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})} 
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm" 
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Amount (AED)</label>
                          <input 
                            type="number" 
                            value={newInvoice.amount || ''} 
                            onChange={(e) => setNewInvoice({...newInvoice, amount: parseFloat(e.target.value)})} 
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm font-bold text-lg" 
                            placeholder="0.00"
                          />
                      </div>

                      <button onClick={handleSaveInvoice} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition">Generate Invoice</button>
                  </div>
              </div>
          </div>
      )}

      {/* Add Asset Modal */}
      {isAssetModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800">Register New Asset</h3>
                      <button onClick={() => setIsAssetModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset Name / Model</label>
                          <input type="text" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" placeholder="e.g. Dell Latitude 5420" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                              <select value={newAsset.category || ''} onChange={e => setNewAsset({...newAsset, category: e.target.value as AssetCategory})} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white">
                                  {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Serial Number</label>
                              <input type="text" value={newAsset.serialNumber} onChange={e => setNewAsset({...newAsset, serialNumber: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned To</label>
                              <input type="text" value={newAsset.assignedTo} onChange={e => setNewAsset({...newAsset, assignedTo: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" placeholder="Employee Name" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                              <input type="text" value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" placeholder="e.g. Dubai HQ" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Purchase Date</label>
                              <input type="date" value={newAsset.purchaseDate} onChange={e => setNewAsset({...newAsset, purchaseDate: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Warranty Expiry</label>
                              <input type="date" value={newAsset.warrantyExpiry} onChange={e => setNewAsset({...newAsset, warrantyExpiry: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Condition</label>
                              <select value={newAsset.condition || ''} onChange={e => setNewAsset({...newAsset, condition: e.target.value as 'Good' | 'Fair' | 'Poor'})} className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white">
                                  <option>New</option>
                                  <option>Good</option>
                                  <option>Fair</option>
                                  <option>Poor</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost (AED)</label>
                              <input type="number" value={newAsset.purchaseCost} onChange={e => setNewAsset({...newAsset, purchaseCost: parseFloat(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                          </div>
                      </div>
                      <button onClick={handleSaveAsset} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition">Save to Registry</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AccountingView;
