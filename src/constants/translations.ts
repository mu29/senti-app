import { LANGUAGE } from './config';

const TRANSLATIONS: {
  [key: string]: {
    // 일반
    COMMON_ERROR_TITLE: string;
    // 채팅
    CHATTING_MESSAGE_COUNT: (count: string) => string;
    // 코인
    COIN_COUNT: (coin: number) => string;
    COIN_CHARGE_BUTTON: string;
    COIN_DISCOUNT_RATE: (percent: string) => string;
    COIN_PRICE: (price: string) => string;
    COIN_CHARGE_TAB: string;
    COIN_HISTORY_TAB: string;
    COIN_PURCHASE_SUCCSS_TITLE: string;
    COIN_PURCHASE_SUCCSS_MESSAGE: string;
    TRANSACTION_DATE_FORMAT: string;
  };
} = {
  ko: {
    // 일반
    COMMON_ERROR_TITLE: '오류',
    // 채팅
    CHATTING_MESSAGE_COUNT: (count) => `메시지 ${count}개`,
    // 코인
    COIN_COUNT: (amount) => `${amount}코인`,
    COIN_CHARGE_BUTTON: '충전',
    COIN_DISCOUNT_RATE: (percent) => `${percent}% 할인!`,
    COIN_PRICE: (price) => `${price}원`,
    COIN_CHARGE_TAB: '코인 충전',
    COIN_HISTORY_TAB: '사용 내역',
    COIN_PURCHASE_SUCCSS_TITLE: '구매 완료',
    COIN_PURCHASE_SUCCSS_MESSAGE: '코인을 구매했습니다.',
    TRANSACTION_DATE_FORMAT: 'YYYY년 M월 D일 HH시',
  },
  en: {
    // 일반
    COMMON_ERROR_TITLE: 'Error',
    // 채팅
    CHATTING_MESSAGE_COUNT: (count) => `${count} messages`,
    // 코인
    COIN_COUNT: (amount) => `${amount} Coin${amount > 1 ? 's' : ''}`,
    COIN_CHARGE_BUTTON: 'Charge',
    COIN_DISCOUNT_RATE: (percent) => `${percent}% discount!`,
    COIN_PRICE: (price) => `USD ${price}`,
    COIN_CHARGE_TAB: 'Charge',
    COIN_HISTORY_TAB: 'History',
    COIN_PURCHASE_SUCCSS_TITLE: '',
    COIN_PURCHASE_SUCCSS_MESSAGE: '',
    TRANSACTION_DATE_FORMAT: '',
  },
};

export const LocalizedStrings = TRANSLATIONS[LANGUAGE] || TRANSLATIONS['en'];
