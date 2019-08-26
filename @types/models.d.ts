import Sound from 'react-native-sound';
import { LoadingType } from 'constants/enums';

declare global {
  interface Tag {
    id: string;
    name: string;
    storyCount: number;
  }

  interface User {
    id: string;
    name: string | null;
    photoUrl: string | null;
  }

  interface Profile extends User {
    email: string;
    gender?: 'male' | 'female';
    createdAt: number;
    useFreeTicketAt: number;
    subscribedTags: Array<Partial<Tag>>;
  }

  interface Audio {
    id: string;
    url: string;
    duration: number;
  }

  interface PlayableAudio extends Audio {
    sound?: Sound;
    currentTime: number;
    isActivated: boolean;
    isPlaying: boolean;
  }

  interface Story {
    id: string;
    cover: string;
    description: string;
    tags: string[];
    audio: Audio;
    user: User;
    createdAt: number;
    updatedAt: number;
  }

  interface Chatting {
    id: string;
    users: {
      [key: string]: User;
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
    user: User;
    readAt?: number;
    createdAt: number;
  }
}