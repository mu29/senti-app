import React, {
  useRef,
  useState,
  useEffect,
} from 'react';
import debounce from 'lodash/debounce';
import { NetworkStatus } from 'apollo-client';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import {
  ErrorView,
  LoadingView,
  TagList,
} from 'components';
import {
  FETCH_POPULAR_TAGS,
  FETCH_SEARCH_QUERY,
  SEARCH_TAGS,
} from 'graphqls';

const TagListContainer: React.FunctionComponent<{}> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data } = useQuery<{ searchQuery: string }>(FETCH_SEARCH_QUERY);

  const [searchTags, searchResult] = useLazyQuery(SEARCH_TAGS, {
    notifyOnNetworkStatusChange: true,
  });

  const popularTagResult = useQuery(FETCH_POPULAR_TAGS, {
    notifyOnNetworkStatusChange: true,
  });

  const debouncedSearch = useRef(debounce((name) => {
    setIsLoading(false);
    searchTags({ variables: { name } });
  }, 1000));

  useEffect(() => {
    if (data!.searchQuery) {
      setIsLoading(true);
    }
    debouncedSearch.current(data!.searchQuery);
  }, [data!.searchQuery]);

  if ([NetworkStatus.loading, NetworkStatus.refetch].includes(popularTagResult.networkStatus)
    || [NetworkStatus.loading, NetworkStatus.refetch].includes(searchResult.networkStatus)) {
    return <LoadingView />;
  }

  if (popularTagResult.error) {
    const reload = () => popularTagResult.refetch().catch(() => {});
    return <ErrorView reload={reload} message={popularTagResult.error.message} />;
  }

  if (searchResult.error) {
    const reload = () => searchResult.refetch().catch(() => {});
    return <ErrorView reload={reload} message={searchResult.error.message} />;
  }

  return (
    <TagList
      items={isLoading || searchResult.loading
        ? []
        : (data!.searchQuery
            ? searchResult.data.searchTags.tags
            : popularTagResult.data.popularTags
          )
      }
      isLoading={isLoading || searchResult.loading}
    />
  );
};

export default React.memo(TagListContainer);
