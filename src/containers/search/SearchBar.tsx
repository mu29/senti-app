import React, { useCallback } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { SearchBar } from 'components';

const SearchBarContainer: React.FunctionComponent<{}> = () => {
  const client = useApolloClient();

  const updateQuery = useCallback((searchQuery: string) => {
    client.writeData({ data: { searchQuery } });
  }, [client]);

  return (
    <SearchBar updateQuery={updateQuery} />
  );
};

export default React.memo(SearchBarContainer);
