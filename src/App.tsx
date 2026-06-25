import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Settings, Menu,
  LayoutDashboard, Users, BarChart3, GraduationCap, 
  FileText, FolderOpen, LogOut,
  Zap, Send,
  BookOpen, Award
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

// Terminal-style Typing Cursor Component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-[13px] text-gray-400 font-mono font-medium">
      <span>Thinking</span>
      <span className="w-1.5 h-3.5 bg-gray-400 inline-block cursor-blink" />
    </div>
  );
}

// Helper Functions for Widget Styling & Content
const getWidgetEmoji = (id: string | null) => {
  switch (id) {
    case 'progress': return '📊';
    case 'activity': return '📈';
    case 'skills': return '🏆';
    case 'engagement': return '🤝';
    default: return '🤖';
  }
};

const getWidgetColor = (id: string | null) => {
  switch (id) {
    case 'progress': return '#F7D85D';
    case 'activity': return '#F3B8D6';
    case 'skills': return '#B7C88C';
    case 'engagement': return '#BFD6FF';
    default: return '#E3DCCE';
  }
};

const getWidgetTextColor = () => {
  return '#141414';
};

const getWidgetLabel = (id: string | null) => {
  switch (id) {
    case 'progress': return 'Learning Progress';
    case 'activity': return 'Course Activity';
    case 'skills': return 'Skill Development';
    case 'engagement': return 'Employee Engagement';
    default: return '';
  }
};

const getUserQuestion = (id: string) => {
  switch (id) {
    case 'progress': return "Why has completion dropped this week?";
    case 'activity': return "Which courses are losing engagement this week?";
    case 'skills': return "Which skills require immediate L&D attention?";
    case 'engagement': return "Why has employee engagement decreased?";
    default: return "Show me widget analysis";
  }
};

export default function App() {
  const [activeMenu, setActiveMenu] = useState('Learning Analytics');
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [hoveredWidget, setHoveredWidget] = useState<string | null>(null);
  const [aiState, setAiState] = useState<'empty' | 'flying' | 'syncing' | 'thinking' | 'generating' | 'analyzed'>('empty');
  const [inputText, setInputText] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('Courses');
  
  // Flying Chip Overlay Coordinates
  const [animatingChip, setAnimatingChip] = useState<{
    label: string;
    emoji: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    textColor: string;
  } | null>(null);

  // Widget Click Actions
  const handleWidgetClick = (widgetId: string) => {
    if (activeWidget === widgetId && aiState !== 'empty') return;
    
    // Set target state to flying
    setActiveWidget(widgetId);
    setAiState('flying');
    
    // Schedule rect calculation on the next DOM loop
    setTimeout(() => {
      const sourceEl = document.getElementById(`widget-${widgetId}`);
      const targetEl = document.getElementById('ai-chip-target');
      
      if (sourceEl && targetEl) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        
        setAnimatingChip({
          label: getWidgetLabel(widgetId),
          emoji: getWidgetEmoji(widgetId),
          startX: sourceRect.left + sourceRect.width / 2,
          startY: sourceRect.top + sourceRect.height / 2,
          endX: targetRect.left + targetRect.width / 2,
          endY: targetRect.top + targetRect.height / 2,
          color: getWidgetColor(widgetId),
          textColor: getWidgetTextColor()
        });
      } else {
        // Fallback animation flow if DOM elements are missing
        setAiState('syncing');
        setTimeout(() => {
          setAiState('thinking');
          setTimeout(() => {
            setAiState('generating');
            setTimeout(() => {
              setAiState('analyzed');
            }, 350);
          }, 350);
        }, 300);
      }
    }, 40);
  };

  // Reset to original welcome onboarding state
  const handleResetConversation = () => {
    setAiState('empty');
    setActiveWidget(null);
    setHoveredWidget(null);
    setInputText('');
    setAnimatingChip(null);
  };

  const getInputPlaceholder = () => {
    if (!activeWidget) return "Select a widget to begin...";
    return `Ask about ${getWidgetLabel(activeWidget)}...`;
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

  // Variants for staggered children animation in Insight Cards
  const cardVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  } as const;

  const cardItemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring" as const, stiffness: 160, damping: 18 } 
    }
  } as const;

  // Render Premium Custom Insight Card templates
  const renderInsightCard = (id: string) => {
    switch (id) {
      case 'progress':
        return (
          <motion.div
            variants={cardItemVariants}
            className="bg-[#FFFDF6] border border-[#F7D85D]/60 rounded-[24px] p-5 flex flex-col shadow-md space-y-4 text-left"
          >
            <motion.div variants={cardItemVariants} className="flex justify-between items-center pb-2 border-b border-black/5">
              <span className="h-6 px-2.5 bg-[#F7D85D] text-[#141414] rounded-full text-[10px] font-black uppercase flex items-center justify-center tracking-wide">
                Learning Progress Analysis
              </span>
              <span className="text-[10px] font-bold text-gray-400">ID: LRN-PRO-84</span>
            </motion.div>
            
            <motion.div variants={cardItemVariants} className="grid grid-cols-3 gap-3 bg-white/50 p-3 rounded-[16px] border border-black/5">
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">COMPLETION</span>
                <strong className="text-[15px] font-black text-[#141414]"><CountUp end={84} />%</strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">WEEK TREND</span>
                <strong className="text-[15px] font-black text-red-500">-4%</strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">CONFIDENCE</span>
                <strong className="text-[15px] font-black text-[#59C28A]"><CountUp end={94} />%</strong>
              </div>
            </motion.div>

            {/* Spark Chart */}
            <motion.div variants={cardItemVariants} className="bg-white rounded-[16px] p-3 border border-[#E3DCCE]/40">
              <span className="text-[10px] font-bold text-gray-400 block mb-2">Weekly Completion Trend</span>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 250 40">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  d="M0,10 Q50,8 100,12 T180,30 T250,38" 
                  fill="none" 
                  stroke="#141414" 
                  strokeWidth="2.5" 
                />
                <line x1="180" y1="0" x2="180" y2="40" stroke="#FF9B54" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx="180" cy="30" r="3.5" fill="#141414" />
              </svg>
            </motion.div>

            {/* Insights */}
            <motion.div variants={cardItemVariants} className="text-[12px] text-[#141414]/80 space-y-1.5 bg-white/40 p-3 rounded-[16px]">
              <p className="font-extrabold text-[#141414] text-[11px] uppercase tracking-wider">Key Insights:</p>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#F7D85D]">•</span>
                <p>Module 6 drop-off rate is at an 18% decline.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#F7D85D]">•</span>
                <p>Average study session length runs 48 minutes.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#F7D85D]">•</span>
                <p>Mobile layout users complete modules 30% less often.</p>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={cardItemVariants} className="text-[12px] text-[#141414]/80 space-y-1.5 border-t border-black/5 pt-3">
              <p className="font-extrabold text-[#141414] text-[11px] uppercase tracking-wider">Recommendations:</p>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Notify Manager to follow up on stuck cohorts.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Improve Module 6 interactive diagrams.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Compare Departments performance metrics.</p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={cardItemVariants} className="flex gap-2 pt-1">
              <motion.button whileTap={{ scale: 0.98 }} className="h-9 flex-1 flex items-center justify-center bg-[#141414] text-white rounded-full text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-sm">
                Improve Module
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }} className="h-9 flex-1 flex items-center justify-center bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[11px] font-bold hover:bg-gray-50 transition-all shadow-sm">
                Notify Manager
              </motion.button>
            </motion.div>
          </motion.div>
        );

      case 'activity':
        return (
          <motion.div
            variants={cardItemVariants}
            className="bg-[#FDF9FB] border border-[#F3B8D6]/60 rounded-[24px] p-5 flex flex-col shadow-md space-y-4 text-left"
          >
            <motion.div variants={cardItemVariants} className="flex justify-between items-center pb-2 border-b border-black/5">
              <span className="h-6 px-2.5 bg-[#F3B8D6] text-[#141414] rounded-full text-[10px] font-black uppercase flex items-center justify-center tracking-wide">
                Course Activity Summary
              </span>
              <span className="text-[10px] font-bold text-gray-400">ID: ACT-SUM-08</span>
            </motion.div>
            
            <motion.div variants={cardItemVariants} className="grid grid-cols-3 gap-3 bg-white/50 p-3 rounded-[16px] border border-black/5">
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">LEARNERS</span>
                <strong className="text-[15px] font-black text-[#141414]"><CountUp end={142} /></strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">AVG SESSION</span>
                <strong className="text-[15px] font-black text-[#141414]"><CountUp end={24} /> min</strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">WEEK TREND</span>
                <strong className="text-[15px] font-black text-red-500">-8%</strong>
              </div>
            </motion.div>

            {/* Curve Chart */}
            <motion.div variants={cardItemVariants} className="bg-white rounded-[16px] p-3 border border-[#E3DCCE]/40">
              <span className="text-[10px] font-bold text-gray-400 block mb-2">Peak Engagement Hours</span>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 250 40">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  d="M0,35 Q50,20 100,5 T200,38 L250,32" 
                  fill="none" 
                  stroke="#141414" 
                  strokeWidth="2.5" 
                />
                <circle cx="100" cy="5" r="3.5" fill="#141414" />
              </svg>
            </motion.div>

            {/* Insights */}
            <motion.div variants={cardItemVariants} className="text-[12px] text-[#141414]/80 space-y-1.5 bg-white/40 p-3 rounded-[16px]">
              <p className="font-extrabold text-[#141414] text-[11px] uppercase tracking-wider">Key Insights:</p>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#F3B8D6]">•</span>
                <p>Engagement drops after 12:00 PM noon.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#F3B8D6]">•</span>
                <p>Mobile learners exit course materials earlier.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#F3B8D6]">•</span>
                <p>Advanced React shows the highest weekly completion.</p>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={cardItemVariants} className="text-[12px] text-[#141414]/80 space-y-1.5 border-t border-black/5 pt-3">
              <p className="font-extrabold text-[#141414] text-[11px] uppercase tracking-wider">Recommendations:</p>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Notify Course Owner regarding afternoon drops.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Review mobile Lesson 4 format and assets.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Compare performance metrics across cohorts.</p>
              </div>
            </motion.div>

            {/* Confidence */}
            <motion.div variants={cardItemVariants} className="flex justify-between items-center text-[10px] text-gray-500 pt-1">
              <span>AI Confidence score:</span>
              <span className="font-bold text-[#59C28A] bg-[#59C28A]/10 px-2 py-0.5 rounded-full"><CountUp end={91} />% Confidence</span>
            </motion.div>

            {/* Actions */}
            <motion.div variants={cardItemVariants} className="flex gap-2">
              <motion.button whileTap={{ scale: 0.98 }} className="h-9 flex-1 flex items-center justify-center bg-[#141414] text-white rounded-full text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-sm">
                Notify Course Owner
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }} className="h-9 flex-1 flex items-center justify-center bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[11px] font-bold hover:bg-gray-50 transition-all shadow-sm">
                Review Lesson 4
              </motion.button>
            </motion.div>
          </motion.div>
        );

      case 'skills':
        return (
          <motion.div
            variants={cardItemVariants}
            className="bg-[#FAFDF7] border border-[#B7C88C]/60 rounded-[24px] p-5 flex flex-col shadow-md space-y-4 text-left"
          >
            <motion.div variants={cardItemVariants} className="flex justify-between items-center pb-2 border-b border-black/5">
              <span className="h-6 px-2.5 bg-[#B7C88C] text-[#141414] rounded-full text-[10px] font-black uppercase flex items-center justify-center tracking-wide">
                Skill Gap Analysis
              </span>
              <span className="text-[10px] font-bold text-gray-400">ID: SKL-GAP-12</span>
            </motion.div>
            
            <motion.div variants={cardItemVariants} className="grid grid-cols-3 gap-3 bg-white/50 p-3 rounded-[16px] border border-black/5">
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">CERTIFICATIONS</span>
                <strong className="text-[15px] font-black text-[#141414]"><CountUp end={148} /></strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">PRIORITY GAPS</span>
                <strong className="text-[15px] font-black text-red-500"><CountUp end={12} /> Gaps</strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">CONFIDENCE</span>
                <strong className="text-[15px] font-black text-[#59C28A]"><CountUp end={96} />%</strong>
              </div>
            </motion.div>

            {/* Skill Level visualizer */}
            <motion.div variants={cardItemVariants} className="bg-white rounded-[16px] p-3.5 border border-[#E3DCCE]/40 space-y-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-gray-500">React Fundamentals</span>
                  <span className="font-bold text-[#141414]">92%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 0.8 }} className="h-full bg-[#141414]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-gray-500">Framer Motion Animations</span>
                  <span className="font-bold text-red-400">45%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full bg-red-400" />
                </div>
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div variants={cardItemVariants} className="text-[12px] text-[#141414]/80 space-y-1.5 bg-white/40 p-3 rounded-[16px]">
              <p className="font-extrabold text-[#141414] text-[11px] uppercase tracking-wider">Key Insights:</p>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#B7C88C]">•</span>
                <p>Engineering lacks senior Rust & System Architecture credentials.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#B7C88C]">•</span>
                <p>Design teams require custom interactive animation training.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#B7C88C]">•</span>
                <p>Active lab mentoring yields 40% higher training retention.</p>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={cardItemVariants} className="text-[12px] text-[#141414]/80 space-y-1.5 border-t border-black/5 pt-3">
              <p className="font-extrabold text-[#141414] text-[11px] uppercase tracking-wider">Recommendations:</p>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Suggest senior engineering mentors for Rust workshops.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Approve L&D budget for animation tools.</p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={cardItemVariants} className="flex gap-2 pt-1">
              <motion.button whileTap={{ scale: 0.98 }} className="h-9 flex-1 flex items-center justify-center bg-[#141414] text-white rounded-full text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-sm">
                Suggest Mentors
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }} className="h-9 flex-1 flex items-center justify-center bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[11px] font-bold hover:bg-gray-50 transition-all shadow-sm">
                Approve L&D Budget
              </motion.button>
            </motion.div>
          </motion.div>
        );

      case 'engagement':
        return (
          <motion.div
            variants={cardItemVariants}
            className="bg-[#F6FAFF] border border-[#BFD6FF]/60 rounded-[24px] p-5 flex flex-col shadow-md space-y-4 text-left"
          >
            <motion.div variants={cardItemVariants} className="flex justify-between items-center pb-2 border-b border-black/5">
              <span className="h-6 px-2.5 bg-[#BFD6FF] text-[#141414] rounded-full text-[10px] font-black uppercase flex items-center justify-center tracking-wide">
                Retention & Engagement Analysis
              </span>
              <span className="text-[10px] font-bold text-gray-400">ID: ENG-TRK-08</span>
            </motion.div>
            
            <motion.div variants={cardItemVariants} className="grid grid-cols-3 gap-3 bg-white/50 p-3 rounded-[16px] border border-black/5">
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">ENGAGED</span>
                <strong className="text-[15px] font-black text-[#141414]"><CountUp end={93} />%</strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">AVG DAYS</span>
                <strong className="text-[15px] font-black text-[#141414]"><CountUp end={8} />.<CountUp end={4} /></strong>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold block mb-0.5 uppercase">CONFIDENCE</span>
                <strong className="text-[15px] font-black text-[#59C28A]"><CountUp end={93} />%</strong>
              </div>
            </motion.div>

            {/* Spark Chart */}
            <motion.div variants={cardItemVariants} className="bg-white rounded-[16px] p-3 border border-[#E3DCCE]/40">
              <span className="text-[10px] font-bold text-gray-400 block mb-2">Quarterly Retention Streak</span>
              <svg className="w-full h-10 overflow-visible" viewBox="0 0 250 40">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  d="M0,25 Q75,5 150,20 T250,8" 
                  fill="none" 
                  stroke="#141414" 
                  strokeWidth="2.5" 
                />
                <circle cx="150" cy="20" r="3.5" fill="#141414" />
              </svg>
            </motion.div>

            {/* Insights */}
            <motion.div variants={cardItemVariants} className="text-[12px] text-[#141414]/80 space-y-1.5 bg-white/40 p-3 rounded-[16px]">
              <p className="font-extrabold text-[#141414] text-[11px] uppercase tracking-wider">Key Insights:</p>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#BFD6FF]">•</span>
                <p>Practical lab environments retain users 22% longer than lectures.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#BFD6FF]">•</span>
                <p>Streak badges triggered during L&D challenge yield higher returns.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#BFD6FF]">•</span>
                <p>Video sessions and lab metrics grew 14% this quarter.</p>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={cardItemVariants} className="text-[12px] text-[#141414]/80 space-y-1.5 border-t border-black/5 pt-3">
              <p className="font-extrabold text-[#141414] text-[11px] uppercase tracking-wider">Recommendations:</p>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Reward active users with custom streak badges.</p>
              </div>
              <div className="flex gap-1.5 items-start">
                <span className="text-[#141414]">•</span>
                <p>Expand lab capacities for other engineering divisions.</p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={cardItemVariants} className="flex gap-2 pt-1">
              <motion.button whileTap={{ scale: 0.98 }} className="h-9 flex-1 flex items-center justify-center bg-[#141414] text-white rounded-full text-[11px] font-bold hover:bg-opacity-90 transition-all shadow-sm">
                Reward Streaks
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }} className="h-9 flex-1 flex items-center justify-center bg-white border border-[#E3DCCE] text-[#141414] rounded-full text-[11px] font-bold hover:bg-gray-50 transition-all shadow-sm">
                Expand Labs
              </motion.button>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-[#F8F4EE] flex p-6 overflow-hidden font-sans selection:bg-intellyPink/50 selection:text-intellyBlack">
      
      {/* Blinking Cursor Inline Style */}
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 0.8s step-start infinite;
        }
      `}</style>

      {/* ========================================================
          1. LEFT SIDEBAR (Black, 260px or 80px)
         ======================================================== */}
      <motion.aside
        layout
        animate={{ 
          width: isSidebarCollapsed ? 80 : 260,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 24 
        }}
        className="h-full bg-[#141414] rounded-[32px] flex flex-col justify-between p-6 text-white relative overflow-hidden shrink-0 mr-6"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-b from-white/10 to-transparent" />
        
        <div>
          {/* Logo & Toggle */}
          <div className={`flex ${isSidebarCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between'} mb-8`}>
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center pl-0' : 'gap-2 pl-2'}`}>
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#141414] font-black text-base animate-pulse shrink-0">W</div>
              {!isSidebarCollapsed && (
                <h1 className="text-xl font-bold tracking-tight font-sans whitespace-nowrap">WidChat</h1>
              )}
            </div>
            {/* Menu icon replaces pink dot toggle button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-gray-400 hover:text-white transition-colors focus:outline-none"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* General Section */}
          <div className="space-y-1 mb-6">
            {!isSidebarCollapsed ? (
              <span className="text-[12px] text-gray-500 uppercase tracking-wider pl-3 font-semibold block mb-2 whitespace-nowrap">General</span>
            ) : (
              <div className="h-4" />
            )}
            {generalMenu.map((item) => {
              const isActive = activeMenu === item.name;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-[16px] text-[13px] font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-white/10 to-white/5 text-[#F3B8D6] shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F3B8D6]' : 'text-gray-400'}`} />
                  {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </button>
              );
            })}
          </div>

          {/* Tools Section */}
          <div className="space-y-1">
            {!isSidebarCollapsed ? (
              <span className="text-[12px] text-gray-500 uppercase tracking-wider pl-3 font-semibold block mb-2 whitespace-nowrap">Tools</span>
            ) : (
              <div className="h-4" />
            )}
            {toolsMenu.map((item) => {
              const isActive = activeMenu === item.name;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-[16px] text-[13px] font-medium transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-white/10 to-white/5 text-[#F3B8D6] shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F3B8D6]' : 'text-gray-400'}`} />
                  {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Profile Info Footer */}
        <div className={`border-t border-white/10 pt-4 flex ${isSidebarCollapsed ? 'flex-col items-center gap-4' : 'items-center gap-3'}`}>
          <div className="w-9 h-9 rounded-full bg-[#F3B8D6] flex items-center justify-center text-[#141414] text-[13px] font-bold shadow-sm shrink-0">
            OC
          </div>
          {!isSidebarCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-white truncate whitespace-nowrap">Olivia Chen</h4>
                <p className="text-[11px] text-gray-500 truncate whitespace-nowrap">L&D Manager</p>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors shrink-0" aria-label="Log out">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </motion.aside>

      {/* ========================================================
          2. CENTER PANEL (Flexible Dashboard Area)
         ======================================================== */}
      <motion.section layout className="h-full flex-1 flex flex-col overflow-y-auto pr-2 scrollbar-thin">
        
        {/* Top Search Bar & Action Buttons */}
        <div className="flex items-center justify-between py-2 mb-6 gap-6">
          <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md border border-[#E3DCCE]/85 rounded-full px-4 h-12 shadow-sm w-full max-w-[700px] flex-1 focus-within:border-[#141414]/30 focus-within:shadow-md transition-all">
            <div className="w-8 h-8 rounded-full bg-[#F3B8D6] flex items-center justify-center text-[#141414] shrink-0 shadow-sm">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input 
              type="text" 
              placeholder={`Search ${selectedSearchCategory.toLowerCase()}...`}
              className="bg-transparent outline-none text-[13px] text-[#141414] placeholder-gray-400 font-medium w-full max-w-[280px] px-1 border-r border-[#E3DCCE]/60 h-full" 
            />
            <div className="flex items-center gap-2 pl-2 text-[13px] text-gray-500 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
              <span className="text-gray-400 text-[11px] uppercase tracking-wider font-bold">In:</span>
              {['Courses', 'Departments', 'Employees', 'Skills'].map((category) => {
                const isCatSelected = selectedSearchCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedSearchCategory(category)}
                    className={`h-6 px-3 rounded-full text-[11px] font-bold shrink-0 transition-all focus:outline-none ${
                      isCatSelected 
                        ? 'bg-[#141414] text-white shadow-sm' 
                        : 'bg-white/80 border border-[#E3DCCE]/80 text-gray-600 hover:bg-[#141414]/5'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile & Icon Stack */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Profile Avatar (Consistent with OC pink style) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-[#F3B8D6] text-[#141414] text-[13px] font-black flex items-center justify-center cursor-pointer border border-[#E3DCCE]/80 hover:opacity-95 transition-all shadow-sm font-sans"
              title="Olivia Chen Profile"
            >
              OC
            </motion.div>

            {/* Notification Bell */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 cursor-pointer border border-[#E3DCCE]/80 hover:bg-gray-50 hover:text-[#141414] transition-all shadow-sm relative focus:outline-none animate-none"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#FF9B54]" />
            </motion.button>

            {/* Settings Button */}
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 cursor-pointer border border-[#E3DCCE]/80 hover:bg-gray-50 hover:text-[#141414] transition-all shadow-sm focus:outline-none animate-none"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Heading Description */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#141414] tracking-tight leading-none">Good Morning, Olivia</h2>
          <p className="text-[13px] text-gray-500 mt-1.5 font-medium">
            Select any analytics widget below to run live AI analysis.
          </p>
        </div>

        {/* Bento Grid (Adapts to fill space with 24px gap) */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          
          {/* Widget 1: Yellow Card (Learning Progress) */}
          <motion.div 
            id="widget-progress"
            onClick={() => handleWidgetClick('progress')}
            onMouseEnter={() => setHoveredWidget('progress')}
            onMouseLeave={() => setHoveredWidget(null)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleWidgetClick('progress');
              }
            }}
            animate={{
              scale: activeWidget === 'progress' ? 1.02 : (hoveredWidget === 'progress' ? 1.01 : 1),
              y: activeWidget === 'progress' ? -4 : (hoveredWidget === 'progress' ? -6 : 0),
              opacity: activeWidget 
                ? (activeWidget === 'progress' ? 1 : 0.75) 
                : (hoveredWidget ? (hoveredWidget === 'progress' ? 1 : 0.75) : 1),
              borderWidth: '2px',
              borderColor: (activeWidget === 'progress' || hoveredWidget === 'progress') ? '#E5C13C' : 'rgba(20, 20, 20, 0.05)',
              boxShadow: (activeWidget === 'progress' || hoveredWidget === 'progress')
                ? '0 12px 25px -4px rgba(20, 20, 20, 0.08), 0 0 20px 4px rgba(247, 216, 93, 0.35)' 
                : '0 4px 6px -1px rgba(20, 20, 20, 0.02)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="col-span-6 bg-[#F7D85D] rounded-[24px] p-6 text-[#141414] relative overflow-hidden flex flex-col justify-between h-[190px] cursor-pointer border group focus-visible:ring-2 focus-visible:ring-[#141414] focus-visible:outline-none"
          >
            {/* Active Badge */}
            <AnimatePresence>
              {activeWidget === 'progress' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#141414] text-white rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 z-20 shadow-md"
                >
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-[#59C28A]"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                  <span>Active</span>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Hover Tooltip */}
            {activeWidget !== 'progress' && (
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#141414] text-white rounded-full text-[9px] font-black tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-40 shadow-md transform translate-y-1 group-hover:translate-y-0">
                Analyze with AI →
              </div>
            )}

            {/* Background Shape */}
            <div className="absolute top-2 right-6 text-[#141414]/10 font-bold text-[140px] leading-none pointer-events-none select-none">
              %
            </div>
            
            <div>
              <span className="text-[20px] font-bold block mb-4 font-sans leading-none">Learning Progress</span>
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
              <span className="text-[10px] font-bold text-[#141414]/50">Mon</span>
              <div className="flex items-end gap-1.5 h-full px-2">
                <div className="w-1.5 h-1/2 bg-[#141414] rounded-full" />
                <div className="w-1.5 h-3/4 bg-[#141414] rounded-full" />
                <div className="w-1.5 h-1/3 bg-[#141414] rounded-full" />
                <div className="w-1.5 h-full bg-[#141414] rounded-full" />
                <div className="w-1.5 h-2/3 bg-[#141414]/30 rounded-full" />
              </div>
              <span className="text-[10px] font-bold text-[#141414]/50">Sun</span>
            </div>
          </motion.div>

          {/* Widget 2: Pink Card (Course Activity) */}
          <motion.div 
            id="widget-activity"
            onClick={() => handleWidgetClick('activity')}
            onMouseEnter={() => setHoveredWidget('activity')}
            onMouseLeave={() => setHoveredWidget(null)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleWidgetClick('activity');
              }
            }}
            animate={{
              scale: activeWidget === 'activity' ? 1.02 : (hoveredWidget === 'activity' ? 1.01 : 1),
              y: activeWidget === 'activity' ? -4 : (hoveredWidget === 'activity' ? -6 : 0),
              opacity: activeWidget 
                ? (activeWidget === 'activity' ? 1 : 0.75) 
                : (hoveredWidget ? (hoveredWidget === 'activity' ? 1 : 0.75) : 1),
              borderWidth: '2px',
              borderColor: (activeWidget === 'activity' || hoveredWidget === 'activity') ? '#DF9FB9' : 'rgba(20, 20, 20, 0.05)',
              boxShadow: (activeWidget === 'activity' || hoveredWidget === 'activity')
                ? '0 12px 25px -4px rgba(20, 20, 20, 0.08), 0 0 20px 4px rgba(243, 184, 214, 0.35)' 
                : '0 4px 6px -1px rgba(20, 20, 20, 0.02)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="col-span-6 bg-[#F3B8D6] rounded-[24px] p-6 text-[#141414] relative overflow-hidden flex flex-col justify-between h-[190px] cursor-pointer border group focus-visible:ring-2 focus-visible:ring-[#141414] focus-visible:outline-none"
          >
            {/* Active Badge */}
            <AnimatePresence>
              {activeWidget === 'activity' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#141414] text-white rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 z-20 shadow-md"
                >
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-[#59C28A]"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                  <span>Active</span>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Hover Tooltip */}
            {activeWidget !== 'activity' && (
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#141414] text-white rounded-full text-[9px] font-black tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-40 shadow-md transform translate-y-1 group-hover:translate-y-0">
                Analyze with AI →
              </div>
            )}

            {/* Background Shape */}
            <div className="absolute right-4 bottom-2 text-[#141414]/5 pointer-events-none select-none">
              <BookOpen className="w-36 h-36 stroke-[1.5]" />
            </div>

            <div>
              <span className="text-[20px] font-bold block mb-4 font-sans leading-none">Course Activity</span>
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
            <div className="h-16 w-full relative z-10 mt-4 flex flex-col justify-end">
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
              <div className="flex justify-between text-[10px] font-bold text-[#141414]/50 px-1 mt-1">
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
            id="widget-skills"
            onClick={() => handleWidgetClick('skills')}
            onMouseEnter={() => setHoveredWidget('skills')}
            onMouseLeave={() => setHoveredWidget(null)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleWidgetClick('skills');
              }
            }}
            animate={{
              scale: activeWidget === 'skills' ? 1.02 : (hoveredWidget === 'skills' ? 1.01 : 1),
              y: activeWidget === 'skills' ? -4 : (hoveredWidget === 'skills' ? -6 : 0),
              opacity: activeWidget 
                ? (activeWidget === 'skills' ? 1 : 0.75) 
                : (hoveredWidget ? (hoveredWidget === 'skills' ? 1 : 0.75) : 1),
              borderWidth: '2px',
              borderColor: (activeWidget === 'skills' || hoveredWidget === 'skills') ? '#9CB26B' : 'rgba(20, 20, 20, 0.05)',
              boxShadow: (activeWidget === 'skills' || hoveredWidget === 'skills')
                ? '0 12px 25px -4px rgba(20, 20, 20, 0.08), 0 0 20px 4px rgba(183, 200, 140, 0.35)' 
                : '0 4px 6px -1px rgba(20, 20, 20, 0.02)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="col-span-6 bg-[#B7C88C] rounded-[24px] p-6 text-[#141414] relative overflow-hidden flex flex-col justify-between h-[190px] cursor-pointer border group focus-visible:ring-2 focus-visible:ring-[#141414] focus-visible:outline-none"
          >
            {/* Active Badge */}
            <AnimatePresence>
              {activeWidget === 'skills' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#141414] text-white rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 z-20 shadow-md"
                >
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-[#59C28A]"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                  <span>Active</span>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Hover Tooltip */}
            {activeWidget !== 'skills' && (
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#141414] text-white rounded-full text-[9px] font-black tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-40 shadow-md transform translate-y-1 group-hover:translate-y-0">
                Analyze with AI →
              </div>
            )}

            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[90px] border-b-[#141414]/5 pointer-events-none select-none transform rotate-12" />

            <div>
              <span className="text-[20px] font-bold block mb-4 font-sans leading-none">Skill Development</span>
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
            <div className="w-2/3 h-3 bg-white/40 rounded-full overflow-hidden flex mt-4 border border-black/5">
              <div className="w-[75%] bg-[#141414] h-full" />
              <div className="w-[18%] bg-[#141414]/50 h-full border-l border-[#B7C88C]" />
              <div className="w-[7%] bg-red-500 h-full border-l border-[#B7C88C]" />
            </div>
          </motion.div>

          {/* Widget 4: Blue Card (Employee Engagement) */}
          <motion.div 
            id="widget-engagement"
            onClick={() => handleWidgetClick('engagement')}
            onMouseEnter={() => setHoveredWidget('engagement')}
            onMouseLeave={() => setHoveredWidget(null)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleWidgetClick('engagement');
              }
            }}
            animate={{
              scale: activeWidget === 'engagement' ? 1.02 : (hoveredWidget === 'engagement' ? 1.01 : 1),
              y: activeWidget === 'engagement' ? -4 : (hoveredWidget === 'engagement' ? -6 : 0),
              opacity: activeWidget 
                ? (activeWidget === 'engagement' ? 1 : 0.75) 
                : (hoveredWidget ? (hoveredWidget === 'engagement' ? 1 : 0.75) : 1),
              borderWidth: '2px',
              borderColor: (activeWidget === 'engagement' || hoveredWidget === 'engagement') ? '#9EBCE2' : 'rgba(20, 20, 20, 0.05)',
              boxShadow: (activeWidget === 'engagement' || hoveredWidget === 'engagement')
                ? '0 12px 25px -4px rgba(20, 20, 20, 0.08), 0 0 20px 4px rgba(191, 214, 255, 0.35)' 
                : '0 4px 6px -1px rgba(20, 20, 20, 0.02)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="col-span-6 bg-[#BFD6FF] rounded-[24px] p-6 text-[#141414] relative overflow-hidden flex flex-col justify-between h-[190px] cursor-pointer border group focus-visible:ring-2 focus-visible:ring-[#141414] focus-visible:outline-none"
          >
            {/* Active Badge */}
            <AnimatePresence>
              {activeWidget === 'engagement' && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#141414] text-white rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 z-20 shadow-md"
                >
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-[#59C28A]"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                  <span>Active</span>
                </motion.span>
              )}
            </AnimatePresence>

            {/* Hover Tooltip */}
            {activeWidget !== 'engagement' && (
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#141414] text-white rounded-full text-[9px] font-black tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-40 shadow-md transform translate-y-1 group-hover:translate-y-0">
                Analyze with AI →
              </div>
            )}

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#141414]/5 pointer-events-none select-none transform rotate-45">
              <Users className="w-28 h-28 stroke-[1.5]" />
            </div>

            <div>
              <span className="text-[20px] font-bold block mb-4 font-sans leading-none">Employee Engagement</span>
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
              <span className="text-[11px] font-medium">93% retention trend active</span>
            </div>
          </motion.div>

        </div>

      </motion.section>

      {/* ========================================================
          3. RIGHT PANEL (AI Assistant, Fixed 400px Width)
         ======================================================== */}
      <motion.aside 
        layout
        animate={{ 
          width: activeWidget ? 400 : 0,
          padding: activeWidget ? 24 : 0,
          borderWidth: activeWidget ? 1 : 0,
          marginLeft: activeWidget ? 24 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 24 
        }}
        className="h-full bg-white border border-[#E3DCCE] rounded-[32px] flex flex-col shadow-sm relative overflow-hidden shrink-0"
      >
        <AnimatePresence mode="wait">
          {!activeWidget ? (
            // Clean Placeholder Panel (Initial State)
            <motion.div
              key="placeholder-panel"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col justify-center items-center text-center p-6 space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">AI Workspace</span>
                <h3 className="text-xl font-bold text-gray-400/80">Ready</h3>
              </div>
              
              <div className="flex flex-col items-center space-y-3 text-gray-400/70">
                <p className="text-[13px] font-semibold leading-relaxed max-w-[190px]">
                  Select any analytics widget to begin analysis.
                </p>
                <span className="text-base font-bold text-gray-300">↓</span>
                <p className="text-[13px] font-semibold leading-relaxed max-w-[190px]">
                  Click any widget
                </p>
                <span className="text-base font-bold text-gray-300">↓</span>
                <p className="text-[13px] font-semibold leading-relaxed max-w-[190px]">
                  AI insights will appear here.
                </p>
              </div>
            </motion.div>
          ) : (
            // Active AI Assistant Panel Workspace (Header + Conversation + Input + Footer)
            <motion.div
              key="active-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full flex flex-col justify-between"
            >
              {/* Dynamic Header */}
              <div className="pb-4 border-b border-[#E3DCCE]/40 min-h-[64px] flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-white shrink-0">
                      <Zap className="w-4 h-4 fill-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-bold text-[#141414] tracking-tight">WidChat AI</h3>
                        <div className="flex items-center gap-1.5 bg-[#59C28A]/10 px-2 py-0.5 rounded-full select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#59C28A] animate-pulse" />
                          <span className="text-[9px] font-black text-[#59C28A] uppercase tracking-wider">Live</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div id="ai-chip-target" className="inline-flex items-center">
                          <span 
                            className="text-[10px] font-bold text-[#141414] px-2.5 py-0.5 rounded-full inline-flex items-center uppercase tracking-wide border border-black/5"
                            style={{ backgroundColor: getWidgetColor(activeWidget) }}
                          >
                            {getWidgetLabel(activeWidget)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Main Content Area (Syncing, Thinking, Generating, Analyzed states) */}
              <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin my-4 flex flex-col justify-start relative">
                <AnimatePresence mode="wait">
                  {aiState === 'syncing' && (
                    <motion.div 
                      key="state-syncing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex-1 flex flex-col justify-center items-center p-6 space-y-4"
                    >
                      <div className="w-full max-w-[200px] h-[3px] bg-gray-100 rounded-full overflow-hidden relative">
                        <motion.div 
                          className="h-full bg-[#141414] rounded-full"
                          initial={{ left: "-100%", width: "50%", position: "absolute" }}
                          animate={{ left: "100%" }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        />
                      </div>
                      <div className="text-[12px] font-medium text-gray-400 tracking-wide">
                        Synchronizing widget context...
                      </div>
                    </motion.div>
                  )}

                  {aiState === 'thinking' && (
                    <motion.div 
                      key="state-thinking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex-1 flex flex-col justify-center items-center p-6 space-y-3"
                    >
                      <div className="text-[12px] font-medium text-gray-400 tracking-wide">
                        Analyzing {getWidgetLabel(activeWidget)}...
                      </div>
                      <TypingIndicator />
                    </motion.div>
                  )}

                  {aiState === 'generating' && (
                    <motion.div 
                      key="state-generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex-1 flex flex-col justify-center items-center p-6 space-y-3"
                    >
                      <div className="text-[12px] font-medium text-gray-400 tracking-wide">
                        Generating insights...
                      </div>
                      <div className="flex items-center gap-1 text-[13px] text-gray-400 font-mono font-medium">
                        <span>Formulating response</span>
                        <span className="w-1.5 h-3.5 bg-gray-400 inline-block cursor-blink" />
                      </div>
                    </motion.div>
                  )}

                  {aiState === 'analyzed' && (
                    <motion.div 
                      key="state-analyzed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full flex-1 flex flex-col justify-start space-y-6"
                    >
                      {/* User Message */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                        className="flex flex-col items-start w-full text-left"
                      >
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">You</span>
                        <div className="text-[13px] text-gray-700 font-medium leading-relaxed mt-1.5">
                          {getUserQuestion(activeWidget)}
                        </div>
                      </motion.div>

                      {/* AI Message */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
                        className="flex flex-col items-start w-full text-left space-y-4"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#141414] uppercase tracking-widest">WidChat AI</span>
                          <span className="w-1 h-1 rounded-full bg-[#59C28A]" />
                        </div>
                        <div className="text-[13px] text-gray-600 font-medium leading-relaxed">
                          Here is the active {getWidgetLabel(activeWidget)} context:
                        </div>

                        <motion.div
                          variants={cardVariants}
                          initial="hidden"
                          animate="show"
                          className="w-full"
                          transition={{ delayChildren: 0.8 }}
                        >
                          {renderInsightCard(activeWidget)}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom input area & bar menu */}
              <div className="space-y-4 pt-2">
                {/* Ask input panel */}
                <div className="flex items-center gap-3 bg-[#F8F4EE] border border-[#E3DCCE] rounded-xl px-4 h-12 shadow-sm focus-within:ring-2 focus-within:ring-[#141414] focus-within:ring-offset-2 transition-all">
                  <input
                    type="text"
                    placeholder={getInputPlaceholder()}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={aiState !== 'analyzed'}
                    className="flex-1 bg-transparent outline-none text-[13px] text-[#141414] font-medium px-1 placeholder-gray-400/80 h-full disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    disabled={aiState !== 'analyzed'}
                    className="text-gray-400 hover:text-[#141414] transition-colors disabled:opacity-30 disabled:cursor-not-allowed p-1"
                    aria-label="Send query"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </motion.button>
                </div>

                {/* Desktop Utility Footer Action */}
                <div className="flex flex-col items-center pt-3 border-t border-[#E3DCCE]/40">
                  <button
                    onClick={handleResetConversation}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors py-1 px-3 focus:outline-none"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>Clear Context</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Global Flying Context Chip Overlay */}
      <AnimatePresence>
        {animatingChip && (
          <motion.div
            initial={{
              left: animatingChip.startX,
              top: animatingChip.startY,
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              left: [animatingChip.startX, (animatingChip.startX + animatingChip.endX) / 2, animatingChip.endX],
              top: [animatingChip.startY, (animatingChip.startY + animatingChip.endY) / 2 - 80, animatingChip.endY],
              scale: [0.9, 1.15, 1],
              opacity: [0, 1, 1],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.65,
              ease: [0.25, 0.46, 0.45, 0.94], // Spring-like cubic bezier path
            }}
            onAnimationComplete={() => {
              setAnimatingChip(null);
              setAiState('syncing');
              
              // Synchronizing widget context... (300ms)
              setTimeout(() => {
                setAiState('thinking');
                
                // Typing indicator (350ms)
                setTimeout(() => {
                  setAiState('generating');
                  
                  // Generating insights... (350ms)
                  setTimeout(() => {
                    setAiState('analyzed');
                  }, 350);
                }, 350);
              }, 300);
            }}
            style={{
              position: 'fixed',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              backgroundColor: animatingChip.color,
              color: animatingChip.textColor,
            }}
            className="h-7 px-4 rounded-full text-[10px] font-black flex items-center justify-center uppercase tracking-widest shadow-xl border border-black/10 pointer-events-none whitespace-nowrap"
          >
            {animatingChip.label}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
