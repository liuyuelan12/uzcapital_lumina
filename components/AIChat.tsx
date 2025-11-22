
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface AIChatProps {
  lang: Language;
}

const AIChat: React.FC<AIChatProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize greeting based on language, but only if it hasn't been touched or if we want to reset.
  // For simplicity, we will just clear and set the greeting when language changes if the user hasn't chatted yet.
  useEffect(() => {
    if (messages.length <= 1) {
       const greeting = lang === 'en' 
        ? 'Welcome to UZ Capital. I am your AI Analyst. How can I assist with our portfolio or investment thesis today?'
        : '歡迎來到 UZ Capital。我是您的 AI 分析師。今天我能為您的投資組合或投資理念提供什麼幫助？';
       setMessages([{ role: 'model', text: greeting }]);
    }
  }, [lang]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Slight delay to allow state update to render before scrolling
    setTimeout(scrollToBottom, 100);

    const responseText = await sendMessageToGemini(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] md:w-[400px] bg-[#0f1126]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-[#2962ff]/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1a1d3d] to-[#0f1126] p-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2962ff]/20 flex items-center justify-center border border-[#2962ff]/50">
                    <Bot className="w-5 h-5 text-[#2962ff]" />
                </div>
                <div>
                    <h3 className="font-heading font-bold text-white text-sm tracking-wider">UZ ANALYST</h3>
                    <p className="text-[10px] text-[#00f0ff] uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse"/> Online
                    </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors" data-hover="true">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-80 overflow-y-auto p-4 space-y-4 scroll-smooth bg-black/20"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 text-sm border ${
                      msg.role === 'user'
                        ? 'bg-[#2962ff]/20 text-white border-[#2962ff]/30'
                        : 'bg-[#1a1d3d] text-gray-200 border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1d3d] p-4 border border-white/5 flex gap-1 items-center">
                    <span className="text-xs text-gray-400 mr-2">Processing</span>
                    <span className="w-1 h-1 bg-[#00f0ff] animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-[#00f0ff] animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-[#00f0ff] animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-[#0f1126]">
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={lang === 'en' ? "Type your inquiry..." : "請輸入您的問題..."}
                  className="flex-1 bg-[#1a1d3d] text-white placeholder-white/20 text-sm focus:outline-none px-4 py-3 border border-white/5 focus:border-[#2962ff]/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#2962ff] px-4 py-2 hover:bg-[#00f0ff] hover:text-black transition-all duration-300 disabled:opacity-50 disabled:hover:bg-[#2962ff] disabled:hover:text-white"
                  data-hover="true"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 bg-[#2962ff] flex items-center justify-center shadow-lg shadow-[#2962ff]/30 border border-white/10 z-50 group overflow-hidden relative"
        data-hover="true"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6200ea] to-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
            {isOpen ? (
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
            ) : (
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
            )}
        </div>
      </motion.button>
    </div>
  );
};

export default AIChat;
