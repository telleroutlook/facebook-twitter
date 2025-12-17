import React, { useState, useEffect } from 'react';
import { User, Signal, AppState } from './types';
import { MOCK_USERS, MOCK_SIGNALS } from './services/mockData';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { SignalCard } from './components/SignalCard';
import { CreateSignal } from './components/CreateSignal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Shield, Clock, Users, Zap, LayoutGrid, Settings, LogOut, Search, Plus, Sparkles, MoreHorizontal, Flame, Hash, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'INTRO',
    user: null,
    currentLanguage: 'English'
  });

  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [nickname, setNickname] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showMobileCreate, setShowMobileCreate] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Auto-scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState.currentView]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleCreateIdentity = () => {
    if (!nickname.trim()) return;
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      nickname: nickname,
      languages: ['English'],
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      expiresAt: Date.now() + 24 * 3600 * 1000,
      isDead: false,
      stats: { postsCount: 0, viewsCount: 0, messagesSent: 0 }
    };

    setAppState(prev => ({
      ...prev,
      user: newUser,
      currentView: 'TIMELINE'
    }));
    addToast('success', 'Identity initialized. Welcome to the grid.');
  };

  const handlePostSignal = (content: string, imageUrl?: string) => {
    if (!appState.user) return;

    // Extract basic hashtags from content for demo
    const tags = content.match(/#[a-zA-Z0-9_]+/g)?.map(tag => tag.slice(1)) || [];

    const newSignal: Signal = {
      id: `signal_${Date.now()}`,
      authorId: appState.user.id,
      authorName: appState.user.nickname,
      content,
      imageUrl,
      timestamp: Date.now(),
      likes: 0,
      commentCount: 0,
      isLiked: false,
      isOwn: true,
      status: 'published',
      tags: tags.length > 0 ? tags : undefined
    };

    setSignals(prev => [newSignal, ...prev]);
    
    // Update local user stats
    setAppState(prev => ({
      ...prev,
      user: prev.user ? {
        ...prev.user,
        stats: {
          ...prev.user.stats,
          postsCount: prev.user.stats.postsCount + 1
        }
      } : null
    }));
    
    addToast('success', 'Signal broadcasted successfully.');
    setShowMobileCreate(false);
  };

  const handleLike = (id: string) => {
    setSignals(prev => prev.map(sig => {
      if (sig.id === id) {
        return {
          ...sig,
          likes: sig.isLiked ? sig.likes - 1 : sig.likes + 1,
          isLiked: !sig.isLiked
        };
      }
      return sig;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this signal?')) {
      setSignals(prev => prev.filter(s => s.id !== id));
      addToast('info', 'Signal deleted.');
    }
  };

  const handleShare = (id: string) => {
    // Mock copy to clipboard
    navigator.clipboard.writeText(`https://trustavo.com/signal/${id}`);
    addToast('success', 'Link copied to clipboard');
  };

  // Filter signals based on tab (Timeline) or Search (Explore)
  const getDisplayedSignals = () => {
    if (appState.currentView === 'EXPLORE') {
      if (!searchQuery.trim()) {
        // Return sorted by likes (Hot signals)
        return [...signals].sort((a, b) => b.likes - a.likes);
      }
      const q = searchQuery.toLowerCase();
      return signals.filter(s => 
        s.content.toLowerCase().includes(q) || 
        s.authorName.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    
    // Timeline Logic
    return activeTab === 'all' 
      ? signals 
      : signals.filter(s => s.isOwn);
  };

  const displayedSignals = getDisplayedSignals();

  // Trending Tags Mock
  const trendingTags = [
     { tag: 'Cyberpunk', count: 2542 },
     { tag: 'Cloudflare', count: 1203 }, 
     { tag: 'React', count: 856 }, 
     { tag: 'Privacy', count: 542 },
     { tag: 'Design', count: 320 }
  ];

  const renderIntro = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30 rotate-3 transition-transform hover:rotate-6 duration-300">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tighter">
          Trustavo
        </h1>
        
        <p className="text-xl text-slate-400 leading-relaxed max-w-md mx-auto">
          Temporary connections, permanent impact. Your identity and messages vanish in <span className="text-violet-400 font-semibold">24 hours</span>.
        </p>

        <div className="grid grid-cols-3 gap-4 py-8">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm hover:border-violet-500/30 transition-colors">
            <Clock className="w-6 h-6 text-violet-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-slate-200">24h Life</div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-slate-200">Secure</div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm hover:border-green-500/30 transition-colors">
            <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-slate-200">Social</div>
          </div>
        </div>

        <Button 
          size="lg" 
          fullWidth 
          onClick={() => setAppState(prev => ({ ...prev, currentView: 'CREATE_IDENTITY' }))}
          rightIcon={<Zap className="w-5 h-5" />}
          className="shadow-violet-500/20 shadow-xl"
        >
          Initialize Identity
        </Button>
      </div>
    </div>
  );

  const renderCreateIdentity = () => (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
        <h2 className="text-2xl font-bold text-white mb-2">Create Identity</h2>
        <p className="text-slate-400 mb-8">This persona will exist for exactly 24 hours.</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Input 
              label="Codename"
              placeholder="e.g. Neon Runner"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-slate-500 flex justify-between">
              <span>2-20 characters</span>
              <span>Anonymous</span>
            </p>
          </div>

          <div className="p-4 bg-violet-900/10 border border-violet-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-violet-300 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Auto-Destruct Timer</span>
            </div>
            <p className="text-xs text-violet-400/70">
              Identity will be purged at {new Date(Date.now() + 24 * 3600 * 1000).toLocaleTimeString()}
            </p>
          </div>

          <Button 
            fullWidth 
            onClick={handleCreateIdentity}
            disabled={nickname.length < 2 || nickname.length > 20}
          >
            Enter The Grid
          </Button>
          
          <button 
            onClick={() => setAppState(prev => ({ ...prev, currentView: 'INTRO' }))}
            className="w-full text-slate-500 text-sm hover:text-slate-300 py-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderExplore = () => (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
       {/* Search Bar */}
       <div className="sticky top-16 z-20 bg-slate-950/80 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 border-b border-slate-800/50">
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input 
                type="text" 
                placeholder="Search signals, tags, or people..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
             />
             {searchQuery && (
                <button 
                   onClick={() => setSearchQuery('')}
                   className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white bg-slate-800 rounded-full"
                >
                   <ArrowLeft className="w-3 h-3" />
                </button>
             )}
          </div>
       </div>

       {/* Trending Tags (Only show when not searching) */}
       {!searchQuery && (
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-violet-400 font-bold px-1">
                <Flame className="w-5 h-5" />
                <h2>Trending Now</h2>
             </div>
             <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {trendingTags.map((item) => (
                   <button 
                      key={item.tag}
                      onClick={() => setSearchQuery(`#${item.tag}`)}
                      className="flex-shrink-0 bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-xl p-4 min-w-[140px] text-left transition-all group"
                   >
                      <div className="text-xs text-slate-500 mb-1 flex items-center gap-1 group-hover:text-violet-400">
                         <Hash className="w-3 h-3" /> Trending
                      </div>
                      <div className="font-bold text-white mb-1">#{item.tag}</div>
                      <div className="text-xs text-slate-600">{item.count} posts</div>
                   </button>
                ))}
             </div>
          </div>
       )}

       {/* Results Feed */}
       <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 px-1 uppercase tracking-wider">
             {searchQuery ? 'Search Results' : 'Hot Signals'}
          </h3>
          
          {displayedSignals.length === 0 ? (
             <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No signals found matching your criteria.</p>
                <p className="text-sm mt-2">Try searching for #tags or content.</p>
             </div>
          ) : (
             displayedSignals.map(signal => (
               <SignalCard 
                  key={signal.id} 
                  signal={signal} 
                  onLike={handleLike} 
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onAddComment={(signalId, content) => {
                     setSignals(prev => prev.map(s => s.id === signalId ? {...s, commentCount: s.commentCount + 1} : s));
                  }}
               />
             ))
          )}
       </div>
    </div>
  );

  const renderMainContent = () => (
    <div className="min-h-screen bg-slate-950 flex relative">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-[275px] fixed h-screen border-r border-slate-800 p-4 bg-slate-950/95 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3 px-4 mb-8 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Trustavo</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <button 
            onClick={() => setAppState(prev => ({ ...prev, currentView: 'TIMELINE' }))}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${appState.currentView === 'TIMELINE' ? 'font-bold text-white' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            <LayoutGrid className={`w-7 h-7 ${appState.currentView === 'TIMELINE' ? 'text-violet-400' : 'group-hover:text-violet-400'}`} />
            <span className="text-lg">Timeline</span>
          </button>

          <button 
             onClick={() => setAppState(prev => ({ ...prev, currentView: 'EXPLORE' }))}
             className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${appState.currentView === 'EXPLORE' ? 'font-bold text-white' : 'text-slate-400 hover:bg-slate-900'}`}
          >
             <Search className={`w-7 h-7 ${appState.currentView === 'EXPLORE' ? 'text-violet-400' : 'group-hover:text-violet-400'}`} />
             <span className="text-lg">Explore</span>
          </button>
          
          <button 
            onClick={() => setAppState(prev => ({ ...prev, currentView: 'SETTINGS' }))}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${appState.currentView === 'SETTINGS' ? 'font-bold text-white' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            <Settings className={`w-7 h-7 ${appState.currentView === 'SETTINGS' ? 'text-violet-400' : 'group-hover:text-violet-400'}`} />
            <span className="text-lg">Identity</span>
          </button>
        </nav>

        {appState.user && (
          <div className="p-3 bg-slate-900/50 rounded-full border border-slate-800 mt-auto hover:bg-slate-800 transition-colors cursor-pointer">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold shadow-lg">
                  {appState.user.nickname.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="font-bold truncate text-sm">{appState.user.nickname}</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </div>
                </div>
                <div className="pr-2">
                   <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>
             </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[275px] w-full max-w-[600px] border-x border-slate-800/50 min-h-screen relative">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
          <div className="p-4 lg:hidden flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Shield className="w-6 h-6 text-violet-500" />
               <h1 className="font-bold text-lg">Trustavo</h1>
            </div>
            {appState.user && (
               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold">
                 {appState.user.nickname.charAt(0).toUpperCase()}
               </div>
            )}
          </div>
          
          {appState.currentView === 'TIMELINE' && (
             <div className="flex w-full">
               <button 
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-4 text-sm font-bold text-center relative hover:bg-slate-900/50 transition-colors ${activeTab === 'all' ? 'text-white' : 'text-slate-500'}`}
               >
                  Global
                  {activeTab === 'all' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-violet-500 rounded-t-full"></div>}
               </button>
               <button 
                  onClick={() => setActiveTab('my')}
                  className={`flex-1 py-4 text-sm font-bold text-center relative hover:bg-slate-900/50 transition-colors ${activeTab === 'my' ? 'text-white' : 'text-slate-500'}`}
               >
                  My Signals
                  {activeTab === 'my' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-violet-500 rounded-t-full"></div>}
               </button>
             </div>
          )}
          {appState.currentView === 'EXPLORE' && (
             <div className="px-4 py-4 font-bold text-lg">
                Explore
             </div>
          )}
           {appState.currentView === 'SETTINGS' && (
             <div className="px-4 py-4 font-bold text-lg">
                Identity Profile
             </div>
          )}
        </header>

        <div className="p-4">
          {appState.currentView === 'EXPLORE' ? renderExplore() : 
           appState.currentView === 'TIMELINE' ? (
            <>
              <div className="hidden sm:block">
                 <CreateSignal onPost={handlePostSignal} currentUserAvatar={appState.user?.nickname.charAt(0).toUpperCase()} />
              </div>
              
              {showMobileCreate && (
                 <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm p-4 pt-16 animate-in slide-in-from-bottom-10 fade-in sm:hidden">
                    <div className="flex justify-between items-center mb-4">
                       <h2 className="text-lg font-bold">New Signal</h2>
                       <button onClick={() => setShowMobileCreate(false)} className="p-2 bg-slate-800 rounded-full text-white">
                          <LogOut className="w-5 h-5 rotate-180" /> 
                       </button>
                    </div>
                    <CreateSignal onPost={handlePostSignal} currentUserAvatar={appState.user?.nickname.charAt(0).toUpperCase()} />
                 </div>
              )}

              <div className="space-y-4 pb-20">
                {displayedSignals.length === 0 ? (
                   <div className="text-center py-20 text-slate-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No signals found in this frequency.</p>
                      {activeTab === 'my' && <p className="text-sm mt-2">Start broadcasting now.</p>}
                   </div>
                ) : (
                   displayedSignals.map(signal => (
                     <SignalCard 
                        key={signal.id} 
                        signal={signal} 
                        onLike={handleLike} 
                        onDelete={handleDelete}
                        onShare={handleShare}
                        onAddComment={(signalId, content) => {
                           // Mock adding comment visual feedback updates signal comment count
                           setSignals(prev => prev.map(s => s.id === signalId ? {...s, commentCount: s.commentCount + 1} : s));
                        }}
                     />
                   ))
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
                <div className="h-32 bg-gradient-to-r from-violet-900 to-blue-900"></div>
                <div className="px-6 pb-6">
                   <div className="relative -mt-12 mb-4 flex justify-between items-end">
                      <div className="w-24 h-24 rounded-full bg-slate-950 p-1">
                         <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                           {appState.user?.nickname.charAt(0).toUpperCase()}
                         </div>
                      </div>
                      <Button variant="secondary" size="sm">Edit Profile</Button>
                   </div>
                   
                   <h3 className="text-2xl font-bold text-white">{appState.user?.nickname}</h3>
                   <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                      <Clock className="w-4 h-4" />
                      <span>Active for another 23h 45m</span>
                   </div>

                   <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="flex flex-col">
                         <span className="font-bold text-white">{appState.user?.stats.postsCount}</span>
                         <span className="text-xs text-slate-500">Signals</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-white">{appState.user?.stats.viewsCount}</span>
                         <span className="text-xs text-slate-500">Views</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-white">{appState.user?.stats.messagesSent}</span>
                         <span className="text-xs text-slate-500">Messages</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                 <h4 className="font-bold mb-4">Account Settings</h4>
                 <Button 
                   variant="danger" 
                   fullWidth 
                   onClick={() => {
                      if(confirm('Are you sure? This will purge all your data immediately.')) {
                         setAppState({ currentView: 'INTRO', user: null, currentLanguage: 'English' });
                         addToast('info', 'Identity terminated.');
                      }
                   }}
                   leftIcon={<LogOut className="w-4 h-4" />}
                 >
                   Terminate Identity Immediately
                 </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Column (Desktop - Trends/Info) */}
      <aside className="hidden lg:block w-[350px] p-6 lg:ml-[calc(275px+600px)] fixed h-screen bg-slate-950/50">
        <div className="bg-slate-900 rounded-xl border border-slate-800 mb-6 overflow-hidden">
           <div className="p-4 border-b border-slate-800 font-bold text-xl">
              Trending
           </div>
          {trendingTags.map((item, idx) => (
             <button key={item.tag} onClick={() => {
                setAppState(prev => ({ ...prev, currentView: 'EXPLORE' }));
                setSearchQuery(`#${item.tag}`);
             }} className="w-full text-left p-4 hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-800/50 last:border-0">
                <div className="text-xs text-slate-500 mb-1">Trending in Tech</div>
                <div className="font-bold text-slate-200">#{item.tag}</div>
                <div className="text-xs text-slate-500 mt-1">{item.count} signals</div>
             </button>
          ))}
          <div className="p-4 text-violet-400 text-sm hover:underline cursor-pointer">
             Show more
          </div>
        </div>
        
        <div className="text-xs text-slate-600 leading-relaxed px-2">
           <nav className="flex flex-wrap gap-2 mb-2">
              <span className="hover:underline cursor-pointer">Terms</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span className="hover:underline cursor-pointer">Status</span>
              <span className="hover:underline cursor-pointer">About</span>
           </nav>
          <p>© 2025 Trustavo Inc.</p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex justify-around p-3 z-40 pb-5">
        <button 
          onClick={() => {
             setAppState(prev => ({ ...prev, currentView: 'TIMELINE' }));
             setActiveTab('all');
          }}
          className={`p-2 rounded-lg flex flex-col items-center gap-1 ${appState.currentView === 'TIMELINE' && activeTab === 'all' ? 'text-white' : 'text-slate-500'}`}
        >
          <LayoutGrid className="w-6 h-6" />
        </button>
        <button 
           onClick={() => setAppState(prev => ({ ...prev, currentView: 'EXPLORE' }))}
           className={`p-2 rounded-lg flex flex-col items-center gap-1 ${appState.currentView === 'EXPLORE' ? 'text-white' : 'text-slate-500'}`}
        >
          <Search className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setShowMobileCreate(true)}
          className="p-3 -mt-8 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/40 hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
        <button 
           onClick={() => setAppState(prev => ({ ...prev, currentView: 'SETTINGS' }))}
           className={`p-2 rounded-lg flex flex-col items-center gap-1 ${appState.currentView === 'SETTINGS' ? 'text-white' : 'text-slate-500'}`}
        >
          <Settings className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {appState.currentView === 'INTRO' && renderIntro()}
      {appState.currentView === 'CREATE_IDENTITY' && renderCreateIdentity()}
      {(appState.currentView === 'TIMELINE' || appState.currentView === 'SETTINGS' || appState.currentView === 'EXPLORE') && renderMainContent()}
    </>
  );
};

export default App;