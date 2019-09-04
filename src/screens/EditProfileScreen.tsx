import React from 'react';
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

const EditProfileScreen = () => (
  <React.Fragment>
    <Header canGoBack>
      정보 관리
      <ProfileSaveButton />
    </Header>
    <ScrollView>
      <EditProfilePhoto />
      <EditProfileInfo />
    </ScrollView>
  </React.Fragment>
);

export default withSafeArea(EditProfileScreen);
