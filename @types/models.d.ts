import Sound from 'react-native-sound';
import { LoadingType } from 'constants/enums';

declare global {
  interface PlayableAudio {
    elapsedTime: number;
    isLoading: boolean;
    isActivated: boolean;
    isPlaying: boolean;
  }
  
  interface Draft {
    cover: string;
    message: string;
  }

  interface Candidate {
    name?: string;
    gender?: 'male' | 'female' | null;
  }

  interface Coin {
    id: string;
    amount: number;
    price: number;
    retailPrice: number;
    currency: string;
  }

  interface Transaction {
    id: string;
    description: string;
    amount: number;
    createdAt: number;
  }

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
    tags: Array<Partial<Tag>>;
    createdAt: number;
    coin: number;
    useFreeCoinAt: number;
  }

  interface Audio {
    id: string;
    url: string;
    duration: number;
  }

  interface Story {
    id: string;
    cover: string;
    message: string;
    tags: string[];
    audio: Audio;
    user: User;
    createdAt: number;
    updatedAt: number;
  }

  interface Chatting {
    id: string;
    partner: User;
    messageCount: number;
    unreadMessageCount: number;
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