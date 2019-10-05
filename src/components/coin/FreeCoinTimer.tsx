import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Text,
  Button,
} from 'components';
import { useAppState } from 'containers';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';
import { AnalyticsService } from 'services';
import { numberPad } from 'utils';

const HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

interface Props {
  canUseFreeCoinAt: number;
  showModal: () => void;
}

const FreeCoinTimer: React.FunctionComponent<Props> = ({
  canUseFreeCoinAt,
  showModal,
}) => {
  const [counter, setCounter] = useState(0);

  const onPress = useCallback(() => {
    showModal();
    AnalyticsService.logEvent('show_coin_modal');
  }, [showModal]);

  useAppState(() => {
    setCounter((canUseFreeCoinAt - Date.now()) / 1000);
  });

  useEffect(() => {
    setCounter((canUseFreeCoinAt - Date.now()) / 1000);
  }, [canUseFreeCoinAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(counter / 60);
  const seconds = Math.floor(counter % 60);

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Icon name="md-time" size={20} color={palette.yellow.default} style={styles.timerIcon} />
        <View style={styles.divider} />
        <Text style={[typography.heading3, styles.counter]}>
          {counter < 0
            ? LocalizedStrings.FREE_COIN_AVAILABLE
            : LocalizedStrings.FREE_COIN_TIME_LEFT(numberPad(minutes), numberPad(seconds))
          }
        </Text>
        <Button
          hitSlop={HITSLOP}
          onPress={onPress}
          style={styles.button}
        >
          <Text style={styles.shop}>
            {LocalizedStrings.COIN_CHARGE_BUTTON}
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    padding: 16,
    backgroundColor: palette.gray[90],
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: palette.gray[100],
  },
  timerIcon: {
    marginTop: Platform.select({
      ios: 2,
      android: 0,
    }),
  },
  divider: {
    width: 1,
    height: '100%',
    marginHorizontal: 14,
    backgroundColor: palette.gray[90],
  },
  counter: {
    marginTop: Platform.select({
      ios: 2,
      android: 0,
    }),
    marginRight: 'auto',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    backgroundColor: palette.gray[90],
  },
  shop: {
    color: palette.gray[10],
    fontSize: 12,
  },
});

export default FreeCoinTimer;
