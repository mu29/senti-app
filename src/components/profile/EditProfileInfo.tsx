import React, { useCallback } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import {
  withNavigation,
  NavigationInjectedProps,
} from 'react-navigation';
import ActionSheet from 'rn-actionsheet-module';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Text,
  Button,
  LoadingLayer,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';
import { WEBSITE_URL } from 'constants/config';

const GENDERS = {
  male: LocalizedStrings.GENDER_MALE,
  female: LocalizedStrings.GENDER_FEMALE,
  none: LocalizedStrings.GENDER_NONE,
};

interface Props extends NavigationInjectedProps {
  profile: Profile;
  candidate: Candidate;
  isLoading: boolean;
  updateCandidate: (candidate: Candidate) => void;
  signOut: () => void;
}

const EditProfileInfo: React.FunctionComponent<Props> = ({
  profile,
  candidate,
  isLoading,
  updateCandidate,
  signOut,
  navigation,
}) => {
  const updateCandidateName = useCallback((name: string) => updateCandidate({ name }), [updateCandidate]);

  const showGenderSelectSheet = useCallback(() => {
    ActionSheet({
      title: LocalizedStrings.GENDER_SELECT_MODAL,
      optionsIOS: [LocalizedStrings.GENDER_MALE, LocalizedStrings.GENDER_FEMALE, LocalizedStrings.COMMON_CANCEL],
      optionsAndroid: [LocalizedStrings.GENDER_MALE, LocalizedStrings.GENDER_FEMALE],
      cancelButtonIndex: 2,
      onCancelAndroidIndex: 2,
    }, (index: number) => {
      updateCandidate({ gender: index === 0 ? 'male' : 'female' });
    });
  }, [updateCandidate]);

  const openEmail = useCallback(async () => {
    const subject = LocalizedStrings.SETTINGS_REPORT_PROBLEM;
    const url = `mailto:service@senti.in?subject=${encodeURIComponent(subject)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        LocalizedStrings.SETTINGS_REPORT_FAILURE_TITLE,
        LocalizedStrings.SETTINGS_REPORT_FAILURE_MESSAGE(error.message),
      );
    }
  }, []);

  const openPrivacy = useCallback(() => {
    const url = `${WEBSITE_URL}/terms.html`;
    navigation.navigate('WebView', { url });
  }, [navigation]);

  const onPressSignOut = useCallback(() => {
    signOut();
    AnalyticsService.logEvent('click_sign_out');
  }, [signOut]);

  return (
    <React.Fragment>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[typography.tiny3, styles.title]}>
            {LocalizedStrings.PROFILE_ACCOUNT}
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.icon}>
            <Icon name="md-contact" size={20} color={palette.gray[60]} />
          </View>
          <TextInput
            placeholder={LocalizedStrings.PROFILE_NAME}
            placeholderTextColor={palette.gray[50]}
            selectionColor={palette.yellow.default}
            spellCheck={false}
            autoCorrect={false}
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
        <Button onPress={onPressSignOut} style={styles.form}>
          <View style={styles.icon}>
            <Icon name="md-exit" size={20} color={palette.gray[60]} />
          </View>
          <Text style={styles.text}>
            {LocalizedStrings.PROFILE_LOGOUT_BUTTON}
          </Text>
        </Button>
        <View style={styles.header}>
          <Text style={[typography.tiny3, styles.title]}>
            {LocalizedStrings.SETTINGS_TITLE}
          </Text>
        </View>
        <Button onPress={openEmail} style={styles.form}>
          <View style={styles.icon}>
            <Icon name="ios-mail" size={20} color={palette.gray[60]} />
          </View>
          <Text style={styles.text}>
            {LocalizedStrings.SETTINGS_REPORT_PROBLEM}
          </Text>
        </Button>
        <Button onPress={openPrivacy} style={styles.form}>
          <View style={styles.icon}>
            <Icon name="ios-filing" size={20} color={palette.gray[60]} />
          </View>
          <Text style={styles.text}>
            {LocalizedStrings.SETTINGS_TERMS_BUTTON}
          </Text>
        </Button>
      </View>
      {isLoading && <LoadingLayer />}
    </React.Fragment>
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

export default React.memo(withNavigation(EditProfileInfo));
