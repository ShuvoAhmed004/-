
import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Volume2, VolumeX, Mic, MicOff, Sparkles, Star } from 'lucide-react';
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
  const [showSurprise, setShowSurprise] = useState(false);
  const [surpriseMsg, setSurpriseMsg] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const complements = [
    "নদি, তুমি আমার জীবনের শ্রেষ্ঠ উপহার।",
    "তোমার চোখের দিকে তাকালে আমি নিজের অস্তিত্ব ভুলে যাই।",
    "পৃথিবীর সব গোলাপের সুবাস মিলেও তোমার মায়ার সমান হবে না।",
    "শুভ'র পৃথিবীটা শুধুই তোমার নামে লেখা।"
  ];

  const triggerSurprise = () => {
    setSurpriseMsg(complements[Math.floor(Math.random() * complements.length)]);
    setShowSurprise(true);
    setTimeout(() => setShowSurprise(false), 5000);
  };

  useEffect(() => {
    if (appState === AppState.READY) {
      setTimeout(() => {
        const opening = "নদি… আমার হৃদয়ের সবটুকু মায়া তোমার জন্য। তুমি এসেছ বলে আমার পৃথিবীটা আজ এত উজ্জ্বল। তোমার দিনটা কেমন কাটছে প্রিয়? তোমাকে অনেক মিস করছি ইতি (শুভ)";
        addModelMessage(opening);
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
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
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
    } catch (e) {}
  };

  const addModelMessage = async (text: string) => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 2000));
    const audio = isAudioEnabled ? await gemini.generateSpeech(text) : '';
    setMessages(prev => [...prev, { role: 'model', text, audio }]);
    setIsTyping(false);
    if (audio) playAudio(audio);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    const txt = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: txt }]);
    try {
      const res = await gemini.generateResponse(messages, txt);
      if (res) addModelMessage(res);
    } catch (e) {
      addModelMessage("সরি প্রিয়, আমি তোমার কাছে ফিরতে পারছি না... তোমাকে অনেক মিস করছি ইতি (শুভ)");
    }
  };

  if (appState === AppState.INTRO) return <IntroAnimation onComplete={() => setAppState(AppState.READY)} />;

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden selection:bg-pink-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="aurora-bg absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-purple-900/10 via-black to-pink-900/10" />
      </div>
      <FloatingParticles />

      {/* Elegant Header */}
      <header className="relative z-10 px-10 py-12 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex flex-col group cursor-pointer" onClick={triggerSurprise}>
          <h1 className="text-5xl font-extralight tracking-[0.3em] text-white flex items-center gap-6">
            নদি 
            <Heart size={24} className="text-pink-500 group-hover:scale-150 transition-transform animate-pulse fill-pink-500/10" />
          </h1>
          <p className="text-[10px] tracking-[0.8em] text-pink-300/30 uppercase mt-4">Light In Darkness</p>
        </div>
        <button onClick={() => setIsAudioEnabled(!isAudioEnabled)} className="p-5 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-pink-300 hover:border-pink-500/20 transition-all duration-700">
          {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </header>

      {/* Surprise Overlay */}
      {showSurprise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-10">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-16 shadow-[0_0_150px_rgba(236,72,153,0.1)] animate-in fade-in zoom-in-95 duration-1000 text-center max-w-2xl">
            <Star size={40} className="text-yellow-400 mx-auto mb-8 animate-spin-slow" />
            <p className="text-3xl md:text-4xl text-pink-50 font-light italic leading-relaxed">{surpriseMsg}</p>
          </div>
        </div>
      )}

      {/* Chat History */}
      <main className="flex-1 relative z-10 w-full max-w-4xl mx-auto px-8 overflow-y-auto pb-60 pt-10 no-scrollbar">
        <div className="space-y-16">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-message`}>
              <div className={`px-10 py-7 rounded-[3rem] text-xl md:text-3xl leading-relaxed transition-all duration-700 
                ${msg.role === 'user' ? 'bg-white/5 border border-white/10 text-white/60 rounded-tr-none' : 'bg-white/[0.07] backdrop-blur-3xl border border-white/[0.05] text-pink-100 italic font-light rounded-tl-none shadow-2xl'}`}>
                {msg.text}
              </div>
              {msg.role === 'model' && <div className="mt-6 flex items-center gap-4 text-pink-300/10 tracking-[0.6em] text-[10px] ml-8">
                <Heart size={10} className="fill-pink-300/10" /> HIS ETERNAL SANCTUARY
              </div>}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-3 ml-10 p-4 bg-white/5 rounded-full border border-white/5 animate-pulse">
              <div className="w-2 h-2 bg-pink-500/30 rounded-full" />
              <div className="w-2 h-2 bg-pink-500/30 rounded-full" />
              <div className="w-2 h-2 bg-pink-500/30 rounded-full" />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Section */}
      <footer className="fixed bottom-0 left-0 right-0 p-10 z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-[4rem] p-3 flex items-center gap-4 shadow-2xl transition-all duration-700 hover:bg-white/[0.06] mb-12">
            <button type="button" onClick={() => setIsListening(!isListening)} className={`p-7 rounded-full transition-all duration-700 ${isListening ? 'bg-pink-600 text-white shadow-[0_0_40px_rgba(236,72,153,0.4)]' : 'text-white/20 hover:text-white/40'}`}>
              <Mic size={32} className={isListening ? 'animate-pulse' : ''} />
            </button>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="নদি, কিছু বলো..." className="flex-1 bg-transparent border-none outline-none text-2xl text-white/70 placeholder:text-white/5 font-extralight py-4" />
            <button type="submit" disabled={!inputValue.trim() || isTyping} className={`p-7 rounded-full transition-all duration-700 ${inputValue.trim() && !isTyping ? 'bg-white text-black scale-100 shadow-[0_0_50px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-white/5 scale-90'}`}>
              <Send size={32} />
            </button>
          </form>

          {/* Signature */}
          <div className="text-center group">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mb-6" />
            <p className="text-[24px] text-pink-400/20 tracking-[1.5em] font-extralight uppercase ml-[1.5em] transition-all duration-1000 group-hover:text-pink-400/40 animate-pulse">
              শুভ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
