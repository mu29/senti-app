import React, { useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Text,
  Button,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

const COIN_ICON = { uri: 'ic_coin' };

const HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

interface Props {
  amount: number;
  showModal: () => void;
}

const CoinInventory: React.FunctionComponent<Props> = ({
  amount,
  showModal,
}) => {
  const onPress = useCallback(() => {
    showModal();
    AnalyticsService.logEvent('show_coin_modal');
  }, [showModal]);

  return (
    <View style={styles.container}>
      <Image source={COIN_ICON} style={styles.icon} />
      <View style={styles.divider} />
      <Text style={[typography.heading3, styles.amount]}>
        {LocalizedStrings.COIN_COUNT(amount)}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 16,
    borderRadius: 4,
    backgroundColor: palette.gray[100],
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: palette.yellow.default,
  },
  amount: {
    marginTop: Platform.select({
      ios: 2,
      android: 0,
    }),
    marginRight: 'auto',
  },
  divider: {
    width: 1,
    height: '100%',
    marginHorizontal: 14,
    backgroundColor: palette.gray[90],
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

export default React.memo(CoinInventory);
