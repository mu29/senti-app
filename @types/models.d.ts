interface Timestamp {
  nanoseconds: number;
  seconds: number;
}

interface User {
  id: string;
  email: string | null;
  name: string | null;
  photoUrl: string | null;
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

interface Message {
  audioUrl: string;
  duration: number;
  createdAt: Timestamp;
}

interface Chatting {
  id: number;
  partner: User;
  lastMessage: Message;
  messageCount: number;
}

interface Tag {
  id: number;
  name: string;
  count: number;
  isSubscribed: boolean;
}
