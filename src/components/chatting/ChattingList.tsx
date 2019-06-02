import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import { ChattingItem } from 'components';
import { ChatStore } from 'stores';

export interface ChattingListProps {
  chatStore?: ChatStore;
}

@inject('chatStore')
@observer
class ChattingList extends React.Component<ChattingListProps> {
  public componentDidMount() {
    this.props.chatStore!.readChattings();
  }

  public render() {
    const {
      chattings,
      readChattings,
    } = this.props.chatStore!;

    return (
      <FlatList
        data={chattings.slice()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onEndReached={readChattings}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  private renderItem = ({ item }: { item: Chatting }) => (
    <ChattingItem chatting={item} />
  )

  private keyExtractor = (item: Chatting) => `Chatting-${item.id}`;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
});

export default ChattingList;
