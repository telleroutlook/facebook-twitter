export interface User {
  id: string;                    // user_1645123456789 (fixed prefix)
  nickname: string;              // "Alice Chen" (2-20 chars)
  languages: string[];           // ["English", "Chinese", "Spanish"]
  createdAt: number;             // Unix timestamp in milliseconds
  lastActiveAt: number;          // Unix timestamp in milliseconds
  expiresAt: number;             // createdAt + 24 hours
  isDead: boolean;               // false (account expiration status)
  stats: {
    postsCount: number;
    viewsCount: number;
    messagesSent: number;
  };
}

export interface Signal {
  id: string;                    // signal_1645123456789
  authorId: string;
  authorName: string;
  content: string;               // 1-500 chars
  imageUrl?: string;             // Optional
  timestamp: number;
  likes: number;
  commentCount: number;
  isLiked: boolean;
  isOwn: boolean;
  status: 'published' | 'publishing';
  tags?: string[];
}

export interface Comment {
  id: string;
  signalId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface AppState {
  currentView: 'INTRO' | 'CREATE_IDENTITY' | 'TIMELINE' | 'SETTINGS' | 'EXPLORE' | 'GONE';
  user: User | null;
  currentLanguage: 'English' | 'Chinese' | 'Spanish';
}

export interface SearchFilter {
  query: string;
  filter: 'all' | 'my' | 'others';
}