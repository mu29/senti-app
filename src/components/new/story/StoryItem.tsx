import React, { useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NewStoryController } from 'containers';
import { palette } from 'constants/style';

const {
  width: deviceWidth,
} = Dimensions.get('window');

interface Props {
  item: Story;
}

const StoryItem: React.FunctionComponent<Props> = ({
  item,
}) => {
  const coverImage = useMemo(() => ({ uri: item.cover }), [item]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={coverImage} style={styles.cover} />
        <NewStoryController item={item} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 48,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.000001)',
  },
  card: {
    alignItems: 'center',
    margin: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.gray[90],
    backgroundColor: palette.gray[100],
  },
  cover: {
    width: deviceWidth - 80,
    height: deviceWidth - 80,
    marginTop: 16,
    borderRadius: 12,
  },
});

export default StoryItem;
