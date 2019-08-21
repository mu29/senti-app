import React, { useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { Text } from 'components';
import { SoundService } from 'services';
import {
  palette,
  typography,
} from 'constants/style';

const HIT_SLOP = {
  top: 16,
  bottom: 16,
};

const REPLAY_ICON = { uri: 'ic_replay' };

const REPLY_ICON = { uri: 'ic_chat_active' };

export interface Props {
  item: Story;
  openReplyModal: () => void;
}

const StoryController: React.FunctionComponent<Props> = ({
  item: {
    user: {
      photoUrl,
      name,
    },
    createdAt,
  },
  openReplyModal,
}) => {
  const photoImage = useMemo(() => ({ uri: photoUrl || '' }), [photoUrl]);

  return (
    <View style={styles.container}>
      <Image
        source={photoImage}
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
        onPress={SoundService.replay}
      >
        <Image source={REPLAY_ICON} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        hitSlop={HIT_SLOP}
        onPress={openReplyModal}
      >
        <Image source={REPLY_ICON} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

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

export default React.memo(StoryController);
