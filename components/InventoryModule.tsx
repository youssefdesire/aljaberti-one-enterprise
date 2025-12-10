
import React, { useState } from 'react';
import { InventoryItem, StockStatus, StockMovement, Supplier } from '../types';
import { Package, AlertTriangle, Truck, BarChart2, AlertCircle, ArrowUpRight, ArrowDownLeft, Search, Filter, Plus, X, Save, Star, Phone, Mail, Edit, Trash2, Image as ImageIcon, Camera, PieChart as PieIcon, QrCode, Printer, Briefcase, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const mockInventory: InventoryItem[] = [
  { id: 'SKU-9001', sku: 'MAT-CMT-50', name: 'Portland Cement (50kg)', type: 'Product', category: 'Raw Materials', stock: 450, price: 18.50, status: StockStatus.IN_STOCK, warehouse: 'Al Quoz 1', imageUrl: '' },
  { id: 'SKU-9002', sku: 'ELC-CBL-100', name: 'Copper Cabling 100m', type: 'Product', category: 'Electrical', stock: 12, price: 450.00, status: StockStatus.LOW_STOCK, warehouse: 'Jebel Ali', imageUrl: '' },
  { id: 'SKU-9003', sku: 'FIN-TL-6060', name: 'Ceramic Tiles 60x60', type: 'Product', category: 'Finishing', stock: 1200, price: 65.00, status: StockStatus.IN_STOCK, warehouse: 'Al Quoz 1', imageUrl: '' },
  { id: 'SKU-9004', sku: 'SAF-HLM-STD', name: 'Safety Helmet (Standard)', type: 'Product', category: 'Safety Gear', stock: 0, price: 45.00, status: StockStatus.OUT_OF_STOCK, warehouse: 'Main Store', imageUrl: '' },
  { id: 'SKU-9005', sku: 'PLM-PP-25', name: 'PVC Pipe 25mm', type: 'Product', category: 'Plumbing', stock: 300, price: 12.00, status: StockStatus.IN_STOCK, warehouse: 'Jebel Ali', imageUrl: '' },
  // Services
  { id: 'SVC-001', sku: 'SVC-CON-GEN', name: 'General Consultation', type: 'Service', category: 'Consultancy', stock: 0, price: 500.00, status: StockStatus.IN_STOCK, warehouse: '-', imageUrl: '' },
  { id: 'SVC-002', sku: 'SVC-INST-AC', name: 'AC Installation Service', type: 'Service', category: 'Labor', stock: 0, price: 250.00, status: StockStatus.IN_STOCK, warehouse: '-', imageUrl: '' },
  { id: 'SVC-003', sku: 'SVC-MAINT-YR', name: 'Annual Maintenance Contract', type: 'Service', category: 'Contracts', stock: 0, price: 15000.00, status: StockStatus.IN_STOCK, warehouse: '-', imageUrl: '' },
];

const mockMovements: StockMovement[] = [
  { id: 'MOV-001', itemId: 'SKU-9001', itemName: 'Portland Cement (50kg)', type: 'IN', quantity: 200, date: '2024-05-22 09:30 AM', reference: 'PO-2024-88', user: 'Admin' },
  { id: 'MOV-002', itemId: 'SKU-9003', itemName: 'Ceramic Tiles 60x60', type: 'OUT', quantity: 50, date: '2024-05-22 11:15 AM', reference: 'PRJ-101', user: 'Rajesh K.' },
  { id: 'MOV-003', itemId: 'SKU-9002', itemName: 'Copper Cabling 100m', type: 'OUT', quantity: 8, date: '2024-05-21 02:00 PM', reference: 'PRJ-104', user: 'Ahmed M.' },
];

const mockSuppliers: Supplier[] = [
    { id: 'SUP-001', name: 'Danube Building Materials', contactPerson: 'John Doe', email: 'sales@danube.ae', phone: '+971 4 123 4567', category: 'Raw Materials', rating: 5, paymentTerms: 'Net 30' },
    { id: 'SUP-002', name: 'Ace Hardware', contactPerson: 'Jane Smith', email: 'b2b@aceuae.com', phone: '+971 4 987 6543', category: 'Tools', rating: 4, paymentTerms: 'Cash' },
    { id: 'SUP-003', name: 'Global Electricals', contactPerson: 'Ali Khan', email: 'ali@global.ae', phone: '+971 50 111 2222', category: 'Electrical', rating: 3, paymentTerms: 'Net 60' },
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const getStockStyle = (status: StockStatus) => {
    switch (status) {
        case StockStatus.IN_STOCK: return 'bg-emerald-100 text-emerald-700';
        case StockStatus.LOW_STOCK: return 'bg-amber-100 text-amber-700';
        case StockStatus.OUT_OF_STOCK: return 'bg-rose-100 text-rose-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

interface InventoryModuleProps {
    checkPermission?: (name: string) => boolean;
}

const InventoryModule: React.FC<InventoryModuleProps> = ({ checkPermission }) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'services' | 'movements' | 'suppliers'>('stock');
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
      category: 'All',
      status: 'All',
      warehouse: 'All',
      minPrice: '',
      maxPrice: ''
  });

  // Modals
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isMovementOpen, setIsMovementOpen] = useState(false);
  const [itemForLabel, setItemForLabel] = useState<InventoryItem | null>(null);
  
  // Supplier Modal
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({ rating: 3 });

  // New Item State
  const [newItem, setNewItem] = useState({
      name: '', sku: '', type: 'Product' as 'Product' | 'Service', category: 'General', price: 0, warehouse: 'Main Store', imageUrl: ''
  });

  // Movement State
  const [newMovement, setNewMovement] = useState({
      itemId: '', type: 'IN' as 'IN' | 'OUT', quantity: 1, reference: ''
  });

  // Permissions
  const canAdjustStock = checkPermission ? checkPermission('Adjust Stock Levels') : true;
  const canViewCost = checkPermission ? checkPermission('View Cost Prices') : true;
  const canDelete = checkPermission ? checkPermission('Delete Inventory Items') : true;

  // Filter Logic
  const filteredItems = items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = filters.category === 'All' || item.category === filters.category;
      const matchStatus = filters.status === 'All' || item.status === filters.status;
      const matchWarehouse = filters.warehouse === 'All' || item.warehouse === filters.warehouse;
      const matchMinPrice = filters.minPrice ? item.price >= parseFloat(filters.minPrice) : true;
      const matchMaxPrice = filters.maxPrice ? item.price <= parseFloat(filters.maxPrice) : true;

      return matchSearch && matchCategory && matchStatus && matchWarehouse && matchMinPrice && matchMaxPrice;
  });

  const lowStockItems = items.filter(item => item.type === 'Product' && (item.status === StockStatus.LOW_STOCK || item.status === StockStatus.OUT_OF_STOCK));
  const productItems = filteredItems.filter(item => item.type === 'Product');
  const serviceItems = filteredItems.filter(item => item.type === 'Service');

  const uniqueCategories = Array.from(new Set(items.map(i => i.category)));
  const uniqueWarehouses = Array.from(new Set(items.filter(i => i.type === 'Product').map(i => i.warehouse || 'Unknown')));

  const clearFilters = () => {
      setFilters({ category: 'All', status: 'All', warehouse: 'All', minPrice: '', maxPrice: '' });
      setSearchTerm('');
  };

  // Chart Data Preparation
  const stockValueByCategory = productItems.reduce((acc, item) => {
     const value = item.stock * item.price;
     acc[item.category] = (acc[item.category] || 0) + value;
     return acc;
  }, {} as Record<string, number>);
  const categoryChartData = Object.entries(stockValueByCategory).map(([name, value]) => ({ name, value }));

  const warehouseDistribution = productItems.reduce((acc, item) => {
     acc[item.warehouse || 'Unknown'] = (acc[item.warehouse || 'Unknown'] || 0) + item.stock;
     return acc;
  }, {} as Record<string, number>);
  const warehouseChartData = Object.entries(warehouseDistribution).map(([name, value]) => ({ name, value }));

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setNewItem({ name: '', sku: '', type: activeTab === 'services' ? 'Service' : 'Product', category: 'General', price: 0, warehouse: 'Main Store', imageUrl: '' });
    setIsAddItemOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem({ 
        name: item.name, 
        sku: item.sku, 
        type: item.type,
        category: item.category, 
        price: item.price, 
        warehouse: item.warehouse || 'Main Store', 
        imageUrl: item.imageUrl || '' 
    });
    setIsAddItemOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if(window.confirm('Are you sure you want to delete this inventory item?')) {
        setItems(items.filter(i => i.id !== id));
    }
  };

  const handleSaveItem = () => {
      if (editingItem) {
        // Update
        setItems(items.map(i => i.id === editingItem.id ? { 
            ...i, 
            name: newItem.name, 
            sku: newItem.sku,
            type: newItem.type, 
            category: newItem.category, 
            price: newItem.price, 
            warehouse: newItem.type === 'Service' ? '-' : newItem.warehouse,
            imageUrl: newItem.imageUrl
        } : i));
      } else {
        // Create
        const item: InventoryItem = {
            id: `SKU-${Date.now()}`,
            name: newItem.name,
            sku: newItem.sku || `${newItem.type === 'Service' ? 'SVC' : 'GEN'}-${Date.now()}`,
            type: newItem.type,
            category: newItem.category,
            price: newItem.price,
            stock: 0,
            status: StockStatus.IN_STOCK, // Services are always 'In Stock'
            warehouse: newItem.type === 'Service' ? '-' : newItem.warehouse,
            imageUrl: newItem.imageUrl
        };
        // If product, default to Out of Stock until initial inventory is added
        if (newItem.type === 'Product') {
            item.status = StockStatus.OUT_OF_STOCK;
        }
        setItems([...items, item]);
      }
      setIsAddItemOpen(false);
  };

  const handleSaveSupplier = () => {
      if (!newSupplier.name) return;
      const supplier: Supplier = {
          id: `SUP-${Date.now()}`,
          name: newSupplier.name!,
          contactPerson: newSupplier.contactPerson || '',
          email: newSupplier.email || '',
          phone: newSupplier.phone || '',
          category: newSupplier.category || 'General',
          rating: newSupplier.rating || 3,
          paymentTerms: newSupplier.paymentTerms || 'Cash'
      };
      setSuppliers([...suppliers, supplier]);
      setIsSupplierModalOpen(false);
      setNewSupplier({ rating: 3 });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewItem({ ...newItem, imageUrl });
    }
  };

  const handleMovement = () => {
     if (!newMovement.itemId) return;
     
     const item = items.find(i => i.id === newMovement.itemId);
     if (!item || item.type === 'Service') return;

     const newStock = newMovement.type === 'IN' 
        ? item.stock + newMovement.quantity 
        : Math.max(0, item.stock - newMovement.quantity);
    
     let newStatus = StockStatus.IN_STOCK;
     if (newStock === 0) newStatus = StockStatus.OUT_OF_STOCK;
     else if (newStock < 20) newStatus = StockStatus.LOW_STOCK;

     // Update Item
     setItems(items.map(i => i.id === item.id ? { ...i, stock: newStock, status: newStatus } : i));

     // Add Record
     const movement: StockMovement = {
         id: `MOV-${Date.now()}`,
         itemId: item.id,
         itemName: item.name,
         type: newMovement.type,
         quantity: newMovement.quantity,
         date: new Date().toLocaleString(),
         reference: newMovement.reference,
         user: 'Current User'
     };
     setMovements([movement, ...movements]);
     setIsMovementOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Total Products</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{items.filter(i => i.type === 'Product').length}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg"><Package className="w-5 h-5 text-blue-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Services Offered</p>
                <h3 className="text-2xl font-bold text-indigo-600 mt-1">{items.filter(i => i.type === 'Service').length}</h3>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg"><Briefcase className="w-5 h-5 text-indigo-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Stock Value</p>
                <h3 className="text-xl font-bold text-slate-800 mt-1">AED {canViewCost ? (productItems.reduce((acc, i) => acc + (i.stock * i.price), 0) / 1000).toFixed(1) + 'k' : '****'}</h3>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg"><BarChart2 className="w-5 h-5 text-emerald-600"/></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Low Stock</p>
                <h3 className="text-2xl font-bold text-amber-600 mt-1">{lowStockItems.length}</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-600"/></div>
        </div>
      </div>

      {/* Inventory Charts */}
      {activeTab === 'stock' && canViewCost && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Stock Value */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <BarChart2 className="w-5 h-5 text-brand-600" /> Stock Value by Category
                </h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="name" tick={{fontSize: 10}} />
                         <YAxis tickFormatter={(val) => `${val/1000}k`} />
                         <Tooltip formatter={(value) => `AED ${value.toLocaleString()}`} />
                         <Bar dataKey="value" fill="#8b5cf6" radius={[4,4,0,0]} barSize={40} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Warehouse Distribution */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                   <PieIcon className="w-5 h-5 text-brand-600" /> Warehouse Distribution
                </h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                            data={warehouseChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                         >
                            {warehouseChartData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                         </Pie>
                         <Tooltip />
                         <Legend verticalAlign="middle" align="right" layout="vertical" />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-6 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('stock')}
                className={`pb-2 text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'stock' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Products & Stock
                {activeTab === 'stock' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"></span>}
            </button>
            <button 
                onClick={() => setActiveTab('services')}
                className={`pb-2 text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'services' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Services Catalog
                {activeTab === 'services' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"></span>}
            </button>
            <button 
                onClick={() => setActiveTab('movements')}
                className={`pb-2 text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'movements' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Movements Log
                {activeTab === 'movements' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"></span>}
            </button>
            <button 
                onClick={() => setActiveTab('suppliers')}
                className={`pb-2 text-sm font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'suppliers' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Suppliers
                {activeTab === 'suppliers' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"></span>}
            </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col border-b border-slate-200">
            <div className="p-4 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search SKU, Name..." 
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
            </div>
            <div className="flex gap-2">
                {(activeTab === 'stock' || activeTab === 'services') && (
                    <>
                        {activeTab === 'stock' && canAdjustStock && (
                            <button 
                                onClick={() => setIsMovementOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                            >
                                <ArrowUpRight className="w-4 h-4" /> Record Movement
                            </button>
                        )}
                        {canAdjustStock && (
                            <button 
                                onClick={handleOpenAddModal}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
                            >
                                <Plus className="w-4 h-4" /> Add {activeTab === 'services' ? 'Service' : 'Item'}
                            </button>
                        )}
                    </>
                )}
                {activeTab === 'suppliers' && (
                    <button 
                        onClick={() => setIsSupplierModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
                    >
                        <Plus className="w-4 h-4" /> Add Supplier
                    </button>
                )}
            </div>
            </div>

            {/* Advanced Filters Panel */}
            {isFilterOpen && (activeTab === 'stock' || activeTab === 'services') && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 animate-in slide-in-from-top-2">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                        <select 
                            value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                        >
                            <option value="All">All Categories</option>
                            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {activeTab === 'stock' && (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Warehouse</label>
                            <select 
                                value={filters.warehouse}
                                onChange={(e) => setFilters({...filters, warehouse: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                            >
                                <option value="All">All Warehouses</option>
                                {uniqueWarehouses.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    )}
                    {activeTab === 'stock' && (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stock Status</label>
                            <select 
                                value={filters.status}
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                            >
                                <option value="All">All Statuses</option>
                                {Object.values(StockStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price Range (AED)</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                placeholder="Min" 
                                value={filters.minPrice} 
                                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg p-1.5 text-xs" 
                            />
                            <input 
                                type="number" 
                                placeholder="Max" 
                                value={filters.maxPrice} 
                                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg p-1.5 text-xs" 
                            />
                        </div>
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

        {/* Tables */}
        <div className="overflow-x-auto min-h-[400px]">
            {activeTab === 'stock' && (
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                          <th className="px-6 py-4 w-16">Image</th>
                          <th className="px-6 py-4">Item Details</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4 text-right">Stock</th>
                          <th className="px-6 py-4 text-right">Unit Price</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {productItems.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 group">
                              <td className="px-6 py-4">
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                      {item.imageUrl ? (
                                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                      ) : (
                                          <Package className="w-5 h-5 text-slate-400" />
                                      )}
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                                  <div className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                              <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">{item.stock}</td>
                              <td className="px-6 py-4 text-right text-sm text-slate-600">AED {canViewCost ? item.price.toFixed(2) : '****'}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStockStyle(item.status)}`}>
                                      {item.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => setItemForLabel(item)}
                                        className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded"
                                        title="Generate Barcode Label"
                                      >
                                          <QrCode className="w-4 h-4" />
                                      </button>
                                      {canAdjustStock && (
                                          <button 
                                            onClick={() => handleOpenEditModal(item)}
                                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded"
                                          >
                                              <Edit className="w-4 h-4" />
                                          </button>
                                      )}
                                      {canDelete && (
                                          <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                          >
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      )}
                                  </div>
                              </td>
                          </tr>
                      ))}
                   </tbody>
                </table>
            )}

            {activeTab === 'services' && (
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                          <th className="px-6 py-4 w-16">Image</th>
                          <th className="px-6 py-4">Service Name</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4 text-right">Standard Rate (AED)</th>
                          <th className="px-6 py-4">Availability</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {serviceItems.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 group">
                              <td className="px-6 py-4">
                                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                                      {item.imageUrl ? (
                                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                      ) : (
                                          <Briefcase className="w-5 h-5 text-indigo-500" />
                                      )}
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                                  <div className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                              <td className="px-6 py-4 text-right text-sm font-bold text-slate-700">AED {canViewCost ? item.price.toFixed(2) : '****'}</td>
                              <td className="px-6 py-4">
                                  <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                                      Active
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {canAdjustStock && (
                                          <button 
                                            onClick={() => handleOpenEditModal(item)}
                                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded"
                                          >
                                              <Edit className="w-4 h-4" />
                                          </button>
                                      )}
                                      {canDelete && (
                                          <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                                          >
                                              <Trash2 className="w-4 h-4" />
                                          </button>
                                      )}
                                  </div>
                              </td>
                          </tr>
                      ))}
                   </tbody>
                </table>
            )}

            {activeTab === 'movements' && (
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Item</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Qty</th>
                          <th className="px-6 py-4">Reference</th>
                          <th className="px-6 py-4">User</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {movements.map(mov => (
                          <tr key={mov.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 text-xs text-slate-500">{mov.date}</td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-700">{mov.itemName}</td>
                              <td className="px-6 py-4">
                                  <span className={`flex items-center gap-1 text-xs font-bold ${mov.type === 'IN' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                      {mov.type === 'IN' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                      {mov.type}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-mono font-bold text-slate-800">{mov.quantity}</td>
                              <td className="px-6 py-4 text-xs text-slate-500 font-mono">{mov.reference}</td>
                              <td className="px-6 py-4 text-xs text-slate-500">{mov.user}</td>
                          </tr>
                      ))}
                   </tbody>
                </table>
            )}

            {activeTab === 'suppliers' && (
                <table className="w-full text-left border-collapse">
                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                          <th className="px-6 py-4">Supplier Name</th>
                          <th className="px-6 py-4">Contact</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Rating</th>
                          <th className="px-6 py-4">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {suppliers.map(sup => (
                          <tr key={sup.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-bold text-sm text-slate-700">{sup.name}</td>
                              <td className="px-6 py-4">
                                  <div className="text-sm text-slate-700">{sup.contactPerson}</div>
                                  <div className="text-xs text-slate-500">{sup.email}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{sup.category}</td>
                              <td className="px-6 py-4">
                                  <div className="flex text-amber-400">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-3 h-3 ${i < sup.rating ? 'fill-current' : 'text-slate-200'}`} />
                                      ))}
                                  </div>
                              </td>
                              <td className="px-6 py-4 flex gap-2">
                                  <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded">
                                      <Phone className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded">
                                      <Mail className="w-4 h-4" />
                                  </button>
                              </td>
                          </tr>
                      ))}
                   </tbody>
                </table>
            )}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {isAddItemOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">{editingItem ? 'Edit Item' : 'Add New Entry'}</h3>
                    <button onClick={() => setIsAddItemOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                </div>
                <div className="p-6 space-y-4">
                    {/* Item Type Selection */}
                    <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                        <button 
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${newItem.type === 'Product' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}
                            onClick={() => setNewItem({...newItem, type: 'Product'})}
                        >
                            Physical Product
                        </button>
                        <button 
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${newItem.type === 'Service' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                            onClick={() => setNewItem({...newItem, type: 'Service'})}
                        >
                            Service / Labor
                        </button>
                    </div>

                    {/* Image Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-400 relative group overflow-hidden">
                            {newItem.imageUrl ? (
                                <img src={newItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                                    <span className="text-[10px] text-slate-400">Upload Image</span>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{newItem.type === 'Service' ? 'Service Name' : 'Item Name'}</label>
                        <input type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU / Code</label>
                        <input type="text" value={newItem.sku} onChange={(e) => setNewItem({...newItem, sku: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Auto-generated if empty" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                            <input type="text" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{newItem.type === 'Service' ? 'Rate / Price (AED)' : 'Unit Price (AED)'}</label>
                            <input type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                    </div>
                    
                    {newItem.type === 'Product' && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Default Warehouse</label>
                            <select value={newItem.warehouse} onChange={(e) => setNewItem({...newItem, warehouse: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white">
                                <option>Main Store</option>
                                <option>Al Quoz 1</option>
                                <option>Jebel Ali</option>
                            </select>
                        </div>
                    )}

                    <button onClick={handleSaveItem} className="w-full bg-brand-600 text-white py-2 rounded-lg font-bold mt-2 hover:bg-brand-700 transition">
                        {editingItem ? 'Update Entry' : 'Save Entry'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Barcode/QR Code Generator Modal */}
      {itemForLabel && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
                      <h3 className="font-bold flex items-center gap-2">
                         <QrCode className="w-5 h-5" /> Barcode/QR Label
                      </h3>
                      <button onClick={() => setItemForLabel(null)} className="hover:bg-slate-700 p-1 rounded"><X className="w-5 h-5" /></button>
                  </div>
                  
                  {/* Label Preview */}
                  <div className="p-8 bg-slate-100 flex justify-center">
                      <div className="bg-white border-2 border-slate-800 rounded-lg p-4 w-64 aspect-square flex flex-col items-center justify-center text-center shadow-lg">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Aljaberti ONE</p>
                          <h2 className="font-bold text-slate-900 text-lg leading-tight mb-2">{itemForLabel.name}</h2>
                          
                          <div className="my-2 p-2 bg-white rounded-lg">
                              <QrCode className="w-32 h-32 text-slate-900" />
                          </div>
                          
                          <p className="font-mono text-sm font-bold text-slate-600">{itemForLabel.sku}</p>
                          <p className="text-xs text-slate-500 mt-1">{itemForLabel.category}</p>
                      </div>
                  </div>

                  <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
                      <button onClick={() => setItemForLabel(null)} className="flex-1 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition">
                          Cancel
                      </button>
                      <button onClick={() => window.print()} className="flex-1 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20">
                          <Printer className="w-4 h-4" /> Print Label
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Record Movement Modal */}
      {isMovementOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-800">Record Stock Movement</h3>
                      <button onClick={() => setIsMovementOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div className="flex gap-4 mb-4">
                          <button 
                            onClick={() => setNewMovement({...newMovement, type: 'IN'})}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm border ${newMovement.type === 'IN' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}
                          >
                              Stock IN (Purchase)
                          </button>
                          <button 
                            onClick={() => setNewMovement({...newMovement, type: 'OUT'})}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm border ${newMovement.type === 'OUT' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-200 text-slate-500'}`}
                          >
                              Stock OUT (Usage)
                          </button>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Item</label>
                          <select 
                            value={newMovement.itemId} 
                            onChange={(e) => setNewMovement({...newMovement, itemId: e.target.value})} 
                            className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
                          >
                              <option value="">-- Choose Item --</option>
                              {productItems.map(i => <option key={i.id} value={i.id}>{i.name} ({i.stock} in stock)</option>)}
                          </select>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                          <input 
                             type="number" 
                             value={newMovement.quantity} 
                             onChange={(e) => setNewMovement({...newMovement, quantity: parseInt(e.target.value)})} 
                             className="w-full border border-slate-200 rounded-lg p-2 text-sm" 
                             min="1"
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reference (PO/Project #)</label>
                          <input 
                             type="text" 
                             value={newMovement.reference} 
                             onChange={(e) => setNewMovement({...newMovement, reference: e.target.value})} 
                             className="w-full border border-slate-200 rounded-lg p-2 text-sm" 
                             placeholder="e.g. PRJ-101"
                          />
                      </div>

                      <button 
                        onClick={handleMovement} 
                        disabled={!newMovement.itemId || !newMovement.quantity}
                        className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold mt-2 hover:bg-slate-900 transition disabled:opacity-50"
                      >
                          Confirm Movement
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Supplier Modal */}
      {isSupplierModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800">Add New Supplier</h3>
                      <button onClick={() => setIsSupplierModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supplier Name</label>
                          <input type="text" value={newSupplier.name || ''} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Person</label>
                              <input type="text" value={newSupplier.contactPerson || ''} onChange={e => setNewSupplier({...newSupplier, contactPerson: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                              <input type="text" value={newSupplier.category || ''} onChange={e => setNewSupplier({...newSupplier, category: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="e.g. Electrical" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                              <input type="email" value={newSupplier.email || ''} onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                              <input type="tel" value={newSupplier.phone || ''} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                      </div>
                      <button onClick={handleSaveSupplier} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition">Save Supplier</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default InventoryModule;
