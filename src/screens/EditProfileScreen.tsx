import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Text,
  Header,
  EditProfileInfo,
  EditProfilePhoto,
  withSafeArea,
} from 'components';
import { palette } from 'constants/style';

const HIT_SLOP = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

const EditProfileScreen = () => (
  <React.Fragment>
    <Header canGoBack>
      정보 관리
      <Button hitSlop={HIT_SLOP} style={styles.button}>
        <Text style={styles.text}>
           저장
        </Text>
      </Button>
    </Header>
    <ScrollView>
      <EditProfilePhoto />
      <EditProfileInfo />
    </ScrollView>
  </React.Fragment>
);

const styles = StyleSheet.create({
  button: {
    marginRight: 4,
  },
  text: {
    color: palette.yellow.default,
    fontSize: 16,
  },
});

export default withSafeArea(EditProfileScreen);
