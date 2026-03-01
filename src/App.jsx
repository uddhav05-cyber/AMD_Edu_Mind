import React, { useState, useEffect, useRef } from 'react';
import { Cpu, MessageSquare, Zap, ClipboardCheck, TrendingUp, ChevronRight, ChevronLeft, Globe, BookOpen, Flame, Clock, CheckCircle2, XCircle, Lightbulb, Send, LayoutDashboard, Settings, MoreVertical } from 'lucide-react';

const COLORS = { bg: '#07090F', surface: '#0D1220', card: '#111827', border: '#1E2A3A', red: '#E8232A', green: '#10B981', orange: '#F5A623', teal: '#06B6D4', purple: '#8B5CF6', white: '#F0F6FF', muted: '#8892A4' };

const LANGUAGES = [{ id: 'en', label: 'English', native: 'English' }, { id: 'hi', label: 'Hindi', native: 'हिंदी' }, { id: 'mr', label: 'Marathi', native: 'मराठी' }, { id: 'te', label: 'Telugu', native: 'తెలుగు' }, { id: 'ta', label: 'Tamil', native: 'தமிழ்' }];

const SUBJECTS = [{ id: 'math', label: 'Mathematics', icon: '∑', color: COLORS.red }, { id: 'phys', label: 'Physics', icon: '⚛', color: COLORS.purple }, { id: 'prog', label: 'Programming', icon: '</>', color: COLORS.teal }, { id: 'chem', label: 'Chemistry', icon: '🧪', color: COLORS.orange }];

const QUIZ_QUESTIONS = [{ id: 1, question: "What is the derivative of sin(x²)?", options: ["2x · cos(x²)", "cos(x²)", "-sin(x²)", "2x · sin(x)"], correct: 0, explanation: "Correct! We use the chain rule: d/dx[sin(u)] = cos(u) * du/dx. Here u = x², so du/dx = 2x.", difficulty: 'Hard' }, { id: 2, question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Linked List", "Tree"], correct: 1, explanation: "Correct! A Stack operates on LIFO, whereas a Queue operates on FIFO.", difficulty: 'Easy' }];

const Badge = ({ children, color = COLORS.red, outline = false }) => (<span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-bold tracking-wider" style={{ backgroundColor: outline ? 'transparent' : `${color}20`, border: `1px solid ${color}40`, color: color }}>{children}</span>);

const ProgressBar = ({ progress, color = COLORS.red, height = 6 }) => (<div className="w-full bg-[#1E2A3A] rounded-full overflow-hidden" style={{ height }}><div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%`, backgroundColor: color }} /></div>);

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState({ name: 'Uddhav', language: 'en', subject: 'math', mastery: { math: 72, prog: 85, phys: 48, chem: 41 }, streak: 5, examDate: '2025-06-15' });
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Namaste! I am your AI tutor. How can I help you learn today?' }]);
  const [isTyping, setIsTyping] = useState(false);
  const [quizState, setQuizState] = useState({ idx: 0, score: 0, finished: false, chosen: null });

  const navigate = (s) => { window.scrollTo(0, 0); setScreen(s); };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => { setMessages(prev => [...prev, { role: 'ai', text: 'I understand. How can I help further?' }]); setIsTyping(false); }, 1200);
  };

  const LandingScreen = () => (
    <div className="min-h-screen flex flex-col bg-[#07090F] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(${COLORS.red} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.red} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E8232A] opacity-10 blur-[120px]" />
      <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[30%] bg-[#8B5CF6] opacity-10 blur-[100px]" />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <Badge>AMD SLINGSHOT HACKATHON · TEAM SIGNAL_404</Badge>
        <h1 className="mt-8 text-6xl md:text-8xl font-black font-serif leading-tight">EduMind <span style={{ color: COLORS.red }}>AI</span></h1>
        <p className="mt-6 text-lg md:text-xl font-mono text-[#8892A4] leading-relaxed max-w-xl">India's first offline multilingual AI tutor. Personalized mastery for every student, powered by AMD Ryzen AI.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Badge color={COLORS.green}>100% OFFLINE</Badge>
          <Badge color={COLORS.teal}>5 LANGUAGES</Badge>
          <Badge color={COLORS.purple}>ADAPTIVE LEARNING</Badge>
        </div>
        <button onClick={() => navigate('onboarding-lang')} className="mt-12 px-10 py-4 rounded-xl font-mono font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl" style={{ backgroundColor: COLORS.red, boxShadow: `0 10px 40px ${COLORS.red}40` }}>START LEARNING →</button>
        <div className="mt-16 grid grid-cols-3 gap-12 border-t border-[#1E2A3A] pt-12 w-full">
          <div><div className="text-3xl font-serif font-black" style={{ color: COLORS.red }}>40M+</div><div className="text-[10px] font-mono text-[#4A5568] uppercase tracking-widest mt-1">Students</div></div>
          <div><div className="text-3xl font-serif font-black" style={{ color: COLORS.red }}>&lt;2s</div><div className="text-[10px] font-mono text-[#4A5568] uppercase tracking-widest mt-1">Latency</div></div>
          <div><div className="text-3xl font-serif font-black" style={{ color: COLORS.red }}>₹99</div><div className="text-[10px] font-mono text-[#4A5568] uppercase tracking-widest mt-1">Per Month</div></div>
        </div>
      </div>
    </div>
  );

  const OnboardingLangScreen = () => (
    <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-serif font-bold text-center mb-2 text-white">Choose Your Language</h2>
        <p className="text-center font-mono text-[#8892A4] text-xs mb-8">EduMind AI responds in your native language</p>
        <div className="space-y-3">
          {LANGUAGES.map(l => (
            <button key={l.id} onClick={() => setUser({...user, language: l.id})} className={`w-full p-4 rounded-xl border transition-all flex justify-between items-center group ${user.language === l.id ? 'border-[#E8232A] bg-[#E8232A]10' : 'border-[#1E2A3A] bg-[#111827] hover:border-[#2A3A50]'}`}>
              <span className={`font-mono font-bold ${user.language === l.id ? 'text-white' : 'text-[#8892A4]'}`}>{l.label}</span>
              <span className={`font-serif text-lg ${user.language === l.id ? 'text-[#E8232A]' : 'text-[#4A5568]'}`}>{l.native}</span>
            </button>
          ))}
        </div>
        <button onClick={() => navigate('onboarding-subj')} className="w-full mt-10 p-4 rounded-xl bg-[#E8232A] font-mono font-bold text-white hover:brightness-110 active:scale-[0.98] transition-all">NEXT →</button>
      </div>
    </div>
  );

  const OnboardingSubjScreen = () => (
    <div className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-serif font-bold text-center mb-2 text-white">Focus Area</h2>
        <p className="text-center font-mono text-[#8892A4] text-xs mb-8">Select a primary subject to start learning</p>
        <div className="grid grid-cols-2 gap-4">
          {SUBJECTS.map(s => (
            <button key={s.id} onClick={() => setUser({...user, subject: s.id})} className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center ${user.subject === s.id ? 'border-[#E8232A] bg-[#E8232A]05' : 'border-[#1E2A3A] bg-[#111827]'}`}>
              <span className="text-3xl" style={{ color: user.subject === s.id ? COLORS.red : COLORS.muted }}>{s.icon}</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-white">{s.label}</span>
              {user.subject === s.id && <div className="w-1.5 h-1.5 rounded-full bg-[#E8232A]" />}
            </button>
          ))}
        </div>
        <button onClick={() => navigate('dashboard')} className="w-full mt-10 p-4 rounded-xl bg-[#E8232A] font-mono font-bold text-white hover:brightness-110">LET'S GO</button>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <div className="min-h-screen bg-[#07090F] text-white pb-24">
      <div className="p-6 flex justify-between items-center border-b border-[#1E2A3A]">
        <div><div className="flex items-center gap-2"><div className="w-7 h-7 bg-[#E8232A] rounded-lg flex items-center justify-center text-white font-black text-sm">E</div><h3 className="font-serif font-bold text-lg">EduMind AI</h3></div><p className="text-[9px] font-mono text-[#8892A4] mt-0.5 uppercase">Team Signal_404</p></div>
        <div className="flex gap-2"><Badge color={COLORS.green}>OFFLINE</Badge><Badge color={COLORS.red}>NPU ACTIVE</Badge></div>
      </div>
      <div className="px-6 space-y-6 mt-6">
        <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E2A3A]"><Badge color={COLORS.red} outline>TODAY'S GOAL</Badge><h2 className="text-xl font-serif font-bold mt-2">Study {SUBJECTS.find(s=>s.id===user.subject)?.label}</h2><div className="mt-6"><ProgressBar progress={42} /></div></div>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: 'Ask Tutor', screen: 'chat', icon: <MessageSquare size={20} />, color: COLORS.red }, { label: 'Take Quiz', screen: 'quiz', icon: <Zap size={20} />, color: COLORS.orange }, { label: 'Analytics', screen: 'progress', icon: <TrendingUp size={20} />, color: COLORS.teal }].map(a => (
            <button key={a.label} onClick={() => navigate(a.screen)} className="p-4 rounded-xl bg-[#111827] border border-[#1E2A3A] flex flex-col items-center gap-2"><span style={{ color: a.color }}>{a.icon}</span><span className="text-[9px] font-mono font-bold uppercase">{a.label}</span></button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D1220] border-t border-[#1E2A3A] p-2 flex justify-around">
        <button onClick={() => navigate('dashboard')} className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-[#E8232A]"><LayoutDashboard size={20} /><span className="text-[8px] font-mono font-bold uppercase">Home</span></button>
        <button onClick={() => navigate('chat')} className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-[#4A5568]"><MessageSquare size={20} /><span className="text-[8px] font-mono font-bold uppercase">Tutor</span></button>
        <button onClick={() => navigate('quiz')} className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-[#4A5568]"><Zap size={20} /><span className="text-[8px] font-mono font-bold uppercase">Quiz</span></button>
        <button onClick={() => navigate('progress')} className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-[#4A5568]"><TrendingUp size={20} /><span className="text-[8px] font-mono font-bold uppercase">Stats</span></button>
      </div>
    </div>
  );

  const ChatScreen = () => {
    const scrollRef = useRef(null);
    useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages, isTyping]);
    return (
      <div className="min-h-screen bg-[#07090F] flex flex-col">
        <div className="p-4 bg-[#0D1220] border-b border-[#1E2A3A] flex items-center gap-3">
          <button onClick={() => navigate('dashboard')} className="text-[#8892A4]"><ChevronLeft /></button>
          <div className="w-10 h-10 rounded-full bg-[#E8232A] flex items-center justify-center text-lg">∑</div>
          <div className="flex-1"><h3 className="font-serif font-bold text-sm text-white">EduMind AI</h3><p className="text-[9px] font-mono text-[#10B981]">Offline · AMD NPU</p></div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-mono leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-[#E8232A] text-white' : 'bg-[#111827] border border-[#1E2A3A] text-[#F0F6FF]'}`}>{m.text}</div>
            </div>
          ))}
          {isTyping && <div className="flex justify-start"><div className="bg-[#111827] border border-[#1E2A3A] p-3 rounded-2xl flex gap-1"><div style={{'animation':'bounce 1s infinite'}} className="w-1 h-1 bg-[#E8232A]" /><div style={{'animation':'bounce 1s infinite', 'animationDelay':'0.2s'}} className="w-1 h-1 bg-[#E8232A]" /><div style={{'animation':'bounce 1s infinite', 'animationDelay':'0.4s'}} className="w-1 h-1 bg-[#E8232A]" /></div></div>}
        </div>
        <div className="p-4 bg-[#07090F] border-t border-[#1E2A3A]">
          <div className="bg-[#111827] border border-[#1E2A3A] rounded-xl p-2 flex items-center gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} placeholder="Ask anything..." className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-white py-2" />
            <button onClick={handleChat} className="p-2 bg-[#E8232A] text-white rounded-lg"><Send size={18} /></button>
          </div>
        </div>
      </div>
    );
  };

  const QuizScreen = () => {
    const q = QUIZ_QUESTIONS[quizState.idx];
    const handleAnswer = (i) => { setQuizState({ ...quizState, chosen: i }); if (i === q.correct) setQuizState(prev => ({ ...prev, score: prev.score + 1 })); };
    const nextQ = () => { if (quizState.idx < QUIZ_QUESTIONS.length - 1) setQuizState({ ...quizState, idx: quizState.idx + 1, chosen: null }); else setQuizState({ ...quizState, finished: true }); };
    if (quizState.finished) return (<div className="min-h-screen bg-[#07090F] text-white p-6 flex flex-col items-center justify-center"><div className="text-6xl font-bold mb-6">{quizState.score}/{QUIZ_QUESTIONS.length}</div><h2 className="text-3xl font-serif font-bold">Quiz Complete!</h2><button onClick={() => navigate('dashboard')} className="mt-8 py-4 px-10 rounded-xl bg-[#E8232A] font-mono font-bold">Back</button></div>);
    return (
      <div className="min-h-screen bg-[#07090F] text-white p-6 flex flex-col">
        <button onClick={() => navigate('dashboard')} className="text-[#8892A4] mb-6">← BACK</button>
        <h2 className="text-2xl font-serif font-bold mb-4">Q{quizState.idx + 1}: {q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} disabled={quizState.chosen !== null} onClick={() => handleAnswer(i)} className={`w-full p-4 rounded-xl border transition-all text-left font-mono text-sm ${quizState.chosen !== null ? (i === q.correct ? 'border-[#10B981] bg-[#10B981]10' : i === quizState.chosen ? 'border-[#E8232A] bg-[#E8232A]10' : 'border-[#1E2A3A] bg-[#111827]') : 'border-[#1E2A3A] bg-[#111827]'}`}>
              {opt}
            </button>
          ))}
        </div>
        {quizState.chosen !== null && (<div className="mt-6 p-4 rounded-xl bg-[#0D1220] border border-[#1E2A3A]"><p className="font-bold text-[#10B981]">EXPLANATION</p><p className="text-xs text-[#8892A4] mt-2">{q.explanation}</p><button onClick={nextQ} className="w-full mt-4 py-3 rounded-xl bg-[#E8232A] font-mono font-bold">{quizState.idx === QUIZ_QUESTIONS.length - 1 ? 'FINISH' : 'NEXT'} →</button></div>)}
      </div>
    );
  };

  const ProgressScreen = () => (
    <div className="min-h-screen bg-[#07090F] text-white p-6">
      <button onClick={() => navigate('dashboard')} className="text-[#8892A4] mb-8">← BACK</button>
      <h2 className="text-3xl font-serif font-bold mb-8">Performance</h2>
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E2A3A]"><Badge color={COLORS.green}>EXAM READINESS</Badge><div className="mt-4 text-5xl font-black font-serif text-[#10B981]">68%</div></div>
        <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E2A3A]"><h3 className="text-[10px] font-mono text-[#8892A4] uppercase font-bold mb-4">Mastery Breakdown</h3>{Object.entries(user.mastery).map(([subj, val]) => (<div key={subj} className="mb-3"><div className="flex justify-between text-xs mb-1"><span className="font-mono font-bold">{subj}</span><span>{val}%</span></div><ProgressBar progress={val} /></div>))}</div>
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-[#07090F]">
      {screen === 'landing' && <LandingScreen />}
      {screen === 'onboarding-lang' && <OnboardingLangScreen />}
      {screen === 'onboarding-subj' && <OnboardingSubjScreen />}
      {screen === 'dashboard' && <DashboardScreen />}
      {screen === 'chat' && <ChatScreen />}
      {screen === 'quiz' && <QuizScreen />}
      {screen === 'progress' && <ProgressScreen />}
    </div>
  );
}
