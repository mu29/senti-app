import React, {
  useRef,
  useState,
  useEffect,
} from 'react';
import debounce from 'lodash/debounce';
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
import { isInitialLoading } from 'utils';

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

  if (isInitialLoading(popularTagResult.networkStatus) || isInitialLoading(searchResult.networkStatus)) {
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
        ? EMPTY_LIST
        : (searchQuery
            ? searchResult.data.searchTags.tags
            : popularTagResult.data.popularTags
          )
      }
      isLoading={isLoading || searchResult.loading}
    />
  );
};

export default React.memo(TagListContainer);
