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
  partnerId: string;
  messageState?: MessageState;
}

@inject('messageState')
@observer
class MessageList extends React.Component<MessageListProps> {
  private listRef = React.createRef<FlatList<Message>>();

  public componentDidMount() {
    const {
      chattingId,
      partnerId,
    } = this.props;

    subscribeMessagesAction(chattingId, partnerId);
    if (this.listRef.current) {
      this.listRef.current.scrollToEnd();
    }
  }

  public componentWillUnmount() {
    unsubscribeMessagesAction();
  }

  public render() {
    const { messages } = this.props.messageState!;

    return (
      <FlatList
        ref={this.listRef}
        data={messages}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  private renderItem = ({ index }: { index: number }) => (
    <MessageItem index={index} />
  )

  private keyExtractor = (item: Message) => `message-${item.id}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});

export default MessageList;
