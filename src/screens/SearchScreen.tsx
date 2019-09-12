import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import { withSafeArea } from 'components';
import {
  SearchBar,
  TagList,
} from 'containers';
import { AnalyticsService } from 'services';

const SearchScreen: React.FunctionComponent<{}> = () => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen(SearchScreen.name);
  }, []);

  return (
    <React.Fragment>
      <SearchBar />
      <TagList />
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

export default withSafeArea(SearchScreen);
