import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Text } from 'components';
import {
  palette,
  typography,
} from 'constants/style';

const COIN_ICON = { uri: 'ic_coin' };

const HITSLOP = {
  top: 16,
  bottom: 16,
  left: 10,
  right: 10,
};

const CoinInventory: React.FunctionComponent<{}> = () => (
  <View style={styles.container}>
    <Image source={COIN_ICON} style={styles.icon} />
    <View style={styles.divider} />
    <Text style={[typography.heading3, styles.amount]}>
      16코인
    </Text>
    <TouchableOpacity
      activeOpacity={0.8}
      hitSlop={HITSLOP}
      style={styles.button}
    >
      <Text style={styles.shop}>
        충전
      </Text>
    </TouchableOpacity>
  </View>
);

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
  },
  divider: {
    width: 1,
    height: '100%',
    marginHorizontal: 14,
    backgroundColor: palette.gray[90],
  },
  button: {
    marginLeft: 'auto',
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

export default CoinInventory;
