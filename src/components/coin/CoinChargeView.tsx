import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Text } from 'components';

interface Props {
  items: string[];
}

const CoinChargeView: React.FunctionComponent<Props> = ({
  items,
}) => {
  const renderItem = useCallback(({ item }) => (
    <Text>
      {item}
    </Text>
  ), []);

  const keyExtractor = (item: string) => `coin-${item}`;

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default React.memo(CoinChargeView);
