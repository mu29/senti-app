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

const MESSAGE_ITEM_HEIGHT = 72;

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
        getItemLayout={this.getItemLayout}
        onContentSizeChange={this.scrollToEnd}
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

  private getItemLayout = (_: any, index: number) => ({
    length: MESSAGE_ITEM_HEIGHT,
    offset: (MESSAGE_ITEM_HEIGHT * index),
    index,
  })

  private scrollToEnd = () => {
    const { messageIds } = this.props.messageState!;

    if (this.listRef.current && messageIds.length > 0) {
      this.listRef.current.scrollToIndex({
        index: messageIds.length - 1,
        viewPosition: 1,
        viewOffset: -16,
        animated: false,
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});

export default MessageList;
