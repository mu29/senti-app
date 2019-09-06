import { TextStyle } from 'react-native';

export const palette = {
  gray: {
    100: '#1A1A1A',
    90: '#2D2D2D',
    80: '#3A3A3A',
    70: '#515151',
    60: '#757575',
    50: '#9E9E9E',
    40: '#A2A2A2',
    30: '#BDBDBD',
    20: '#E0E0E0',
    10: '#EEEEEE',
  },
  white: {
    default: '#FFFFFF',
  },
  black: {
    default: '#000000',
  },
  yellow: {
    default: '#F9D14C',
  },
  orange: {
    default: '#F28523',
  },
  red: {
    default: '#CA392E',
  },
  transparent: {
    black: {
      20: 'rgba(0, 0, 0, 0.2)',
      40: 'rgba(0, 0, 0, 0.4)',
      60: 'rgba(0, 0, 0, 0.6)',
      80: 'rgba(0, 0, 0, 0.8)',
    },
    red: {
      default: 'rgba(202, 57, 46, 0.5)',
    },
  },
  brand: {
    facebook: '#4B68AD',
    google: '#D55040',
  },
};

export const typography: {
  [key: string]: TextStyle;
} = {
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.gray[10],
  },
  heading2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: palette.gray[20],
  },
  heading3: {
    fontSize: 15,
    fontWeight: 'bold',
    color: palette.gray[20],
  },
  heading4: {
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.gray[20],
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    color: palette.gray[30],
  },
  body2: {
    fontSize: 15,
    lineHeight: 21,
    color: palette.gray[30],
  },
  tiny2: {
    fontSize: 14,
    color: palette.gray[50],
  },
  tiny3: {
    fontSize: 12,
    color: palette.gray[50],
  },
  tiny4: {
    fontSize: 11,
    color: palette.gray[50],
  },
};
