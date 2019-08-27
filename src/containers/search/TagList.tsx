import React from 'react';
import { NetworkStatus } from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  TagList,
} from 'components';
import { FETCH_POPULAR_TAGS } from 'graphqls';

const TagListContainer: React.FunctionComponent<{}> = () => {
  const {
    data,
    networkStatus,
    error,
    refetch,
  } = useQuery(FETCH_POPULAR_TAGS, {
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
      items={data.popularTags}
      isLoading={networkStatus === NetworkStatus.fetchMore}
    />
  );
};

export default React.memo(TagListContainer);
