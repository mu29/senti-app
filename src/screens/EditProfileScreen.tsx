import React from 'react';
import {
  Header,
  EditProfilePhoto,
  withSafeArea,
} from 'components';

const EditProfileScreen = () => (
  <React.Fragment>
    <Header canGoBack>
      프로필 편집
    </Header>
    <EditProfilePhoto />
  </React.Fragment>
);

export default withSafeArea(EditProfileScreen);
