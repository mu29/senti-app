import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
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
  storyState?: StoryState;
}

@inject('storyState')
@observer
class CompactStoryItem extends React.Component<CompactStoryItemProps> {
  public render() {
    if (!this.story) {
      return null;
    }

    const {
      cover,
      description,
    } = this.story;

    return (
      <Button>
        <CachableImage source={{ uri: cover }} style={styles.image} permanent />
        <View style={styles.filter}>
          <Text style={styles.description}>
            {description.replace(/#[^ ]+/g, '').trim()}
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
}

const styles = StyleSheet.create({
  image: {
    height: 128,
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: palette.transparent.black[40],
  },
  description: {
    color: palette.gray[10],
    fontSize: 12,
  },
});

export default CompactStoryItem;
