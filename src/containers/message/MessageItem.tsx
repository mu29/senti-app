import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import firebase from 'react-native-firebase';
import {
  useQuery,
  useLazyQuery,
} from '@apollo/react-hooks';
import { MessageItem } from 'components';
import {
  FETCH_PROFILE,
  FETCH_AUDIO,
} from 'graphqls';

interface Props {
  item: Message;
}

const Container: React.FunctionComponent<Props> = ({
  item,
}) => {
  const { data: profile } = useQuery<{ me: Profile }>(FETCH_PROFILE, {
    skip: !firebase.auth().currentUser,
    fetchPolicy: 'cache-only',
  });

  const [loadAudio, { loading, error }] = useLazyQuery(FETCH_AUDIO, {
    variables: {
      id: item.audio.id,
    },
  });

  useEffect(() => {
    if (error) {
      Alert.alert('오류', `메시지 재생에 실패했습니다.\n${error.message}`);
    }
  }, [error]);

  if (!profile || !profile.me) {
    return null;
  }

  return (
    <MessageItem
      item={item}
      userId={profile.me.id}
      isLoading={loading}
      loadAudio={loadAudio}
    />
  );
};

export default React.memo(Container);
