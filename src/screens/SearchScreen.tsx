import React from 'react';
import { withSafeArea } from 'components';
import {
  SearchBar,
  TagList,
} from 'containers';

const SearchScreen = () => (
  <React.Fragment>
    <SearchBar />
    <TagList />
  </React.Fragment>
);

export default withSafeArea(SearchScreen);
