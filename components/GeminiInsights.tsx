import React, { useState } from 'react';
import { generateAttendanceInsights } from '../services/geminiService';
import { AttendanceRecord, AuditLog, User } from '../types';
import { BrainCircuit, Send, Sparkles, Loader2, Bot, User as UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GeminiInsightsProps {
  records: AttendanceRecord[];
  users: User[];
  logs: AuditLog[];
}

export const GeminiInsights: React.FC<GeminiInsightsProps> = ({ records, users, logs }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    const result = await generateAttendanceInsights(records, users, logs, query);
    setResponse(result);
    setLoading(false);
  };

  const suggestions = [
    "Analyze student lateness trends",
    "Any suspicious check-in patterns?",
    "Summarize department performance"
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto h-screen flex flex-col">
       <div className="mb-6 flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg text-white shadow-lg shadow-purple-500/30">
                    <BrainCircuit className="w-6 h-6" /> 
                </div>
                AI Insights
            </h1>
            <p className="text-slate-500 mt-1 ml-1">Powered by Gemini 2.5 Flash</p>
         </div>
       </div>

       <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden relative">
         {/* Chat Area */}
         <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
            {!response && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 animate-float">
                     <Sparkles className="w-10 h-10 text-brand-500" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800 mb-2">How can I help you today?</h2>
                 <p className="text-slate-500 text-sm">I can analyze attendance patterns, detect anomalies, and generate summary reports instantly.</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
               <div className="flex items-center justify-center h-full">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center gap-4">
                     <div className="relative">
                        <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin"></div>
                        <Bot className="w-6 h-6 text-brand-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                     </div>
                     <p className="text-sm font-medium text-slate-600 animate-pulse">Analyzing system data...</p>
                  </div>
               </div>
            )}

            {/* Response Area */}
            {response && (
              <div className="space-y-6 max-w-4xl mx-auto">
                 {/* User Query Bubble */}
                 <div className="flex justify-end">
                    <div className="bg-brand-600 text-white px-6 py-4 rounded-2xl rounded-tr-none shadow-md max-w-lg">
                       <p className="text-sm">{query}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center ml-3 flex-shrink-0">
                       <UserIcon className="w-5 h-5 text-brand-700" />
                    </div>
                 </div>

                 {/* AI Response Bubble */}
                 <div className="flex justify-start">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-purple-500/20">
                       <Bot className="w-5 h-5 text-white" />
                     </div>
                     <div className="bg-white px-8 py-6 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-3xl prose prose-slate prose-sm md:prose-base">
                        <ReactMarkdown>{response}</ReactMarkdown>
                     </div>
                 </div>
              </div>
            )}
         </div>

         {/* Input Area */}
         <div className="p-6 bg-white border-t border-gray-100 z-10">
           
           <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
             {suggestions.map((s, i) => (
               <button 
                 key={i}
                 onClick={() => { setQuery(s); if(!loading) handleAsk(); }}
                 className="flex-shrink-0 px-4 py-2 bg-slate-50 text-slate-600 text-xs font-medium rounded-xl hover:bg-brand-50 hover:text-brand-700 hover:scale-105 transition-all border border-slate-100 hover:border-brand-200"
               >
                 {s}
               </button>
             ))}
           </div>

           <div className="relative max-w-4xl mx-auto">
             <input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
               placeholder="Ask about attendance trends, anomalies, or summaries..."
               className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-inner text-sm"
             />
             <button 
               onClick={handleAsk}
               disabled={loading || !query}
               className="absolute right-2 top-2 p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-brand-500/30 hover:shadow-lg"
             >
               <Send className="w-5 h-5" />
             </button>
           </div>
           <p className="text-center text-[10px] text-slate-400 mt-3">AI responses may vary. Double check critical data.</p>
         </div>
       </div>
    </div>
  );
};