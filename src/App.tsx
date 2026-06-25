import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Settings, ChevronDown,
  LayoutDashboard, Calendar, Users, BarChart3, GraduationCap, 
  FileText, FolderOpen, LogOut,
  MoreVertical, Zap, Send, Home,
  BookOpen, Award, TrendingUp, UserCheck
} from 'lucide-react';

// CountUp Micro-animation component
function CountUp({ end, duration = 800 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const totalFrames = Math.round(duration / 16);
    const increment = end / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      start += increment;
      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <>{count}</>;
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState('Learning Analytics');
  const [activeWidget, setActiveWidget] = useState('progress'); // 'progress' | 'activity' | 'skills' | 'engagement'
  const [inputText, setInputText] = useState('');
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);

  // Trigger loading state on widget switch to simulate AI synchronization
  const handleWidgetClick = (widgetId: string) => {
    if (activeWidget === widgetId) return;
    setIsAIAnalyzing(true);
    setActiveWidget(widgetId);
    const timer = setTimeout(() => {
      setIsAIAnalyzing(false);
    }, 450);
    return () => clearTimeout(timer);
  };

  const getWidgetLabel = (id: string) => {
    switch (id) {
      case 'progress': return 'Learning Progress';
      case 'activity': return 'Course Activity';
      case 'skills': return 'Skill Development';
      case 'engagement': return 'Employee Engagement';
      default: return 'Learning Progress';
    }
  };

  const getInputPlaceholder = () => {
    switch (activeWidget) {
      case 'progress': return "Ask about Learning Progress...";
      case 'activity': return "Ask about Course Activity...";
      case 'skills': return "Ask about Skill Development...";
      case 'engagement': return "Ask about Employee Engagement...";
      default: return "Ask a question...";
    }
  };

  // Sidebar Menu Items
  const generalMenu = [
    { name: 'Learning Analytics', icon: LayoutDashboard },
    { name: 'Courses', icon: GraduationCap },
    { name: 'Employees', icon: Users },
    { name: 'Departments', icon: BarChart3 },
    { name: 'Skills Matrix', icon: Award },
    { name: 'AI Insights', icon: Zap },
  ];

  const toolsMenu = [
    { name: 'Reports', icon: FileText },
    { name: 'Knowledge Base', icon: FolderOpen },
    { name: 'Settings', icon: Settings },
  ];

  // Chat Conversations per widget
  const chatConversations: Record<string, Array<{ sender: 'user' | 'assistant'; content: string; hasWidget?: boolean }>> = {
    progress: [
      { sender: 'user', content: 'Why has completion dropped this week?' },
      { sender: 'assistant', content: 'Here is the current Learning Progress Analysis context. I’ve synthesized module completion rates and user session intervals:', hasWidget: true }
    ],
    activity: [
      { sender: 'user', content: 'Which courses are losing engagement?' },
      { sender: 'assistant', content: 'Based on course interaction cycles, here is the Course Activity summary:', hasWidget: true }
    ],
    skills: [
      { sender: 'user', content: 'Which skills require immediate attention?' },
      { sender: 'assistant', content: 'I’ve cross-referenced skill proficiency indexes with active roles. Here are the core team skill needs:', hasWidget: true }
    ],
    engagement: [
      { sender: 'user', content: 'Why has engagement decreased?' },
      { sender: 'assistant', content: 'Here is the analysis of active learning session parameters and user retention streaks:', hasWidget: true }
    ]
  };

  return (
    <div className="w-full h-screen bg-[#F8F4EE] grid grid-cols-[260px_1fr_400px] p-6 gap-6 overflow-hidden font-sans selection:bg-intellyPink/50 selection:text-intellyBlack">
      
      {/* ========================================================
          1. LEFT SIDEBAR (Black, 260px)
         ======================================================== */}
      <aside className="h-full bg-[#141414] rounded-[32px] flex flex-col justify-between p-6 text-white relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-b from-white/10 to-transparent" />
        
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#141414] font-black text-base animate-pulse">W</div>
              <h1 className="text-xl font-bold tracking-tight font-sans">WidChat</h1>
            </div>
            {/* Pink dot toggle button */}
            <div className="w-5 h-5 rounded-full bg-[#F3B8D6] flex items-center justify-center cursor-pointer transform translate-x-3 shadow-md">
              <div className="w-1.5 h-1.5 rounded-full bg-[#141414]" />
            </div>
          </div>

          {/* General Section */}
          <div className="space-y-1 mb-6">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest pl-3 font-semibold block mb-2">General</span>
            {generalMenu.map((item) => {
              const isActive = activeMenu === item.name;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-white/10 to-white/5 text-[#F3B8D6] shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F3B8D6]' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tools Section */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest pl-3 font-semibold block mb-2">Tools</span>
            {toolsMenu.map((item) => {
              const isActive = activeMenu === item.name;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-white/10 to-white/5 text-[#F3B8D6] shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F3B8D6]' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile Info Footer */}
        <div className="border-t border-white/10 pt-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F3B8D6] flex items-center justify-center text-[#141414] text-xs font-bold shadow-sm">
            OC
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Olivia Chen</h4>
            <p className="text-[9px] text-gray-500 truncate">L&D Manager</p>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors" aria-label="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ========================================================
          2. CENTER PANEL (Flexible Dashboard Area)
         ======================================================== */}
      <section className="h-full flex flex-col overflow-y-auto pr-2 scrollbar-thin">
        
        {/* Top Search Bar & Action Buttons */}
        <div className="flex items-center justify-between py-2 mb-6">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[#E3DCCE] rounded-full px-3.5 py-1.5 shadow-sm w-full max-w-[700px] flex-1">
            <div className="w-7 h-7 rounded-full bg-[#F3B8D6] flex items-center justify-center text-[#141414]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input 
              type="text" 
              placeholder="Search employees, courses, departments..." 
              className="bg-transparent outline-none text-[13px] text-[#141414] font-medium w-full max-w-[280px] px-1 border-r border-[#E3DCCE]" 
            />
            <div className="flex items-center gap-1.5 pl-2 text-[13px] text-gray-500 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
              <span>In:</span>
              <span className="px-2.5 py-0.5 bg-[#141414] text-white rounded-full text-[10px] shrink-0 font-medium">Courses</span>
              <span className="px-2.5 py-0.5 bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[10px] shrink-0 font-medium">Departments</span>
              <span className="px-2.5 py-0.5 bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[10px] shrink-0 font-medium">Employees</span>
              <span className="px-2.5 py-0.5 bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[10px] shrink-0 font-medium">Skills</span>
            </div>
          </div>

          {/* Profile & Icon Stack */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#141414] flex items-center justify-center text-white text-xs font-semibold cursor-pointer border border-[#E3DCCE] hover:opacity-90">
              o.c
            </div>
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 cursor-pointer border border-[#E3DCCE] hover:bg-gray-50 shadow-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 cursor-pointer border border-[#E3DCCE] hover:bg-gray-50 shadow-sm">
              <Settings className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Heading Description */}
        <div className="flex justify-between items-end mb-6 pr-2">
          <div>
            <h2 className="text-[32px] font-bold text-[#141414] tracking-tight leading-tight">Good Morning, Olivia</h2>
            <p className="text-[15px] text-gray-500 mt-1.5 max-w-[750px] leading-relaxed">
              Monitor learning performance across your organization. Select any analytics widget to ask AI questions and uncover actionable insights.
            </p>
          </div>
          <a href="#" className="text-xs font-semibold text-[#141414] underline hover:opacity-80 shrink-0">Show all...</a>
        </div>

        {/* Bento Grid (Adapts to fill space with 24px gap) */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          
          {/* Widget 1: Yellow Card (Learning Progress) */}
          <motion.div 
            onClick={() => handleWidgetClick('progress')}
            animate={{
              scale: activeWidget === 'progress' ? 1.02 : 1,
              opacity: activeWidget && activeWidget !== 'progress' ? 0.7 : 1,
              borderWidth: '2px',
              borderColor: activeWidget === 'progress' ? '#141414' : 'rgba(20, 20, 20, 0.05)',
              boxShadow: activeWidget === 'progress' 
                ? '0 12px 25px -4px rgba(20, 20, 20, 0.08), 0 4px 10px -2px rgba(20, 20, 20, 0.04), 0 0 0 4px rgba(20, 20, 20, 0.03)' 
                : '0 4px 6px -1px rgba(20, 20, 20, 0.02)'
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="col-span-5 bg-[#F7D85D] rounded-[24px] p-6 text-[#141414] relative overflow-hidden flex flex-col justify-between h-[210px] cursor-pointer"
          >
            {/* Active Badge */}
            <AnimatePresence>
              {activeWidget === 'progress' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-3 right-3 px-2 py-0.5 bg-[#141414] text-white rounded-full text-[8px] font-black tracking-widest uppercase flex items-center gap-1 z-20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59C28A] animate-pulse" />
                  <span>● Active</span>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Shared Context Chip */}
            {activeWidget === 'progress' && (
              <motion.div 
                layoutId="context-chip-id"
                className="absolute bottom-3 left-6 px-2.5 py-1 bg-[#141414] text-[#F7D85D] rounded-full text-[8px] font-black pointer-events-none z-30 uppercase"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                Learning Progress
              </motion.div>
            )}

            {/* Background Shape */}
            <div className="absolute top-2 right-6 text-[#141414]/10 font-bold text-[140px] leading-none pointer-events-none select-none">
              %
            </div>
            
            <div>
              <span className="text-[20px] font-bold block mb-3 font-sans leading-none">Learning Progress</span>
              <div className="flex gap-4">
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    <CountUp end={84} />%
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">Completion Rate</span>
                </div>
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    +<CountUp end={4} />%
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">vs last week</span>
                </div>
              </div>
            </div>

            {/* Progress mini bars */}
            <div className="flex items-end justify-between gap-1 h-14 mt-4 relative z-10">
              <span className="text-[8px] font-bold text-[#141414]/50">Mon</span>
              <div className="flex items-end gap-1.5 h-full px-2">
                <div className="w-1.5 h-1/2 bg-[#141414] rounded-full" />
                <div className="w-1.5 h-3/4 bg-[#141414] rounded-full" />
                <div className="w-1.5 h-1/3 bg-[#141414] rounded-full" />
                <div className="w-1.5 h-full bg-[#141414] rounded-full" />
                <div className="w-1.5 h-2/3 bg-[#141414]/30 rounded-full" />
              </div>
              <span className="text-[8px] font-bold text-[#141414]/50">Sun</span>
            </div>
          </motion.div>

          {/* Widget 2: Pink Card (Course Activity) */}
          <motion.div 
            onClick={() => handleWidgetClick('activity')}
            animate={{
              scale: activeWidget === 'activity' ? 1.02 : 1,
              opacity: activeWidget && activeWidget !== 'activity' ? 0.7 : 1,
              borderWidth: '2px',
              borderColor: activeWidget === 'activity' ? '#141414' : 'rgba(20, 20, 20, 0.05)',
              boxShadow: activeWidget === 'activity' 
                ? '0 12px 25px -4px rgba(20, 20, 20, 0.08), 0 4px 10px -2px rgba(20, 20, 20, 0.04), 0 0 0 4px rgba(20, 20, 20, 0.03)' 
                : '0 4px 6px -1px rgba(20, 20, 20, 0.02)'
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="col-span-7 bg-[#F3B8D6] rounded-[24px] p-6 text-[#141414] relative overflow-hidden flex flex-col justify-between h-[210px] cursor-pointer"
          >
            {/* Active Badge */}
            <AnimatePresence>
              {activeWidget === 'activity' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-3 right-3 px-2 py-0.5 bg-[#141414] text-white rounded-full text-[8px] font-black tracking-widest uppercase flex items-center gap-1 z-20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59C28A] animate-pulse" />
                  <span>● Active</span>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Shared Context Chip */}
            {activeWidget === 'activity' && (
              <motion.div 
                layoutId="context-chip-id"
                className="absolute bottom-3 left-6 px-2.5 py-1 bg-[#141414] text-[#F3B8D6] rounded-full text-[8px] font-black pointer-events-none z-30 uppercase"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                Course Activity
              </motion.div>
            )}

            {/* Background Shape */}
            <div className="absolute right-4 bottom-2 text-[#141414]/5 pointer-events-none select-none">
              <BookOpen className="w-36 h-36 stroke-[1.5]" />
            </div>

            <div>
              <span className="text-[20px] font-bold block mb-3 font-sans leading-none">Course Activity</span>
              <div className="flex gap-6">
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    <CountUp end={142} />
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">Active Learners</span>
                </div>
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    <CountUp end={24} /> <span className="text-[16px] font-normal text-[#141414]/70">mins</span>
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">Average Session</span>
                </div>
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    -<CountUp end={8} />%
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">Weekly Trend</span>
                </div>
              </div>
            </div>

            {/* SVG curve line chart */}
            <div className="h-16 w-full relative z-10 mt-3 flex flex-col justify-end">
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 350 40">
                <path
                  d="M0,35 Q30,30 60,32 T120,25 T180,10 T200,5 T220,20 T260,35 T300,30 T350,33"
                  fill="none"
                  stroke="#141414"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="5" r="4" fill="#141414" />
                <line x1="200" y1="5" x2="200" y2="40" stroke="#141414" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
              <div className="flex justify-between text-[8px] font-bold text-[#141414]/50 px-1 mt-1">
                <span>09:00</span>
                <span>10:00</span>
                <span>11:00</span>
                <span className="text-[#141414] font-black">12:00</span>
                <span>13:00</span>
                <span>14:00</span>
                <span>15:00</span>
              </div>
            </div>
          </motion.div>

          {/* Widget 3: Green Card (Skill Development) */}
          <motion.div 
            onClick={() => handleWidgetClick('skills')}
            animate={{
              scale: activeWidget === 'skills' ? 1.02 : 1,
              opacity: activeWidget && activeWidget !== 'skills' ? 0.7 : 1,
              borderWidth: '2px',
              borderColor: activeWidget === 'skills' ? '#141414' : 'rgba(20, 20, 20, 0.05)',
              boxShadow: activeWidget === 'skills' 
                ? '0 12px 25px -4px rgba(20, 20, 20, 0.08), 0 4px 10px -2px rgba(20, 20, 20, 0.04), 0 0 0 4px rgba(20, 20, 20, 0.03)' 
                : '0 4px 6px -1px rgba(20, 20, 20, 0.02)'
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="col-span-6 bg-[#B7C88C] rounded-[24px] p-6 text-[#141414] relative overflow-hidden flex flex-col justify-between h-[175px] cursor-pointer"
          >
            {/* Active Badge */}
            <AnimatePresence>
              {activeWidget === 'skills' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-3 right-3 px-2 py-0.5 bg-[#141414] text-white rounded-full text-[8px] font-black tracking-widest uppercase flex items-center gap-1 z-20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59C28A] animate-pulse" />
                  <span>● Active</span>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Shared Context Chip */}
            {activeWidget === 'skills' && (
              <motion.div 
                layoutId="context-chip-id"
                className="absolute bottom-3 left-6 px-2.5 py-1 bg-[#141414] text-[#B7C88C] rounded-full text-[8px] font-black pointer-events-none z-30 uppercase"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                Skill Development
              </motion.div>
            )}

            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[90px] border-b-[#141414]/5 pointer-events-none select-none transform rotate-12" />

            <div>
              <span className="text-[20px] font-bold block mb-3 font-sans leading-none">Skill Development</span>
              <div className="flex gap-6">
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    <CountUp end={148} />
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">New Certifications</span>
                </div>
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    <CountUp end={12} />
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">Priority Gaps</span>
                </div>
              </div>
            </div>

            {/* Stacked horizontal bar indicators */}
            <div className="w-2/3 h-2.5 bg-white/40 rounded-full overflow-hidden flex mt-2 border border-black/5">
              <div className="w-[75%] bg-[#141414] h-full" />
              <div className="w-[18%] bg-[#141414]/50 h-full border-l border-[#B7C88C]" />
              <div className="w-[7%] bg-red-500 h-full border-l border-[#B7C88C]" />
            </div>
          </motion.div>

          {/* Widget 4: Blue Card (Employee Engagement) */}
          <motion.div 
            onClick={() => handleWidgetClick('engagement')}
            animate={{
              scale: activeWidget === 'engagement' ? 1.02 : 1,
              opacity: activeWidget && activeWidget !== 'engagement' ? 0.7 : 1,
              borderWidth: '2px',
              borderColor: activeWidget === 'engagement' ? '#141414' : 'rgba(20, 20, 20, 0.05)',
              boxShadow: activeWidget === 'engagement' 
                ? '0 12px 25px -4px rgba(20, 20, 20, 0.08), 0 4px 10px -2px rgba(20, 20, 20, 0.04), 0 0 0 4px rgba(20, 20, 20, 0.03)' 
                : '0 4px 6px -1px rgba(20, 20, 20, 0.02)'
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="col-span-6 bg-[#BFD6FF] rounded-[24px] p-6 text-[#141414] relative overflow-hidden flex flex-col justify-between h-[175px] cursor-pointer"
          >
            {/* Active Badge */}
            <AnimatePresence>
              {activeWidget === 'engagement' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-3 right-3 px-2 py-0.5 bg-[#141414] text-white rounded-full text-[8px] font-black tracking-widest uppercase flex items-center gap-1 z-20"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59C28A] animate-pulse" />
                  <span>● Active</span>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Shared Context Chip */}
            {activeWidget === 'engagement' && (
              <motion.div 
                layoutId="context-chip-id"
                className="absolute bottom-3 left-6 px-2.5 py-1 bg-[#141414] text-[#BFD6FF] rounded-full text-[8px] font-black pointer-events-none z-30 uppercase"
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                Employee Engagement
              </motion.div>
            )}

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#141414]/5 pointer-events-none select-none transform rotate-45">
              <Users className="w-28 h-28 stroke-[1.5]" />
            </div>

            <div>
              <span className="text-[20px] font-bold block mb-3 font-sans leading-none">Employee Engagement</span>
              <div className="flex gap-6">
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    <CountUp end={93} />%
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">Engagement Score</span>
                </div>
                <div>
                  <div className="text-[36px] font-black tracking-tight leading-none">
                    <CountUp end={8} />.<CountUp end={4} /> <span className="text-[16px] font-normal text-[#141414]/70">days</span>
                  </div>
                  <span className="text-[13px] font-medium text-[#141414]/60">Avg Learning Days</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 items-center text-xs font-semibold text-[#141414]/70">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-[#141414] text-white flex items-center justify-center text-[8px] border border-[#BFD6FF]">ENG</div>
                <div className="w-5 h-5 rounded-full bg-white text-[#141414] flex items-center justify-center text-[8px] border border-[#BFD6FF]">L&D</div>
                <div className="w-5 h-5 rounded-full bg-[#F3B8D6] text-[#141414] flex items-center justify-center text-[8px] border border-[#BFD6FF]">AI</div>
              </div>
              <span className="text-[10px] font-medium">93% retention trend active</span>
            </div>
          </motion.div>

        </div>

        {/* ========================================================
            3. LOWER DASHBOARD SECTION (Top Performing Courses & Department Insights)
           ======================================================== */}
        <div className="grid grid-cols-12 gap-6 mt-2 pb-6">
          
          {/* Left Card: Top Performing Courses (Span 6) */}
          <div className="col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[20px] font-bold text-[#141414]">Top Performing Courses</h3>
              <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E3DCCE] rounded-full text-[10px] font-bold text-[#141414] shadow-sm hover:bg-gray-50">
                <span>This Quarter</span>
                <ChevronDown className="w-3 h-3 text-[#141414]" />
              </button>
            </div>

            {/* Course Items Stack */}
            <div className="space-y-2">
              {/* React Fundamentals */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#E3DCCE] rounded-[24px] hover:border-gray-300 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#BFD6FF]/30 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-[#141414]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#141414]">React Fundamentals</h4>
                    <p className="text-[9px] text-gray-500">142 Enrolled • Avg Score: 88%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-2 py-1 bg-[#BFD6FF] text-[#141414] rounded-full">92% Done</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#59C28A]" />
                </div>
              </div>

              {/* Python Advanced */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#E3DCCE] rounded-[24px] hover:border-gray-300 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#B7C88C]/30 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[#141414]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#141414]">Python Advanced</h4>
                    <p className="text-[9px] text-gray-500">98 Enrolled • Avg Score: 82%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-2 py-1 bg-[#B7C88C] text-[#141414] rounded-full">85% Done</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#59C28A]" />
                </div>
              </div>

              {/* Leadership Essentials */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#E3DCCE] rounded-[24px] hover:border-gray-300 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F3B8D6]/30 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-[#141414]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#141414]">Leadership Essentials</h4>
                    <p className="text-[9px] text-gray-500">56 Enrolled • Avg Score: 90%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-2 py-1 bg-[#F3B8D6] text-[#141414] rounded-full">78% Done</span>
                  <div className="w-3.5 h-0.5 bg-[#7C7C7C] rounded-full" />
                </div>
              </div>

              {/* AWS Cloud Foundations */}
              <div className="flex items-center justify-between p-3.5 bg-white border border-[#E3DCCE] rounded-[24px] hover:border-gray-300 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F7D85D]/30 flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#141414]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#141414]">AWS Cloud Foundations</h4>
                    <p className="text-[9px] text-gray-500">120 Enrolled • Avg Score: 84%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold px-2 py-1 bg-[#F7D85D] text-[#141414] rounded-full">90% Done</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#59C28A]" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Department Insights (Span 6) */}
          <div className="col-span-6 flex flex-col gap-4">
            <div className="px-1">
              <h3 className="text-[20px] font-bold text-[#141414]">Department Insights</h3>
            </div>

            {/* Large styled card with completion list */}
            <div className="bg-white border border-[#E3DCCE] rounded-[24px] p-6 shadow-sm flex flex-col justify-between flex-1 min-h-[220px]">
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#141414]">Organizational Divisions</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Completion percentage & study effort hours</p>
                </div>
                <span className="text-[9px] font-bold bg-[#141414] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                  L&D Audit Active
                </span>
              </div>

              {/* Grid list of Departments */}
              <div className="space-y-3.5 text-xs border-t border-gray-100 pt-4">
                {/* Engineering */}
                <div className="flex items-center justify-between">
                  <div className="w-20 font-bold text-[#141414] text-[13px]">Engineering</div>
                  <div className="flex items-center gap-6 flex-1 justify-end">
                    <span className="text-gray-500 text-[11px]">1,240 hrs</span>
                    <span className="text-gray-500 text-[11px] font-bold text-[#59C28A]">+15% Growth</span>
                    <span className="font-semibold text-right w-14 text-[13px]">84% Comp</span>
                    <span className="px-2 py-0.5 bg-[#B7C88C]/40 text-[#141414] text-[9px] rounded-full font-bold">Stable</span>
                  </div>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between">
                  <div className="w-20 font-bold text-[#141414] text-[13px]">Marketing</div>
                  <div className="flex items-center gap-6 flex-1 justify-end">
                    <span className="text-gray-500 text-[11px]">510 hrs</span>
                    <span className="text-gray-500 text-[11px] font-bold text-[#59C28A]">+8% Growth</span>
                    <span className="font-semibold text-right w-14 text-[13px]">72% Comp</span>
                    <span className="px-2 py-0.5 bg-[#F7D85D]/40 text-[#141414] text-[9px] rounded-full font-bold">At Risk</span>
                  </div>
                </div>

                {/* Sales */}
                <div className="flex items-center justify-between">
                  <div className="w-20 font-bold text-[#141414] text-[13px]">Sales</div>
                  <div className="flex items-center gap-6 flex-1 justify-end">
                    <span className="text-gray-500 text-[11px]">480 hrs</span>
                    <span className="text-gray-500 text-[11px] font-bold text-[#7C7C7C]">+6% Growth</span>
                    <span className="font-semibold text-right w-14 text-[13px]">68% Comp</span>
                    <span className="px-2 py-0.5 bg-[#F3B8D6] text-[#141414] text-[9px] rounded-full font-bold">Critical</span>
                  </div>
                </div>

                {/* Operations */}
                <div className="flex items-center justify-between">
                  <div className="w-20 font-bold text-[#141414] text-[13px]">Operations</div>
                  <div className="flex items-center gap-6 flex-1 justify-end">
                    <span className="text-gray-500 text-[11px]">320 hrs</span>
                    <span className="text-gray-500 text-[11px] font-bold text-[#59C28A]">+12% Growth</span>
                    <span className="font-semibold text-right w-14 text-[13px]">91% Comp</span>
                    <span className="px-2 py-0.5 bg-[#B7C88C]/40 text-[#141414] text-[9px] rounded-full font-bold">Stable</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* ========================================================
          3. RIGHT PANEL (AI Assistant, Fixed 400px Width)
         ======================================================== */}
      <aside className="h-full bg-white border border-[#E3DCCE] rounded-[32px] flex flex-col p-5 shadow-sm relative overflow-hidden justify-between shrink-0">
        
        {/* Header & Context Display */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCE]/40 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#141414] tracking-tight">WidChat AI Assistant</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#59C28A] animate-pulse" />
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Live Analysis</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-[#141414] p-1 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Context tag display */}
          <div className="bg-[#F8F4EE] border border-[#E3DCCE] rounded-2xl p-2.5 mb-4 flex items-center justify-between min-h-[40px]">
            <span className="text-[9px] font-black text-[#141414]/40 uppercase tracking-wider">Current Widget</span>
            <div className="relative h-5 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={activeWidget}
                  layoutId="context-chip-id"
                  className="px-2.5 py-1 bg-[#141414] text-[#F3B8D6] rounded-full text-[8px] font-black tracking-wide block uppercase"
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  {getWidgetLabel(activeWidget)}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Messages Timeline */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin mb-4 min-h-[420px]">
            <AnimatePresence mode="wait">
              {isAIAnalyzing ? (
                /* Loading Skeletons */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 p-2 animate-pulse"
                >
                  <div className="flex flex-col items-end space-y-1">
                    <div className="w-2/3 h-8 bg-gray-100 rounded-2xl rounded-tr-none" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-4 space-y-3">
                    <div className="w-1/3 h-4 bg-gray-200 rounded-full" />
                    <div className="w-full h-12 bg-gray-200 rounded-xl" />
                    <div className="w-full h-16 bg-gray-200 rounded-xl" />
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-gray-200 rounded-full" />
                      <div className="flex-1 h-8 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeWidget}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {chatConversations[activeWidget]?.map((msg, index) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.1 }}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[90%] px-4 py-2.5 rounded-[20px] text-xs font-medium leading-relaxed shadow-sm ${
                          isUser 
                            ? 'bg-[#F8F4EE] border border-[#E3DCCE] text-[#141414] rounded-tr-none' 
                            : 'bg-gray-100 text-[#141414] rounded-tl-none mb-2'
                        }`}>
                          {msg.content}
                        </div>

                        {/* Dynamic Rich Analysis Cards */}
                        {!isUser && msg.hasWidget && (
                          <div className="w-full mt-2">
                            
                            {/* --- Context: Learning Progress --- */}
                            {activeWidget === 'progress' && (
                              <div className="bg-[#FDF8F9] border border-[#F3B8D6]/60 rounded-[24px] p-5 flex flex-col shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="px-2 py-0.5 bg-[#F3B8D6] text-[#141414] rounded-full text-[8px] font-black uppercase">
                                    Learning Progress Analysis
                                  </span>
                                  <span className="text-[9px] font-bold text-gray-400">ID: LRN-PRO-84</span>
                                </div>
                                
                                <div className="flex gap-4 mb-3 border-b border-black/5 pb-2">
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">COMPLETION RATE</span>
                                    <strong className="text-sm font-black text-[#141414]">84%</strong>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">WEEKLY CHANGE</span>
                                    <strong className="text-sm font-black text-red-500">-4%</strong>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">CONFIDENCE</span>
                                    <strong className="text-sm font-black text-[#59C28A]">94%</strong>
                                  </div>
                                </div>

                                {/* Trend mini sparkline */}
                                <div className="bg-white rounded-xl p-2 border border-[#E3DCCE]/40 mb-3">
                                  <span className="text-[8px] font-bold text-gray-400 block mb-1">Weekly Completion Trend</span>
                                  <svg className="w-full h-10 overflow-visible" viewBox="0 0 250 40">
                                    <path d="M0,10 Q50,8 100,12 T180,30 T220,38" fill="none" stroke="#141414" strokeWidth="2" />
                                    <line x1="180" y1="0" x2="180" y2="40" stroke="#FF9B54" strokeWidth="1" strokeDasharray="3,3" />
                                    <circle cx="180" cy="30" r="3.5" fill="#141414" />
                                  </svg>
                                </div>

                                {/* Insights list */}
                                <div className="text-[11px] text-gray-600 space-y-1 mb-3">
                                  <p className="font-semibold text-[#141414]">Key Insights:</p>
                                  <p>• Module 6 has the highest user drop-off rate (18% decline).</p>
                                  <p>• Average study session length runs 48 minutes.</p>
                                  <p>• Mobile layout users complete modules 30% less often.</p>
                                </div>

                                {/* Recommendations list */}
                                <div className="text-[11px] text-gray-600 space-y-1 mb-4 border-t border-black/5 pt-2">
                                  <p className="font-semibold text-[#141414]">Recommendations:</p>
                                  <p>• Notify Manager to follow up on stuck cohorts.</p>
                                  <p>• Improve Module 6 interactive diagrams.</p>
                                  <p>• Compare Departments performance.</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-[#141414] text-white rounded-full text-[10px] font-bold hover:bg-opacity-95 transition-all">
                                      Improve Module
                                    </button>
                                    <button className="flex-1 py-2 bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[10px] font-bold hover:bg-gray-50 transition-all">
                                      Notify Manager
                                    </button>
                                </div>
                              </div>
                            )}

                            {/* --- Context: Course Activity --- */}
                            {activeWidget === 'activity' && (
                              <div className="bg-[#EDF6FF] border border-[#BFD6FF]/60 rounded-[24px] p-5 flex flex-col shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="px-2 py-0.5 bg-[#BFD6FF] text-[#141414] rounded-full text-[8px] font-black uppercase">
                                    Course Activity Summary
                                  </span>
                                  <span className="text-[9px] font-bold text-gray-400">ID: ACT-SUM-08</span>
                                </div>
                                <div className="flex gap-4 mb-3 border-b border-black/5 pb-2">
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">ACTIVE USERS</span>
                                    <strong className="text-sm font-black text-[#141414]">142</strong>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">WEEKLY TREND</span>
                                    <strong className="text-sm font-black text-red-500">-8%</strong>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">CONFIDENCE</span>
                                    <strong className="text-sm font-black text-[#59C28A]">91%</strong>
                                  </div>
                                </div>

                                <div className="bg-white rounded-xl p-2 border border-[#E3DCCE]/40 mb-3">
                                  <span className="text-[8px] font-bold text-gray-400 block mb-1">Peak Engagement Hours</span>
                                  <svg className="w-full h-10 overflow-visible" viewBox="0 0 250 40">
                                    <path d="M0,35 Q50,20 100,5 T200,38" fill="none" stroke="#141414" strokeWidth="2" />
                                    <circle cx="100" cy="5" r="3.5" fill="#141414" />
                                  </svg>
                                </div>

                                <div className="text-[11px] text-gray-600 space-y-1 mb-3">
                                  <p className="font-semibold text-[#141414]">Drop-off & Activity Gaps:</p>
                                  <p>• User logins fell after 12:00 PM on weekdays.</p>
                                  <p>• Video sessions dropped during high meeting volumes.</p>
                                  <p>• React course has the highest active focus time.</p>
                                </div>

                                <div className="flex gap-2">
                                  <button className="flex-1 py-2 bg-[#141414] text-white rounded-full text-[10px] font-bold hover:bg-opacity-95 transition-all">
                                    Schedule Reminders
                                  </button>
                                  <button className="flex-1 py-2 bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[10px] font-bold hover:bg-gray-50 transition-all">
                                    Review Logs
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* --- Context: Skill Development --- */}
                            {activeWidget === 'skills' && (
                              <div className="bg-[#F3FCE2] border border-[#B7C88C]/60 rounded-[24px] p-5 flex flex-col shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="px-2 py-0.5 bg-[#B7C88C] text-[#141414] rounded-full text-[8px] font-black uppercase">
                                    Skill Gap Analysis
                                  </span>
                                  <span className="text-[9px] font-bold text-gray-400">ID: SKL-GAP-12</span>
                                </div>
                                <div className="flex gap-4 mb-3 border-b border-black/5 pb-2">
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">PRIORITY GAPS</span>
                                    <strong className="text-sm font-black text-red-500">3 High</strong>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">TARGET COMP</span>
                                    <strong className="text-sm font-black text-[#141414]">148 new</strong>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">CONFIDENCE</span>
                                    <strong className="text-sm font-black text-[#59C28A]">96%</strong>
                                  </div>
                                </div>

                                <div className="text-[11px] text-gray-600 space-y-1.5 mb-3 border-t border-black/5 pt-2">
                                  <p className="font-semibold text-[#141414]">Missing Competencies:</p>
                                  <p>• Engineering lacks Rust & System Architecture credentials.</p>
                                  <p>• Design requires Framer Motion interactive training.</p>
                                  <p>• Recommend introducing 8 senior developer mentors.</p>
                                </div>

                                <div className="flex gap-2">
                                  <button className="flex-1 py-2 bg-[#141414] text-white rounded-full text-[10px] font-bold hover:bg-opacity-95 transition-all">
                                    Suggest Mentors
                                  </button>
                                  <button className="flex-1 py-2 bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[10px] font-bold hover:bg-gray-50 transition-all">
                                    Approve L&D Budget
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* --- Context: Employee Engagement --- */}
                            {activeWidget === 'engagement' && (
                              <div className="bg-[#EDF6FF] border border-[#BFD6FF]/60 rounded-[24px] p-5 flex flex-col shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="px-2 py-0.5 bg-[#BFD6FF] text-[#141414] rounded-full text-[8px] font-black uppercase">
                                    Engagement Metrics Sync
                                  </span>
                                  <span className="text-[9px] font-bold text-gray-400">ID: ENG-TRK-08</span>
                                </div>
                                <div className="flex gap-4 mb-3 border-b border-black/5 pb-2">
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">ENGAGEMENT SCORE</span>
                                    <strong className="text-sm font-black text-[#141414]">93%</strong>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">AVG DAYS</span>
                                    <strong className="text-sm font-black text-[#141414]">8.4 days</strong>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-500 font-bold block">CONFIDENCE</span>
                                    <strong className="text-sm font-black text-[#59C28A]">93%</strong>
                                  </div>
                                </div>

                                <div className="text-[11px] text-gray-600 space-y-1 mb-3">
                                  <p className="font-semibold text-[#141414]">Participation Analysis:</p>
                                  <p>• Practical lab environments retain users 22% longer than lectures.</p>
                                  <p>• Streak badges triggered during L&D challenge yield higher returns.</p>
                                  <p>• Video session metrics grew 14% this quarter.</p>
                                </div>

                                <div className="flex gap-2">
                                  <button className="flex-1 py-2 bg-[#141414] text-white rounded-full text-[10px] font-bold hover:bg-opacity-95 transition-all">
                                    Reward Streaks
                                  </button>
                                  <button className="flex-1 py-2 bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[10px] font-bold hover:bg-gray-50 transition-all">
                                    Expand Labs
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom input area & bar menu */}
        <div className="space-y-4 pt-2">
          {/* Ask input panel */}
          <div className="flex items-center gap-1.5 bg-[#F8F4EE] border border-[#E3DCCE] rounded-full px-3 py-1.5 shadow-sm">
            <input
              type="text"
              placeholder={getInputPlaceholder()}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xs text-[#141414] font-medium px-1 placeholder-gray-400"
            />
            <button className="w-7 h-7 rounded-full bg-[#141414] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
              <Send className="w-3.5 h-3.5 fill-white transform translate-x-px -translate-y-px" />
            </button>
          </div>

          {/* Navigation Tabs at the very bottom */}
          <div className="flex justify-between items-center px-4 pt-2 border-t border-[#E3DCCE]/40 text-gray-400">
            <button className="text-[#141414] p-1.5 hover:text-[#141414]" aria-label="Home page">
              <Home className="w-4.5 h-4.5 fill-current" />
            </button>
            <button className="p-1.5 hover:text-[#141414]" aria-label="Timeline log calendar">
              <Calendar className="w-4.5 h-4.5" />
            </button>
            <button className="p-1.5 hover:text-[#141414]" aria-label="Organization employees">
              <Users className="w-4.5 h-4.5" />
            </button>
            <button className="p-1.5 hover:text-[#141414]" aria-label="L&D configuration settings">
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

      </aside>

    </div>
  );
}
