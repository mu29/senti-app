import React from 'react';
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
import {
  inject,
  observer,
} from 'mobx-react/native';
import imageCacheHoc from 'react-native-image-cache-hoc';
import {
  Text,
  Button,
} from 'components';
import { StoryState } from 'stores/states';
import { palette } from 'constants/style';

const CachableImage = imageCacheHoc(Image, {
  fileDirName: 'covers',
  cachePruneTriggerLimit: 1024 * 1024 * 50,
});

interface CompactStoryItemProps {
  storyId: string;
  index: number;
  storyState?: StoryState;
}

@inject('storyState')
@observer
class CompactStoryItem extends React.Component<CompactStoryItemProps & NavigationInjectedProps> {
  public render() {
    if (!this.story) {
      return null;
    }

    const {
      cover,
      message,
    } = this.story;

    return (
      <Button onPress={this.openMyStoryScreen}>
        <CachableImage source={{ uri: cover }} style={styles.image} permanent />
        <View style={styles.filter}>
          <Text style={styles.message}>
            {message.replace(/#[^ ]+/g, '').trim()}
          </Text>
        </View>
      </Button>
    );
  }

  private get story() {
    const {
      storyId,
      storyState,
    } = this.props;

    return storyState!.stories[storyId] || {};
  }

  private openMyStoryScreen = () => {
    const {
      navigation,
      index,
    } = this.props;

    navigation.navigate('MyStory', { index });
  }
}

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
    color: palette.gray[10],
    fontSize: 12,
  },
});

export default withNavigation(CompactStoryItem);
