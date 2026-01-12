
import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import IntroAnimation from './components/IntroAnimation';
import FloatingParticles from './components/FloatingParticles';
import { AppState, Message } from './types';
import { gemini } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize opening message
  useEffect(() => {
    if (appState === AppState.READY) {
      setTimeout(() => {
        const openingText = "নদি… তুমি জানো? কিছু মানুষ আসে, আর সবকিছু নিঃশব্দে সুন্দর হয়ে যায় 💖";
        addModelMessage(openingText);
        setAppState(AppState.CHATTING);
      }, 1000);
    }
  }, [appState]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const decodeAudio = async (base64: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length;
    const buffer = audioContextRef.current.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const playAudio = async (base64: string) => {
    if (!isAudioEnabled) return;
    try {
      const buffer = await decodeAudio(base64);
      const source = audioContextRef.current!.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current!.destination);
      source.start();
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  const addModelMessage = async (text: string) => {
    setIsTyping(true);
    await new Promise(res => setTimeout(res, 1500));
    
    let audioBase64 = '';
    if (isAudioEnabled) {
      audioBase64 = await gemini.generateSpeech(text) || '';
    }

    const newMessage: Message = {
      role: 'model',
      text: text,
      audio: audioBase64
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);

    if (audioBase64) {
      playAudio(audioBase64);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue('');
    
    const userMsg: Message = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await gemini.generateResponse(messages, userText);
      if (response) {
        addModelMessage(response);
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      addModelMessage("সরি নদি, আমি এই মুহূর্তে কিছু বলতে পারছি না... কিন্তু আমি তোমার পাশেই আছি।");
    }
  };

  if (appState === AppState.INTRO) {
    return <IntroAnimation onComplete={() => setAppState(AppState.READY)} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-['Hind_Siliguri']">
      {/* Cinematic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a0b12] via-black to-[#0b1a18] opacity-60 z-0" />
      <FloatingParticles />
      
      {/* Decorative Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-pink-500/10 blur-[150px] rounded-full" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 blur-[150px] rounded-full" />

      {/* Header */}
      <header className="relative z-10 py-8 px-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <div className="flex flex-col">
          <h1 className="text-3xl font-light tracking-[0.2em] text-white/90">নদি</h1>
          <span className="text-xs tracking-[0.4em] text-pink-300/50 uppercase mt-1">My Sanctuary</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/70"
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 relative z-10 w-full max-w-4xl mx-auto px-6 overflow-y-auto pb-40 pt-4">
        <div className="space-y-12">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} transition-all duration-1000 animate-in fade-in slide-in-from-bottom-4`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-pink-200/40 text-[10px] uppercase tracking-widest ml-4">
                  <Heart size={10} className="fill-pink-200/40" />
                  Him
                </div>
              )}
              <div className={`
                max-w-[85%] md:max-w-[70%] px-6 py-4 rounded-3xl text-lg md:text-xl leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-white/5 border border-white/10 text-white/90 rounded-tr-none' 
                  : 'bg-white/10 backdrop-blur-xl border border-white/10 text-pink-50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-tl-none font-light italic'
                }
              `}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex flex-col items-start animate-pulse ml-4">
              <div className="w-16 h-8 bg-white/5 rounded-full flex items-center justify-center gap-1 border border-white/10">
                <div className="w-1.5 h-1.5 bg-pink-300/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-pink-300/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-pink-300/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Dock */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-20">
        <div className="max-w-4xl mx-auto relative">
          <form 
            onSubmit={handleSendMessage}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex items-center gap-2 shadow-2xl transition-all hover:bg-white/10 group mb-6"
          >
            <button 
              type="button"
              onClick={() => setIsListening(!isListening)}
              className={`p-4 rounded-full transition-all ${isListening ? 'bg-pink-500/20 text-pink-300' : 'text-white/40 hover:text-white/60'}`}
            >
              {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Talk to me, Nodi..."
              className="flex-1 bg-transparent border-none outline-none text-lg text-white/90 placeholder:text-white/20 py-2 px-2"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`
                p-4 rounded-full transition-all duration-300
                ${inputValue.trim() && !isTyping 
                  ? 'bg-white text-black scale-100 shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                  : 'bg-white/5 text-white/20 scale-90'
                }
              `}
            >
              <Send size={24} />
            </button>
          </form>
          
          <div className="text-center pb-2 opacity-60">
            <p className="text-[10px] text-white/30 tracking-[0.4em] uppercase mb-1">
              For Nodi, With Love
            </p>
            <p className="text-[12px] text-pink-400/50 tracking-[0.8em] font-medium uppercase ml-[0.8em]">
              শুভ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
