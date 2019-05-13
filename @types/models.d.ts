interface User {
  uid?: string;
  email: string;
  displayName: string;
}

interface Message {
  audioUrl: string;
  duration: number;
  createdAt: string;
}

interface Tag {
  id: number;
  name: string;
  count: number;
  isSubscribed: boolean;
}
