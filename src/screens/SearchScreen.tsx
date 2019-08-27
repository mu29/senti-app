import React from 'react';
import {
  TagList,
  withSafeArea,
} from 'components';
import {
  SearchBar,
} from 'containers';

const SearchScreen = () => (
  <React.Fragment>
    <SearchBar />
    <TagList />
  </React.Fragment>
);

export default withSafeArea(SearchScreen);
