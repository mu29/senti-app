import React from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import { MessageItem } from 'components';
import { ChattingState } from 'stores/states';
import { palette } from 'constants/style';

const REFRESH_CONTROL_COLORS = [palette.gray[40]];

export interface MessageListProps {
  chattingState?: ChattingState;
}

const messages = [{
  id: 'tLvYHFfl0vZBV2vMpoTe',
  audio: {
    duration: 4284.221545952526,
    id: 't1tcTF9bKhYjvGTsN5W2',
    url: 'https://firebasestorage.googleapis.com/v0/b/senti-ee110.appspot.com/o/audios%2F584fdc0d-78e2-4a99-be29-f2d8b9588f7a.aac?alt=media&token=52f65c9a-ac34-4f69-94c2-7119cfa223c8',
  },
  user: {
    id: 'yMW6G3HBLPPSXljOwikljP5ZIuE2',
    name: '정인중',
    photoUrl: 'https://lh5.googleusercontent.com/-mOasNAEjgEw/AAAAAAAAAAI/AAAAAAAAAUQ/7kfZ1OG3D0Y/s96-c/photo.jpg',
  },
  createdAt: 1559518197225,
}, {
  id: 'A6IA95ZpB80CkmK7VLou',
  audio: {
    duration: 3310.3933975240716,
    id: 'RoUOFcd1UhYctREzE10M',
    url: 'https://firebasestorage.googleapis.com/v0/b/senti-ee110.appspot.com/o/audios%2Fc152b8b6-90bb-41b5-86c5-f5e5206e5f6f.aac?alt=media&token=2069cf08-fddb-4330-9031-cc64cf66bd1a',
  },
  user: {
    id: 'YrN1zpsOVdQWDx5D1hRWN7otkOG3',
    name: '정인중',
    photoUrl: 'https://graph.facebook.com/2838152166259233/picture',
  },
  createdAt: 1559520591476,
}];

class MessageList extends React.Component<MessageListProps> {
  public render() {
    return (
      <FlatList
        data={messages}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  private renderItem = ({ item, index }: { item: Message; index: number }) => (
    <MessageItem index={index} message={item} />
  )

  private keyExtractor = (item: Message) => `message-${item.id}`;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
});

export default MessageList;
