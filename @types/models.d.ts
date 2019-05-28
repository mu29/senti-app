interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
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
  createdAt: number;
  updatedAt: number;
}

interface Message {
  audioUrl: string;
  duration: number;
  createdAt: string;
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
