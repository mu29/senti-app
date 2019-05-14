import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChattingItem } from 'components';

export interface ChattingListProps {
  data: Chatting[];
}

class ChattingList extends React.PureComponent<ChattingListProps> {
  public render() {
    const { data } = this.props;

    return (
      <FlatList
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={styles.container}
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
