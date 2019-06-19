import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import {
  LoadingIndicator,
  ChattingItem,
  ChattingEmptyList,
} from 'components';
import {
  subscribeChattingsAction,
  unsubscribeChattingsAction,
} from 'stores/actions';
import { ChattingState } from 'stores/states';
import { LoadingType } from 'constants/enums';

export interface ChattingListProps {
  chattingState?: ChattingState;
}

@inject('chattingState')
@observer
class ChattingList extends React.Component<ChattingListProps> {
  public componentDidMount() {
    subscribeChattingsAction();
  }

  public componentWillUnmount() {
    unsubscribeChattingsAction();
  }

  public render() {
    const {
      chattings,
      isLoading,
      isInitialLoaded,
    } = this.props.chattingState!;

    if (chattings.length === 0 && isInitialLoaded) {
      return <ChattingEmptyList />;
    }

    return (
      <FlatList
        data={chattings.slice()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ListFooterComponent={isLoading === LoadingType.LIST ? <LoadingIndicator /> : null}
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
