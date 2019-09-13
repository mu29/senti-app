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
    <View
      style={styles.container}
      pointerEvents="auto"
    >
      <Text style={[typography.heading1, styles.title]}>
        로그인하고 모든 기능을 사용하세요!
      </Text>
      <SocialProviderButton
        icon="facebook"
        backgroundColor={palette.brand.facebook}
        onPress={signInWithFacebook}
        isLoading={provider === 'facebook'}
        disabled={!!provider}
      >
        페이스북으로 시작하기
      </SocialProviderButton>
      <SocialProviderButton
        icon="google"
        backgroundColor={palette.brand.google}
        onPress={signInWithGoogle}
        isLoading={provider === 'google'}
        disabled={!!provider}
      >
        구글 계정으로 시작하기
      </SocialProviderButton>
      <Text style={styles.description}>
        로그인하면 이용약관 및 개인정보처리방침에{'\n'}동의하는 것으로 간주합니다.
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
