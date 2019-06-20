import Sound from 'react-native-sound';
import { LoadingType } from 'constants/enums';

declare global {
  interface Tag {
    id: string;
    name: string;
    storyCount: number;
  }

  interface UserEssential {
    id: string;
    name: string | null;
    photoUrl: string | null;
  }

  interface User extends UserEssential {
    email?: string;
    lastSignInAt: number;
    createdAt: number;
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
    index: number;
    cover: string;
    description: string;
    tags: {
      [key: string]: number;
    };
    tagNames: [string];
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
}