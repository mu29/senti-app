import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { inject } from 'mobx-react/native';
import moment from 'moment';
import { Text } from 'components';
import {
  AuthState,
  StoryState,
} from 'stores/states';
import {
  replayAudioAction,
  showAuthModalAction,
  showReplyModalAction,
  pauseAudioAction,
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
  item: Story;
  style?: StyleProp<ViewStyle>;
  authState?: AuthState;
  storyState?: StoryState;
}

@inject('authState', 'storyState')
class StoryController extends React.Component<StoryControllerProps> {
  public render() {
    const {
      item: {
        user: {
          photoUrl,
          name,
        },
        createdAt,
      },
      style,
    } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Image
          source={{ uri: photoUrl || '' }}
          style={styles.photo}
        />
        <View style={styles.profile}>
          <Text style={[typography.heading3, styles.name]}>
            {name}
          </Text>
          <Text style={styles.date}>
            {moment(createdAt).fromNow()}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={HIT_SLOP}
          onPress={replayAudioAction}
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

    pauseAudioAction();
    showReplyModalAction();
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingRight: 8,
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
