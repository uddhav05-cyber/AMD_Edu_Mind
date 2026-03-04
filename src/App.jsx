import React, { useState, useEffect, useRef } from 'react';
import { Cpu, MessageSquare, Zap, ClipboardCheck, TrendingUp, ChevronRight, ChevronLeft, Globe, BookOpen, Flame, Clock, CheckCircle2, XCircle, Lightbulb, Send, LayoutDashboard, Settings, MoreVertical, Brain, Sparkles, Award } from 'lucide-react';

const COLORS = { bg: '#F8FAFF', surface: '#F1F5F9', card: '#FFFFFF', border: '#E6EEF8', primary: '#2563EB', red: '#2563EB', accent: '#7C3AED', danger: '#EF4444', success: '#10B981', green: '#10B981', orange: '#F97316', teal: '#06B6D4', purple: '#7C3AED', white: '#FFFFFF', muted: '#6B7280', light: '#EEF2FF' };

const LANGUAGES = [{ id: 'en', label: 'English', native: 'English' }, { id: 'hi', label: 'Hindi', native: 'हिंदी' }, { id: 'mr', label: 'Marathi', native: 'मराठी' }, { id: 'te', label: 'Telugu', native: 'తెలుగు' }, { id: 'ta', label: 'Tamil', native: 'தమిழ்' }];

const SUBJECTS = [{ id: 'math', label: 'Mathematics', icon: '∑', color: COLORS.red, bgColor: 'from-red-500/20 to-red-500/10' }, { id: 'phys', label: 'Physics', icon: '⚛', color: COLORS.purple, bgColor: 'from-purple-500/20 to-purple-500/10' }, { id: 'prog', label: 'Programming', icon: '</>', color: COLORS.teal, bgColor: 'from-cyan-500/20 to-cyan-500/10' }, { id: 'chem', label: 'Chemistry', icon: '🧪', color: COLORS.orange, bgColor: 'from-orange-500/20 to-orange-500/10' }];

const QUIZ_QUESTIONS = [{ id: 1, question: "What is the derivative of sin(x²)?", options: ["2x · cos(x²)", "cos(x²)", "-sin(x²)", "2x · sin(x)"], correct: 0, explanation: "Correct! We use the chain rule: d/dx[sin(u)] = cos(u) * du/dx. Here u = x², so du/dx = 2x.", difficulty: 'Hard' }, { id: 2, question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Linked List", "Tree"], correct: 1, explanation: "Correct! A Stack operates on LIFO, whereas a Queue operates on FIFO.", difficulty: 'Easy' }];

const Badge = ({ children, color = COLORS.primary, outline = false }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider" style={{ backgroundColor: outline ? 'transparent' : `${color}20`, border: `1.5px solid ${color}60`, color: color }}>
    {children}
  </span>
);

const ProgressBar = ({ progress, color = COLORS.red, height = 8 }) => (
  <div className="w-full bg-gray-800/50 rounded-full overflow-hidden" style={{ height }}>
    <div className="h-full rounded-full transition-all duration-700 ease-out shadow-lg" style={{ width: `${progress}%`, backgroundColor: color, boxShadow: `0 0 20px ${color}80` }} />
  </div>
);

const GradientButton = ({ children, onClick, gradient = `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`, className = '' }) => (
  <button onClick={onClick} className={`px-6 py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${className}`} style={{ background: gradient }}>
    {children}
  </button>
);

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [navLoading, setNavLoading] = useState(false); // show page transition
  const [user, setUser] = useState({ name: 'Uddhav', language: 'en', subject: 'math', mastery: { math: 72, prog: 85, phys: 48, chem: 41 }, streak: 5, examDate: '2025-06-15' });
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Namaste! I am your AI tutor. How can I help you learn today?' }]);
  const [isTyping, setIsTyping] = useState(false);
  const [quizState, setQuizState] = useState({ idx: 0, score: 0, finished: false, chosen: null });

  const examDaysLeft = () => {
    const today = new Date();
    const exam = new Date(user.examDate);
    const diff = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const navigate = (s) => {
    // small loading for nicer transition
    setNavLoading(true);
    setTimeout(() => {
      window.scrollTo(0, 0);
      setScreen(s);
      setNavLoading(false);
    }, 200);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      // call backend chat endpoint
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg, language: user.language }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch (err) {
      console.error('chat error', err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Oops, something went wrong.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const LandingScreen = () => (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-surface to-white relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-gradient-to-r from-primary/30 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-gradient-to-l from-teal-200/20 to-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `linear-gradient(0deg, ${COLORS.primary} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.primary} 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30 mb-8">
          <Cpu size={16} className="text-red-400" />
          <span className="text-sm font-mono text-red-300">AMD RYZEN AI POWERED</span>
        </div>

        <h1 className="text-7xl md:text-8xl font-black leading-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
          EduMind <span className="text-slate-900">AI</span>
        </h1>

        <p className="text-lg md:text-2xl font-light text-slate-600 leading-relaxed max-w-2xl mb-8">
          India's first offline multilingual AI tutor powered by AMD Ryzen AI. Personalized adaptive learning for every student.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Badge color={COLORS.green}>🔓 100% OFFLINE</Badge>
          <Badge color={COLORS.teal}>🌍 5 LANGUAGES</Badge>
          <Badge color={COLORS.purple}>🧠 ADAPTIVE AI</Badge>
          <Badge color={COLORS.orange}>⚡ &lt;2s LATENCY</Badge>
        </div>

        <button 
          onClick={() => navigate('onboarding-lang')} 
          className="group relative px-10 py-4 rounded-xl font-bold text-white text-lg transition-all transform hover:scale-110 active:scale-95 shadow-2xl overflow-hidden mb-16"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)` }}
        >
          <span className="relative z-10 flex items-center gap-2">START LEARNING <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" /></span>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </button>

        <div className="grid grid-cols-3 gap-8 w-full border-t border-gray-700 pt-12">
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">40M+</div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Students Worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">&lt;2s</div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-2">₹99</div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Per Month</div>
          </div>
        </div>
      </div>
    </div>
  );

  const OnboardingLangScreen = () => (
    <div className={`min-h-screen bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${navLoading ? 'opacity-50' : 'opacity-100'}`}>
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Choose Language</h2>
          <p className="text-slate-500 text-sm">Select your preferred language for learning</p>
        </div>

        <div className="space-y-3 mb-8">
          {LANGUAGES.map(l => (
            <button 
              key={l.id} 
              onClick={() => setUser({...user, language: l.id})} 
              className={`w-full p-5 rounded-xl border-2 transition-all flex justify-between items-center group ${user.language === l.id ? 'border-primary bg-gradient-to-r from-primary/20 to-accent/20' : 'border-slate-200 bg-white/50 hover:border-slate-300'}`}
            >
              <span className={`font-medium text-lg ${user.language === l.id ? 'text-slate-900' : 'text-slate-500'}`}>{l.label}</span>
              <span className={`font-serif text-2xl ${user.language === l.id ? 'text-primary' : 'text-slate-400'}`}>{l.native}</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => navigate('onboarding-subj')} 
          className="w-full p-4 rounded-lg bg-gradient-to-r from-primary to-accent font-bold text-white hover:shadow-lg transition-all"
        >
          CONTINUE →
        </button>
      </div>
    </div>
  );

  const OnboardingSubjScreen = () => (
    <div className={`min-h-screen bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${navLoading ? 'opacity-50' : 'opacity-100'}`}>
      <div className="w-full max-w-2xl">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Select Your Focus</h2>
          <p className="text-slate-500 text-sm">Choose your primary subject to begin personalized learning</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {SUBJECTS.map(s => (
            <button 
              key={s.id} 
              onClick={() => setUser({...user, subject: s.id})} 
              className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 text-center group ${user.subject === s.id ? `border-primary bg-gradient-to-br from-primary/20 to-accent/20` : 'border-slate-200 bg-white/50 hover:border-slate-300'}`}
            >
              <span className={`text-5xl group-hover:scale-110 transition-transform ${user.subject === s.id ? 'scale-110' : ''}`}>{s.icon}</span>
              <span className="font-bold text-lg text-slate-900 uppercase tracking-wide">{s.label}</span>
              {user.subject === s.id && <div className="w-2 h-2 rounded-full bg-primary" />}
            </button>
          ))}
        </div>

        <button 
          onClick={() => navigate('dashboard')} 
          className="w-full p-4 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 font-bold text-white hover:shadow-lg hover:shadow-red-500/50 transition-all text-lg"
        >
          BEGIN LEARNING
        </button>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <div className={`min-h-screen bg-white text-slate-900 pb-32 transition-opacity duration-300 ${navLoading ? 'opacity-50' : 'opacity-100'}`}>
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-200 bg-white/60">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">E</div>
              <h3 className="font-bold text-xl text-slate-900">EduMind AI</h3>
            </div>
            <p className="text-xs font-mono text-green-600">🟢 AMD NPU Active</p>
          </div>
          <div className="flex gap-2">
            <Badge color={COLORS.green}>OFFLINE</Badge>
            <Badge color={COLORS.red}>RYZEN AI</Badge>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-slate-500">Keep up your momentum and master {SUBJECTS.find(s=>s.id===user.subject)?.label}</p>
        </div>

        {/* Exam Countdown Card */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
          <div className="flex items-center gap-4">
            <Clock className="text-orange-400" size={32} />
            <div>
              <p className="text-sm text-orange-300 font-mono">EXAM COUNTDOWN</p>
              <p className="text-3xl font-bold text-white">{examDaysLeft()} days</p>
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="mb-8 p-6 rounded-xl bg-white/60 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge color={COLORS.red}>TODAY'S GOAL</Badge>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Learn {SUBJECTS.find(s=>s.id===user.subject)?.label}</h2>
            </div>
            <Flame className="text-orange-400" size={28} />
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Progress Today</span>
              <span className="text-slate-900 font-bold">42%</span>
            </div>
            <ProgressBar progress={42} color={COLORS.red} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Chat', screen: 'chat', icon: <MessageSquare size={22} />, color: 'from-red-500 to-pink-600' },
            { label: 'Quiz', screen: 'quiz', icon: <Zap size={22} />, color: 'from-orange-500 to-yellow-600' },
            { label: 'Stats', screen: 'progress', icon: <TrendingUp size={22} />, color: 'from-cyan-500 to-blue-600' }
          ].map(a => (
            <button 
              key={a.label} 
              onClick={() => navigate(a.screen)} 
              className={`p-4 rounded-xl bg-gradient-to-br ${a.color} hover:shadow-lg transition-all transform hover:scale-105 active:scale-95`}
            >
              <div className="text-white mb-2">{a.icon}</div>
              <p className="text-xs font-bold text-white">{a.label}</p>
            </button>
          ))}
        </div>

        {/* Study Planner */}
        <button
          onClick={() => navigate('planner')}
          className="w-full p-6 rounded-xl bg-gradient-to-r from-purple-600/50 to-purple-700/20 border border-purple-500/30 hover:border-purple-500/50 transition-all flex items-center justify-between group"
        >
          <div className="text-left">
            <p className="text-sm text-purple-300 font-mono">STUDY PLANNER</p>
            <p className="text-lg font-bold text-white mt-1">Personalized Schedule</p>
          </div>
          <ChevronRight className="text-purple-400 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex justify-around">
        {[
          { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
          { id: 'chat', label: 'AI Tutor', icon: <MessageSquare size={20} /> },
          { id: 'quiz', label: 'Quiz', icon: <Zap size={20} /> },
          { id: 'progress', label: 'Progress', icon: <TrendingUp size={20} /> }
        ].map(nav => (
            <button 
            key={nav.id}
            onClick={() => navigate(nav.id)} 
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${screen === nav.id ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {nav.icon}
            <span className="text-xs font-mono font-bold">{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const ChatScreen = () => {
    const scrollRef = useRef(null);
    useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages, isTyping]);
    return (
      <div className={`min-h-screen bg-white flex flex-col transition-opacity duration-300 ${navLoading ? 'opacity-50' : 'opacity-100'}`}>
        {/* Header */}
        <div className="sticky top-0 z-40 p-5 bg-white/60 backdrop-blur-md border-b border-slate-200 flex items-center gap-4">
          <button onClick={() => navigate('dashboard')} className="text-slate-600 hover:text-slate-900 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">∑</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900">EduMind AI Tutor</h3>
            <p className="text-xs text-green-600 font-mono">🟢 AMD Ryzen AI | Offline</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>  
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-5 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-gradient-to-r from-primary to-accent text-white' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-5 bg-white/60 backdrop-blur-md border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 focus-within:border-primary focus-within:bg-slate-50 transition-colors">
            <input 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleChat()} 
              placeholder="Ask anything..." 
              className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-sm" 
            />
            <button 
              onClick={handleChat} 
              className="p-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all active:scale-95"
            >
              {isTyping ? <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PlannerScreen = () => (
    <div className="min-h-screen bg-white text-slate-900 p-6 flex flex-col">
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8 w-fit">
        <ChevronLeft size={20} />
        <span className="font-mono text-sm">BACK</span>
      </button>

      <h1 className="text-4xl font-bold mb-2">Study Planner</h1>
      <p className="text-gray-400 mb-8">AI-generated personalized study schedule</p>

      <div className="space-y-4 flex-1">
        {[
          { day: 'Monday', subject: 'Mathematics', time: '2 hours', focus: 'Calculus & Derivatives' },
          { day: 'Tuesday', subject: 'Physics', time: '1.5 hours', focus: 'Mechanics' },
          { day: 'Wednesday', subject: 'Programming', time: '2.5 hours', focus: 'Data Structures' },
          { day: 'Thursday', subject: 'Chemistry', time: '2 hours', focus: 'Organic Chemistry' },
        ].map((plan, i) => (
          <div key={i} className="p-5 rounded-xl bg-white/60 border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{plan.day}</h3>
              <span className="text-sm text-gray-400 font-mono">{plan.time}</span>
            </div>
            <p className="text-primary font-semibold mb-1">{plan.subject}</p>
            <p className="text-sm text-slate-500">{plan.focus}</p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('dashboard')} className="w-full mt-8 p-4 rounded-lg bg-gradient-to-r from-primary to-accent font-bold text-white hover:shadow-lg transition-all">
        BACK TO DASHBOARD
      </button>
    </div>
  );

  const QuizScreen = () => {
    const [optionLoading, setOptionLoading] = useState(false);
    const q = QUIZ_QUESTIONS[quizState.idx];
    const handleAnswer = (i) => {
      setOptionLoading(true);
      setTimeout(() => {
        setQuizState({ ...quizState, chosen: i });
        if (i === q.correct) setQuizState(prev => ({ ...prev, score: prev.score + 1 }));
        setOptionLoading(false);
      }, 400);
    };
    const nextQ = () => { if (quizState.idx < QUIZ_QUESTIONS.length - 1) setQuizState({ ...quizState, idx: quizState.idx + 1, chosen: null }); else setQuizState({ ...quizState, finished: true }); };
    
    if (quizState.finished) {
      const percentage = Math.round((quizState.score / QUIZ_QUESTIONS.length) * 100);
      return (
        <div className="min-h-screen bg-white text-slate-900 p-6 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 flex items-center justify-center">
              <Award size={48} className="text-green-400" />
            </div>
            <h1 className="text-5xl font-bold mb-2">{percentage}%</h1>
            <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-slate-500 mb-2">You scored {quizState.score} out of {QUIZ_QUESTIONS.length}</p>
          </div>
          <button onClick={() => { setQuizState({ idx: 0, score: 0, finished: false, chosen: null }); navigate('dashboard'); }} className="mt-12 w-full max-w-xs p-4 rounded-lg bg-gradient-to-r from-primary to-accent font-bold text-white hover:shadow-lg transition-all">
            RETURN HOME
          </button>
        </div>
      );
    }

    return (
      <div className={`min-h-screen bg-white text-slate-900 p-6 flex flex-col transition-opacity duration-300 ${navLoading ? 'opacity-50' : 'opacity-100'}`}>
        <button onClick={() => navigate('dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 w-fit">
          <ChevronLeft size={20} />
          <span className="font-mono text-sm">BACK</span>
        </button>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-mono text-slate-500">Question {quizState.idx + 1} of {QUIZ_QUESTIONS.length}</span>
            <Badge color={COLORS.green}>{quizState.score} Correct</Badge>
          </div>
          <ProgressBar progress={(quizState.idx + 1) / QUIZ_QUESTIONS.length * 100} color={COLORS.red} />
        </div>

        {/* Question */}
        <h2 className="text-3xl font-bold mb-8">{q.question}</h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {optionLoading && <div className="text-center text-slate-500 text-sm py-4">Evaluating...</div>}
          {q.options.map((opt, i) => (
            <button 
              key={i} 
              disabled={quizState.chosen !== null || optionLoading} 
              onClick={() => handleAnswer(i)} 
              className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium flex justify-between items-center ${
                quizState.chosen !== null 
                  ? (i === q.correct ? 'border-green-500 bg-green-500/20' : i === quizState.chosen ? 'border-red-500 bg-red-500/20' : 'border-slate-200 bg-white/50') 
                  : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white/60'
              } disabled:cursor-not-allowed`}
            > 
              <span>{opt}</span>
              {quizState.chosen !== null && (i === q.correct ? <CheckCircle2 size={20} className="text-green-400" /> : i === quizState.chosen ? <XCircle size={20} className="text-red-400" /> : null)}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {quizState.chosen !== null && (
          <div className="mb-8 p-5 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <p className="font-bold text-blue-300 mb-2 flex items-center gap-2">
              <Lightbulb size={18} />
              EXPLANATION
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {quizState.chosen !== null && (
          <button 
            onClick={nextQ} 
            className="w-full p-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 font-bold text-white hover:shadow-lg transition-all"
          >
            {quizState.idx === QUIZ_QUESTIONS.length - 1 ? 'SEE RESULTS' : 'NEXT QUESTION'} →
          </button>
        )}
      </div>
    );
  };

  const ProgressScreen = () => (
    <div className={`min-h-screen bg-white text-slate-900 p-6 flex flex-col pb-32 transition-opacity duration-300 ${navLoading ? 'opacity-50' : 'opacity-100'}`}>
      <button onClick={() => navigate('dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 w-fit">
        <ChevronLeft size={20} />
        <span className="font-mono text-sm">BACK</span>
      </button>

      <h1 className="text-4xl font-bold mb-2">Your Progress</h1>
      <p className="text-slate-500 mb-8">Track your learning journey and mastery levels</p>

      {/* Exam Readiness */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge color={COLORS.green}>EXAM READINESS</Badge>
            <h2 className="text-3xl font-bold text-white mt-3">68%</h2>
          </div>
          <TrendingUp className="text-green-400" size={32} />
        </div>
        <p className="text-sm text-green-300">You're on track for your exam! Keep up the good work.</p>
      </div>

      {/* Subject Mastery */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-6">Subject Mastery Breakdown</h3>
        <div className="space-y-5">
          {Object.entries(user.mastery).map(([subj, val]) => {
            const subjectData = SUBJECTS.find(s => s.id === subj);
            return (
              <div key={subj} className="p-5 rounded-xl bg-white/60 border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{subjectData?.icon}</span>
                    <span className="font-bold capitalize">{subj}</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">{val}%</span>
                </div>
                <ProgressBar progress={val} color={subjectData?.color} height={8} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
          <p className="text-3xl font-bold text-blue-400 mb-1">{user.streak}</p>
          <p className="text-sm text-blue-300">Day Streak</p>
        </div>
        <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-center">
          <p className="text-3xl font-bold text-purple-400 mb-1">42</p>
          <p className="text-sm text-purple-300">Lessons Learn</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex justify-around">
        {[
          { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
          { id: 'chat', label: 'AI Tutor', icon: <MessageSquare size={20} /> },
          { id: 'quiz', label: 'Quiz', icon: <Zap size={20} /> },
          { id: 'progress', label: 'Progress', icon: <TrendingUp size={20} /> }
        ].map(nav => (
            <button 
            key={nav.id}
            onClick={() => navigate(nav.id)} 
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${screen === nav.id ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {nav.icon}
            <span className="text-xs font-mono font-bold">{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const Header = () => (
    <header className="app-header fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">E</div>
          <div>
            <div className="font-bold text-slate-900">EduMind AI</div>
            <div className="text-xs text-slate-500">Offline multilingual tutor</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <button onClick={() => navigate('dashboard')} className="text-slate-700 hover:text-primary">Home</button>
          <button onClick={() => navigate('chat')} className="text-slate-700 hover:text-primary">Chat</button>
          <button onClick={() => navigate('quiz')} className="text-slate-700 hover:text-primary">Quiz</button>
          <button onClick={() => navigate('progress')} className="text-slate-700 hover:text-primary">Progress</button>
        </nav>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="app-footer bg-white/95 border-t border-slate-200 fixed bottom-0 left-0 right-0">
      <div className="max-w-6xl mx-auto px-6 py-3 text-center text-sm text-slate-500">© {new Date().getFullYear()} EduMind AI — Offline • Privacy first</div>
    </footer>
  );

  const StaticLanding = () => (
    <div className="min-h-[calc(100vh-136px)] flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-5xl font-extrabold mb-4 gradient-text">EduMind AI</h1>
        <p className="text-lg text-slate-600 mb-8">Offline multilingual AI tutor — personalized learning, built to run locally on AMD hardware.</p>
        <div className="flex justify-center gap-4 mb-10">
          <button onClick={() => navigate('onboarding-lang')} className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-bold">Get Started</button>
          <button onClick={() => navigate('dashboard')} className="px-6 py-3 rounded-lg border border-slate-200 text-slate-700">Open Dashboard</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/60 border border-slate-200 rounded-lg">
            <h3 className="font-bold mb-2">Offline First</h3>
            <p className="text-sm text-slate-500">Run models locally without sending data to cloud services.</p>
          </div>
          <div className="p-6 bg-white/60 border border-slate-200 rounded-lg">
            <h3 className="font-bold mb-2">Multilingual</h3>
            <p className="text-sm text-slate-500">Supports multiple Indian languages for inclusive learning.</p>
          </div>
          <div className="p-6 bg-white/60 border border-slate-200 rounded-lg">
            <h3 className="font-bold mb-2">Adaptive</h3>
            <p className="text-sm text-slate-500">Personalized study plans and quizzes to track progress.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-surface text-slate-900 min-h-screen">
      <Header />
      <main className="app-main">
        {navLoading && <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50"><div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" /></div>}
        <StaticLanding />
      </main>
      <Footer />
    </div>
  );
}
