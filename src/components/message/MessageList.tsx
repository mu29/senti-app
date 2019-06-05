import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import { MessageItem } from 'components';
import { MessageState } from 'stores/states';
import {
  subscribeMessagesAction,
  unsubscribeMessagesAction,
} from 'stores/actions';

export interface MessageListProps {
  chattingId: string;
  messageState?: MessageState;
}

@inject('messageState')
@observer
class MessageList extends React.Component<MessageListProps> {
  public componentDidMount() {
    subscribeMessagesAction(this.props.chattingId);
  }

  public componentWillUnmount() {
    unsubscribeMessagesAction();
  }

  public render() {
    const { messages } = this.props.messageState!;

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
