import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { Text } from 'components';
import { StoryStore } from 'stores';
import { palette } from 'constants/style';

interface StoryControllerProps {
  story: Story;
  storyStore?: StoryStore;
}

class StoryController extends React.Component<StoryControllerProps> {
  public render() {
    const { story } = this.props;

    return (
      <View style={styles.container}>
        <Image
          source={{ uri: story.user.photoUrl || '' }}
          style={styles.photo}
        />
        <View style={styles.profile}>
          <Text style={styles.name}>
            {story.user.name}
          </Text>
          <Text style={styles.date}>
            {moment(story.createdAt.seconds * 1000).fromNow()}
          </Text>
        </View>
        <TouchableOpacity>
          <Image source={{ uri: 'ic_replay' }} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={{ uri: 'ic_chat_active' }} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    marginBottom: 48,
  },
  photo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.gray[10],
  },
  profile: {
    flex: 1,
  },
  name: {
    marginBottom: 2,
    color: palette.gray[10],
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    color: palette.gray[30],
    fontSize: 12,
  },
  icon: {
    width: 28,
    height: 28,
    marginLeft: 24,
    tintColor: palette.gray[10],
  },
});

export default StoryController;
