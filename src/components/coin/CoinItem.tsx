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
import { palette } from 'constants/style';

const COIN_ICON = { uri: 'ic_coin' };

interface Props {
  item: Coin;
  purchase: (productId: string) => void;
}

const CoinItem: React.FunctionComponent<Props> = ({
  item: {
    id,
    amount,
    price,
    retailPrice,
    currency,
  },
  purchase,
}) => {
  const onPress = useCallback(() => {
    purchase(id);
  }, [id]);

  return (
    <View style={styles.container}>
      <Button onPress={onPress} style={styles.button}>
        <Image source={COIN_ICON} style={styles.icon} />
        <Text style={styles.amount}>
          {amount}
        </Text>
        <View style={styles.price}>
          <View style={styles.discount}>
            <Text style={styles.discountPercent}>
              {((1 - retailPrice / price) * 100).toFixed(1)}% 할인!
            </Text>
            <Text style={styles.originalPrice}>
              {price.toLocaleString()}원
            </Text>
          </View>
          <Text style={styles.retailPrice}>
            {currency} {retailPrice.toLocaleString()}
          </Text>
        </View>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 10,
    padding: 1,
    backgroundColor: palette.gray[80],
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: palette.gray[90],
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: palette.yellow.default,
  },
  amount: {
    marginLeft: 4,
    marginRight: 'auto',
    paddingTop: Platform.select({
      ios: 4,
      android: 0,
    }),
    fontSize: 24,
    fontWeight: 'bold',
    color: palette.yellow.default,
  },
  price: {
    alignItems: 'flex-end',
  },
  discount: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  discountPercent: {
    marginRight: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: palette.yellow.default,
  },
  originalPrice: {
    fontSize: 12,
    color: palette.gray[50],
    textDecorationLine: 'line-through',
  },
  retailPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.gray[10],
  },
});

export default React.memo(CoinItem);
