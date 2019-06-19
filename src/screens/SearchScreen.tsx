import React from 'react';
import {
  SearchBar,
  PopularTagList,
  withSafeArea,
} from 'components';

const SearchScreen = () => (
  <React.Fragment>
    <SearchBar />
    <PopularTagList />
  </React.Fragment>
);

export default withSafeArea(SearchScreen);
