import React, { useState } from 'react';
import { Image, Send, X, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface CreateSignalProps {
  onPost: (content: string, imageUrl?: string) => void;
  currentUserAvatar?: string;
}

export const CreateSignal: React.FC<CreateSignalProps> = ({ onPost, currentUserAvatar }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 500;
  const progress = (content.length / maxLength) * 100;
  const isOverLimit = content.length > maxLength;
  
  // Color calculation for progress circle
  const getProgressColor = () => {
    if (content.length >= maxLength) return 'text-red-500';
    if (content.length >= maxLength - 50) return 'text-amber-500';
    return 'text-violet-500';
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || isOverLimit) return;
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onPost(content, imagePreview || undefined);
    setContent('');
    setImagePreview(null);
    setIsExpanded(false);
    setIsSubmitting(false);
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 transition-all duration-300 ${isExpanded ? 'shadow-lg shadow-violet-900/10 ring-1 ring-violet-500/20' : ''}`}>
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold flex-shrink-0">
          {currentUserAvatar || "U"}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="What's happening?"
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 resize-none focus:outline-none text-lg min-h-[50px] leading-relaxed"
            rows={isExpanded ? 3 : 1}
          />
          
          {imagePreview && (
            <div className="relative mt-3 rounded-xl overflow-hidden w-fit group">
              <img src={imagePreview} alt="Preview" className="max-h-60 object-cover rounded-xl border border-slate-700" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className={`flex justify-between items-center mt-4 pt-3 border-t border-slate-800 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden pt-0 mt-0 border-none'}`}>
            <div className="flex gap-2">
              <label className="p-2 text-violet-400 hover:bg-violet-500/10 rounded-full cursor-pointer transition-colors" title="Add Image">
                <Image className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>
            </div>
            
            <div className="flex gap-4 items-center">
              {/* Circular Progress Indicator */}
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                   <div className="relative w-6 h-6 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-800" />
                      <circle 
                        cx="12" cy="12" r="10" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 10}
                        strokeDashoffset={2 * Math.PI * 10 * (1 - Math.min(progress, 100) / 100)}
                        className={`transition-all duration-300 ${getProgressColor()}`} 
                      />
                    </svg>
                   </div>
                   {isOverLimit && <span className="text-xs text-red-500 font-medium">{maxLength - content.length}</span>}
                </div>
              )}

              <div className="h-6 w-px bg-slate-800 mx-1" />

              <Button 
                size="sm" 
                onClick={handleSubmit} 
                disabled={!content.trim() || isSubmitting || isOverLimit}
                loading={isSubmitting}
                className="rounded-full px-6"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};