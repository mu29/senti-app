import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
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
import { LocalizedStrings } from 'constants/translations';

const EditProfileScreen: React.FunctionComponent<{}> = () => {
  const onDidFocus = useCallback(() => {
    AnalyticsService.setScreen(EditProfileScreen.name);
  }, []);

  return (
    <React.Fragment>
      <Header canGoBack>
        {LocalizedStrings.PROFILE_EDIT}
        <ProfileSaveButton />
      </Header>
      <EditProfilePhoto />
      <EditProfileInfo />
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

export default withSafeArea(EditProfileScreen);
