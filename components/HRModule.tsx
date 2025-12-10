
import React, { useState, useMemo, useRef } from 'react';
import { Employee, AttendanceRecord, PayrollEntry, LeaveRequest, JobPosition, Candidate, PerformanceReview } from '../types';
import { Users, Search, Plus, PieChart as PieIcon, Edit, Clock, CheckCircle, X, LogOut, MapPin, Loader2, AlertTriangle, Download, Banknote, FileText, Printer, UserPlus, Star, TrendingUp, Award, GitBranch, Plane, XCircle, Briefcase, Mail, Phone, Calendar, Globe, CreditCard, Lock } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// --- MOCK DATA ---
const mockPositions: JobPosition[] = [
    { id: 'POS-001', title: 'General Manager', code: 'GM-01', department: 'Management', grade: 'Executive', costCenter: 'CC-100', status: 'Filled', holderId: 'EMP-001' },
    { id: 'POS-002', title: 'Senior Accountant', code: 'FIN-01', department: 'Finance', grade: 'Senior', costCenter: 'CC-200', status: 'Filled', holderId: 'EMP-002', reportsToPositionId: 'POS-001' },
    { id: 'POS-003', title: 'Sales Director', code: 'SLS-01', department: 'Sales', grade: 'Senior', costCenter: 'CC-500', status: 'Filled', holderId: 'EMP-005', reportsToPositionId: 'POS-001' },
    { id: 'POS-004', title: 'HR Manager', code: 'HR-01', department: 'Human Resources', grade: 'Senior', costCenter: 'CC-400', status: 'Filled', holderId: 'EMP-004', reportsToPositionId: 'POS-001' },
    { id: 'POS-005', title: 'Site Engineer', code: 'PRJ-01', department: 'Projects', grade: 'Mid', costCenter: 'CC-300', status: 'Vacant', reportsToPositionId: 'POS-001' },
];

const mockEmployees: Employee[] = [
  { 
      id: 'EMP-001', name: 'Ahmed Al-Mansouri', positionId: 'POS-001', positionTitle: 'General Manager', department: 'Management', status: 'Active', location: 'Dubai HQ', joinDate: '2020-01-15', skills: ['Leadership', 'Strategy'], employmentType: 'Permanent', visaStatus: 'Company Visa',
      personal: { email: 'ahmed.p@email.com', phone: '+971501111111', nationality: 'UAE', gender: 'Male', dob: '1985-04-12', address: 'Villa 12, Jumeirah 1, Dubai', emergencyContact: { name: 'Fatima Al-Mansouri', relationship: 'Spouse', phone: '+971502222222' } },
      employment: { legalEntity: 'Aljaberti ONE LLC', costCenter: 'CC-100', jobGrade: 'L6 - Executive', managerId: 'Board' },
      compensation: { baseSalary: 45000, currency: 'AED', frequency: 'Monthly', bankName: 'ADCB', iban: 'AE12345678901234567' },
      workEmail: 'ahmed@aljaberti.ae',
      assets: [{ id: 'AST-001', type: 'Laptop', identifier: 'MacBook Pro M2', assignedDate: '2023-01-01' }],
      performanceScore: 98, attendanceScore: 100
  },
  { 
      id: 'EMP-002', name: 'Sarah Jones', positionId: 'POS-002', positionTitle: 'Senior Accountant', department: 'Finance', status: 'Active', location: 'Dubai HQ', joinDate: '2021-03-10', skills: ['GAAP', 'Taxation'], employmentType: 'Permanent', visaStatus: 'Company Visa',
      personal: { email: 'sarah.j@email.com', phone: '+971503333333', nationality: 'UK', gender: 'Female', dob: '1990-08-22', address: 'Marina Gate, Dubai Marina', emergencyContact: { name: 'Tom Jones', relationship: 'Spouse', phone: '+971504444444' } },
      employment: { legalEntity: 'Aljaberti ONE LLC', costCenter: 'CC-200', jobGrade: 'L4 - Senior', managerId: 'EMP-001' },
      compensation: { baseSalary: 22000, currency: 'AED', frequency: 'Monthly', bankName: 'ENBD', iban: 'AE98765432109876543' },
      workEmail: 'sarah@aljaberti.ae',
      assets: [{ id: 'AST-002', type: 'Laptop', identifier: 'Dell XPS 15', assignedDate: '2021-03-10' }],
      performanceScore: 95, attendanceScore: 98
  },
  { id: 'EMP-004', name: 'Maria Rodriguez', positionId: 'POS-004', positionTitle: 'HR Manager', department: 'Human Resources', status: 'Remote', location: 'Dubai', joinDate: '2019-11-20', skills: ['Recruitment', 'Labor Law'], employmentType: 'Contract', visaStatus: 'Own Visa', performanceScore: 88, attendanceScore: 92, compensation: { baseSalary: 18000, currency: 'AED', frequency: 'Monthly' } },
  { id: 'EMP-005', name: 'John Smith', positionId: 'POS-003', positionTitle: 'Sales Director', department: 'Sales', status: 'Active', location: 'Dubai HQ', joinDate: '2023-01-10', skills: ['Negotiation', 'CRM'], employmentType: 'Permanent', visaStatus: 'Company Visa', performanceScore: 92, attendanceScore: 85, compensation: { baseSalary: 28000, currency: 'AED', frequency: 'Monthly' } },
];

const mockAttendance: AttendanceRecord[] = [
    { id: 'ATT-001', employeeId: 'EMP-002', employeeName: 'Sarah Jones', date: '2024-05-24', checkIn: '08:55 AM', checkOut: '06:05 PM', status: 'Present', location: 'Dubai HQ', workHours: 9.2 },
    { id: 'ATT-002', employeeId: 'EMP-005', employeeName: 'John Smith', date: '2024-05-24', checkIn: '09:15 AM', checkOut: '06:00 PM', status: 'Late', location: 'Dubai HQ', workHours: 8.75 },
    { id: 'ATT-003', employeeId: 'EMP-001', employeeName: 'Ahmed Al-Mansouri', date: '2024-05-24', checkIn: '08:30 AM', checkOut: '', status: 'Present', location: 'Dubai HQ', workHours: 0 },
    { id: 'ATT-004', employeeId: 'EMP-004', employeeName: 'Maria Rodriguez', date: '2024-05-24', checkIn: '09:00 AM', checkOut: '01:00 PM', status: 'Early Leave', location: 'Remote', workHours: 4 },
];

const mockPayroll: PayrollEntry[] = [
    { id: 'PAY-001', employeeId: 'EMP-001', employeeName: 'Ahmed Al-Mansouri', basicSalary: 45000, allowances: 15000, deductions: 0, netSalary: 60000, status: 'Processed' },
    { id: 'PAY-002', employeeId: 'EMP-002', employeeName: 'Sarah Jones', basicSalary: 22000, allowances: 8000, deductions: 0, netSalary: 30000, status: 'Pending' },
    { id: 'PAY-003', employeeId: 'EMP-004', employeeName: 'Maria Rodriguez', basicSalary: 18000, allowances: 5000, deductions: 500, netSalary: 22500, status: 'Pending' },
];

const mockLeaves: LeaveRequest[] = [
    { id: 'LV-001', employeeId: 'EMP-002', employeeName: 'Sarah Jones', type: 'Annual', startDate: '2024-06-10', endDate: '2024-06-20', days: 10, status: 'Pending', reason: 'Family vacation' },
    { id: 'LV-002', employeeId: 'EMP-005', employeeName: 'John Smith', type: 'Sick', startDate: '2024-05-10', endDate: '2024-05-11', days: 2, status: 'Approved', reason: 'Flu' },
];

const mockCandidates: Candidate[] = [
    { id: 'CAN-001', name: 'James Wilson', appliedFor: 'Site Engineer', stage: 'Interview', rating: 4, applicationDate: '2024-05-20', email: 'james@email.com' },
    { id: 'CAN-002', name: 'Linda Chen', appliedFor: 'Marketing Executive', stage: 'New', rating: 0, applicationDate: '2024-05-22', email: 'linda@email.com' },
    { id: 'CAN-003', name: 'Omar Farooq', appliedFor: 'Accountant', stage: 'Offer', rating: 5, applicationDate: '2024-05-15', email: 'omar@email.com' },
];

const mockReviews: PerformanceReview[] = [
    { id: 'REV-001', employeeId: 'EMP-002', employeeName: 'Sarah Jones', reviewDate: '2024-04-01', rating: 4.8, reviewer: 'Ahmed Al-Mansouri', goalsMet: true, comments: 'Exceptional performance in audit.' },
    { id: 'REV-002', employeeId: 'EMP-005', employeeName: 'John Smith', reviewDate: '2024-04-05', rating: 4.2, reviewer: 'Ahmed Al-Mansouri', goalsMet: true, comments: 'Great sales numbers, needs to improve CRM updates.' },
];

// Mock Office Location (Dubai Downtown approx)
const OFFICE_COORDS = { lat: 25.2048, lng: 55.2708 };
const GEOFENCE_RADIUS_METERS = 500;
const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface HRModuleProps {
    checkPermission?: (name: string) => boolean;
}

const HRModule: React.FC<HRModuleProps> = ({ checkPermission }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'employees' | 'leave' | 'recruitment' | 'talent' | 'payroll' | 'time'>('employees');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [payroll, setPayroll] = useState<PayrollEntry[]>(mockPayroll);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  
  // Attendance Filter State
  const [attFilterDate, setAttFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [attFilterStatus, setAttFilterStatus] = useState('All');
  const [attSearch, setAttSearch] = useState('');

  // Remote Check-in State
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<{lat: number, lng: number} | null>(null);
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Payslip Modal State
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollEntry | null>(null);

  // Employee Edit Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeModalTab, setEmployeeModalTab] = useState<'personal' | 'employment' | 'compensation'>('personal');

  // PERMISSION CHECKS
  const canViewPersonal = checkPermission ? checkPermission('View Personal Contact Info') : true;
  const canViewSalary = checkPermission ? checkPermission('View Salary Data') : true;
  const canEditComp = checkPermission ? checkPermission('Edit Compensation') : true;
  const canEditGeneral = checkPermission ? checkPermission('Edit Employee Records') : true;

  // Helper: Haversine Formula for distance
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3; // metres
      const φ1 = lat1 * Math.PI/180;
      const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180;
      const Δλ = (lon2-lon1) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      return R * c;
  };

  const handleStartCheckIn = () => {
      setIsCheckInModalOpen(true);
      setSelfieImage(null);
      setCurrentLoc(null);
      setIsWithinRange(null);
      setIsLocLoading(true);

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              setCurrentLoc({ lat, lng });
              const dist = getDistance(lat, lng, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
              setIsWithinRange(dist <= GEOFENCE_RADIUS_METERS);
              setIsLocLoading(false);
              
              // Start Camera
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                      if (videoRef.current) {
                          videoRef.current.srcObject = stream;
                          videoRef.current.play();
                      }
                  });
              }
          }, (error) => {
              alert("Location access is required for remote check-in.");
              setIsLocLoading(false);
          });
      } else {
          alert("Geolocation is not supported by this browser.");
          setIsLocLoading(false);
      }
  };

  const handleCaptureSelfie = () => {
      if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.drawImage(videoRef.current, 0, 0);
              setSelfieImage(canvas.toDataURL('image/png'));
              // Stop stream
              const stream = videoRef.current.srcObject as MediaStream;
              stream.getTracks().forEach(t => t.stop());
          }
      }
  };

  const handleSubmitCheckIn = () => {
      if (!currentLoc || !selfieImage) return;
      
      const newRecord: AttendanceRecord = {
          id: `ATT-${Date.now()}`,
          employeeId: 'EMP-CURRENT', // Mock current user
          employeeName: 'You',
          date: new Date().toISOString().split('T')[0],
          checkIn: new Date().toLocaleTimeString(),
          checkOut: '',
          status: 'Present',
          location: 'Remote (Verified)',
          coordinates: currentLoc,
          selfieUrl: selfieImage
      };
      
      setAttendance([newRecord, ...attendance]);
      setIsCheckInModalOpen(false);
  };

  const handleOpenEmployeeModal = (emp?: Employee) => {
      if (emp) {
          setSelectedEmployee(emp);
      } else {
          // New Employee Defaults
          setSelectedEmployee({
              id: `EMP-${Date.now()}`,
              name: '',
              positionId: '',
              department: '',
              status: 'Active',
              location: 'Dubai HQ',
              joinDate: new Date().toISOString().split('T')[0],
              employmentType: 'Permanent',
              visaStatus: 'Company Visa',
              personal: { email: '', phone: '' },
              compensation: { baseSalary: 0, currency: 'AED', frequency: 'Monthly' }
          });
      }
      setEmployeeModalTab('personal');
      setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = () => {
      if (!selectedEmployee || !selectedEmployee.name) return;
      
      // Update if exists, else add
      const exists = employees.find(e => e.id === selectedEmployee.id);
      if (exists) {
          setEmployees(employees.map(e => e.id === selectedEmployee.id ? selectedEmployee : e));
      } else {
          setEmployees([...employees, selectedEmployee]);
      }
      setIsEmployeeModalOpen(false);
  };

  const updateSelectedEmployee = (section: keyof Employee, field: string, value: any) => {
      if (!selectedEmployee) return;
      
      if (section === 'personal' || section === 'employment' || section === 'compensation') {
          setSelectedEmployee({
              ...selectedEmployee,
              [section]: { ...selectedEmployee[section], [field]: value }
          });
      } else {
          // Top level fields
          setSelectedEmployee({ ...selectedEmployee, [field]: value });
      }
  };

  // Filter Attendance
  const filteredAttendance = useMemo(() => {
      return attendance.filter(rec => {
          const matchDate = rec.date === attFilterDate;
          const matchStatus = attFilterStatus === 'All' || rec.status === attFilterStatus;
          const matchSearch = rec.employeeName.toLowerCase().includes(attSearch.toLowerCase());
          return matchDate && matchStatus && matchSearch;
      });
  }, [attendance, attFilterDate, attFilterStatus, attSearch]);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Present': return 'bg-emerald-100 text-emerald-700';
          case 'Late': return 'bg-amber-100 text-amber-700';
          case 'Absent': return 'bg-rose-100 text-rose-700';
          case 'Early Leave': return 'bg-orange-100 text-orange-700';
          case 'Half Day': return 'bg-blue-100 text-blue-700';
          case 'On Leave': return 'bg-purple-100 text-purple-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  const handleProcessPayroll = () => {
      if (confirm("Generate WPS .SIF file for Pending salaries?")) {
          setPayroll(payroll.map(p => ({ ...p, status: 'Processed' })));
          alert("Payroll processed successfully. WPS file ready for download.");
      }
  };

  const handleLeaveAction = (id: string, action: 'Approved' | 'Rejected') => {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: action } : l));
  };

  // Analytics Data
  const deptData = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);
  const pieData = Object.keys(deptData).map((key, idx) => ({ name: key, value: deptData[key] }));

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Module Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'employees' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Users className="w-4 h-4" /> Employees
            </button>
            <button 
                onClick={() => setActiveTab('time')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'time' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Clock className="w-4 h-4" /> Attendance
            </button>
            <button 
                onClick={() => setActiveTab('leave')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'leave' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Plane className="w-4 h-4" /> Leave Mgmt
            </button>
            <button 
                onClick={() => setActiveTab('payroll')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'payroll' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Banknote className="w-4 h-4" /> Payroll (WPS)
            </button>
            <button 
                onClick={() => setActiveTab('recruitment')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'recruitment' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <UserPlus className="w-4 h-4" /> Recruitment
            </button>
            <button 
                onClick={() => setActiveTab('talent')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'talent' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Star className="w-4 h-4" /> Performance
            </button>
            <button 
                onClick={() => setActiveTab('structure')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'structure' ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <GitBranch className="w-4 h-4" /> Org Chart
            </button>
        </div>

        {/* --- EMPLOYEES DIRECTORY --- */}
        {activeTab === 'employees' && (
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users className="w-5 h-5 text-brand-600" /> Employee Directory</h3>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search by name, ID..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full" />
                        </div>
                        {canEditGeneral && (
                            <button onClick={() => handleOpenEmployeeModal()} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Employee
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
                        <div className="h-24 w-24">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" paddingAngle={5}>
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-700">Headcount by Dept</p>
                            <p className="text-xs text-slate-500">Total: {employees.length} Employees</p>
                        </div>
                    </div>
                    <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-around items-center">
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase">Active</p>
                            <p className="text-xl font-bold text-emerald-600">{employees.filter(e => e.status === 'Active').length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase">On Leave</p>
                            <p className="text-xl font-bold text-amber-600">{leaves.filter(l => l.status === 'Approved').length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-500 uppercase">Remote</p>
                            <p className="text-xl font-bold text-blue-600">{employees.filter(e => e.status === 'Remote').length}</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Visa Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                                                {canViewPersonal ? (
                                                    <p className="text-xs text-slate-500">{emp.workEmail}</p>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic">Hidden</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{emp.positionTitle}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{emp.department}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${emp.visaStatus === 'Company Visa' ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                                            <span className="text-xs text-slate-600">{emp.visaStatus}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenEmployeeModal(emp)} className="text-brand-600 hover:bg-brand-50 p-1.5 rounded transition">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- LEAVE MANAGEMENT --- */}
        {activeTab === 'leave' && (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Plane className="w-5 h-5 text-brand-600" /> Leave Management</h3>
                    <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Request
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-3 text-sm">Pending Approvals</h4>
                        <div className="space-y-3">
                            {leaves.filter(l => l.status === 'Pending').map(leave => (
                                <div key={leave.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{leave.employeeName}</p>
                                            <p className="text-xs text-slate-500">{leave.type} Leave • {leave.days} Days</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{leave.startDate} to {leave.endDate}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleLeaveAction(leave.id, 'Approved')} className="p-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100" title="Approve"><CheckCircle className="w-4 h-4"/></button>
                                            <button onClick={() => handleLeaveAction(leave.id, 'Rejected')} className="p-1 bg-rose-50 text-rose-600 rounded hover:bg-rose-100" title="Reject"><XCircle className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-1.5 rounded">"{leave.reason}"</p>
                                </div>
                            ))}
                            {leaves.filter(l => l.status === 'Pending').length === 0 && <p className="text-xs text-slate-400 italic">No pending requests.</p>}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-3 text-sm">Leave Balance Overview (Team)</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1"><span className="font-bold text-slate-700">Annual Leave Consumed</span><span>45%</span></div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full"><div className="bg-brand-500 h-1.5 rounded-full" style={{width: '45%'}}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1"><span className="font-bold text-slate-700">Sick Leave Consumed</span><span>12%</span></div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full"><div className="bg-rose-500 h-1.5 rounded-full" style={{width: '12%'}}></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Days</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {leaves.map(leave => (
                                <tr key={leave.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{leave.employeeName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{leave.type}</td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{leave.startDate} - {leave.endDate}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{leave.days}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                            leave.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                        }`}>{leave.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- ATTENDANCE MANAGEMENT CONSOLE --- */}
        {activeTab === 'time' && (
            <div className="p-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600"><CheckCircle className="w-6 h-6" /></div>
                        <div><p className="text-xs font-bold text-emerald-800 uppercase">Present Today</p><h3 className="text-2xl font-bold text-emerald-700">{attendance.filter(a => a.status === 'Present' || a.status === 'Late').length}</h3></div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><Clock className="w-6 h-6" /></div>
                        <div><p className="text-xs font-bold text-amber-800 uppercase">Late Arrivals</p><h3 className="text-2xl font-bold text-amber-700">{attendance.filter(a => a.status === 'Late').length}</h3></div>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600"><X className="w-6 h-6" /></div>
                        <div><p className="text-xs font-bold text-rose-800 uppercase">Absent</p><h3 className="text-2xl font-bold text-rose-700">2</h3></div>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600"><LogOut className="w-6 h-6" /></div>
                        <div><p className="text-xs font-bold text-orange-800 uppercase">Early Leave</p><h3 className="text-2xl font-bold text-orange-700">{attendance.filter(a => a.status === 'Early Leave').length}</h3></div>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search Employee..." value={attSearch} onChange={(e) => setAttSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-full md:w-64" />
                        </div>
                        <input type="date" value={attFilterDate} onChange={(e) => setAttFilterDate(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600" />
                        <select value={attFilterStatus} onChange={(e) => setAttFilterStatus(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white">
                            <option value="All">All Statuses</option>
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                        <button 
                            onClick={handleStartCheckIn}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-md"
                        >
                            <MapPin className="w-4 h-4" /> Remote Check-In
                        </button>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Check In</th>
                                <th className="px-6 py-4">Check Out</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredAttendance.map(rec => (
                                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-700 text-sm">{rec.employeeName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{rec.date}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{rec.checkIn || '--:--'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{rec.checkOut || '--:--'}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(rec.status)}`}>{rec.status}</span></td>
                                    <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {rec.location}</td>
                                    <td className="px-6 py-4">
                                        {rec.selfieUrl ? (
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                                                <img src={rec.selfieUrl} alt="Verified" className="w-full h-full object-cover" />
                                            </div>
                                        ) : <span className="text-xs text-slate-400">N/A</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- PAYROLL MODULE --- */}
        {activeTab === 'payroll' && (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-slate-800">Payroll Processing (WPS)</h3>
                        <p className="text-sm text-slate-500">Review and finalize salaries for the current month.</p>
                    </div>
                    <button 
                        onClick={handleProcessPayroll}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        <Banknote className="w-4 h-4" /> Generate WPS File
                    </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex gap-8">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Total Payroll</p>
                        <p className="text-2xl font-bold text-slate-800">AED {payroll.reduce((acc, p) => acc + p.netSalary, 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Employees</p>
                        <p className="text-2xl font-bold text-slate-800">{payroll.length}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                        <p className="text-2xl font-bold text-amber-600">Pending Approval</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4 text-right">Basic Salary</th>
                                <th className="px-6 py-4 text-right">Allowances</th>
                                <th className="px-6 py-4 text-right">Deductions</th>
                                <th className="px-6 py-4 text-right">Net Pay</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {payroll.map(entry => (
                                <tr key={entry.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-bold text-slate-700 text-sm">{entry.employeeName}</td>
                                    <td className="px-6 py-4 text-right text-sm font-mono text-slate-600">{entry.basicSalary.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-sm font-mono text-slate-600">{entry.allowances.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-sm font-mono text-rose-600">({entry.deductions.toLocaleString()})</td>
                                    <td className="px-6 py-4 text-right text-sm font-bold font-mono text-slate-800">{entry.netSalary.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${entry.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {entry.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => setSelectedPayslip(entry)}
                                            className="text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto"
                                        >
                                            <FileText className="w-3 h-3" /> Slip
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- RECRUITMENT ATS --- */}
        {activeTab === 'recruitment' && (
            <div className="p-6 h-[600px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Recruitment Pipeline (ATS)</h3>
                    <button className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Add Candidate
                    </button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 h-full">
                    {['New', 'Screening', 'Interview', 'Offer', 'Hired'].map(stage => (
                        <div key={stage} className="min-w-[250px] bg-slate-50 rounded-xl p-4 flex flex-col h-full border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700 text-sm uppercase">{stage}</h4>
                                <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-slate-500 border border-slate-200">
                                    {candidates.filter(c => c.stage === stage).length}
                                </span>
                            </div>
                            <div className="space-y-3 overflow-y-auto flex-1">
                                {candidates.filter(c => c.stage === stage).map(candidate => (
                                    <div key={candidate.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:border-brand-300 transition">
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className="font-bold text-slate-800 text-sm">{candidate.name}</h5>
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-2 h-2 ${i < candidate.rating ? 'fill-current' : 'text-slate-200'}`} />)}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">{candidate.appliedFor}</p>
                                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                                            <span>{candidate.applicationDate}</span>
                                            <span className="bg-slate-100 px-1.5 py-0.5 rounded">Resume</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- TALENT & PERFORMANCE --- */}
        {activeTab === 'talent' && (
            <div className="p-6">
                <h3 className="font-bold text-slate-800 mb-6">Performance Management</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Recent Reviews</h4>
                        <div className="space-y-4">
                            {mockReviews.map(review => (
                                <div key={review.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{review.employeeName}</p>
                                            <p className="text-xs text-slate-500">Reviewed by {review.reviewer} on {review.reviewDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-brand-600">{review.rating}</span>
                                            <span className="text-xs text-slate-400">/5.0</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 italic">"{review.comments}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> Goal Tracking</h4>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">Sales Targets Q2</span>
                                    <span className="font-bold text-emerald-600">85%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">Project Delivery On-Time</span>
                                    <span className="font-bold text-brand-600">72%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-brand-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">Training Completion</span>
                                    <span className="font-bold text-amber-600">45%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- ORG STRUCTURE --- */}
        {activeTab === 'structure' && (
            <div className="p-6 h-[600px] overflow-auto flex justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-8 py-8">
                    {/* Level 1: CEO */}
                    <div className="flex flex-col items-center">
                        <div className="w-64 bg-white p-4 rounded-xl border-2 border-brand-500 shadow-lg text-center relative z-10">
                            <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto mb-2 flex items-center justify-center font-bold text-slate-600">A</div>
                            <p className="font-bold text-slate-800">Ahmed Al-Mansouri</p>
                            <p className="text-xs text-brand-600 font-bold uppercase">General Manager</p>
                        </div>
                        <div className="h-8 w-px bg-slate-300"></div>
                    </div>

                    {/* Level 2: Heads */}
                    <div className="flex gap-8 relative">
                        {/* Connector Line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-slate-300 max-w-[calc(100%-260px)]"></div>
                        
                        <div className="flex flex-col items-center relative">
                            <div className="h-4 w-px bg-slate-300 absolute -top-4"></div>
                            <div className="w-56 bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                                <p className="font-bold text-slate-700 text-sm">Sarah Jones</p>
                                <p className="text-[10px] text-slate-500 uppercase">Finance Manager</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center relative">
                            <div className="h-4 w-px bg-slate-300 absolute -top-4"></div>
                            <div className="w-56 bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                                <p className="font-bold text-slate-700 text-sm">John Smith</p>
                                <p className="text-[10px] text-slate-500 uppercase">Sales Director</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center relative">
                            <div className="h-4 w-px bg-slate-300 absolute -top-4"></div>
                            <div className="w-56 bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                                <p className="font-bold text-slate-700 text-sm">Maria Rodriguez</p>
                                <p className="text-[10px] text-slate-500 uppercase">HR Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Remote Check-In Modal */}
      {isCheckInModalOpen && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-brand-600" /> Remote Check-In
                      </h3>
                      <button onClick={() => { setIsCheckInModalOpen(false); if(videoRef.current && videoRef.current.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()); }}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  
                  <div className="p-6 flex flex-col items-center space-y-6">
                      {/* Step 1: Location Check */}
                      <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                          {isLocLoading ? (
                              <div className="flex flex-col items-center py-4">
                                  <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-2" />
                                  <p className="text-sm font-bold text-slate-600">Acquiring GPS Location...</p>
                              </div>
                          ) : (
                              <div>
                                  <div className="flex justify-center mb-2">
                                      {isWithinRange ? <CheckCircle className="w-8 h-8 text-emerald-500" /> : <AlertTriangle className="w-8 h-8 text-rose-500" />}
                                  </div>
                                  <p className={`text-sm font-bold ${isWithinRange ? 'text-emerald-700' : 'text-rose-700'}`}>
                                      {isWithinRange ? 'Location Verified: Within Geofence' : 'Location Warning: Outside Office Range'}
                                  </p>
                                  {currentLoc && (
                                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                                          {currentLoc.lat.toFixed(6)}, {currentLoc.lng.toFixed(6)}
                                      </p>
                                  )}
                              </div>
                          )}
                      </div>

                      {/* Step 2: Camera Selfie */}
                      {!isLocLoading && (
                          <div className="w-full">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-2 text-center">Identity Verification</p>
                              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-slate-200">
                                  {selfieImage ? (
                                      <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" />
                                  ) : (
                                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                  )}
                                  {!selfieImage && (
                                      <button 
                                        onClick={handleCaptureSelfie}
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 border-4 border-slate-200/50"
                                      >
                                          <div className="w-12 h-12 bg-rose-500 rounded-full"></div>
                                      </button>
                                  )}
                              </div>
                              {selfieImage && (
                                  <button onClick={() => setSelfieImage(null)} className="mt-2 text-xs text-brand-600 font-bold hover:underline w-full text-center">Retake Photo</button>
                              )}
                          </div>
                      )}

                      <button 
                        onClick={handleSubmitCheckIn}
                        disabled={isLocLoading || !selfieImage}
                        className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
                      >
                          Confirm Check-In
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Detailed Payslip Modal */}
      {selectedPayslip && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200 print:shadow-none print:w-full">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 print:hidden">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-brand-600" /> Salary Slip
                      </h3>
                      <div className="flex gap-2">
                          <button onClick={() => window.print()} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"><Printer className="w-5 h-5" /></button>
                          <button onClick={() => setSelectedPayslip(null)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"><X className="w-5 h-5" /></button>
                      </div>
                  </div>
                  
                  <div className="p-8 bg-white text-slate-800 font-serif" id="print-container">
                      <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                          <h1 className="text-2xl font-bold uppercase tracking-wider">Aljaberti ONE</h1>
                          <p className="text-xs text-slate-500 uppercase mt-1">Project Management Services LLC</p>
                          <p className="text-sm font-bold mt-4">Payslip for May 2024</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 text-sm mb-6">
                          <div>
                              <p><span className="font-bold">Employee:</span> {selectedPayslip.employeeName}</p>
                              <p><span className="font-bold">ID:</span> {selectedPayslip.employeeId}</p>
                              <p><span className="font-bold">Department:</span> Management</p>
                          </div>
                          <div className="text-right">
                              <p><span className="font-bold">Pay Date:</span> 28/05/2024</p>
                              <p><span className="font-bold">Bank:</span> ADCB</p>
                              <p><span className="font-bold">Acct:</span> **** 4567</p>
                          </div>
                      </div>

                      <div className="border border-slate-300 mb-6">
                          <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-300 font-bold text-xs uppercase p-2">
                              <div>Earnings</div>
                              <div className="text-right">Amount (AED)</div>
                          </div>
                          <div className="divide-y divide-slate-100">
                              <div className="grid grid-cols-2 p-2 text-sm">
                                  <div>Basic Salary</div>
                                  <div className="text-right">{selectedPayslip.basicSalary.toLocaleString()}</div>
                              </div>
                              <div className="grid grid-cols-2 p-2 text-sm">
                                  <div>Housing Allowance</div>
                                  <div className="text-right">{(selectedPayslip.allowances * 0.6).toLocaleString()}</div>
                              </div>
                              <div className="grid grid-cols-2 p-2 text-sm">
                                  <div>Transport Allowance</div>
                                  <div className="text-right">{(selectedPayslip.allowances * 0.4).toLocaleString()}</div>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 bg-slate-100 border-y border-slate-300 font-bold text-xs uppercase p-2 mt-4">
                              <div>Deductions</div>
                              <div className="text-right">Amount (AED)</div>
                          </div>
                          <div className="divide-y divide-slate-100">
                              <div className="grid grid-cols-2 p-2 text-sm">
                                  <div>Absence / Unpaid Leave</div>
                                  <div className="text-right text-rose-600">{selectedPayslip.deductions > 0 ? `-${selectedPayslip.deductions.toLocaleString()}` : '0.00'}</div>
                              </div>
                          </div>
                      </div>

                      <div className="flex justify-between items-center border-t-2 border-slate-800 pt-4">
                          <div className="text-sm">
                              <p className="font-bold">Net Pay:</p>
                              <p className="text-[10px] text-slate-500 uppercase">Transfer to Bank</p>
                          </div>
                          <div className="text-2xl font-bold">AED {selectedPayslip.netSalary.toLocaleString()}</div>
                      </div>

                      <div className="mt-12 text-[10px] text-center text-slate-400">
                          This is a system-generated document. No signature required.
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Employee Modal */}
      {isEmployeeModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-brand-600" />
                          {selectedEmployee.id.includes('EMP-') && selectedEmployee.name ? `Edit: ${selectedEmployee.name}` : 'New Employee Onboarding'}
                      </h3>
                      <button onClick={() => setIsEmployeeModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                  </div>

                  <div className="flex border-b border-slate-200 px-6">
                      <button onClick={() => setEmployeeModalTab('personal')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${employeeModalTab === 'personal' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500'}`}>Personal</button>
                      <button onClick={() => setEmployeeModalTab('employment')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${employeeModalTab === 'employment' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500'}`}>Employment</button>
                      <button onClick={() => setEmployeeModalTab('compensation')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${employeeModalTab === 'compensation' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500'}`}>Compensation</button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 bg-white">
                      {employeeModalTab === 'personal' && (
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                  <input 
                                    type="text" 
                                    className="w-full border rounded p-2 text-sm" 
                                    value={selectedEmployee.name} 
                                    onChange={(e) => updateSelectedEmployee('personal', 'name', e.target.value)} 
                                    disabled={!canEditGeneral}
                                  />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                                      <div className="relative">
                                          <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                          <input 
                                            type="email" 
                                            className="w-full border rounded pl-9 p-2 text-sm" 
                                            value={canViewPersonal ? selectedEmployee.personal?.email : '***@***.***'} 
                                            onChange={(e) => updateSelectedEmployee('personal', 'email', e.target.value)}
                                            disabled={!canEditGeneral || !canViewPersonal} 
                                          />
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                                      <div className="relative">
                                          <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                          <input 
                                            type="tel" 
                                            className="w-full border rounded pl-9 p-2 text-sm" 
                                            value={canViewPersonal ? selectedEmployee.personal?.phone : '+971 *** ***'} 
                                            onChange={(e) => updateSelectedEmployee('personal', 'phone', e.target.value)}
                                            disabled={!canEditGeneral || !canViewPersonal}
                                          />
                                      </div>
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Home Address</label>
                                  <textarea 
                                    className="w-full border rounded p-2 text-sm h-20 resize-none" 
                                    value={canViewPersonal ? selectedEmployee.personal?.address : 'Hidden'} 
                                    onChange={(e) => updateSelectedEmployee('personal', 'address', e.target.value)}
                                    disabled={!canEditGeneral || !canViewPersonal}
                                  />
                              </div>
                          </div>
                      )}

                      {employeeModalTab === 'employment' && (
                          <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Position Title</label>
                                      <input type="text" className="w-full border rounded p-2 text-sm" value={selectedEmployee.positionTitle || ''} onChange={(e) => updateSelectedEmployee('employment', 'positionTitle', e.target.value)} disabled={!canEditGeneral} />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                                      <input type="text" className="w-full border rounded p-2 text-sm" value={selectedEmployee.department} onChange={(e) => updateSelectedEmployee('employment', 'department', e.target.value)} disabled={!canEditGeneral} />
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Join Date</label>
                                      <div className="relative">
                                          <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                          <input type="date" className="w-full border rounded pl-9 p-2 text-sm" value={selectedEmployee.joinDate} onChange={(e) => updateSelectedEmployee('employment', 'joinDate', e.target.value)} disabled={!canEditGeneral} />
                                      </div>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Work Location</label>
                                      <div className="relative">
                                          <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                          <input type="text" className="w-full border rounded pl-9 p-2 text-sm" value={selectedEmployee.location} onChange={(e) => updateSelectedEmployee('employment', 'location', e.target.value)} disabled={!canEditGeneral} />
                                      </div>
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employment Type</label>
                                      <select className="w-full border rounded p-2 text-sm bg-white" value={selectedEmployee.employmentType} onChange={(e) => updateSelectedEmployee('employment', 'employmentType', e.target.value)} disabled={!canEditGeneral}>
                                          <option>Permanent</option>
                                          <option>Contract</option>
                                          <option>Temporary</option>
                                          <option>Intern</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Visa Status</label>
                                      <select className="w-full border rounded p-2 text-sm bg-white" value={selectedEmployee.visaStatus} onChange={(e) => updateSelectedEmployee('employment', 'visaStatus', e.target.value)} disabled={!canEditGeneral}>
                                          <option>Company Visa</option>
                                          <option>Own Visa</option>
                                      </select>
                                  </div>
                              </div>
                          </div>
                      )}

                      {employeeModalTab === 'compensation' && (
                          <div className="space-y-6">
                              {!canViewSalary ? (
                                  <div className="flex flex-col items-center justify-center h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                                      <Lock className="w-8 h-8 mb-2" />
                                      <p className="text-sm font-bold">Access Restricted</p>
                                      <p className="text-xs">You do not have permission to view salary data.</p>
                                  </div>
                              ) : (
                                  <>
                                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
                                          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600"><Banknote className="w-6 h-6" /></div>
                                          <div>
                                              <p className="text-xs font-bold text-emerald-700 uppercase">Total Compensation</p>
                                              <p className="text-2xl font-bold text-emerald-800">{selectedEmployee.compensation?.currency} {selectedEmployee.compensation?.baseSalary.toLocaleString()}</p>
                                          </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Base Salary</label>
                                              <input 
                                                type="number" 
                                                className="w-full border rounded p-2 text-sm" 
                                                value={selectedEmployee.compensation?.baseSalary} 
                                                onChange={(e) => updateSelectedEmployee('compensation', 'baseSalary', parseFloat(e.target.value))}
                                                disabled={!canEditComp}
                                              />
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Currency</label>
                                              <select 
                                                className="w-full border rounded p-2 text-sm bg-white" 
                                                value={selectedEmployee.compensation?.currency} 
                                                onChange={(e) => updateSelectedEmployee('compensation', 'currency', e.target.value)}
                                                disabled={!canEditComp}
                                              >
                                                  <option>AED</option>
                                                  <option>USD</option>
                                                  <option>EUR</option>
                                              </select>
                                          </div>
                                      </div>

                                      <div className="pt-4 border-t border-slate-100">
                                          <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2"><CreditCard className="w-4 h-4"/> Bank Details</h4>
                                          <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bank Name</label>
                                                  <input 
                                                    type="text" 
                                                    className="w-full border rounded p-2 text-sm" 
                                                    value={selectedEmployee.compensation?.bankName || ''} 
                                                    onChange={(e) => updateSelectedEmployee('compensation', 'bankName', e.target.value)}
                                                    disabled={!canEditComp}
                                                  />
                                              </div>
                                              <div>
                                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">IBAN</label>
                                                  <input 
                                                    type="text" 
                                                    className="w-full border rounded p-2 text-sm font-mono" 
                                                    value={selectedEmployee.compensation?.iban || ''} 
                                                    onChange={(e) => updateSelectedEmployee('compensation', 'iban', e.target.value)}
                                                    disabled={!canEditComp}
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  </>
                              )}
                          </div>
                      )}
                  </div>

                  <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 rounded-b-xl">
                      <button onClick={() => setIsEmployeeModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition">Cancel</button>
                      {canEditGeneral && (
                          <button onClick={handleSaveEmployee} className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20">
                              Save Employee Record
                          </button>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default HRModule;
