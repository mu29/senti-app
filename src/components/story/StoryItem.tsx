import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useAnimation } from 'react-native-animation-hooks';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import {
  Text,
  CachableImage,
} from 'components';
import {
  useAudio,
  StoryController,
} from 'containers';
import { palette } from 'constants/style';
import { AnalyticsService } from 'services';

const {
  width: deviceWidth,
  height: deviceHeight,
} = Dimensions.get('window');

const PLAY_ICON = { uri: 'ic_play_active' };

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'never',
  bottom: 'always',
};

interface Props {
  item: Story;
  index: number;
  animatedValue: Animated.Value;
  hasBottom?: boolean;
}

const StoryItem: React.FunctionComponent<Props> = ({
  item,
  index,
  animatedValue,
  hasBottom,
}) => {
  const parallexStyle = useMemo(() => ({
    transform: [{
      translateY: animatedValue!.interpolate({
        inputRange: [
          (index - 1) * deviceHeight,
          index * deviceHeight,
          (index + 1) * deviceHeight,
        ],
        outputRange: [-deviceHeight * 0.5, 0, deviceHeight * 0.5],
        extrapolate: 'clamp',
      }),
    }],
  }), [animatedValue, index]);

  const Tags = useMemo(() => {
    return item.tags
      .map(tag => `#${tag}`)
      .map((tag: string, i: number) => (
        <Text key={`${tag}-${i}`} style={styles.tag}>
          {tag}
        </Text>
      ));
  }, [item]);

  return (
    <View style={styles.container}>
      <Animated.View style={parallexStyle}>
        <CachableImage prefix="covers" source={item.cover} style={styles.background} />
      </Animated.View>
      <View style={styles.filter}>
        <View style={styles.content}>
          <View style={styles.tags}>
            {Tags}
          </View>
        </View>
        <StoryController item={item} hasBottom={hasBottom} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
  },
  background: {
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: palette.gray[100],
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.transparent.black[40],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 48,
    paddingTop: 32,
  },
  tag: {
    margin: 4,
    color: palette.gray[10],
    fontSize: 18,
  },
  controller: {
    alignSelf: 'stretch',
  },
  bottomSpace: {
    marginBottom: 48,
  },
  iconContainer: {
    position: 'absolute',
    paddingTop: 32,
  },
  icon: {
    width: 48,
    height: 48,
    tintColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default React.memo(StoryItem);
