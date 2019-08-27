import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useLazyQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  TagList,
} from 'components';
import { FETCH_POPULAR_TAGS } from 'graphqls';

const TagListContainer: React.FunctionComponent<{}> = () => {
  const [fetchPopularTags, {
    data,
    networkStatus,
    error,
    refetch,
  }] = useLazyQuery(FETCH_POPULAR_TAGS, {
    notifyOnNetworkStatusChange: true,
  });

  if ([NetworkStatus.loading, NetworkStatus.refetch].includes(networkStatus)) {
    return <LoadingView />;
  }

  if (error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error.message} />;
  }

  return (
    <TagList
      items={data.tags}
      isLoading={networkStatus === NetworkStatus.fetchMore}
      fetchPopularTags={fetchPopularTags}
    />
  );
};

export default React.memo(TagListContainer);
