import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock, Trash2, Copy, X } from 'lucide-react';
import { Signal, Comment } from '../types';
import { Button } from './Button';

interface SignalCardProps {
  signal: Signal;
  onLike: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  onAddComment?: (signalId: string, content: string) => void;
  comments?: Comment[]; // In a real app this would be fetched
}

export const SignalCard: React.FC<SignalCardProps> = ({ 
  signal, 
  onLike, 
  onDelete, 
  onShare, 
  onAddComment 
}) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  // Local state for demo comments since we can't change global data structure easily
  const [localComments, setLocalComments] = useState<Comment[]>([]); 

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return '1d';
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    
    // Simulate adding a comment locally for UI feedback
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      signalId: signal.id,
      authorId: 'current_user',
      authorName: 'Me',
      content: commentText,
      createdAt: Date.now()
    };
    
    setLocalComments(prev => [...prev, newComment]);
    if (onAddComment) onAddComment(signal.id, commentText);
    setCommentText('');
  };

  return (
    <>
      <article className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl transition-all hover:bg-slate-900 overflow-hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-3 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-900/20">
                {signal.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-100 hover:underline cursor-pointer">{signal.authorName}</h3>
                  {signal.isOwn && (
                    <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/30">YOU</span>
                  )}
                </div>
                <div className="flex items-center text-xs text-slate-500 gap-1">
                  <span>{timeAgo(signal.timestamp)} left</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                </div>
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="text-slate-500 hover:text-violet-400 p-1 rounded-full hover:bg-slate-800 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 py-1">
                     <button 
                        onClick={() => { onShare?.(signal.id); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" /> Copy ID
                      </button>
                      {signal.isOwn && (
                        <button 
                          onClick={() => { onDelete?.(signal.id); setShowMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Signal
                        </button>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mb-3 pl-[3.25rem]">
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-[15px]">{signal.content}</p>
            {signal.tags && (
              <div className="flex gap-2 mt-3">
                {signal.tags.map(tag => (
                  <span key={tag} className="text-blue-400 text-sm hover:underline cursor-pointer">#{tag}</span>
                ))}
              </div>
            )}
          
            {/* Image Attachment */}
            {signal.imageUrl && (
              <div 
                className="mt-3 rounded-xl overflow-hidden border border-slate-800 relative group cursor-pointer"
                onClick={() => setShowLightbox(true)}
              >
                <img 
                  src={signal.imageUrl} 
                  alt="Signal attachment" 
                  className="w-full h-auto object-cover max-h-[500px]" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-slate-400 mt-2 pl-[3.25rem]">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => onLike(signal.id)}
                className={`flex items-center gap-2 group transition-colors ${signal.isLiked ? 'text-pink-500' : 'hover:text-pink-500'}`}
              >
                <div className={`p-2 rounded-full group-hover:bg-pink-500/10 transition-all ${signal.isLiked ? 'bg-pink-500/10 scale-110' : ''}`}>
                  <Heart className={`w-5 h-5 ${signal.isLiked ? 'fill-current' : ''}`} />
                </div>
                <span className="text-sm font-medium">{signal.likes}</span>
              </button>

              <button 
                onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                className={`flex items-center gap-2 group hover:text-blue-400 transition-colors ${isCommentsOpen ? 'text-blue-400' : ''}`}
              >
                <div className={`p-2 rounded-full group-hover:bg-blue-400/10 ${isCommentsOpen ? 'bg-blue-400/10' : ''}`}>
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{signal.commentCount + localComments.length}</span>
              </button>

              <button 
                onClick={() => onShare?.(signal.id)}
                className="flex items-center gap-2 group hover:text-green-400 transition-colors"
              >
                <div className="p-2 rounded-full group-hover:bg-green-400/10">
                  <Share2 className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {isCommentsOpen && (
           <div className="bg-slate-950/50 border-t border-slate-800 p-4 pl-[4.25rem] animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="space-y-4 mb-4">
                 {localComments.length === 0 && signal.commentCount === 0 ? (
                    <p className="text-slate-600 text-sm text-center py-2">No comments yet. Be the first!</p>
                 ) : (
                    // In a real app, we would map existing comments here too
                    localComments.map(comment => (
                       <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-bold">
                             {comment.authorName.charAt(0)}
                          </div>
                          <div className="bg-slate-900 rounded-2xl rounded-tl-none px-4 py-2 border border-slate-800">
                             <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-bold text-slate-200">{comment.authorName}</span>
                                <span className="text-xs text-slate-500">just now</span>
                             </div>
                             <p className="text-sm text-slate-300">{comment.content}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
              
              <div className="flex gap-3 items-start">
                 <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0" />
                 <div className="flex-1 flex gap-2">
                    <input 
                       type="text" 
                       value={commentText}
                       onChange={(e) => setCommentText(e.target.value)}
                       placeholder="Post your reply..."
                       className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                       onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    />
                    <Button size="xs" onClick={handlePostComment} disabled={!commentText.trim()} className="rounded-full">
                       Reply
                    </Button>
                 </div>
              </div>
           </div>
        )}
      </article>

      {/* Lightbox Modal */}
      {showLightbox && signal.imageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <button 
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 bg-slate-800/50 rounded-full text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={signal.imageUrl} 
            alt="Full size" 
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
};