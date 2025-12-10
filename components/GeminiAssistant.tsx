import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';
import { generateERPInsight } from '../services/geminiService';
import { ChatMessage } from '../types';

interface GeminiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  contextSummary: string;
  initialMessage?: string;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ isOpen, onClose, contextSummary, initialMessage }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am your Aljaberti AI Assistant. How can I help you with your accounting or project data today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle auto-send of initial message if provided
  useEffect(() => {
    if (isOpen && initialMessage && !hasProcessedInitial.current) {
        handleSend(initialMessage);
        hasProcessedInitial.current = true;
    }
    if (!isOpen) {
        hasProcessedInitial.current = false; // Reset when closed
    }
  }, [isOpen, initialMessage]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateERPInsight(textToSend, contextSummary);

    const modelMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right duration-300 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="p-4 bg-brand-900 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-brand-500 bg-white rounded-full p-1" />
          <div>
            <h3 className="font-bold text-sm">Aljaberti AI Assistant</h3>
            <span className="text-xs text-brand-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Powered by Gemini 2.5
            </span>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-brand-800 p-1 rounded transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about revenue, overdue invoices..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 text-xs text-center text-slate-400">
          AI generated content may be inaccurate.
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;