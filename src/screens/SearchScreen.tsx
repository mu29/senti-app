import React from 'react';
import {
  SearchBar,
  TagList,
  withSafeArea,
} from 'components';

const SearchScreen = () => (
  <React.Fragment>
    <SearchBar />
    <TagList />
  </React.Fragment>
);

export default withSafeArea(SearchScreen);
