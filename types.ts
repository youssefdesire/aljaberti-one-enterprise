
import React from 'react';

export enum InvoiceStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  PAID = 'Paid',
  OVERDUE = 'Overdue'
}

export enum DealStage {
  LEAD = 'Lead',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export enum ExpenseStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed'
}

export enum UserRole {
  ADMIN = 'Super Admin',
  MANAGER = 'Manager',
  USER = 'User',
  VIEWER = 'Viewer'
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

// --- EVENTS MODULE START ---
export enum EventStatus {
  PLANNING = 'Planning',
  CONFIRMED = 'Confirmed',
  LIVE = 'Live',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum EventType {
  CORPORATE = 'Corporate',
  WORKSHOP = 'Workshop',
  CLIENT_MEETING = 'Client Meeting',
  TEAM_BUILDING = 'Team Building',
  CONFERENCE = 'Conference',
  SITE_LAUNCH = 'Site Launch'
}

export interface EventAttendee {
  id: string;
  name: string;
  email: string;
  type: 'Employee' | 'Client' | 'Guest';
  rsvpStatus: 'Pending' | 'Going' | 'Not Going' | 'Maybe';
  checkedIn: boolean;
  notes?: string;
}

export interface EventScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface CompanyEvent {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string; // Employee Name
  budget: number;
  actualCost: number;
  description?: string;
  attendees: EventAttendee[];
  schedule: EventScheduleItem[];
  coverImage?: string;
}
// --- EVENTS MODULE END ---

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // 5% usually
  amount: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  items: number;
  paymentDate?: string;
  paymentMethod?: string;
}

export interface PurchaseOrder {
  id: string;
  vendorName: string;
  amount: number;
  date: string;
  deliveryDate: string;
  status: 'Draft' | 'Sent' | 'Received';
  items: number;
}

export interface Expense {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  currency: string;
  vatAmount: number;
  date: string;
  status: ExpenseStatus;
  receiptAttached: boolean;
  description?: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  owner: string;
  lastActivity?: string;
}

export interface DealActivity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  content: string;
  date: string;
  user: string;
}

export interface Quote {
  id: string;
  dealId: string;
  reference: string;
  amount: number;
  date: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  type: 'Customer' | 'Partner' | 'Vendor';
  lastContact: string;
}

// --- CLIENTS MODULE START ---

export interface ClientContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface Client {
  id: string;
  code: string; // e.g., CUST-001
  name: string; // Company Name
  industry: string;
  type: 'Corporate' | 'Individual' | 'Government';
  status: 'Active' | 'Inactive' | 'Prospect';
  serviceType?: string;
  
  // Contact Info
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  country: string;

  // Financials
  trn?: string; // Tax Registration Number
  currency: string;
  paymentTerms: 'Immediate' | 'Net 15' | 'Net 30' | 'Net 60';
  creditLimit?: number;
  outstandingBalance: number;

  // Relationships
  accountManager: string; // Employee Name
  since: string; // Date joined
  
  // Nested Data
  contacts: ClientContact[];
  documents?: DocumentFile[];
  notes?: string;
  logoUrl?: string;
}

// --- CLIENTS MODULE END ---

// --- SERVICE REQUEST START ---
export interface ServiceRequest {
  id: string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  projectName: string;
  projectLocation: string;
  selectedServices: string[]; // List of selected service strings
  additionalNotes?: string;
  submittedDate: string;
  status: 'New' | 'Reviewing' | 'Approved';
}
// --- SERVICE REQUEST END ---

export interface JobPosition {
  id: string;
  title: string;
  code: string;
  department: string;
  grade: 'Entry' | 'Junior' | 'Mid' | 'Senior' | 'Executive';
  costCenter: string;
  status: 'Filled' | 'Vacant' | 'Frozen';
  holderId?: string; // Links to Employee
  reportsToPositionId?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface Asset {
  id: string;
  type: 'Laptop' | 'Phone' | 'Vehicle' | 'Access Card';
  identifier: string; // Serial Num
  assignedDate: string;
}

export interface KPI {
    id: string;
    name: string;
    target: number;
    actual: number;
    unit: string;
    status: 'On Track' | 'At Risk' | 'Behind';
}

export interface Employee {
  // Core Identifiers
  id: string;
  name: string; // Full Legal Name
  positionId: string; 
  positionTitle?: string; 
  department: string;
  status: 'Active' | 'On Leave' | 'Remote' | 'Terminated';
  location: string;
  joinDate: string;
  avatarUrl?: string; 
  employmentType: 'Permanent' | 'Contract' | 'Temporary' | 'Intern';
  visaStatus: 'Company Visa' | 'Own Visa';

  // Nested Sections
  personal?: {
    preferredName?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
    email: string;
    phone: string;
    address?: string;
    emergencyContact?: EmergencyContact;
  };

  employment?: {
    legalEntity: string;
    originalHireDate?: string;
    managerId?: string;
    dottedLineManagerId?: string;
    jobGrade?: string;
    costCenter?: string;
    subDepartment?: string;
  };

  compensation?: {
    baseSalary: number;
    currency: string;
    frequency: 'Monthly' | 'Weekly';
    iban?: string;
    bankName?: string;
  };

  skills?: string[];
  education?: Education[];
  languages?: string[];
  
  workEmail?: string;
  assets?: Asset[];

  offboarding?: {
    terminationDate?: string;
    type?: 'Voluntary' | 'Involuntary';
    reason?: string;
    eligibleForRehire?: boolean;
  };

  performanceScore?: number;
  attendanceScore?: number;
  kpis?: KPI[];
}

export interface Candidate {
  id: string;
  name: string;
  appliedFor: string;
  stage: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  rating: number;
  applicationDate: string;
  email: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewDate: string;
  rating: number;
  reviewer: string;
  goalsMet: boolean;
  comments: string;
}

export interface EmployeeDocument {
  id: string;
  type: 'Passport' | 'Visa' | 'Emirates ID' | 'Labor Card' | 'Contract';
  number: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  fileUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent' | 'Early Leave' | 'Half Day' | 'On Leave';
  location: string; // 'Office' | 'Remote' | 'Site'
  workHours?: number;
  coordinates?: { lat: number; lng: number };
  selfieUrl?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Annual' | 'Sick' | 'Emergency';
  startDate: string;
  endDate: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Pending' | 'Processed';
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  type: 'Product' | 'Service';
  category: string;
  stock: number;
  price: number;
  status: StockStatus;
  warehouse?: string;
  imageUrl?: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  reference: string;
  user: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  paymentTerms: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  raci: 'R' | 'A' | 'C' | 'I';
  email: string;
  phone?: string;
  isExternal?: boolean;
}

export interface ProjectRisk {
  id: string;
  description: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigationPlan: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface FileVersion {
  id: string;
  versionNumber: number;
  url: string;
  date: string;
  uploadedBy: string;
  size?: string;
  name: string; // The filename at this version
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'image' | 'code' | 'doc';
  url?: string;
  uploadedBy: string;
  date: string;
  size?: string;
  parentId?: string;
  
  // Version Control
  currentVersion: number;
  versions?: FileVersion[];
}

export interface ProjectThread {
  id: string;
  title: string;
  category: 'Announcement' | 'Discussion' | 'Decision' | 'Q&A';
  author: string;
  date: string;
  replies: number;
  isPinned?: boolean;
}

export interface ProjectKPIs {
    budgetAdherence: number; // Percentage used (e.g. 95)
    scheduleVariance: number; // Days (Positive = Ahead, Negative = Behind)
    taskCompletionRate: number; // Percentage
    clientSatisfaction: number; // 0-10 Score
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  client: string;
  clientPOC?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  budget: number;
  spent: number;
  startDate: string;
  deadline: string;
  dueDate?: string;
  status: ProjectStatus;
  completion: number;
  manager: string;
  createdBy?: string; 
  coverImage?: string; // New field
  
  team?: ProjectMember[];
  risks?: ProjectRisk[];
  files?: ProjectFile[];
  threads?: ProjectThread[];
  kpis?: ProjectKPIs;

  healthScore?: number;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startDate?: string;
  subtasks?: Subtask[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  department: string;
  isOnline: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  requester: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdDate: string;
  assignedTo: string;
  department: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: string;
  message: string;
  timestamp: string;
  isInternal: boolean;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'image' | 'sheet' | 'doc' | 'video' | 'audio';
  size?: string;
  modified: string;
  owner: string;
  sharedWith?: string[];
  url?: string;
}

export interface ChartData {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
  prediction?: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface SystemActivity {
  id: string;
  type: 'invoice' | 'deal' | 'task' | 'alert' | 'user';
  description: string;
  time: string;
  user: string;
}

export interface CompanyProfile {
  name: string;
  trn: string;
  address: string;
  email: string;
  phone: string;
  logoUrl?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  unreadCount?: number;
  description?: string;
  isOnline?: boolean;
}

export interface TeamMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name: string;
  }[];
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  headcount: number;
  location: string;
  budget: string;
  departmentHead?: string; // Additional
}

export type AssetCategory = 'Vehicle' | 'IT Equipment' | 'Furniture' | 'Machinery' | 'SIM Card' | 'Access Control' | 'Building';

export interface FixedAsset {
  id: string;
  name: string;
  assetTag: string;
  category: AssetCategory;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  status: 'Active' | 'Under Maintenance' | 'Disposed' | 'Written Off' | 'In Storage';
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
  serialNumber?: string;
  assignedTo?: string; // Employee Name or ID
  location?: string; // e.g., 'Dubai HQ', 'Warehouse B'
  warrantyExpiry?: string;
  notes?: string;
}

// --- OPERATIONS MODULE TYPES ---
export interface MaintenanceRequest {
    id: string;
    assetId: string;
    assetName: string;
    reportedBy: string;
    dateReported: string;
    issue: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Completed';
    cost?: number;
}

export interface OperationLog {
    id: string;
    date: string;
    site: string;
    supervisor: string;
    workersCount: number;
    weather: string;
    notes: string;
    incidents?: string;
}
// --- END OPERATIONS ---

export interface PermissionItem {
    id: string;
    module: string;
    type: string;
    name: string;
    admin: boolean;
    manager: boolean;
    user: boolean;
    viewer: boolean;
}

// --- SETTINGS TYPES ---
export interface AutomationRule {
    id: string;
    name: string;
    module: 'Finance' | 'HR' | 'Inventory' | 'Projects' | 'CRM';
    trigger: string;
    condition: string;
    action: string;
    active: boolean;
}
