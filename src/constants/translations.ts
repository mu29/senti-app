import { LANGUAGE } from './config';

const TRANSLATIONS: {
  [key: string]: {
    CHATTING_MESSAGE_COUNT: (count: string) => string;
    COIN_COUNT: (coin: number) => string;
    COIN_CHARGE_BUTTON: string;
    COIN_DISCOUNT_RATE: (percent: string) => string;
    COIN_PRICE: (price: string) => string;
  };
} = {
  ko: {
    CHATTING_MESSAGE_COUNT: (count) => `메시지 ${count}개`,
    COIN_COUNT: (amount) => `${amount}코인`,
    COIN_CHARGE_BUTTON: '충전',
    COIN_DISCOUNT_RATE: (percent) => `${percent}% 할인!`,
    COIN_PRICE: (price) => `${price}원`,
  },
  en: {
    CHATTING_MESSAGE_COUNT: (count) => `${count} messages`,
    COIN_COUNT: (amount) => `${amount} Coin${amount > 1 ? 's' : ''}`,
    COIN_CHARGE_BUTTON: 'Charge',
    COIN_DISCOUNT_RATE: (percent) => `${percent}% discount!`,
    COIN_PRICE: (price) => `USD ${price}`,
  },
};

export const LocalizedStrings = TRANSLATIONS[LANGUAGE] || TRANSLATIONS['en'];
