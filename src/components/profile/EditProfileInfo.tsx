import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
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
          <Icon name="md-contact" size={20} color={palette.gray[60]} />
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
          <Icon name="md-heart" size={20} color={palette.gray[60]} />
          <TextInput
            placeholder="성별"
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
          />
        </View>
        <View style={styles.form}>
          <Icon name="md-exit" size={20} color={palette.gray[60]} />
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
          <Icon name="ios-mail" size={20} color={palette.gray[60]} />
          <Text style={styles.text}>
            건의 및 불편 신고
          </Text>
        </View>
        <View style={styles.form}>
          <Icon name="ios-filing" size={20} color={palette.gray[60]} />
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
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 8,
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
  input: {
    flex: 1,
    marginLeft: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.gray[10],
    // borderBottomColor: palette.gray[90],
    // borderBottomWidth: 0.5,
  },
  text: {
    flex: 1,
    marginLeft: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.gray[10],
    // borderTopColor: palette.gray[90],
    // borderTopWidth: 0.5,
  },
});

export default EditProfileInfo;
