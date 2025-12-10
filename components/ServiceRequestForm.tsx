
import React, { useState } from 'react';
import { ClipboardList, Send, MapPin, Building, Phone, Mail, User, CheckCircle2, ShieldCheck, Truck, Users, FileText, Settings, BarChart2 } from 'lucide-react';

const serviceCategories = [
    {
        title: "Project Planning and Initiation",
        icon: ClipboardList,
        options: ["Scope definition", "Project timeline planning", "Budget estimation", "Feasibility study", "Risk assessment", "Work breakdown structure"]
    },
    {
        title: "Project Execution and Coordination",
        icon: Settings,
        options: ["Daily supervision", "Contractor and supplier coordination", "Resource allocation", "Compliance monitoring", "Site visits and inspections", "Task scheduling"]
    },
    {
        title: "Financial and Budget Management",
        icon: BarChart2,
        options: ["Budget preparation", "Cost control", "Cash flow monitoring", "Procurement management", "Vendor contract management", "Financial reports"]
    },
    {
        title: "Quality Assurance",
        icon: ShieldCheck,
        options: ["Quality standards planning", "Material and equipment inspection", "On site quality verification", "Compliance checks", "Final quality approval"]
    },
    {
        title: "Risk and Issue Management",
        icon: ShieldCheck,
        options: ["Risk identification", "Mitigation planning", "Issue tracking", "Problem resolution"]
    },
    {
        title: "Reporting and Communication",
        icon: FileText,
        options: ["Weekly progress reports", "Monthly reports", "KPI dashboard", "Client communication updates", "Performance analytics"]
    },
    {
        title: "Documentation and Compliance",
        icon: FileText,
        options: ["Document control", "Regulatory compliance", "Contract and change request management", "Handover documentation"]
    },
    {
        title: "Procurement and Supply Chain",
        icon: Truck,
        options: ["Vendor sourcing", "Quotation comparison", "Purchase orders", "Delivery tracking", "Inventory control"]
    },
    {
        title: "Workforce and HR Management",
        icon: Users,
        options: ["Attendance tracking", "Performance evaluation", "Safety and training sessions", "Workforce scheduling"]
    },
    {
        title: "Project Closing and Handover",
        icon: CheckCircle2,
        options: ["Final inspection", "Snag list completion", "Full handover documentation", "Post project review"]
    }
];

const ServiceRequestForm: React.FC = () => {
    const [clientInfo, setClientInfo] = useState({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        projectName: '',
        projectLocation: ''
    });

    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleService = (option: string) => {
        if (selectedServices.includes(option)) {
            setSelectedServices(selectedServices.filter(s => s !== option));
        } else {
            setSelectedServices([...selectedServices, option]);
        }
    };

    const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientInfo({ ...clientInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        // Here you would typically api call to save
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 animate-in fade-in">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Submitted!</h2>
                <p className="text-slate-500 text-center max-w-md">
                    Thank you for detailing your project requirements. Our team will review your scope and contact you shortly with a formal proposal.
                </p>
                <button onClick={() => setIsSubmitted(false)} className="mt-8 px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">
                    Submit Another Request
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-10 text-slate-900 dark:text-slate-100">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="bg-brand-900 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">Services Provided Form</h1>
                        <p className="text-brand-100">Define your project scope and requirements for a tailored management solution.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Client Information */}
                        <section className="mb-12">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <User className="w-5 h-5 text-brand-600" /> Client & Project Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input required name="fullName" value={clientInfo.fullName} onChange={handleClientChange} type="text" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" placeholder="John Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Company Name</label>
                                    <div className="relative">
                                        <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input required name="companyName" value={clientInfo.companyName} onChange={handleClientChange} type="text" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" placeholder="Acme Corp" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input required name="email" value={clientInfo.email} onChange={handleClientChange} type="email" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input required name="phone" value={clientInfo.phone} onChange={handleClientChange} type="tel" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" placeholder="+971 50 123 4567" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Project Name</label>
                                    <input required name="projectName" value={clientInfo.projectName} onChange={handleClientChange} type="text" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" placeholder="e.g. Headquarters Renovation" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">Project Location</label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input required name="projectLocation" value={clientInfo.projectLocation} onChange={handleClientChange} type="text" className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition" placeholder="Dubai, UAE" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Service Categories */}
                        <section className="mb-12">
                            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <ClipboardList className="w-5 h-5 text-brand-600" /> Service Scope Selection
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {serviceCategories.map((category, idx) => (
                                    <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-5 hover:border-brand-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-brand-600 shadow-sm">
                                                <category.icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-sm">{category.title}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {category.options.map((option) => (
                                                <label key={option} className="flex items-start gap-3 cursor-pointer group p-1.5 hover:bg-white rounded-lg transition-colors">
                                                    <div className="relative flex items-center mt-0.5">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedServices.includes(option)}
                                                            onChange={() => toggleService(option)}
                                                            className="peer h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" 
                                                        />
                                                    </div>
                                                    <span className={`text-sm ${selectedServices.includes(option) ? 'text-slate-800 font-medium' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                                        {option}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Additional Notes */}
                        <section className="mb-10">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Additional Requirements</h2>
                            <textarea 
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none h-32 resize-none"
                                placeholder="Please describe any specific needs, constraints, or extra details for the project..."
                            />
                        </section>

                        {/* Submit Action */}
                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button 
                                type="submit" 
                                className="flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-1"
                            >
                                <Send className="w-5 h-5" /> Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestForm;
