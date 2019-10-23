import React, { useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
 } from 'react-navigation';
import {
  NewStoryProfile,
  NewStoryController,
} from 'containers';
import { palette } from 'constants/style';

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'always',
  bottom: 'never',
};

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
    <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
      <View style={styles.image}>
        <Image source={coverImage} style={styles.cover} />
      </View>
      <NewStoryProfile item={item} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 24,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    width: deviceWidth - 48,
    height: 256,
    borderRadius: 12,
  },
});

export default StoryItem;
