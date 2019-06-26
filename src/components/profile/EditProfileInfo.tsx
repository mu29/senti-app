import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'components';
import { AuthState } from 'stores/states';
import { palette, typography } from 'constants/style';

interface EditProfileInfoProps {
  authState?: AuthState;
}

@inject('authState')
@observer
class EditProfileInfo extends React.Component<EditProfileInfoProps> {
  public render() {
    const { user } = this.props.authState!;

    if (!user) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[typography.tiny3, styles.title]}>
            계정
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.icon}>
            <Icon name="md-contact" size={20} color={palette.gray[60]} />
          </View>
          <TextInput
            placeholder="닉네임"
            placeholderTextColor={palette.gray[50]}
            spellCheck={false}
            autoCorrect={false}
            autoCapitalize="none"
            dataDetectorTypes="none"
            keyboardType="default"
            underlineColorAndroid="transparent"
            multiline={false}
            maxLength={40}
            style={styles.input}
          >
            {user.name}
          </TextInput>
        </View>
        <View style={styles.form}>
          <View style={styles.icon}>
            <Icon name="md-heart" size={20} color={palette.gray[60]} />
          </View>
          <Text style={[styles.text, styles.hint]}>
            성별
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.icon}>
            <Icon name="md-exit" size={20} color={palette.gray[60]} />
          </View>
          <Text style={styles.text}>
            로그아웃
          </Text>
        </View>
        <View style={styles.header}>
          <Text style={[typography.tiny3, styles.title]}>
            지원
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.icon}>
            <Icon name="ios-mail" size={20} color={palette.gray[60]} />
          </View>
          <Text style={styles.text}>
            건의 및 불편 신고
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.icon}>
            <Icon name="ios-filing" size={20} color={palette.gray[60]} />
          </View>
          <Text style={styles.text}>
            이용약관 및 개인정보처리방침
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[90],
  },
  title: {
    fontWeight: '600',
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  icon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    paddingHorizontal: 0,
    paddingVertical: 12,
    fontSize: Platform.select({
      ios: 15,
      android: 14,
    }),
    color: palette.gray[20],
  },
  text: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: palette.gray[20],
  },
  hint: {
    color: palette.gray[50],
  },
});

export default EditProfileInfo;
