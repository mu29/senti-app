import { LANGUAGE } from './config';

const TRANSLATIONS: {
  [key: string]: {
    // 일반
    COMMON_ERROR: string;
    COMMON_LOADING: string;
    COMMON_CANCEL: string;
    COMMON_SAVE: string;
    // 화면 이름
    SCREEN_PROFILE: string;
    // 오류
    ERROR_VIEW_TITLE: string;
    ERROR_VIEW_MESSAGE: (message: string) => string;
    ERROR_VIEW_REFRESH_BUTTON: string;
    // 계정
    LOGIN_TITLE: string;
    LOGIN_WITH_FACEBOOK: string;
    LOGIN_WITH_GOOGLE: string;
    LOGIN_AGREEMENT_MESSAGE: string;
    MY_STORIES: string;
    PROFILE_EDIT: string;
    PROFILE_ACCOUNT: string;
    PROFILE_NAME: string;
    PROFILE_PHOTO_CHANGE_BUTTON: string;
    PROFILE_PHOTO_CHANGE_FAILURE: (message: string) => string;
    PROFILE_LOGOUT_BUTTON: string;
    GENDER_SELECT_MODAL: string;
    GENDER_MALE: string;
    GENDER_FEMALE: string;
    GENDER_NONE: string;
    // 지원
    SETTINGS_TITLE: string;
    SETTINGS_REPORT_PROBLEM: string;
    SETTINGS_REPORT_FAILURE_TITLE: string;
    SETTINGS_REPORT_FAILURE_MESSAGE: (message: string) => string;
    SETTINGS_TERMS_BUTTON: string;
    // 채팅
    CHATTING_EMPTY_MESSAGE: string;
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
    COMMON_ERROR: '오류',
    COMMON_LOADING: '로딩 중..',
    COMMON_CANCEL: '취소',
    COMMON_SAVE: '저장',
    // 화면 이름
    SCREEN_PROFILE: '프로필',
    // 오류
    ERROR_VIEW_TITLE: '일시적인 오류입니다.',
    ERROR_VIEW_MESSAGE: (message) => `아래 버튼을 눌러 다시 시도할 수 있습니다.\n문제가 반복된다면 저희에게 알려 주세요.\n\n${message}`,
    ERROR_VIEW_REFRESH_BUTTON: '새로고침',
    // 계정
    LOGIN_TITLE: '로그인하고 모든 기능을 사용하세요!',
    LOGIN_WITH_FACEBOOK: '페이스북으로 시작하기',
    LOGIN_WITH_GOOGLE: '구글 계정으로 시작하기',
    LOGIN_AGREEMENT_MESSAGE: '로그인하시면 이용약관 및 개인정보처리방침에\n동의하는 것으로 간주합니다.',
    MY_STORIES: '나의 이야기',
    PROFILE_EDIT: '정보 관리',
    PROFILE_ACCOUNT: '계정',
    PROFILE_NAME: '닉네임',
    PROFILE_PHOTO_CHANGE_BUTTON: '프로필 사진 변경',
    PROFILE_PHOTO_CHANGE_FAILURE: (message) => `프로필 사진 변경에 실패했습니다.\n${message}`,
    PROFILE_LOGOUT_BUTTON: '로그아웃',
    GENDER_SELECT_MODAL: '성별을 선택하세요',
    GENDER_MALE: '남성',
    GENDER_FEMALE: '여성',
    GENDER_NONE: '성별',
    // 설정
    SETTINGS_TITLE: '지원',
    SETTINGS_REPORT_PROBLEM: '건의 & 불편 신고',
    SETTINGS_REPORT_FAILURE_TITLE: '알림',
    SETTINGS_REPORT_FAILURE_MESSAGE: (message) => `메일 작성에 실패했습니다.\n${message}`,
    SETTINGS_TERMS_BUTTON: '이용약관 및 개인정보처리방침',
    // 채팅
    CHATTING_EMPTY_MESSAGE: '이야기에 답변해\n새로운 대화를 시작해 보세요.',
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
    COMMON_ERROR: 'Error',
    COMMON_LOADING: 'Now Loading..',
    COMMON_CANCEL: 'Cancel',
    COMMON_SAVE: 'Save',
    // 화면 이름
    SCREEN_PROFILE: 'Profile',
    // 오류
    ERROR_VIEW_TITLE: 'Temporary Error',
    ERROR_VIEW_MESSAGE: (message) => `Try again by press Refresh button.\nIf the error occurs constantly, please report us.\n\n${message}`,
    ERROR_VIEW_REFRESH_BUTTON: 'Refresh',
    // 계정
    LOGIN_TITLE: 'Log in to use all features!',
    LOGIN_WITH_FACEBOOK: 'Log in with Facebook',
    LOGIN_WITH_GOOGLE: 'Log in with Google',
    LOGIN_AGREEMENT_MESSAGE: 'By logging in, you agree to the following terms and conditions.',
    MY_STORIES: 'My Stories',
    PROFILE_EDIT: 'Edit Profile',
    PROFILE_ACCOUNT: 'Account',
    PROFILE_NAME: 'Nickname',
    PROFILE_PHOTO_CHANGE_BUTTON: 'Change Profile Photo',
    PROFILE_PHOTO_CHANGE_FAILURE: (message) => `Failed to change profile photo.\n${message}`,
    PROFILE_LOGOUT_BUTTON: 'Log Out',
    GENDER_SELECT_MODAL: 'Select your gender',
    GENDER_MALE: 'Male',
    GENDER_FEMALE: 'Female',
    GENDER_NONE: 'Gender',
    // 설정
    SETTINGS_TITLE: 'Support',
    SETTINGS_REPORT_PROBLEM: 'Report a problem',
    SETTINGS_REPORT_FAILURE_TITLE: 'Report',
    SETTINGS_REPORT_FAILURE_MESSAGE: (message) => `Failed to report problem.\n${message}`,
    SETTINGS_TERMS_BUTTON: 'Terms and Conditions / Privacy Policy',
    // 채팅
    CHATTING_EMPTY_MESSAGE: 'Start new chatting by respond to the story!',
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
