import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { palette } from 'constants/style';

class EditProfileInfo extends React.Component {
  public render() {
    return (
      <View style={styles.form}>
        <Icon name="md-person" size={18} color={palette.gray[40]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
});

export default EditProfileInfo;
