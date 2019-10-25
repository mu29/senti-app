import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import { FlatGrid } from 'react-native-super-grid';
import {
  LoadingBar,
  CompactStoryItem,
} from 'components';
import { SCREEN_WIDTH } from 'constants/config';

const ITEM_SIZE = SCREEN_WIDTH / 3;

const SAFE_AREA_INSET: {
  bottom: SafeAreaViewForceInsetValue;
} = {
  bottom: 'always',
};

interface Props {
  items: Story[];
  isLoading: boolean;
  isRefreshing: boolean;
  onFetchMore: () => void;
  onRefresh: () => void;
}

const StoryGrid: React.FunctionComponent<Props> = ({
  items,
  isLoading,
  isRefreshing,
  onFetchMore,
  onRefresh,
}) => {
  const renderItem = useCallback(({ item, index }: { item: Story; index: number }) => (
    <CompactStoryItem item={item} index={index} />
  ), []);

  return (
    <React.Fragment>
      {/*
      // @ts-ignore */}
      <FlatGrid
        itemDimension={ITEM_SIZE}
        spacing={0}
        items={items}
        renderItem={renderItem}
        onEndReached={onFetchMore}
        onEndReachedThreshold={1}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        contentContainerStyle={styles.container}
      />
      <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.loading}>
        <LoadingBar isVisible={isLoading} />
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  container: {
    paddingBottom: 50,
  },
});

export default React.memo(StoryGrid);
