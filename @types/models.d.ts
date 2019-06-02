interface Timestamp {
  nanoseconds: number;
  seconds: number;
}

interface User {
  id: string;
  email?: string;
  name: string | null;
  photoUrl: string | null;
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
  user: Partial<User>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Chatting {
  id: string;
  participantIds: string[];
  messageCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Message {
  id: string;
  audio: Audio;
  user: Partial<User>;
  createdAt: Timestamp;
}

interface Tag {
  id: number;
  name: string;
  count: number;
  isSubscribed: boolean;
}
