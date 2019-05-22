interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
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
