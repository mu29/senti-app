import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Text,
  SocialProviderButton,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

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
}) => (
  <Modal
    isVisible={isVisible}
    onBackdropPress={hide}
    onBackButtonPress={hide}
    style={styles.modal}
    backdropOpacity={0.4}
    animationInTiming={400}
    animationOutTiming={600}
    hideModalContentWhileAnimating={true}
    useNativeDriver
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
      <Text style={styles.description}>
        {LocalizedStrings.LOGIN_AGREEMENT_MESSAGE}
      </Text>
    </View>
  </Modal>
);

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
  description: {
    marginTop: 16,
    width: '100%',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: palette.gray[60],
  },
});

export default React.memo(AuthModal);
