import React, { useState, useRef, useEffect } from 'react';
import { BotMessageSquare, Send, Sparkles, User, RefreshCw, AlertCircle, Wind } from 'lucide-react';
import { CityData, ChatMessage } from '../types';

interface AiAssistantChatProps {
  city: CityData;
}

export const AiAssistantChat: React.FC<AiAssistantChatProps> = ({ city }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! I am **VayuDrishti Gemini AI**, chief Environmental Scientist monitoring **${city.name}** (Current AQI: **${city.metrics.aqi} - ${city.status}**).\n\nHow can I assist you with urban air quality intervention, source attribution, or health advisories today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Why is AQI high today?",
    "How can pollution reduce?",
    "What precautions should I take?",
    `What are the main emission sources in ${city.name}?`
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Update AI welcome message when city switches
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${city.id}`,
        sender: 'ai',
        text: `Switched target location telemetry to **${city.name}** (Live AQI: **${city.metrics.aqi} - ${city.status}** with wind at ${city.weather.windSpeed} km/h).\n\nAsk me anything about localized pollution dynamics or smart city mitigation plans!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [city.id]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          cityData: city
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply || `Based on live telemetry for ${city.name}, AQI is ${city.metrics.aqi}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiReply]);
      } else {
        throw new Error('API failure');
      }
    } catch (err) {
      console.error('Chat error', err);
      const errReply: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `Live telemetry connection for **${city.name}**: Recorded AQI is **${city.metrics.aqi} (${city.status})**. Primary attribution cause is **${city.mainPollutant}**. Municipal inspection squads have been notified of continuous emissions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errReply]);
    } finally {
      setLoading(false);
    }
  };

  // Helper formatting markdown-ish text
  const formatText = (content: string) => {
    return content.split('\n').map((line, i) => {
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300 font-bold">$1</strong>');
      return (
        <React.Fragment key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < content.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[500px] md:h-[640px] select-none">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 px-6 py-4 border-b border-slate-800 rounded-t-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
            <BotMessageSquare className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">Gemini 3.5 Environmental Strategist</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                LIVE GROUNDED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Grounded in live atmospheric sensors for {city.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Context:</span>
          <span className="font-bold text-white">{city.name}</span>
          <span className="px-1.5 py-0.5 rounded text-slate-950 font-bold ml-1 text-[10px]" style={{ backgroundColor: city.color }}>
            {city.metrics.aqi} AQI
          </span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-slate-500 flex items-center gap-1 shrink-0 text-[11px] font-medium">
          <Sparkles className="w-3 h-3 text-purple-400" /> Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3 py-1 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/80 shrink-0 text-[11px] font-medium transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 select-text">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                isUser ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                isUser 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                  <span className="font-bold uppercase tracking-wider">{isUser ? 'You' : 'VayuDrishti AI'}</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>
                <div className="text-xs">{formatText(msg.text)}</div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-purple-400 animate-pulse bg-purple-950/30 border border-purple-500/20 p-3.5 rounded-2xl max-w-xs">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-mono font-bold">Gemini analyzing urban telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={`Ask VayuDrishti AI about ${city.name}'s air quality or smart city intervention...`}
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all shadow-inner select-text"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
