
import React, { useState, useRef } from 'react';
import { ChatChannel, TeamMessage } from '../types';
import { Hash, Lock, Search, Bell, Plus, Image as ImageIcon, Paperclip, Send, Smile, MoreVertical, Users, Pin, X, FileText, Film, Music, Mic, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const mockChannels: ChatChannel[] = [
  { id: 'C-001', name: 'general', type: 'public', description: 'Company-wide chatter' },
  { id: 'C-002', name: 'announcements', type: 'public', description: 'Official news and updates' },
  { id: 'C-003', name: 'projects-alpha', type: 'private', description: 'Discussion for Alpha Project' },
  { id: 'C-004', name: 'finance-team', type: 'private', description: 'Restricted to Finance' },
  { id: 'C-005', name: 'it-support', type: 'public', description: 'Tech help and questions' },
];

const mockDirects: ChatChannel[] = [
  { id: 'D-001', name: 'Ahmed Al-Mansouri', type: 'direct', unreadCount: 2, isOnline: true },
  { id: 'D-002', name: 'Sarah Jones', type: 'direct', isOnline: true },
  { id: 'D-003', name: 'Rajesh Kumar', type: 'direct', unreadCount: 1, isOnline: false },
  { id: 'D-004', name: 'Maria Rodriguez', type: 'direct', isOnline: true },
  { id: 'D-005', name: 'John Smith', type: 'direct', isOnline: false },
];

const mockMessages: TeamMessage[] = [
  { id: 'M-1', channelId: 'C-001', senderId: 'USR-001', senderName: 'Ahmed Al-Mansouri', content: 'Welcome to the new Aljaberti ONE platform everyone! 🚀', timestamp: 'Yesterday, 9:00 AM' },
  { id: 'M-2', channelId: 'C-001', senderId: 'USR-002', senderName: 'Sarah Jones', content: 'Thanks Ahmed! The new dashboard looks amazing.', timestamp: 'Yesterday, 9:05 AM' },
  { id: 'M-3', channelId: 'C-001', senderId: 'USR-003', senderName: 'Rajesh Kumar', content: 'Is the inventory module fully active now?', timestamp: 'Yesterday, 9:15 AM' },
  { id: 'M-4', channelId: 'C-001', senderId: 'USR-001', senderName: 'Ahmed Al-Mansouri', content: 'Yes, inventory is live. Please report any bugs in #it-support.', timestamp: 'Yesterday, 9:20 AM' },
];

const CommunicationModule: React.FC = () => {
  const [activeChannelId, setActiveChannelId] = useState('C-001');
  const [messages, setMessages] = useState<TeamMessage[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChannel = [...mockChannels, ...mockDirects].find(c => c.id === activeChannelId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setAttachment(e.target.files[0]);
      }
  };

  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  };

  const handleSendMessage = () => {
    if (!inputText.trim() && !attachment) return;

    let attachmentsData = undefined;
    if (attachment) {
        let type: 'image' | 'video' | 'audio' | 'file' = 'file';
        if (attachment.type.startsWith('image/')) type = 'image';
        else if (attachment.type.startsWith('video/')) type = 'video';
        else if (attachment.type.startsWith('audio/')) type = 'audio';

        attachmentsData = [{
            type,
            name: attachment.name,
            url: URL.createObjectURL(attachment)
        }];
    }

    const newMessage: TeamMessage = {
      id: `M-${Date.now()}`,
      channelId: activeChannelId,
      senderId: 'ME',
      senderName: 'You',
      content: inputText,
      timestamp: 'Just now',
      attachments: attachmentsData
    };
    setMessages([...messages, newMessage]);
    setInputText('');
    setAttachment(null);
  };

  const currentMessages = messages.filter(m => m.channelId === activeChannelId);

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
           {!isSidebarCollapsed && (
             <h2 className="font-bold text-slate-800 flex items-center gap-2">
               <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center text-white text-xs">A1</div>
               Aljaberti Team
             </h2>
           )}
           <button
             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
             className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition ml-auto"
             title={isSidebarCollapsed ? 'Expand' : 'Collapse'}
           >
             {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
           {/* Public Channels */}
           <div className="mb-6">
              <div className="flex justify-between items-center px-2 mb-2">
                 {!isSidebarCollapsed && <h3 className="text-xs font-bold text-slate-500 uppercase">Channels</h3>}
                 {!isSidebarCollapsed && <button className="text-slate-400 hover:text-brand-600"><Plus className="w-4 h-4" /></button>}
              </div>
              <div className="space-y-0.5">
                 {mockChannels.map(channel => (
                    <button 
                      key={channel.id}
                      onClick={() => setActiveChannelId(channel.id)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeChannelId === channel.id ? 'bg-white shadow-sm text-brand-700' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                       {channel.type === 'private' ? <Lock className="w-3.5 h-3.5 opacity-70" /> : <Hash className="w-3.5 h-3.5 opacity-70" />}
                       {!isSidebarCollapsed && channel.name}
                    </button>
                 ))}
              </div>
           </div>

           {/* Direct Messages */}
           <div>
              <div className="flex justify-between items-center px-2 mb-2">
                 {!isSidebarCollapsed && <h3 className="text-xs font-bold text-slate-500 uppercase">Direct Messages</h3>}
                 {!isSidebarCollapsed && <button className="text-slate-400 hover:text-brand-600"><Plus className="w-4 h-4" /></button>}
              </div>
              <div className="space-y-0.5">
                 {mockDirects.map(dm => (
                    <button 
                      key={dm.id}
                      onClick={() => setActiveChannelId(dm.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isSidebarCollapsed ? 'justify-center' : ''} ${activeChannelId === dm.id ? 'bg-white shadow-sm text-brand-700' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                       <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2'}`}>
                          <div className="relative">
                              <div className="w-5 h-5 rounded bg-gradient-to-tr from-brand-400 to-purple-400 flex items-center justify-center text-[8px] text-white font-bold">
                                {dm.name.charAt(0)}
                              </div>
                              {dm.isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full"></span>
                              )}
                          </div>
                          {!isSidebarCollapsed && <span className="truncate max-w-[120px]">{dm.name}</span>}
                       </div>
                       {!isSidebarCollapsed && dm.unreadCount && (
                          <span className="bg-brand-600 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[16px] text-center">
                             {dm.unreadCount}
                          </span>
                       )}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Chat Header */}
         <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white">
            <div className="flex items-center gap-2 overflow-hidden">
               <Hash className="w-5 h-5 text-slate-400 flex-shrink-0" />
               <h3 className="font-bold text-slate-800 truncate">{activeChannel?.name}</h3>
               {activeChannel?.isOnline && (
                   <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                   </span>
               )}
               {activeChannel?.description && (
                  <span className="text-sm text-slate-400 hidden md:inline truncate border-l border-slate-200 pl-2 ml-2">
                     {activeChannel.description}
                  </span>
               )}
            </div>
            <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                     <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] text-slate-500 font-bold">U{i}</div>
                  ))}
               </div>
               <button className="text-slate-400 hover:text-slate-600"><Search className="w-4 h-4" /></button>
               <button className="text-slate-400 hover:text-slate-600"><Pin className="w-4 h-4" /></button>
               <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
            </div>
         </div>

         {/* Messages List */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                  <Hash className="w-8 h-8 text-slate-300" />
               </div>
               <p className="font-bold text-slate-600">This is the start of #{activeChannel?.name}</p>
               <p className="text-sm">Discussion about {activeChannel?.description?.toLowerCase() || 'this topic'}.</p>
            </div>

            {currentMessages.map(msg => (
               <div key={msg.id} className="group flex gap-3 hover:bg-slate-50/50 -mx-4 px-4 py-1">
                  <div className="w-9 h-9 rounded bg-brand-100 flex-shrink-0 flex items-center justify-center font-bold text-brand-700 text-sm mt-1">
                     {msg.senderName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                     <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                     </div>
                     <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                     
                     {/* Attachments */}
                     {msg.attachments && msg.attachments.length > 0 && (
                         <div className="mt-2 flex flex-wrap gap-2">
                             {msg.attachments.map((att, idx) => (
                                 <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden max-w-xs">
                                     {att.type === 'image' ? (
                                         <img src={att.url} alt={att.name} className="max-w-[200px] max-h-[200px] object-cover" />
                                     ) : att.type === 'video' ? (
                                         <div className="p-2 bg-slate-50 flex items-center gap-2">
                                             <Film className="w-5 h-5 text-blue-500" />
                                             <span className="text-xs font-medium truncate max-w-[150px]">{att.name}</span>
                                         </div>
                                     ) : att.type === 'audio' ? (
                                         <div className="p-2 bg-slate-50 flex items-center gap-2">
                                             <Mic className="w-5 h-5 text-purple-500" />
                                             <span className="text-xs font-medium truncate max-w-[150px]">{att.name}</span>
                                         </div>
                                     ) : (
                                         <div className="p-2 bg-slate-50 flex items-center gap-2">
                                             <FileText className="w-5 h-5 text-slate-500" />
                                             <span className="text-xs font-medium truncate max-w-[150px]">{att.name}</span>
                                         </div>
                                     )}
                                 </div>
                             ))}
                         </div>
                     )}
                  </div>
               </div>
            ))}
         </div>

         {/* Message Input */}
         <div className="p-4 bg-white border-t border-slate-200">
            {attachment && (
                <div className="mb-2 flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 w-fit">
                    {attachment.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-purple-500" /> : 
                     attachment.type.startsWith('video/') ? <Film className="w-4 h-4 text-blue-500" /> : 
                     attachment.type.startsWith('audio/') ? <Music className="w-4 h-4 text-amber-500" /> : 
                     <FileText className="w-4 h-4 text-slate-500" />}
                    <span className="text-xs font-medium text-slate-700 max-w-[200px] truncate">{attachment.name}</span>
                    <button onClick={() => setAttachment(null)} className="p-0.5 hover:bg-slate-200 rounded-full ml-1"><X className="w-3 h-3 text-slate-500"/></button>
                </div>
            )}
            
            <div className="border border-slate-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all overflow-hidden bg-white">
               <textarea
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSendMessage();
                    }
                 }}
                 placeholder={`Message #${activeChannel?.name}`}
                 className="w-full max-h-32 p-3 text-sm border-none focus:ring-0 resize-none"
                 rows={1}
               />
               <div className="flex justify-between items-center bg-slate-50 p-2 border-t border-slate-100">
                  <div className="flex gap-1">
                     <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><Plus className="w-4 h-4" /></button>
                     <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                     <button onClick={triggerFileSelect} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded" title="Attach Image"><ImageIcon className="w-4 h-4" /></button>
                     <button onClick={triggerFileSelect} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded" title="Attach File"><Paperclip className="w-4 h-4" /></button>
                     <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><Smile className="w-4 h-4" /></button>
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() && !attachment}
                    className={`p-1.5 rounded transition-all ${inputText.trim() || attachment ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                     <Send className="w-4 h-4" />
                  </button>
               </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
               <strong>Tip:</strong> You can drag & drop files here to upload.
            </p>
         </div>
      </div>
    </div>
  );
};

export default CommunicationModule;
