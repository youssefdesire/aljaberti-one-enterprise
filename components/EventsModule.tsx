
import React, { useState } from 'react';
import { CompanyEvent, EventType, EventStatus, EventAttendee, EventScheduleItem, UserRole } from '../types';
import { Calendar, MapPin, Users, DollarSign, Clock, Plus, Search, Filter, MoreVertical, Edit, Trash2, X, CheckCircle, AlertCircle, Briefcase, FileText, Image as ImageIcon, Send } from 'lucide-react';

const mockEvents: CompanyEvent[] = [
    {
        id: 'EVT-001',
        name: 'Annual Tech Summit 2024',
        type: EventType.CONFERENCE,
        status: EventStatus.PLANNING,
        startDate: '2024-11-15',
        endDate: '2024-11-16',
        location: 'Dubai World Trade Centre',
        organizer: 'Sarah Jones',
        budget: 150000,
        actualCost: 45000,
        description: 'Annual gathering for tech partners and clients showcasing new ERP solutions.',
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        attendees: [
            { id: 'AT-1', name: 'Mohammed Ali', email: 'm.ali@client.com', type: 'Client', rsvpStatus: 'Going', checkedIn: false },
            { id: 'AT-2', name: 'Rajesh Kumar', email: 'rajesh@aljaberti.ae', type: 'Employee', rsvpStatus: 'Going', checkedIn: false },
        ],
        schedule: [
            { id: 'SCH-1', time: '09:00', title: 'Registration & Networking', description: 'Main Hall Entrance' },
            { id: 'SCH-2', time: '10:00', title: 'Keynote Speech', description: 'Future of ERP in UAE', speaker: 'Ahmed Al-Mansouri' }
        ]
    },
    {
        id: 'EVT-002',
        name: 'Q3 Team Building',
        type: EventType.TEAM_BUILDING,
        status: EventStatus.CONFIRMED,
        startDate: '2024-08-20',
        endDate: '2024-08-20',
        location: 'Hatta Dam Resort',
        organizer: 'Maria Rodriguez',
        budget: 20000,
        actualCost: 18500,
        description: 'Kayaking and team strategy session.',
        coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
        attendees: [],
        schedule: []
    }
];

interface EventsModuleProps {
    checkPermission?: (name: string) => boolean;
    currentUserRole?: UserRole;
}

const EventsModule: React.FC<EventsModuleProps> = ({ checkPermission, currentUserRole }) => {
    const [events, setEvents] = useState<CompanyEvent[]>(mockEvents);
    const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
    const [selectedEvent, setSelectedEvent] = useState<CompanyEvent | null>(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    
    // Filters
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [newEvent, setNewEvent] = useState<Partial<CompanyEvent>>({
        type: EventType.CORPORATE,
        status: EventStatus.PLANNING,
        budget: 0
    });

    // Attendee Modal
    const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
    const [newAttendee, setNewAttendee] = useState<Partial<EventAttendee>>({ type: 'Client', rsvpStatus: 'Pending' });

    // Schedule Modal
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [newScheduleItem, setNewScheduleItem] = useState<Partial<EventScheduleItem>>({});

    const canEdit = checkPermission ? checkPermission('Manage Events') : (currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.MANAGER);

    const filteredEvents = events.filter(evt => {
        const matchSearch = evt.name.toLowerCase().includes(searchTerm.toLowerCase()) || evt.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'All' || evt.type === filterType;
        return matchSearch && matchType;
    });

    const handleSaveEvent = () => {
        if (!newEvent.name || !newEvent.startDate) return;
        
        if (selectedEvent && isEventModalOpen) {
            // Edit Mode (Simulated for New/Edit distinction) - Here we mostly treat as new or overwrite in list if ID matches
            const updated = { ...selectedEvent, ...newEvent } as CompanyEvent;
            setEvents(events.map(e => e.id === selectedEvent.id ? updated : e));
            setSelectedEvent(updated);
        } else {
            const event: CompanyEvent = {
                ...newEvent as CompanyEvent,
                id: `EVT-${Date.now()}`,
                actualCost: 0,
                attendees: [],
                schedule: []
            };
            setEvents([...events, event]);
        }
        setIsEventModalOpen(false);
        setNewEvent({ type: EventType.CORPORATE, status: EventStatus.PLANNING, budget: 0 });
    };

    const handleAddAttendee = () => {
        if (!selectedEvent || !newAttendee.name) return;
        const attendee: EventAttendee = {
            ...newAttendee as EventAttendee,
            id: `AT-${Date.now()}`,
            checkedIn: false
        };
        const updatedEvent = { ...selectedEvent, attendees: [...selectedEvent.attendees, attendee] };
        updateEventState(updatedEvent);
        setIsAttendeeModalOpen(false);
        setNewAttendee({ type: 'Client', rsvpStatus: 'Pending' });
    };

    const handleAddScheduleItem = () => {
        if (!selectedEvent || !newScheduleItem.title) return;
        const item: EventScheduleItem = {
            ...newScheduleItem as EventScheduleItem,
            id: `SCH-${Date.now()}`
        };
        // Sort by time
        const updatedSchedule = [...selectedEvent.schedule, item].sort((a,b) => a.time.localeCompare(b.time));
        const updatedEvent = { ...selectedEvent, schedule: updatedSchedule };
        updateEventState(updatedEvent);
        setIsScheduleModalOpen(false);
        setNewScheduleItem({});
    };

    const updateEventState = (updated: CompanyEvent) => {
        setEvents(events.map(e => e.id === updated.id ? updated : e));
        setSelectedEvent(updated);
    };

    const handleDeleteEvent = (id: string) => {
        if (window.confirm("Are you sure you want to cancel and delete this event?")) {
            setEvents(events.filter(e => e.id !== id));
            if (selectedEvent?.id === id) setSelectedEvent(null);
        }
    };

    const getStatusColor = (status: EventStatus) => {
        switch(status) {
            case EventStatus.CONFIRMED: return 'bg-emerald-100 text-emerald-700';
            case EventStatus.LIVE: return 'bg-purple-100 text-purple-700 animate-pulse';
            case EventStatus.PLANNING: return 'bg-blue-100 text-blue-700';
            case EventStatus.CANCELLED: return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // --- Render Details View ---
    if (selectedEvent) {
        return (
            <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300">
                {/* Header Image */}
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                    {selectedEvent.coverImage ? (
                        <img src={selectedEvent.coverImage} alt="Event Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                            <Calendar className="w-16 h-16 text-slate-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-6 text-white">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase mb-2 inline-block ${getStatusColor(selectedEvent.status)}`}>{selectedEvent.status}</span>
                        <h1 className="text-3xl font-bold">{selectedEvent.name}</h1>
                        <p className="text-sm text-slate-200 flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {selectedEvent.startDate}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {selectedEvent.location}</span>
                        </p>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Overview */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-2">Event Description</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{selectedEvent.description || 'No description provided.'}</p>
                                
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Organizer</p>
                                        <p className="font-bold text-slate-800 mt-1">{selectedEvent.organizer}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Type</p>
                                        <p className="font-bold text-slate-800 mt-1">{selectedEvent.type}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Budget</p>
                                        <p className="font-bold text-slate-800 mt-1">AED {selectedEvent.budget.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-brand-600" /> Event Schedule
                                    </h3>
                                    {canEdit && (
                                        <button onClick={() => setIsScheduleModalOpen(true)} className="text-xs font-bold text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition">
                                            + Add Item
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {selectedEvent.schedule.length > 0 ? selectedEvent.schedule.map((item, idx) => (
                                        <div key={item.id} className="flex gap-4 group">
                                            <div className="w-16 flex-shrink-0 text-right">
                                                <span className="text-sm font-bold text-slate-700 block">{item.time}</span>
                                            </div>
                                            <div className="flex-1 pb-4 border-l-2 border-brand-100 pl-4 relative">
                                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-white"></div>
                                                <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                                                {item.speaker && <p className="text-xs text-brand-600 font-medium mb-1">Speaker: {item.speaker}</p>}
                                                <p className="text-xs text-slate-500">{item.description}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                            No schedule items yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Guests & Stats */}
                        <div className="space-y-6">
                            {/* Guest List */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-purple-600" /> Guest List
                                    </h3>
                                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{selectedEvent.attendees.length}</span>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {selectedEvent.attendees.map(attendee => (
                                        <div key={attendee.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition">
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{attendee.name}</p>
                                                <p className="text-[10px] text-slate-400">{attendee.type}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                    attendee.rsvpStatus === 'Going' ? 'bg-emerald-50 text-emerald-600' :
                                                    attendee.rsvpStatus === 'Not Going' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {attendee.rsvpStatus}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {canEdit && (
                                    <button 
                                        onClick={() => setIsAttendeeModalOpen(true)}
                                        className="mt-4 w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition"
                                    >
                                        Add Attendee
                                    </button>
                                )}
                            </div>

                            {/* Financial Mini-Stat */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <DollarSign className="w-6 h-6 text-brand-400" />
                                    <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-brand-200">Budget</span>
                                </div>
                                <p className="text-sm text-slate-400">Remaining Budget</p>
                                <h4 className="text-2xl font-bold mt-1">AED {(selectedEvent.budget - selectedEvent.actualCost).toLocaleString()}</h4>
                                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-brand-500 h-full" style={{ width: `${(selectedEvent.actualCost / selectedEvent.budget) * 100}%` }}></div>
                                </div>
                                <p className="text-[10px] text-right mt-1 text-slate-400">{(selectedEvent.actualCost / selectedEvent.budget * 100).toFixed(1)}% Spent</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals for Details View */}
                {isAttendeeModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95">
                            <h3 className="font-bold text-slate-800 mb-4">Add Guest</h3>
                            <div className="space-y-3">
                                <input type="text" placeholder="Name" className="w-full border rounded p-2 text-sm" value={newAttendee.name || ''} onChange={e => setNewAttendee({...newAttendee, name: e.target.value})} />
                                <input type="email" placeholder="Email" className="w-full border rounded p-2 text-sm" value={newAttendee.email || ''} onChange={e => setNewAttendee({...newAttendee, email: e.target.value})} />
                                <select className="w-full border rounded p-2 text-sm" value={newAttendee.type} onChange={e => setNewAttendee({...newAttendee, type: e.target.value as 'Employee' | 'Client' | 'Guest'})}>
                                    <option>Client</option>
                                    <option>Employee</option>
                                    <option>Guest</option>
                                </select>
                                <select className="w-full border rounded p-2 text-sm" value={newAttendee.rsvpStatus} onChange={e => setNewAttendee({...newAttendee, rsvpStatus: e.target.value as 'Pending' | 'Going' | 'Maybe' | 'Not Going'})}>
                                    <option>Pending</option>
                                    <option>Going</option>
                                    <option>Maybe</option>
                                    <option>Not Going</option>
                                </select>
                                <button onClick={handleAddAttendee} className="w-full bg-brand-600 text-white py-2 rounded font-bold text-sm">Add</button>
                                <button onClick={() => setIsAttendeeModalOpen(false)} className="w-full text-slate-500 text-sm mt-2">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {isScheduleModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95">
                            <h3 className="font-bold text-slate-800 mb-4">Add Schedule Item</h3>
                            <div className="space-y-3">
                                <input type="time" className="w-full border rounded p-2 text-sm" value={newScheduleItem.time || ''} onChange={e => setNewScheduleItem({...newScheduleItem, time: e.target.value})} />
                                <input type="text" placeholder="Session Title" className="w-full border rounded p-2 text-sm" value={newScheduleItem.title || ''} onChange={e => setNewScheduleItem({...newScheduleItem, title: e.target.value})} />
                                <input type="text" placeholder="Speaker (Optional)" className="w-full border rounded p-2 text-sm" value={newScheduleItem.speaker || ''} onChange={e => setNewScheduleItem({...newScheduleItem, speaker: e.target.value})} />
                                <textarea placeholder="Description" className="w-full border rounded p-2 text-sm h-20" value={newScheduleItem.description || ''} onChange={e => setNewScheduleItem({...newScheduleItem, description: e.target.value})} />
                                <button onClick={handleAddScheduleItem} className="w-full bg-brand-600 text-white py-2 rounded font-bold text-sm">Add Item</button>
                                <button onClick={() => setIsScheduleModalOpen(false)} className="w-full text-slate-500 text-sm mt-2">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- Main List View ---
    return (
        <div className="space-y-6 text-slate-900 dark:text-slate-100">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search events..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-64" 
                        />
                    </div>
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="All">All Types</option>
                        {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                {canEdit && (
                    <button 
                        onClick={() => { setIsEventModalOpen(true); setSelectedEvent(null); }}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
                    >
                        <Plus className="w-4 h-4" /> Create Event
                    </button>
                )}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <div 
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-brand-300 transition-all cursor-pointer group overflow-hidden flex flex-col h-full"
                    >
                        <div className="h-40 bg-slate-100 relative overflow-hidden">
                            {event.coverImage ? (
                                <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                    <Calendar className="w-10 h-10 text-slate-300" />
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${getStatusColor(event.status)}`}>
                                    {event.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">{event.name}</h3>
                            <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> {event.type}
                            </p>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{event.startDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    {event.attendees.slice(0,3).map((att, i) => (
                                        <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                                            {att.name.charAt(0)}
                                        </div>
                                    ))}
                                    {event.attendees.length > 3 && (
                                        <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] text-slate-500 font-bold">
                                            +{event.attendees.length - 3}
                                        </div>
                                    )}
                                </div>
                                {canEdit && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                                        className="text-slate-400 hover:text-rose-500 p-1 hover:bg-rose-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredEvents.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No events found.</p>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {isEventModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 text-lg">Create New Event</h3>
                            <button onClick={() => setIsEventModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event Name</label>
                                <input type="text" className="w-full border rounded p-2 text-sm" value={newEvent.name || ''} onChange={e => setNewEvent({...newEvent, name: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                                    <select className="w-full border rounded p-2 text-sm bg-white" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as EventType})}>
                                        {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                                    <select className="w-full border rounded p-2 text-sm bg-white" value={newEvent.status} onChange={e => setNewEvent({...newEvent, status: e.target.value as EventStatus})}>
                                        {Object.values(EventStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                                    <input type="date" className="w-full border rounded p-2 text-sm" value={newEvent.startDate || ''} onChange={e => setNewEvent({...newEvent, startDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                                    <input type="date" className="w-full border rounded p-2 text-sm" value={newEvent.endDate || ''} onChange={e => setNewEvent({...newEvent, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                                <input type="text" className="w-full border rounded p-2 text-sm" value={newEvent.location || ''} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Organizer</label>
                                <input type="text" className="w-full border rounded p-2 text-sm" value={newEvent.organizer || ''} onChange={e => setNewEvent({...newEvent, organizer: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Budget (AED)</label>
                                <input type="number" className="w-full border rounded p-2 text-sm" value={newEvent.budget || 0} onChange={e => setNewEvent({...newEvent, budget: parseFloat(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                <textarea className="w-full border rounded p-2 text-sm h-20" value={newEvent.description || ''} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                            </div>
                            <button onClick={handleSaveEvent} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition">Save Event</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsModule;
