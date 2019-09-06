import React, { useCallback } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import ActionSheet from 'rn-actionsheet-module';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Text,
  Button,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';

const GENDERS = {
  male: '남성',
  female: '여성',
  none: '성별',
};

interface Props {
  profile: Profile;
  candidate: Candidate;
  updateCandidate: (candidate: Candidate) => void;
  signOut: () => void;
}

const EditProfileInfo: React.FunctionComponent<Props> = ({
  profile,
  candidate,
  updateCandidate,
  signOut,
}) => {
  const updateCandidateName = useCallback((name: string) => updateCandidate({ name }), []);

  const showGenderSelectSheet = useCallback(() => {
    ActionSheet({
      title: '성별을 선택하세요',
      optionsIOS: ['남성', '여성', '취소'],
      optionsAndroid: ['남성', '여성'],
      cancelButtonIndex: 2,
      onCancelAndroidIndex: 2,
    }, (index: number) => {
      updateCandidate({ gender: index === 0 ? 'male' : 'female' });
    });
  }, []);

  const openEmail = useCallback(async () => {
    const subject = '[센치] 건의 & 불편 신고';
    const url = `mailto:service@senti.in?subject=${encodeURIComponent(subject)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('알림', `메일 작성에 실패했습니다.\n${error.message}`);
    }
  }, []);

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
          onChangeText={updateCandidateName}
          style={styles.input}
        >
          {profile.name}
        </TextInput>
      </View>
      <Button onPress={showGenderSelectSheet} style={styles.form}>
        <View style={styles.icon}>
          <Icon name="md-heart" size={20} color={palette.gray[60]} />
        </View>
        <Text style={[styles.text, !profile.gender && !candidate.gender && styles.hint]}>
          {GENDERS[candidate.gender || profile.gender || 'none']}
        </Text>
      </Button>
      <Button onPress={signOut} style={styles.form}>
        <View style={styles.icon}>
          <Icon name="md-exit" size={20} color={palette.gray[60]} />
        </View>
        <Text style={styles.text}>
          로그아웃
        </Text>
      </Button>
      <View style={styles.header}>
        <Text style={[typography.tiny3, styles.title]}>
          지원
        </Text>
      </View>
      <Button onPress={openEmail} style={styles.form}>
        <View style={styles.icon}>
          <Icon name="ios-mail" size={20} color={palette.gray[60]} />
        </View>
        <Text style={styles.text}>
          건의 및 불편 신고
        </Text>
      </Button>
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
};

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
    fontWeight: 'bold',
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

export default React.memo(EditProfileInfo);
