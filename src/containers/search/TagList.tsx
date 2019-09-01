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

const EMPTY_LIST: Tag[] = [];

const TagListContainer: React.FunctionComponent<{}> = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: {
      searchQuery,
    },
  } = useQuery(FETCH_SEARCH_QUERY) as { data: { searchQuery: string } };

  const [searchTags, searchResult] = useLazyQuery(SEARCH_TAGS, {
    notifyOnNetworkStatusChange: true,
  });

  const popularTagResult = useQuery(FETCH_POPULAR_TAGS, {
    notifyOnNetworkStatusChange: true,
  });

  const debouncedSearch = useRef(debounce((tag) => {
    searchTags({ variables: { tag } });
    setIsLoading(false);
  }, 1000));

  useEffect(() => {
    if (searchQuery && !isLoading) {
      setIsLoading(true);
    }
    debouncedSearch.current(searchQuery);
  }, [searchQuery]);

  const {
    data = {},
    error,
    refetch,
    networkStatus,
  } = searchQuery ? searchResult : popularTagResult;
  const tags = searchQuery ? (data.searchTags ? data.searchTags.tags : EMPTY_LIST) : data.popularTags;

  if (error || networkStatus === NetworkStatus.error) {
    const reload = () => refetch().catch(() => {});
    return <ErrorView reload={reload} message={error ? error.message : ''} />;
  }

  if (networkStatus === NetworkStatus.loading || !data || !tags) {
    return <LoadingView />;
  }

  return (
    <TagList
      items={isLoading || searchResult.loading ? EMPTY_LIST : tags}
      isLoading={isLoading || searchResult.loading}
    />
  );
};

export default React.memo(TagListContainer);
