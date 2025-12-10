
import React, { useState } from 'react';
import { Project, ProjectStatus, UserRole, ProjectTask, ProjectRisk, ProjectMember, ProjectKPIs, ProjectFile, FileVersion } from '../types';
import { 
  CheckSquare, Plus, Search, Filter, Calendar, 
  DollarSign, User, Briefcase, Clock, Edit, Trash2, X, 
  Activity, Upload, History, RotateCcw, FileText, Download, Star, AlertTriangle, Image as ImageIcon,
  ArrowLeft, Smile, RefreshCw, ChevronDown, ChevronRight, CornerDownRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock Data
const mockProjects: Project[] = [
  {
    id: 'PRJ-001',
    code: 'WEB-RED-24',
    name: 'Website Redesign',
    description: 'Corporate website overhaul with new branding.',
    client: 'Hilton JBR',
    budget: 50000,
    spent: 12000,
    startDate: '2024-05-01',
    deadline: '2024-07-01',
    dueDate: '2024-07-01',
    status: ProjectStatus.IN_PROGRESS,
    completion: 35,
    manager: 'Ahmed Al-Mansouri',
    healthScore: 92,
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
    team: [
        { id: 'M1', name: 'Ahmed Al-Mansouri', role: 'Project Manager', raci: 'A', email: 'ahmed@aljaberti.ae' },
        { id: 'M2', name: 'Sarah Jones', role: 'Frontend Dev', raci: 'R', email: 'sarah@aljaberti.ae' }
    ],
    risks: [
        { id: 'R1', description: 'Design delay due to client feedback', probability: 'Medium', impact: 'High', mitigationPlan: 'Weekly review meetings', status: 'Open' }
    ],
    files: [
        { 
            id: 'PF-001', name: 'Project_Scope_v1.pdf', type: 'pdf', uploadedBy: 'Ahmed Al-Mansouri', date: '2024-05-01', size: '1.2 MB', currentVersion: 1, versions: [] 
        }
    ],
    kpis: {
        budgetAdherence: 24, // 12000 / 50000
        scheduleVariance: 2, // 2 days ahead
        taskCompletionRate: 25,
        clientSatisfaction: 9
    }
  },
  {
    id: 'PRJ-002',
    code: 'APP-MOB-24',
    name: 'Mobile App Development',
    description: 'Customer loyalty app for iOS and Android.',
    client: 'Tech Corp',
    budget: 120000,
    spent: 45000,
    startDate: '2024-04-15',
    deadline: '2024-09-15',
    dueDate: '2024-09-15',
    status: ProjectStatus.PLANNING,
    completion: 10,
    manager: 'Sarah Jones',
    healthScore: 78,
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80',
    team: [],
    risks: [],
    files: [],
    kpis: {
        budgetAdherence: 37.5,
        scheduleVariance: 0,
        taskCompletionRate: 10,
        clientSatisfaction: 8
    }
  },
   {
    id: 'PRJ-003',
    code: 'ERP-IMP-24',
    name: 'ERP Implementation',
    description: 'Internal system migration to new ERP.',
    client: 'Aljaberti Group',
    budget: 250000,
    spent: 200000,
    startDate: '2024-01-10',
    deadline: '2024-06-30',
    dueDate: '2024-06-30',
    status: ProjectStatus.IN_PROGRESS,
    completion: 80,
    manager: 'Rajesh Kumar',
    healthScore: 45, // At risk
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    team: [],
    risks: [],
    files: [],
    kpis: {
        budgetAdherence: 80,
        scheduleVariance: -15, // 15 days behind
        taskCompletionRate: 75,
        clientSatisfaction: 6
    }
  }
];

const mockTasks: ProjectTask[] = [
    { 
        id: 'T1', 
        projectId: 'PRJ-001', 
        title: 'Design Homepage Mockup', 
        assignee: 'Sarah Jones', 
        dueDate: '2024-05-25', 
        status: 'Done', 
        priority: 'High',
        subtasks: [
            { id: 'ST1-1', title: 'Create Wireframe', isCompleted: true },
            { id: 'ST1-2', title: 'Select Color Palette', isCompleted: true },
            { id: 'ST1-3', title: 'Finalize Hero Section', isCompleted: true }
        ]
    },
    { id: 'T2', projectId: 'PRJ-001', title: 'Setup React Repository', assignee: 'Dev Team', dueDate: '2024-05-26', status: 'In Progress', priority: 'Medium', subtasks: [] },
    { id: 'T3', projectId: 'PRJ-001', title: 'Client Feedback Meeting', assignee: 'Ahmed Al-Mansouri', dueDate: '2024-05-28', status: 'To Do', priority: 'High', subtasks: [] },
    { id: 'T4', projectId: 'PRJ-001', title: 'Integrate API', assignee: 'Backend Team', dueDate: '2024-06-05', status: 'To Do', priority: 'Critical', subtasks: [] },
];

interface ProjectsModuleProps {
    currentUserRole?: UserRole;
    currentUserName?: string;
    checkPermission?: (name: string) => boolean;
}

const ProjectsModule: React.FC<ProjectsModuleProps> = ({ currentUserRole = UserRole.USER, currentUserName = 'Guest', checkPermission }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
      status: 'All',
      manager: 'All',
      client: 'All',
      deadlineStart: '',
      deadlineEnd: ''
  });

  // Detailed View State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'kpis' | 'tasks' | 'team' | 'files' | 'risks'>('overview');
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>(mockTasks);
  const [taskViewMode, setTaskViewMode] = useState<'list' | 'board' | 'gantt'>('list');
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<{ [key: string]: string }>({});

  // KPI Editing
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [editingKpis, setEditingKpis] = useState<ProjectKPIs>({
      budgetAdherence: 0,
      scheduleVariance: 0,
      taskCompletionRate: 0,
      clientSatisfaction: 0
  });

  // Form State
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({
      name: '', client: '', budget: 0, status: ProjectStatus.PLANNING, completion: 0, manager: currentUserName, coverImage: ''
  });

  // File Upload & Versioning State
  const [uploadConflictModalOpen, setUploadConflictModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedFileForHistory, setSelectedFileForHistory] = useState<ProjectFile | null>(null);

  // Permission Checks
  const canCreate = checkPermission ? checkPermission('Create Projects') : true;
  const canDelete = checkPermission ? checkPermission('Delete Projects') : true;

  // Extract unique values for filters
  const uniqueManagers = Array.from(new Set(projects.map(p => p.manager)));
  const uniqueClients = Array.from(new Set(projects.map(p => p.client)));

  // Filter Logic
  const filteredProjects = projects.filter(project => {
      const matchesSearch = 
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status === 'All' || project.status === filters.status;
      const matchesManager = filters.manager === 'All' || project.manager === filters.manager;
      const matchesClient = filters.client === 'All' || project.client === filters.client;
      
      let matchesDeadline = true;
      if (filters.deadlineStart) {
          matchesDeadline = matchesDeadline && new Date(project.deadline) >= new Date(filters.deadlineStart);
      }
      if (filters.deadlineEnd) {
          matchesDeadline = matchesDeadline && new Date(project.deadline) <= new Date(filters.deadlineEnd);
      }

      return matchesSearch && matchesStatus && matchesManager && matchesClient && matchesDeadline;
  });

  const clearFilters = () => {
      setFilters({
          status: 'All',
          manager: 'All',
          client: 'All',
          deadlineStart: '',
          deadlineEnd: ''
      });
      setSearchQuery('');
  };

  // Calculate Health Score Color
  const getHealthColor = (score: number = 100) => {
      if (score >= 80) return 'text-emerald-500';
      if (score >= 50) return 'text-amber-500';
      return 'text-rose-500';
  };

  // Helper: Calculate Health Score based on KPIs
  const calculateHealthScore = (kpis: ProjectKPIs): number => {
      let score = 100;
      
      // Deduct for Budget Overrun (> 100% adherence)
      if (kpis.budgetAdherence > 100) {
          score -= (kpis.budgetAdherence - 100) * 1.5;
      }
      
      // Deduct for Schedule Delays (Variance < 0)
      if (kpis.scheduleVariance < 0) {
          score -= Math.abs(kpis.scheduleVariance) * 2;
      }
      
      // Deduct for Low Client Satisfaction (< 7)
      if (kpis.clientSatisfaction < 7) {
          score -= (7 - kpis.clientSatisfaction) * 5;
      }

      return Math.max(0, Math.min(100, Math.round(score)));
  };

  const handleOpenAddModal = () => {
      setEditingProject(null);
      setProjectFormData({
          name: '', code: `PRJ-${new Date().getFullYear()}-${projects.length + 1}`, client: '', budget: 0, status: ProjectStatus.PLANNING, completion: 0, 
          manager: currentUserName, startDate: new Date().toISOString().split('T')[0], deadline: '', coverImage: ''
      });
      setIsModalOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, project: Project) => {
      e.stopPropagation();
      setEditingProject(project);
      setProjectFormData({ ...project });
      setIsModalOpen(true);
  };

  const handleSaveProject = () => {
      if (editingProject) {
          setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...projectFormData } as Project : p));
      } else {
          const newProject: Project = {
              ...projectFormData as Project,
              id: `PRJ-${Date.now()}`,
              spent: 0,
              team: [],
              risks: [],
              files: [],
              kpis: {
                  budgetAdherence: 0,
                  scheduleVariance: 0,
                  taskCompletionRate: 0,
                  clientSatisfaction: 8 // default
              },
              healthScore: 100
          };
          setProjects([...projects, newProject]);
      }
      setIsModalOpen(false);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (window.confirm("Are you sure you want to delete this project?")) {
          setProjects(projects.filter(p => p.id !== id));
      }
  };

  const handleTaskMove = (taskId: string, newStatus: 'To Do' | 'In Progress' | 'Done') => {
      setProjectTasks(projectTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const toggleTaskExpansion = (taskId: string) => {
      if (expandedTasks.includes(taskId)) {
          setExpandedTasks(expandedTasks.filter(id => id !== taskId));
      } else {
          setExpandedTasks([...expandedTasks, taskId]);
      }
  };

  const handleAddSubtask = (taskId: string) => {
      const title = newSubtaskTitle[taskId];
      if (!title?.trim()) return;

      const updatedTasks = projectTasks.map(task => {
          if (task.id === taskId) {
              return {
                  ...task,
                  subtasks: [
                      ...(task.subtasks || []),
                      { id: `ST-${Date.now()}`, title: title, isCompleted: false }
                  ]
              };
          }
          return task;
      });
      setProjectTasks(updatedTasks);
      setNewSubtaskTitle({ ...newSubtaskTitle, [taskId]: '' });
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
      const updatedTasks = projectTasks.map(task => {
          if (task.id === taskId) {
              const updatedSubtasks = task.subtasks?.map(st => 
                  st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
              );
              
              // Optional: Auto-update main task status if all subtasks are done
              const allDone = updatedSubtasks?.every(st => st.isCompleted);
              const newStatus: 'To Do' | 'In Progress' | 'Done' = allDone ? 'Done' : task.status === 'Done' ? 'In Progress' : task.status;

              return { ...task, subtasks: updatedSubtasks, status: newStatus };
          }
          return task;
      });
      setProjectTasks(updatedTasks);
  };

  const handleOpenKpiModal = () => {
      if (selectedProject?.kpis) {
          setEditingKpis({ ...selectedProject.kpis });
      } else {
          setEditingKpis({
              budgetAdherence: 0,
              scheduleVariance: 0,
              taskCompletionRate: 0,
              clientSatisfaction: 0
          });
      }
      setIsKpiModalOpen(true);
  };

  const handleSaveKpis = () => {
      if (!selectedProject) return;
      const newScore = calculateHealthScore(editingKpis);
      const updatedProject = { ...selectedProject, kpis: editingKpis, healthScore: newScore };
      setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
      setSelectedProject(updatedProject);
      setIsKpiModalOpen(false);
  };

  const autoCalculateKpis = () => {
      if (!selectedProject) return;
      
      // Task Rate
      const projectSpecificTasks = projectTasks.filter(t => t.projectId === selectedProject.id);
      const completed = projectSpecificTasks.filter(t => t.status === 'Done').length;
      const total = projectSpecificTasks.length;
      const taskRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Budget Rate
      const budgetRate = selectedProject.budget > 0 ? parseFloat(((selectedProject.spent / selectedProject.budget) * 100).toFixed(1)) : 0;
      
      // Schedule Variance Calculation
      let varianceDays = 0;
      const start = new Date(selectedProject.startDate);
      const end = new Date(selectedProject.deadline);
      const today = new Date();
      
      if (start && end && end > start) {
          const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
          const elapsedDays = (today.getTime() - start.getTime()) / (1000 * 3600 * 24);
          
          if (totalDays > 0 && elapsedDays > 0) {
              const expectedProgress = Math.min(1, elapsedDays / totalDays);
              const actualProgress = (selectedProject.completion || 0) / 100;
              
              // Difference between actual completion % and time-elapsed %
              // If actual (30%) < expected (50%), diff is -0.2
              const diff = actualProgress - expectedProgress; 
              // Convert variance % back to days (approximate)
              varianceDays = Math.round(diff * totalDays);
          }
      }

      setEditingKpis(prev => ({
          ...prev,
          taskCompletionRate: taskRate,
          budgetAdherence: budgetRate,
          scheduleVariance: varianceDays
      }));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const imageUrl = URL.createObjectURL(file);
          setProjectFormData({ ...projectFormData, coverImage: imageUrl });
      }
  };

  const getStatusColor = (status: ProjectStatus) => {
      switch(status) {
          case ProjectStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700';
          case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700';
          case ProjectStatus.ON_HOLD: return 'bg-amber-100 text-amber-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  // --- FILE VERSIONING LOGIC ---

  const handleFileUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && selectedProject) {
          const file = e.target.files[0];
          
          // Check for existing file with same name
          const existingFile = selectedProject.files?.find(f => f.name === file.name);
          
          if (existingFile) {
              setPendingFile(file);
              setUploadConflictModalOpen(true);
          } else {
              // Standard Upload
              const newFile: ProjectFile = {
                  id: `PF-${Date.now()}`,
                  name: file.name,
                  type: 'pdf', // Mock type
                  uploadedBy: currentUserName,
                  date: new Date().toISOString().split('T')[0],
                  size: `${(file.size / 1024).toFixed(2)} KB`,
                  currentVersion: 1,
                  versions: [],
                  url: URL.createObjectURL(file)
              };
              const updatedProject = { ...selectedProject, files: [...(selectedProject.files || []), newFile] };
              updateProjectState(updatedProject);
          }
      }
  };

  const handleResolveConflict = (resolution: 'overwrite' | 'new_version' | 'rename') => {
      if (!selectedProject || !pendingFile) return;

      const existingFileIndex = selectedProject.files?.findIndex(f => f.name === pendingFile.name);
      if (existingFileIndex === -1 || existingFileIndex === undefined) return;

      const existingFile = selectedProject.files![existingFileIndex];
      const today = new Date().toISOString().split('T')[0];
      let updatedFiles = [...(selectedProject.files || [])];

      if (resolution === 'new_version') {
          // Archive current state to versions
          const archivedVersion: FileVersion = {
              id: `V${existingFile.currentVersion}-${Date.now()}`,
              versionNumber: existingFile.currentVersion,
              url: existingFile.url || '', // In real app, this would be the old URL
              date: existingFile.date,
              uploadedBy: existingFile.uploadedBy,
              size: existingFile.size,
              name: existingFile.name
          };

          const newFileState: ProjectFile = {
              ...existingFile,
              currentVersion: existingFile.currentVersion + 1,
              date: today,
              uploadedBy: currentUserName,
              size: `${(pendingFile.size / 1024).toFixed(2)} KB`,
              url: URL.createObjectURL(pendingFile),
              versions: [archivedVersion, ...(existingFile.versions || [])]
          };
          updatedFiles[existingFileIndex] = newFileState;

      } else if (resolution === 'overwrite') {
          // Replace content, keep version same (Destructive in this context, but user chose overwrite)
          const newFileState: ProjectFile = {
              ...existingFile,
              date: today,
              uploadedBy: currentUserName,
              size: `${(pendingFile.size / 1024).toFixed(2)} KB`,
              url: URL.createObjectURL(pendingFile),
              // We keep versions history but replace HEAD
          };
          updatedFiles[existingFileIndex] = newFileState;

      } else if (resolution === 'rename') {
          // Create new file with different name
          const newName = `${pendingFile.name.split('.')[0]} (Copy).${pendingFile.name.split('.').pop()}`;
          const newFile: ProjectFile = {
              id: `PF-${Date.now()}`,
              name: newName,
              type: 'pdf', 
              uploadedBy: currentUserName,
              date: today,
              size: `${(pendingFile.size / 1024).toFixed(2)} KB`,
              currentVersion: 1,
              versions: [],
              url: URL.createObjectURL(pendingFile)
          };
          updatedFiles.push(newFile);
      }

      updateProjectState({ ...selectedProject, files: updatedFiles });
      setUploadConflictModalOpen(false);
      setPendingFile(null);
  };

  const handleRevertVersion = (file: ProjectFile, version: FileVersion) => {
      if (!selectedProject) return;
      if (!window.confirm(`Are you sure you want to revert to Version ${version.versionNumber}? Current changes will be archived.`)) return;

      const fileIndex = selectedProject.files?.findIndex(f => f.id === file.id);
      if (fileIndex === -1 || fileIndex === undefined) return;

      const currentFile = selectedProject.files![fileIndex];
      
      // Archive current HEAD as a version
      const archivedHead: FileVersion = {
          id: `V${currentFile.currentVersion}-${Date.now()}`,
          versionNumber: currentFile.currentVersion,
          url: currentFile.url || '',
          date: currentFile.date,
          uploadedBy: currentFile.uploadedBy,
          size: currentFile.size,
          name: currentFile.name
      };

      // Restore selected version to HEAD
      const newHead: ProjectFile = {
          ...currentFile,
          currentVersion: currentFile.currentVersion + 1, // Increment version to indicate a change occurred (revert is a new commit)
          url: version.url,
          date: new Date().toISOString().split('T')[0],
          uploadedBy: currentUserName, // User who reverted
          size: version.size,
          versions: [archivedHead, ...(currentFile.versions || [])]
      };
      
      const updatedFiles = [...(selectedProject.files || [])];
      updatedFiles[fileIndex] = newHead;
      
      updateProjectState({ ...selectedProject, files: updatedFiles });
      setHistoryModalOpen(false);
  };

  const updateProjectState = (updatedProject: Project) => {
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setSelectedProject(updatedProject);
  };

  const handleViewHistory = (file: ProjectFile) => {
      setSelectedFileForHistory(file);
      setHistoryModalOpen(true);
  };

  // --- Render Project Detail View ---
  if (selectedProject) {
      const tasks = projectTasks.filter(t => t.projectId === selectedProject.id);

      return (
          <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300">
              {/* Cover Image Banner */}
              {selectedProject.coverImage && (
                  <div className="h-48 w-full overflow-hidden relative">
                      <img src={selectedProject.coverImage} alt="Project Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
              )}

              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50 relative">
                  <div>
                      <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 mb-3 transition-colors">
                          <ArrowLeft className="w-4 h-4" /> Back to Projects
                      </button>
                      <div className="flex items-center gap-3">
                          <h1 className="text-2xl font-bold text-slate-800">{selectedProject.name}</h1>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusColor(selectedProject.status)}`}>
                              {selectedProject.status}
                          </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-4">
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/> {selectedProject.client}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Due: {selectedProject.deadline}</span>
                          <span className="flex items-center gap-1 font-mono text-xs bg-slate-200 px-1 rounded">{selectedProject.code}</span>
                      </p>
                  </div>
                  <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">
                          Edit Project
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-md">
                          <Plus className="w-4 h-4" /> Add Task
                      </button>
                  </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 px-6 overflow-x-auto bg-white">
                  {['overview', 'kpis', 'tasks', 'team', 'files', 'risks'].map(tab => (
                      <button
                          key={tab}
                          onClick={() => setActiveDetailTab(tab as any)}
                          className={`px-6 py-3 text-sm font-bold capitalize border-b-2 transition-colors whitespace-nowrap ${
                              activeDetailTab === tab ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                          }`}
                      >
                          {tab === 'kpis' ? 'Health & KPIs' : tab}
                      </button>
                  ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                  {activeDetailTab === 'overview' && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 space-y-6">
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                  <h3 className="font-bold text-slate-800 mb-4">Project Description</h3>
                                  <p className="text-slate-600 text-sm leading-relaxed">{selectedProject.description}</p>
                              </div>
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                  <h3 className="font-bold text-slate-800 mb-4">Financial Overview</h3>
                                  <div className="h-64">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={[
                                              { name: 'Budget', amount: selectedProject.budget },
                                              { name: 'Spent', amount: selectedProject.spent }
                                          ]} layout="vertical" margin={{left: 40}}>
                                              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                              <XAxis type="number" tickFormatter={(val) => `${val/1000}k`} />
                                              <YAxis dataKey="name" type="category" />
                                              <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => `AED ${val.toLocaleString()}`} />
                                              <Bar dataKey="amount" fill="#0ea5e9" radius={[0,4,4,0]} barSize={20} />
                                          </BarChart>
                                      </ResponsiveContainer>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="space-y-6">
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                  <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
                                  <div className="space-y-4">
                                      <div>
                                          <div className="flex justify-between items-center mb-1">
                                              <span className="text-sm text-slate-500">Progress</span>
                                              <span className="text-sm font-bold text-brand-600">{selectedProject.completion}%</span>
                                          </div>
                                          {canCreate ? (
                                              <input 
                                                  type="range" 
                                                  min="0" 
                                                  max="100" 
                                                  value={selectedProject.completion} 
                                                  onChange={(e) => {
                                                      const val = parseInt(e.target.value);
                                                      const updated = { ...selectedProject, completion: val };
                                                      setSelectedProject(updated);
                                                      setProjects(projects.map(p => p.id === updated.id ? updated : p));
                                                  }}
                                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                                  title="Drag to update progress"
                                              />
                                          ) : (
                                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                  <div className="h-full bg-brand-500" style={{ width: `${selectedProject.completion}%` }}></div>
                                              </div>
                                          )}
                                      </div>
                                      
                                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                          <span className="text-sm text-slate-500">Days Remaining</span>
                                          <span className="text-sm font-bold text-slate-700">45 Days</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <span className="text-sm text-slate-500">Health Score</span>
                                          <span className={`text-sm font-bold ${getHealthColor(selectedProject.healthScore)}`}>{selectedProject.healthScore}/100</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* KPIs Tab */}
                  {activeDetailTab === 'kpis' && (
                      <div className="space-y-6">
                          <div className="flex justify-between items-center">
                              <h3 className="font-bold text-lg text-slate-800">Key Performance Indicators</h3>
                              <button 
                                  onClick={handleOpenKpiModal}
                                  className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-sm"
                              >
                                  <Activity className="w-4 h-4" /> Update Health Metrics
                              </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {/* Budget Adherence */}
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
                                      <DollarSign className="w-6 h-6" />
                                  </div>
                                  <p className="text-xs font-bold text-slate-500 uppercase">Budget Adherence</p>
                                  <h4 className="text-2xl font-bold text-slate-800 mt-1">{selectedProject.kpis?.budgetAdherence}%</h4>
                                  <p className="text-xs text-slate-400 mt-2">of budget consumed</p>
                              </div>

                              {/* Schedule Variance */}
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${selectedProject.kpis?.scheduleVariance! >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                      <Calendar className="w-6 h-6" />
                                  </div>
                                  <p className="text-xs font-bold text-slate-500 uppercase">Schedule Variance</p>
                                  <h4 className={`text-2xl font-bold mt-1 ${selectedProject.kpis?.scheduleVariance! >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {selectedProject.kpis?.scheduleVariance! > 0 ? '+' : ''}{selectedProject.kpis?.scheduleVariance} Days
                                  </h4>
                                  <p className="text-xs text-slate-400 mt-2">{selectedProject.kpis?.scheduleVariance! >= 0 ? 'Ahead of Schedule' : 'Behind Schedule'}</p>
                              </div>

                              {/* Task Completion */}
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-3">
                                      <CheckSquare className="w-6 h-6" />
                                  </div>
                                  <p className="text-xs font-bold text-slate-500 uppercase">Task Completion</p>
                                  <h4 className="text-2xl font-bold text-slate-800 mt-1">{selectedProject.kpis?.taskCompletionRate}%</h4>
                                  <p className="text-xs text-slate-400 mt-2">of tasks marked done</p>
                              </div>

                              {/* Client Satisfaction */}
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-3">
                                      <Smile className="w-6 h-6" />
                                  </div>
                                  <p className="text-xs font-bold text-slate-500 uppercase">Client Satisfaction</p>
                                  <h4 className="text-2xl font-bold text-slate-800 mt-1">{selectedProject.kpis?.clientSatisfaction}/10</h4>
                                  <div className="flex gap-1 mt-2">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-3 h-3 ${i < (selectedProject.kpis?.clientSatisfaction || 0)/2 ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Tasks Tab */}
                  {activeDetailTab === 'tasks' && (
                      <div className="space-y-6">
                          <div className="flex justify-between items-center mb-4">
                              <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                                  <button onClick={() => setTaskViewMode('list')} className={`px-3 py-1.5 text-xs font-bold rounded ${taskViewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>List</button>
                                  <button onClick={() => setTaskViewMode('board')} className={`px-3 py-1.5 text-xs font-bold rounded ${taskViewMode === 'board' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>Board</button>
                                  <button onClick={() => setTaskViewMode('gantt')} className={`px-3 py-1.5 text-xs font-bold rounded ${taskViewMode === 'gantt' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>Gantt</button>
                              </div>
                              <button className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-2 rounded-lg hover:bg-brand-100 flex items-center gap-1">
                                  <Plus className="w-4 h-4" /> Add Task
                              </button>
                          </div>

                          {taskViewMode === 'list' && (
                              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                  <table className="w-full text-left">
                                      <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                          <tr>
                                              <th className="px-6 py-3">Task Name</th>
                                              <th className="px-6 py-3">Assignee</th>
                                              <th className="px-6 py-3">Due Date</th>
                                              <th className="px-6 py-3">Priority</th>
                                              <th className="px-6 py-3">Status</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                          {tasks.map(task => (
                                              <React.Fragment key={task.id}>
                                                  <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => toggleTaskExpansion(task.id)}>
                                                      <td className="px-6 py-3 font-medium text-slate-700 flex items-center gap-2">
                                                          {expandedTasks.includes(task.id) ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                                          {task.title}
                                                          {task.subtasks && task.subtasks.length > 0 && (
                                                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2 border border-slate-200">
                                                                  {task.subtasks.filter(st => st.isCompleted).length}/{task.subtasks.length}
                                                              </span>
                                                          )}
                                                      </td>
                                                      <td className="px-6 py-3 text-sm text-slate-500">{task.assignee}</td>
                                                      <td className="px-6 py-3 text-sm text-slate-500">{task.dueDate}</td>
                                                      <td className="px-6 py-3">
                                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${task.priority === 'High' ? 'bg-orange-100 text-orange-700' : task.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>{task.priority}</span>
                                                      </td>
                                                      <td className="px-6 py-3">
                                                          <select 
                                                              value={task.status} 
                                                              onChange={(e) => handleTaskMove(task.id, e.target.value as 'To Do' | 'In Progress' | 'Done')}
                                                              onClick={(e) => e.stopPropagation()}
                                                              className="text-xs bg-transparent border-none font-bold text-slate-700 focus:ring-0 cursor-pointer"
                                                          >
                                                              <option>To Do</option>
                                                              <option>In Progress</option>
                                                              <option>Done</option>
                                                          </select>
                                                      </td>
                                                  </tr>
                                                  {expandedTasks.includes(task.id) && (
                                                      <tr className="bg-slate-50/50">
                                                          <td colSpan={5} className="px-6 py-4 pl-12 border-b border-slate-100">
                                                              <div className="space-y-2">
                                                                  {task.subtasks?.map(subtask => (
                                                                      <div key={subtask.id} className="flex items-center gap-3 group">
                                                                          <CornerDownRight className="w-4 h-4 text-slate-300" />
                                                                          <input 
                                                                              type="checkbox" 
                                                                              checked={subtask.isCompleted} 
                                                                              onChange={() => handleToggleSubtask(task.id, subtask.id)}
                                                                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                                                                          />
                                                                          <span className={`text-sm ${subtask.isCompleted ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                                                                              {subtask.title}
                                                                          </span>
                                                                      </div>
                                                                  ))}
                                                                  <div className="flex items-center gap-2 mt-3 pl-7">
                                                                      <input 
                                                                          type="text" 
                                                                          placeholder="Add a subtask..." 
                                                                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-all"
                                                                          value={newSubtaskTitle[task.id] || ''}
                                                                          onChange={(e) => setNewSubtaskTitle({...newSubtaskTitle, [task.id]: e.target.value})}
                                                                          onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(task.id)}
                                                                      />
                                                                      <button 
                                                                          onClick={() => handleAddSubtask(task.id)}
                                                                          className="text-brand-600 hover:bg-brand-50 p-1.5 rounded transition-colors"
                                                                          title="Add Subtask"
                                                                      >
                                                                          <Plus className="w-4 h-4" />
                                                                      </button>
                                                                  </div>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  )}
                                              </React.Fragment>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          )}

                          {taskViewMode === 'board' && (
                              <div className="grid grid-cols-3 gap-6">
                                  {['To Do', 'In Progress', 'Done'].map(col => (
                                      <div key={col} className="bg-slate-100 rounded-xl p-4">
                                          <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase">{col}</h4>
                                          <div className="space-y-3">
                                              {tasks.filter(t => t.status === col).map(task => (
                                                  <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-move">
                                                      <p className="text-sm font-bold text-slate-800 mb-2">{task.title}</p>
                                                      
                                                      {/* Subtask Progress on Board */}
                                                      {task.subtasks && task.subtasks.length > 0 && (
                                                          <div className="mb-2">
                                                              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                                                  <span>Subtasks</span>
                                                                  <span>{task.subtasks.filter(st => st.isCompleted).length}/{task.subtasks.length}</span>
                                                              </div>
                                                              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                  <div 
                                                                      className="h-full bg-brand-400" 
                                                                      style={{ width: `${(task.subtasks.filter(st => st.isCompleted).length / task.subtasks.length) * 100}%` }}
                                                                  ></div>
                                                              </div>
                                                          </div>
                                                      )}

                                                      <div className="flex justify-between items-center">
                                                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{task.assignee}</span>
                                                          <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                          {taskViewMode === 'gantt' && (
                              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
                                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                  <p>Gantt Chart Visualization Placeholder</p>
                              </div>
                          )}
                      </div>
                  )}

                  {/* Files Tab */}
                  {activeDetailTab === 'files' && (
                      <div className="space-y-6">
                          <div className="flex justify-between items-center">
                              <h3 className="font-bold text-lg text-slate-800">Project Documents</h3>
                              <label className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 shadow-sm cursor-pointer">
                                  <Upload className="w-4 h-4" /> Upload File
                                  <input type="file" className="hidden" onChange={handleFileUploadInput} />
                              </label>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                              <table className="w-full text-left">
                                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                      <tr>
                                          <th className="px-6 py-3">Name</th>
                                          <th className="px-6 py-3">Size</th>
                                          <th className="px-6 py-3">Uploaded By</th>
                                          <th className="px-6 py-3">Version</th>
                                          <th className="px-6 py-3">Date</th>
                                          <th className="px-6 py-3 text-center">Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                      {selectedProject.files?.map(file => (
                                          <tr key={file.id} className="hover:bg-slate-50">
                                              <td className="px-6 py-3 flex items-center gap-2">
                                                  <FileText className="w-4 h-4 text-slate-400" />
                                                  <span className="text-sm font-medium text-slate-700">{file.name}</span>
                                              </td>
                                              <td className="px-6 py-3 text-sm text-slate-500">{file.size}</td>
                                              <td className="px-6 py-3 text-sm text-slate-500">{file.uploadedBy}</td>
                                              <td className="px-6 py-3">
                                                  <span className="text-xs font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded">v{file.currentVersion}</span>
                                              </td>
                                              <td className="px-6 py-3 text-sm text-slate-500">{file.date}</td>
                                              <td className="px-6 py-3 text-center flex justify-center gap-2">
                                                  <button onClick={() => handleViewHistory(file)} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-brand-600" title="Version History">
                                                      <History className="w-4 h-4" />
                                                  </button>
                                                  <button className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-emerald-600">
                                                      <Download className="w-4 h-4" />
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}

                  {/* Risks Tab */}
                  {activeDetailTab === 'risks' && (
                      <div className="space-y-6">
                          <div className="flex justify-between items-center">
                              <h3 className="font-bold text-lg text-slate-800">Risk Register</h3>
                              <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 shadow-sm">
                                  <AlertTriangle className="w-4 h-4" /> Add Risk
                              </button>
                          </div>
                          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                              <table className="w-full text-left">
                                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                      <tr>
                                          <th className="px-6 py-3">Description</th>
                                          <th className="px-6 py-3">Probability</th>
                                          <th className="px-6 py-3">Impact</th>
                                          <th className="px-6 py-3">Mitigation Plan</th>
                                          <th className="px-6 py-3">Status</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                      {selectedProject.risks?.map(risk => (
                                          <tr key={risk.id} className="hover:bg-slate-50">
                                              <td className="px-6 py-3 text-sm font-medium text-slate-700">{risk.description}</td>
                                              <td className="px-6 py-3"><span className="text-xs font-bold">{risk.probability}</span></td>
                                              <td className="px-6 py-3">
                                                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${risk.impact === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100'}`}>{risk.impact}</span>
                                              </td>
                                              <td className="px-6 py-3 text-sm text-slate-600">{risk.mitigationPlan}</td>
                                              <td className="px-6 py-3 text-sm text-slate-600">{risk.status}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // --- Main Project List ---
  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* List Toolbar */}
      <div className="flex flex-col border-b border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Search projects..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                {canCreate && (
                    <button 
                      onClick={handleOpenAddModal}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
                    >
                       <Plus className="w-4 h-4" /> New Project
                    </button>
                )}
             </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                      <select 
                          value={filters.status}
                          onChange={(e) => setFilters({...filters, status: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                      >
                          <option value="All">All Statuses</option>
                          {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Manager</label>
                      <select 
                          value={filters.manager}
                          onChange={(e) => setFilters({...filters, manager: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                      >
                          <option value="All">All Managers</option>
                          {uniqueManagers.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Client</label>
                      <select 
                          value={filters.client}
                          onChange={(e) => setFilters({...filters, client: e.target.value})}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white"
                      >
                          <option value="All">All Clients</option>
                          {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
              <div 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-brand-300 transition-all cursor-pointer group overflow-hidden flex flex-col"
              >
                  {/* Card Cover */}
                  <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                      {project.coverImage ? (
                          <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                              <Briefcase className="w-10 h-10 text-slate-300" />
                          </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm bg-white/90 backdrop-blur-sm text-slate-700`}>
                              {project.status}
                          </span>
                      </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-600 transition-colors line-clamp-1">{project.name}</h3>
                          {canCreate && (
                              <button onClick={(e) => handleOpenEditModal(e, project)} className="text-slate-400 hover:text-brand-600 p-1 hover:bg-slate-50 rounded">
                                  <Edit className="w-4 h-4" />
                              </button>
                          )}
                      </div>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-4">
                          <div className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400"/> {project.manager}</div>
                          <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400"/> {project.deadline}</div>
                      </div>

                      {/* KPI Summary Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div className="text-center">
                              <p className="text-[10px] text-slate-400 uppercase">Budget</p>
                              <p className="text-xs font-bold text-slate-700">{project.kpis?.budgetAdherence || 0}%</p>
                          </div>
                          <div className="text-center border-l border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase">Schedule</p>
                              <p className={`text-xs font-bold ${project.kpis?.scheduleVariance! >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {project.kpis?.scheduleVariance! > 0 ? '+' : ''}{project.kpis?.scheduleVariance || 0}d
                              </p>
                          </div>
                          <div className="text-center border-l border-slate-200">
                              <p className="text-[10px] text-slate-400 uppercase">Client</p>
                              <p className="text-xs font-bold text-amber-600 flex items-center justify-center gap-0.5">
                                  {project.kpis?.clientSatisfaction || '-'}<Star className="w-2.5 h-2.5 fill-current" />
                              </p>
                          </div>
                      </div>

                      <div className="mt-auto">
                          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                              <span>Completion</span>
                              <span>{project.completion}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${project.healthScore && project.healthScore < 50 ? 'bg-rose-500' : 'bg-brand-500'}`} style={{ width: `${project.completion}%` }}></div>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                      <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                      {/* Image Upload */}
                      <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-400 relative group overflow-hidden">
                              {projectFormData.coverImage ? (
                                  <img src={projectFormData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                              ) : (
                                  <div className="text-center">
                                      <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                                      <span className="text-[10px] text-slate-400">Upload Cover Image</span>
                                  </div>
                              )}
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleCoverImageUpload} />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Name</label>
                          <input type="text" value={projectFormData.name} onChange={(e) => setProjectFormData({...projectFormData, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Client</label>
                              <input type="text" value={projectFormData.client} onChange={(e) => setProjectFormData({...projectFormData, client: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Budget (AED)</label>
                              <input type="number" value={projectFormData.budget} onChange={(e) => setProjectFormData({...projectFormData, budget: parseFloat(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                              <input type="date" value={projectFormData.startDate} onChange={(e) => setProjectFormData({...projectFormData, startDate: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deadline</label>
                              <input type="date" value={projectFormData.deadline} onChange={(e) => setProjectFormData({...projectFormData, deadline: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Completion (%)</label>
                          <div className="flex items-center gap-4">
                              <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={projectFormData.completion || 0} 
                                  onChange={(e) => setProjectFormData({...projectFormData, completion: parseInt(e.target.value)})} 
                                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                              />
                              <span className="text-sm font-bold text-slate-700 w-10 text-right">{projectFormData.completion}%</span>
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                          <textarea value={projectFormData.description || ''} onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm h-24 resize-none" />
                      </div>
                      <button onClick={handleSaveProject} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition">Save Project</button>
                  </div>
              </div>
          </div>
      )}

      {/* KPI Update Modal */}
      {isKpiModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800">Update Health Metrics</h3>
                      <button onClick={() => setIsKpiModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                  </div>
                  <div className="p-6 space-y-6">
                      <div>
                          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                              <span>Client Satisfaction Score (0-10)</span>
                              <span>{editingKpis.clientSatisfaction}</span>
                          </div>
                          <input 
                              type="range" min="0" max="10" step="1" 
                              value={editingKpis.clientSatisfaction} 
                              onChange={(e) => setEditingKpis({...editingKpis, clientSatisfaction: parseInt(e.target.value)})}
                              className="w-full"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Budget Usage (%)</label>
                              <input type="number" value={editingKpis.budgetAdherence} onChange={(e) => setEditingKpis({...editingKpis, budgetAdherence: parseFloat(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Schedule Variance (Days)</label>
                              <input type="number" value={editingKpis.scheduleVariance} onChange={(e) => setEditingKpis({...editingKpis, scheduleVariance: parseInt(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2 text-sm" placeholder="+Ahead / -Behind" />
                          </div>
                      </div>
                      
                      <button 
                          onClick={autoCalculateKpis}
                          className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 flex items-center justify-center gap-2"
                      >
                          <RefreshCw className="w-3 h-3" /> Auto-Calculate from System Data
                      </button>

                      <button onClick={handleSaveKpis} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition">
                          Save & Update Score
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Upload Conflict Modal */}
      {uploadConflictModalOpen && pendingFile && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 mb-2">File Conflict Detected</h3>
                  <p className="text-sm text-slate-600 mb-6">
                      A file named <span className="font-bold">"{pendingFile.name}"</span> already exists. How would you like to proceed?
                  </p>
                  <div className="flex flex-col gap-2">
                      <button onClick={() => handleResolveConflict('new_version')} className="w-full py-2 bg-brand-600 text-white rounded-lg font-bold text-sm hover:bg-brand-700">
                          Upload as New Version (Recommended)
                      </button>
                      <button onClick={() => handleResolveConflict('rename')} className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50">
                          Keep Both (Rename)
                      </button>
                      <button onClick={() => handleResolveConflict('overwrite')} className="w-full py-2 bg-white border border-rose-200 text-rose-600 rounded-lg font-bold text-sm hover:bg-rose-50">
                          Overwrite Existing
                      </button>
                      <button onClick={() => setUploadConflictModalOpen(false)} className="mt-2 text-xs text-slate-400 underline">Cancel Upload</button>
                  </div>
              </div>
          </div>
      )}

      {/* History Modal */}
      {historyModalOpen && selectedFileForHistory && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <History className="w-4 h-4 text-slate-500" /> Version History
                      </h3>
                      <button onClick={() => setHistoryModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                  </div>
                  <div className="p-4 bg-slate-50 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-700">{selectedFileForHistory.name}</p>
                      <p className="text-xs text-slate-500">Current Version: v{selectedFileForHistory.currentVersion}</p>
                  </div>
                  <div className="p-4 max-h-[300px] overflow-y-auto space-y-3">
                      {(!selectedFileForHistory.versions || selectedFileForHistory.versions.length === 0) ? (
                          <p className="text-center text-xs text-slate-400 py-4">No previous versions available.</p>
                      ) : (
                          selectedFileForHistory.versions.map(ver => (
                              <div key={ver.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-300 transition">
                                  <div>
                                      <p className="text-sm font-bold text-slate-700">Version {ver.versionNumber}</p>
                                      <p className="text-xs text-slate-400">{ver.date} • by {ver.uploadedBy}</p>
                                  </div>
                                  <button 
                                      onClick={() => handleRevertVersion(selectedFileForHistory, ver)}
                                      className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                                  >
                                      <RotateCcw className="w-3 h-3" /> Revert
                                  </button>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProjectsModule;
