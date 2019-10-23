import React, {
  useMemo,
  useCallback,
} from 'react';
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
import { LayoutService } from 'services';

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
  const itemSize = useMemo(() => LayoutService.screenWidth / 3, []);

  const renderItem = useCallback(({ item, index }: { item: Story; index: number }) => (
    <CompactStoryItem item={item} index={index} />
  ), []);

  return (
    <React.Fragment>
      {/*
      // @ts-ignore */}
      <FlatGrid
        itemDimension={itemSize}
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
