import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { inject } from 'mobx-react/native';
import moment from 'moment';
import { Text } from 'components';
import {
  AuthState,
  StoryState,
} from 'stores/states';
import {
  replayStoryAction,
  showAuthModalAction,
  showReplyModalAction,
  pauseStoryAction,
} from 'stores/actions';
import {
  palette,
  typography,
} from 'constants/style';

const HIT_SLOP = {
  top: 16,
  bottom: 16,
};

interface StoryControllerProps {
  story: Story;
  authState?: AuthState;
  storyState?: StoryState;
}

@inject('authState', 'storyState')
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
          <Text style={[typography.heading3, styles.name]}>
            {story.user.name}
          </Text>
          <Text style={styles.date}>
            {moment(story.createdAt).fromNow()}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={HIT_SLOP}
          onPress={replayStoryAction}
        >
          <Image source={{ uri: 'ic_replay' }} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={HIT_SLOP}
          onPress={this.openReplyModal}
        >
          <Image source={{ uri: 'ic_chat_active' }} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  }

  private openReplyModal = () => {
    const { authState } = this.props;

    if (!authState!.isLoggedIn) {
      showAuthModalAction();
      return;
    }

    pauseStoryAction();
    showReplyModalAction();
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingRight: 8,
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
  },
  date: {
    color: palette.gray[30],
    fontSize: 12,
  },
  icon: {
    width: 28,
    height: 28,
    marginHorizontal: 16,
    tintColor: palette.gray[10],
  },
});

export default StoryController;
