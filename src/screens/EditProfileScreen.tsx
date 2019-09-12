import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from 'react-native';
import {
  Header,
  withSafeArea,
} from 'components';
import {
  ProfileSaveButton,
  EditProfileInfo,
  EditProfilePhoto,
} from 'containers';
import { AnalyticsService } from 'services';

const EditProfileScreen: React.FunctionComponent<{}> = () => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen(EditProfileScreen.name);
  }, []);

  return (
    <React.Fragment>
      <Header canGoBack>
        정보 관리
        <ProfileSaveButton />
      </Header>
      <ScrollView>
        <EditProfilePhoto />
        <EditProfileInfo />
      </ScrollView>
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

export default withSafeArea(EditProfileScreen);
