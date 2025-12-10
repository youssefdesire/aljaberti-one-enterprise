
import React, { useState } from 'react';
import { DocumentFile, UserRole } from '../types';
import { 
  Folder, FileText, Image, FileSpreadsheet, Search, Plus, 
  MoreVertical, Download, ChevronRight, UploadCloud, X, Home, ArrowLeft, Trash2, Shield, Users, Clock, Share2, Check, Lock,
  Film, Music, Mic, Play, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const mockFiles: DocumentFile[] = [
  { id: 'DOC-001', name: 'Finance', type: 'folder', modified: '2024-05-20', owner: 'System', sharedWith: ['Sarah Jones'] },
  { id: 'DOC-002', name: 'HR Records', type: 'folder', modified: '2024-05-18', owner: 'Maria R.', sharedWith: [] },
  { id: 'DOC-003', name: 'Project Specs', type: 'folder', modified: '2024-05-15', owner: 'Ahmed M.', sharedWith: ['Rajesh Kumar'] },
  { id: 'DOC-004', name: 'Q2_Financial_Report.pdf', type: 'pdf', size: '2.4 MB', modified: '2024-05-19', owner: 'Sarah J.', sharedWith: [] },
  { id: 'DOC-005', name: 'Site_Inspection_Photos.zip', type: 'image', size: '45 MB', modified: '2024-05-18', owner: 'Rajesh K.', sharedWith: [] },
  { id: 'DOC-006', name: 'Inventory_List_v2.xlsx', type: 'sheet', size: '1.2 MB', modified: '2024-05-10', owner: 'John S.', sharedWith: [] },
  { id: 'DOC-007', name: 'Service_Agreement_Hilton.docx', type: 'doc', size: '850 KB', modified: '2024-05-01', owner: 'Ahmed M.', sharedWith: [] },
  { id: 'DOC-008', name: 'Site_Walkthrough.mp4', type: 'video', size: '120 MB', modified: '2024-05-23', owner: 'Rajesh K.', sharedWith: [], url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4' },
  { id: 'DOC-009', name: 'Client_Meeting_Rec.mp3', type: 'audio', size: '15 MB', modified: '2024-05-23', owner: 'Ahmed M.', sharedWith: [] },
  // Shared Files from Externals
  { id: 'DOC-SH-1', name: 'Partner_Agreement_Draft.docx', type: 'doc', size: '1.2 MB', modified: '2024-05-22', owner: 'External Partner', sharedWith: ['Ahmed Al-Mansouri', 'Sarah Jones'] },
  { id: 'DOC-SH-2', name: 'Project_Beta_Assets', type: 'folder', modified: '2024-05-21', owner: 'Design Agency', sharedWith: ['Ahmed Al-Mansouri', 'Rajesh Kumar'] },
];

const mockShareUsers = [
    { name: 'Sarah Jones', role: 'Finance Manager' },
    { name: 'Rajesh Kumar', role: 'Operations' },
    { name: 'John Smith', role: 'Sales' },
    { name: 'Maria Rodriguez', role: 'HR' }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'folder': return <Folder className="w-10 h-10 text-brand-400 fill-brand-100" />;
    case 'pdf': return <FileText className="w-10 h-10 text-rose-500" />;
    case 'image': return <Image className="w-10 h-10 text-purple-500" />;
    case 'sheet': return <FileSpreadsheet className="w-10 h-10 text-emerald-500" />;
    case 'video': return <Film className="w-10 h-10 text-blue-500" />;
    case 'audio': return <Music className="w-10 h-10 text-amber-500" />;
    default: return <FileText className="w-10 h-10 text-slate-400" />;
  }
};

interface DocumentsModuleProps {
    currentUserRole?: UserRole;
    currentUserName?: string;
}

const DocumentsModule: React.FC<DocumentsModuleProps> = ({ currentUserRole = UserRole.USER, currentUserName = 'Guest' }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null); // null means root
  const [activeSection, setActiveSection] = useState<'my-files' | 'shared' | 'recent'>('my-files');
  const [files, setFiles] = useState<DocumentFile[]>(mockFiles);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState<DocumentFile | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<DocumentFile | null>(null);

  // Permission Logic
  const canEdit = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.MANAGER;
  const canShare = currentUserRole === UserRole.ADMIN; // Only Super Admins can grant access

  // Filter Logic
  const getDisplayedFiles = () => {
      if (currentFolder) {
          // Inside a folder, simulate hierarchy by returning arbitrary subset or empty
          return files.filter(f => f.id.includes('SUB') || (f.type !== 'folder' && Math.random() > 0.7)); 
      }

      if (activeSection === 'shared') {
          // Show files where user is in sharedWith list OR files owned by others if user is Admin
          if (currentUserRole === UserRole.ADMIN) return files.filter(f => f.owner !== 'System' && f.owner !== 'You');
          return files.filter(f => f.sharedWith?.includes(currentUserName));
      }
      
      if (activeSection === 'recent') {
          return [...files].sort((a,b) => b.modified.localeCompare(a.modified));
      }

      // My Files (Default)
      // Admins see everything. Users see System + their own.
      if (currentUserRole === UserRole.ADMIN) return files;
      return files.filter(f => f.owner === 'System' || f.owner === currentUserName);
  };

  const displayedFiles = getDisplayedFiles();
  
  const currentFolderName = currentFolder 
      ? files.find(f => f.id === currentFolder)?.name 
      : (activeSection === 'shared' ? 'Shared with me' : activeSection === 'recent' ? 'Recent Files' : 'My Files');

  const handleFileClick = (file: DocumentFile) => {
      if (file.type === 'folder') {
          setCurrentFolder(file.id);
      } else {
          setPreviewFile(file);
      }
  };

  const handleNavigateUp = () => {
      setCurrentFolder(null); 
  };

  const handleSectionChange = (section: 'my-files' | 'shared' | 'recent') => {
      setActiveSection(section);
      setCurrentFolder(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (!canEdit) return;
      if (window.confirm("Are you sure you want to delete this file?")) {
          setFiles(files.filter(f => f.id !== id));
      }
  };

  const handleShareClick = (e: React.MouseEvent, file: DocumentFile) => {
      e.stopPropagation();
      setSelectedFileForShare(file);
      setIsShareModalOpen(true);
  };

  const toggleUserAccess = (userName: string) => {
      if (!selectedFileForShare) return;
      
      const currentShared = selectedFileForShare.sharedWith || [];
      let newShared;
      
      if (currentShared.includes(userName)) {
          newShared = currentShared.filter(u => u !== userName);
      } else {
          newShared = [...currentShared, userName];
      }

      const updatedFile = { ...selectedFileForShare, sharedWith: newShared };
      setFiles(files.map(f => f.id === selectedFileForShare.id ? updatedFile : f));
      setSelectedFileForShare(updatedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setFileToUpload(e.target.files[0]);
      }
  };

  const handleUpload = () => {
      if (!fileToUpload) return;

      // Simulate Upload
      let progress = 0;
      const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                  let fileType: DocumentFile['type'] = 'doc';
                  if (fileToUpload.type.startsWith('image/')) fileType = 'image';
                  else if (fileToUpload.type.startsWith('video/')) fileType = 'video';
                  else if (fileToUpload.type.startsWith('audio/')) fileType = 'audio';
                  else if (fileToUpload.type === 'application/pdf') fileType = 'pdf';
                  else if (fileToUpload.type.includes('sheet') || fileToUpload.type.includes('excel')) fileType = 'sheet';

                  const newFile: DocumentFile = {
                      id: `DOC-${Date.now()}`,
                      name: fileToUpload.name,
                      type: fileType,
                      size: `${(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB`,
                      modified: 'Just now',
                      owner: currentUserName,
                      sharedWith: [],
                      url: URL.createObjectURL(fileToUpload)
                  };
                  setFiles([...files, newFile]);
                  setIsUploadModalOpen(false);
                  setUploadProgress(0);
                  setFileToUpload(null);
              }, 500);
          }
      }, 200);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 h-fit lg:h-full flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          {!isSidebarCollapsed && <h3 className="font-bold text-slate-700 text-sm">Sections</h3>}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition ml-auto hidden lg:block"
            title={isSidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {!isSidebarCollapsed && canEdit ? (
            <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition mb-6"
            >
            <UploadCloud className="w-4 h-4" /> Upload File
            </button>
        ) : !isSidebarCollapsed && (
            <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <Shield className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-500 font-medium">Read-Only</p>
            </div>
        )}

        <nav className="space-y-1 flex-1">
          {!isSidebarCollapsed && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Locations</h3>}
          <button 
            onClick={() => handleSectionChange('my-files')} 
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} ${activeSection === 'my-files' && currentFolder === null ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'My Files' : ''}
          >
            <Home className="w-4 h-4 flex-shrink-0"/> {!isSidebarCollapsed && 'My Files'}
          </button>
          <button 
            onClick={() => handleSectionChange('shared')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} ${activeSection === 'shared' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Shared' : ''}
          >
             <Share2 className="w-4 h-4 flex-shrink-0"/> {!isSidebarCollapsed && 'Shared with me'}
          </button>
          <button 
            onClick={() => handleSectionChange('recent')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} ${activeSection === 'recent' ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
            title={isSidebarCollapsed ? 'Recent' : ''}
          >
             <Clock className="w-4 h-4 flex-shrink-0"/> {!isSidebarCollapsed && 'Recent'}
          </button>
        </nav>
        
        {!isSidebarCollapsed && (
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
               <span>Storage Used</span>
               <span>75%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-brand-500 w-3/4 rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">15GB of 20GB used</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
             {currentFolder && (
                 <button onClick={handleNavigateUp} className="hover:bg-slate-100 p-1 rounded">
                     <ArrowLeft className="w-4 h-4" />
                 </button>
             )}
             <span onClick={() => setCurrentFolder(null)} className="hover:text-brand-600 cursor-pointer">
                 {activeSection === 'shared' ? 'Shared' : activeSection === 'recent' ? 'Recent' : 'Home'}
             </span>
             <ChevronRight className="w-4 h-4" />
             <span className="font-bold text-slate-800">{currentFolderName}</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search files..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm w-48 focus:ring-1 focus:ring-brand-500" />
             </div>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                       <div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div>
                       <div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div>
                    </div>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="w-4 h-4 flex flex-col gap-0.5 justify-center">
                       <div className="h-0.5 w-full bg-current rounded-[1px]"></div>
                       <div className="h-0.5 w-full bg-current rounded-[1px]"></div>
                       <div className="h-0.5 w-full bg-current rounded-[1px]"></div>
                    </div>
                </button>
             </div>
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
           {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                 {displayedFiles.map(file => (
                    <div 
                        key={file.id} 
                        onClick={() => handleFileClick(file)}
                        className="group relative bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-brand-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer"
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                           {canShare && (
                               <button 
                                    onClick={(e) => handleShareClick(e, file)}
                                    className="p-1.5 hover:bg-white rounded-full text-slate-400 hover:text-brand-600 bg-white shadow-sm"
                                    title="Share Access"
                               >
                                   <Share2 className="w-3.5 h-3.5" />
                               </button>
                           )}
                           {canEdit && (
                               <button 
                                    onClick={(e) => handleDelete(e, file.id)}
                                    className="p-1.5 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 bg-white shadow-sm"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                               </button>
                           )}
                        </div>
                        {getFileIcon(file.type)}
                        <div className="text-center w-full">
                           <p className="text-sm font-medium text-slate-700 truncate w-full px-2">{file.name}</p>
                           <p className="text-xs text-slate-400 mt-1">{file.type !== 'folder' ? file.size : `${file.modified}`}</p>
                        </div>
                        {file.sharedWith && file.sharedWith.length > 0 && (
                            <div className="absolute bottom-2 right-2">
                                <Users className="w-3 h-3 text-brand-400" />
                            </div>
                        )}
                    </div>
                 ))}
                 
                 {/* Upload Placeholder - Hidden for Users unless in Shared */}
                 {canEdit && (
                    <div 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-400 hover:bg-slate-50 transition-colors"
                    >
                        <Plus className="w-8 h-8 text-slate-300" />
                        <span className="text-xs font-medium text-slate-400">Add New</span>
                    </div>
                 )}
              </div>
           ) : (
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                       <th className="py-3 px-4 w-10"></th>
                       <th className="py-3 px-4">Name</th>
                       <th className="py-3 px-4">Date Modified</th>
                       <th className="py-3 px-4">Size</th>
                       <th className="py-3 px-4">Owner</th>
                       <th className="py-3 px-4"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {displayedFiles.map(file => (
                       <tr key={file.id} onClick={() => handleFileClick(file)} className="hover:bg-slate-50 group cursor-pointer">
                          <td className="py-3 px-4">
                             <div className="w-6 h-6">{getFileIcon(file.type)}</div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">
                              {file.name}
                              {file.sharedWith && file.sharedWith.length > 0 && (
                                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                                      Shared
                                  </span>
                              )}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-500">{file.modified}</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{file.size || '-'}</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{file.owner}</td>
                          <td className="py-3 px-4 text-right flex justify-end gap-2">
                             {canShare && (
                                 <button 
                                    onClick={(e) => handleShareClick(e, file)}
                                    className="p-1 text-slate-400 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Share"
                                 >
                                    <Share2 className="w-4 h-4" />
                                 </button>
                             )}
                             {canEdit && (
                                 <button 
                                    onClick={(e) => handleDelete(e, file.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                             )}
                             <button className="p-1 text-slate-400 hover:text-brand-600 opacity-0 group-hover:opacity-100">
                                <Download className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-800">Upload Files</h3>
                      <button onClick={() => { setIsUploadModalOpen(false); setFileToUpload(null); }}><X className="w-5 h-5 text-slate-400"/></button>
                  </div>
                  
                  <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 mb-6 cursor-pointer hover:bg-slate-100 hover:border-brand-300 transition">
                      <UploadCloud className="w-12 h-12 text-slate-300 mb-3" />
                      {fileToUpload ? (
                          <div className="text-center">
                              <p className="text-sm font-bold text-brand-600">{fileToUpload.name}</p>
                              <p className="text-xs text-slate-400">{(fileToUpload.size / 1024).toFixed(2)} KB</p>
                          </div>
                      ) : (
                          <>
                            <p className="text-sm font-medium text-slate-600">Drag & Drop or Click to Browse</p>
                            <p className="text-xs text-slate-400 mt-1">Images, Video, Audio, Documents</p>
                          </>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileSelect} 
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      />
                  </label>

                  {uploadProgress > 0 && (
                      <div className="mb-6">
                          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className="bg-brand-600 h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                      </div>
                  )}

                  <div className="flex justify-end gap-2">
                      <button onClick={() => { setIsUploadModalOpen(false); setFileToUpload(null); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-bold">Cancel</button>
                      <button onClick={handleUpload} disabled={uploadProgress > 0 || !fileToUpload} className="px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 disabled:opacity-50">
                          {uploadProgress > 0 ? 'Uploading...' : 'Upload'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Share Access Modal */}
      {isShareModalOpen && selectedFileForShare && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-brand-600" /> Share Access
                      </h3>
                      <button onClick={() => setIsShareModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <div className="p-6">
                      <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                              {getFileIcon(selectedFileForShare.type)}
                          </div>
                          <div>
                              <p className="text-sm font-bold text-slate-800">{selectedFileForShare.name}</p>
                              <p className="text-xs text-slate-500">Only listed users can access this.</p>
                          </div>
                      </div>

                      <div className="space-y-1 mb-6 max-h-60 overflow-y-auto">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Select Users to Grant Access</p>
                          {mockShareUsers.map(user => {
                              const isShared = selectedFileForShare.sharedWith?.includes(user.name);
                              return (
                                  <div key={user.name} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" onClick={() => toggleUserAccess(user.name)}>
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                              {user.name.charAt(0)}
                                          </div>
                                          <div>
                                              <p className="text-sm font-medium text-slate-700">{user.name}</p>
                                              <p className="text-[10px] text-slate-400">{user.role}</p>
                                          </div>
                                      </div>
                                      {isShared ? (
                                          <div className="text-emerald-600 bg-emerald-50 p-1 rounded-full"><Check className="w-4 h-4" /></div>
                                      ) : (
                                          <div className="text-slate-300"><Plus className="w-4 h-4" /></div>
                                      )}
                                  </div>
                              )
                          })}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button onClick={() => setIsShareModalOpen(false)} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700">Done</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                      <div className="flex items-center gap-3">
                          {getFileIcon(previewFile.type)}
                          <div>
                              <h3 className="font-bold text-slate-800">{previewFile.name}</h3>
                              <p className="text-xs text-slate-500">{previewFile.size} • Uploaded by {previewFile.owner}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition">
                              <Download className="w-4 h-4" /> Download
                          </button>
                          <button onClick={() => setPreviewFile(null)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500"><X className="w-5 h-5"/></button>
                      </div>
                  </div>
                  
                  <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 overflow-hidden relative">
                      {previewFile.type === 'image' && previewFile.url && (
                          <img src={previewFile.url} alt={previewFile.name} className="max-w-full max-h-full object-contain rounded shadow-lg" />
                      )}
                      
                      {previewFile.type === 'video' && previewFile.url && (
                          <video controls className="max-w-full max-h-full rounded shadow-lg bg-black">
                              <source src={previewFile.url} type="video/mp4" />
                              Your browser does not support the video tag.
                          </video>
                      )}

                      {previewFile.type === 'audio' && previewFile.url && (
                          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4 w-96">
                              <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 animate-pulse">
                                  <Music className="w-10 h-10" />
                              </div>
                              <h4 className="font-bold text-slate-700 text-center">{previewFile.name}</h4>
                              <audio controls className="w-full">
                                  <source src={previewFile.url} type="audio/mpeg" />
                                  Your browser does not support the audio element.
                              </audio>
                          </div>
                      )}

                      {['pdf', 'sheet', 'doc'].includes(previewFile.type) && (
                          <div className="text-center">
                              <div className="w-24 h-24 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                                  {getFileIcon(previewFile.type)}
                              </div>
                              <p className="text-slate-600 font-medium mb-2">Preview not available for this file type.</p>
                              <p className="text-sm text-slate-400 mb-6">Please download the file to view it.</p>
                              <button className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 shadow-sm">
                                  Download File
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DocumentsModule;
