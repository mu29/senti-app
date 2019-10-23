import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import { useQuery } from '@apollo/react-hooks';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Text,
  Header,
  withSafeArea,
} from 'components';
import {
  UserInfo,
  CoinInventory,
  CoinModal,
  MyStoryGrid,
} from 'containers';
import { AnalyticsService } from 'services';
import { FETCH_PROFILE } from 'graphqls';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

const ProfileScreen: React.FunctionComponent<{}> = () => {
  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen('ProfileScreen');
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <React.Fragment>
      <Header>
        {LocalizedStrings.SCREEN_PROFILE}
      </Header>
      <View style={styles.info}>
        <UserInfo />
        <View style={styles.divider} />
        <CoinInventory />
      </View>
      <View style={styles.stories}>
        <Icon name="ios-albums" size={16} color={palette.gray[20]} />
        <Text style={[typography.heading3, styles.title]}>
          {LocalizedStrings.MY_STORIES}
        </Text>
      </View>
      <MyStoryGrid />
      <CoinModal />
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  info: {
    backgroundColor: palette.gray[90],
  },
  divider: {
    marginHorizontal: 16,
    height: 1,
    backgroundColor: palette.gray[80],
  },
  title: {
    marginLeft: 6,
  },
  stories: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[90],
  },
});

export default withSafeArea(ProfileScreen);
