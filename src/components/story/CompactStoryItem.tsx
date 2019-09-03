import React, {
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import imageCacheHoc from 'react-native-image-cache-hoc';
import {
  Text,
  Button,
} from 'components';
import { palette } from 'constants/style';

const CachableImage = imageCacheHoc(Image, {
  fileDirName: 'covers',
  cachePruneTriggerLimit: 1024 * 1024 * 50,
});

interface Props extends NavigationInjectedProps {
  item: Story;
  index: number;
}

const CompactStoryItem: React.FunctionComponent<Props> = ({
  item: {
    cover,
    message,
  },
  index,
  navigation,
}) => {
  const coverImage = useMemo(() => ({ uri: cover }), [cover]);

  const openMyStoryScreen = useCallback(() => {
    navigation.navigate('MyStory', { index });
  }, []);

  return (
    <Button onPress={openMyStoryScreen}>
      <CachableImage source={coverImage} style={styles.image} permanent />
      <View style={styles.filter}>
        <Text style={styles.message}>
          {message.trim()}
        </Text>
      </View>
    </Button>
  );
};

const styles = StyleSheet.create({
  image: {
    height: Dimensions.get('window').width / 2,
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: palette.transparent.black[40],
  },
  message: {
    textAlign: 'center',
    color: palette.gray[10],
    fontSize: 12,
  },
});

export default withNavigation(React.memo(CompactStoryItem));
