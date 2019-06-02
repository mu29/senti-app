interface Timestamp {
  nanoseconds: number;
  seconds: number;
  toMillis: () => number;
}

interface UserEssential {
  id: string;
  name: string | null;
  photoUrl: string | null;
}

interface User extends UserEssential {
  email?: string;
  lastSignInAt: Timestamp;
  createdAt: Timestamp;
}

interface Audio {
  id: string;
  url: string;
  duration: number;
}

interface Story {
  id: string;
  cover: string;
  description: string;
  tags: {
    [key: string]: boolean;
  };
  audio: Audio;
  user: UserEssential;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Chatting {
  id: string;
  users: {
    [key: string]: UserEssential;
  };
  userIds: {
    [key: string]: Timestamp;
  },
  messageCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Message {
  id: string;
  audio: Audio;
  user: UserEssential;
  createdAt: Timestamp;
}

interface Tag {
  id: number;
  name: string;
  count: number;
  isSubscribed: boolean;
}
