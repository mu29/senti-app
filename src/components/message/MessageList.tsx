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
  private listRef = React.createRef<FlatList<string>>();

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
    const { messageIds } = this.props.messageState!;

    return (
      <FlatList
        ref={this.listRef}
        data={messageIds}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  private renderItem = ({ item }: { item: string }) => (
    <MessageItem messageId={item} />
  )

  private keyExtractor = (item: string) => `message-${item}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});

export default MessageList;
