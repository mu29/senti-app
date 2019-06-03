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
import {
  ChattingItem,
  ChattingEmptyList,
} from 'components';
import { ChattingState } from 'stores/states';
import {
  readChattingsAction,
  refreshChattingsAction,
} from 'stores/actions';
import { LoadingType } from 'constants/enums';
import { palette } from 'constants/style';

const REFRESH_CONTROL_COLORS = [palette.gray[40]];

export interface ChattingListProps {
  chattingState?: ChattingState;
}

@inject('chattingState')
@observer
class ChattingList extends React.Component<ChattingListProps> {
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
        onEndReached={readChattingsAction}
        refreshControl={(
          <RefreshControl
            colors={REFRESH_CONTROL_COLORS}
            tintColor={palette.gray[40]}
            refreshing={isLoading === LoadingType.REFRESH}
            onRefresh={refreshChattingsAction}
          />
        )}
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
