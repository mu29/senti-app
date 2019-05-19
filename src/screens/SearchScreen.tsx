import React from 'react';
import {
  SearchBar,
  TagList,
  withSafeArea,
} from 'components';

const SearchScreen = () => (
  <React.Fragment>
    <SearchBar />
    <TagList
      data={[{
        id: 1,
        name: '고민',
        count: 3481,
        isSubscribed: false,
      }, {
        id: 2,
        name: '연애상담',
        count: 90163,
        isSubscribed: true,
      }, {
        id: 3,
        name: '불면증',
        count: 142,
        isSubscribed: false,
      }]}
    />
  </React.Fragment>
);

export default withSafeArea(SearchScreen);
