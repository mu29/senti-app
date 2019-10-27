import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Text,
  SocialProviderButton,
} from 'components';
import { NavigationService } from 'services';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';
import {
  LANGUAGE,
  WEBSITE_URL,
} from 'constants/config';

interface Props {
  isVisible: boolean;
  provider?: 'facebook' | 'google';
  signInWithFacebook: () => void;
  signInWithGoogle: () => void;
  hide: () => void;
}

const AuthModal: React.FunctionComponent<Props> = ({
  isVisible,
  provider,
  signInWithFacebook,
  signInWithGoogle,
  hide,
}) => {
  const openPrivacy = useCallback(() => {
    const url = `${WEBSITE_URL}/${LANGUAGE}/terms.html`;
    NavigationService.navigate('WebView', { url });
    hide();
  }, [hide]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={hide}
      onBackButtonPress={hide}
      style={styles.modal}
      backdropOpacity={0.4}
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
      animationInTiming={400}
      animationOutTiming={600}
      hideModalContentWhileAnimating
      useNativeDriver
      hardwareAccelerated
    >
      <View style={styles.container} pointerEvents="auto">
        <Text style={[typography.heading1, styles.title]}>
          {LocalizedStrings.LOGIN_TITLE}
        </Text>
        <SocialProviderButton
          icon="facebook"
          backgroundColor={palette.brand.facebook}
          onPress={signInWithFacebook}
          isLoading={provider === 'facebook'}
          disabled={!!provider}
        >
          {LocalizedStrings.LOGIN_WITH_FACEBOOK}
        </SocialProviderButton>
        <SocialProviderButton
          icon="google"
          backgroundColor={palette.brand.google}
          onPress={signInWithGoogle}
          isLoading={provider === 'google'}
          disabled={!!provider}
        >
          {LocalizedStrings.LOGIN_WITH_GOOGLE}
        </SocialProviderButton>
        <TouchableOpacity onPress={openPrivacy} activeOpacity={0.8} style={styles.terms}>
          <Text style={styles.description}>
            {LocalizedStrings.LOGIN_AGREEMENT_MESSAGE}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    padding: 24,
    paddingTop: 0,
    backgroundColor: palette.white.default,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    width: '100%',
    marginTop: 32,
    marginBottom: 24,
    textAlign: 'center',
    color: palette.gray[100],
  },
  terms: {
    marginTop: 16,
  },
  description: {
    width: '100%',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: palette.gray[60],
  },
});

export default React.memo(AuthModal);
