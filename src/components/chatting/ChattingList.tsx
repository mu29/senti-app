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
import { ChattingState } from 'stores/states';
import { readChattingsAction } from 'stores/actions';

export interface ChattingListProps {
  chattingState?: ChattingState;
}

@inject('chattingState')
@observer
class ChattingList extends React.Component<ChattingListProps> {
  public componentDidMount() {
    readChattingsAction();
  }

  public render() {
    const { chattings } = this.props.chattingState!;

    return (
      <FlatList
        data={chattings.slice()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        onEndReached={readChattingsAction}
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
