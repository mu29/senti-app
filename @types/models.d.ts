interface UserEssential {
  id: string;
  name: string | null;
  photoUrl: string | null;
}

interface User extends UserEssential {
  email?: string;
  lastSignInAt: number;
  createdAt: number;
}

interface Audio {
  id: string;
  url: string;
  duration: number;
}

interface Story {
  id: string;
  index: number;
  cover: string;
  description: string;
  tags: {
    [key: string]: boolean;
  };
  audio: Audio;
  user: UserEssential;
  createdAt: number;
  updatedAt: number;
}

interface Chatting {
  id: string;
  users: {
    [key: string]: UserEssential;
  };
  userIds: {
    [key: string]: number;
  },
  unreadMessageCount: {
    [key: string]: number;
  },
  messageCount: number;
  createdAt: number;
  updatedAt: number;
}

interface Message {
  id: string;
  audio: Audio;
  user: UserEssential;
  readAt?: number;
  createdAt: number;
}

interface Tag {
  id: number;
  name: string;
  count: number;
  isSubscribed: boolean;
}
