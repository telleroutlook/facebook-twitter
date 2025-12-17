import { Signal, User } from '../types';

const NOW = Date.now();
const HOUR = 3600 * 1000;

export const MOCK_USERS: User[] = [
  {
    id: `user_${NOW - 2 * HOUR}`,
    nickname: "Alice Chen",
    languages: ["English", "Chinese", "Spanish"],
    createdAt: NOW - 2 * HOUR,
    lastActiveAt: NOW,
    expiresAt: NOW - 2 * HOUR + 24 * HOUR,
    isDead: false,
    stats: {
      postsCount: 28,
      viewsCount: 1247,
      messagesSent: 156
    }
  },
  {
    id: `user_${NOW - 5 * HOUR}`,
    nickname: "Bob Wilson",
    languages: ["English", "French"],
    createdAt: NOW - 5 * HOUR,
    lastActiveAt: NOW - HOUR,
    expiresAt: NOW - 5 * HOUR + 24 * HOUR,
    isDead: false,
    stats: {
      postsCount: 15,
      viewsCount: 892,
      messagesSent: 73
    }
  }
];

export const MOCK_SIGNALS: Signal[] = [
  {
    id: `signal_${NOW - 30 * 60 * 1000}`,
    authorId: MOCK_USERS[0].id,
    authorName: "Alice Chen",
    content: "Just discovered this amazing design framework! The color system is so well thought out. 🎨\n\nWhat tools do you all use for design system management?",
    imageUrl: "https://picsum.photos/800/400",
    timestamp: NOW - 30 * 60 * 1000,
    likes: 24,
    commentCount: 8,
    isLiked: false,
    isOwn: false,
    status: "published",
    tags: ["design", "tools"]
  },
  {
    id: `signal_${NOW - 2 * HOUR}`,
    authorId: MOCK_USERS[1].id,
    authorName: "Bob Wilson",
    content: "The future of web development is edge computing. Cloudflare Workers are changing the game! ⚡\n\nZero cold starts, global distribution, and incredible performance.",
    timestamp: NOW - 2 * HOUR,
    likes: 18,
    commentCount: 5,
    isLiked: true,
    isOwn: false,
    status: "published",
    tags: ["tech", "performance"]
  },
  {
    id: `signal_${NOW - 4 * HOUR}`,
    authorId: "user_temp_me", // Placeholder for when we view 'own' posts before login
    authorName: "Me",
    content: "My current workspace setup. Minimalist but functional! 💻",
    imageUrl: "https://picsum.photos/800/600",
    timestamp: NOW - 4 * HOUR,
    likes: 32,
    commentCount: 12,
    isLiked: false,
    isOwn: true,
    status: "published",
    tags: ["workspace"]
  }
];