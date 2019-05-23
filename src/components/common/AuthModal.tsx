import React from 'react';
import { StyleSheet } from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import {
  Text,
  SocialProviderButton,
} from 'components';
import {
  UiStore,
  AuthStore,
} from 'stores';
import { palette } from 'services/style';
import NavigationService from '../../NavigationService';

interface AuthModalProps {
  uiStore?: UiStore;
  authStore?: AuthStore;
}

@inject('uiStore', 'authStore')
@observer
class AuthModal extends React.Component<AuthModalProps> {
  public render() {
    const { isAuthModalVisible } = this.props.uiStore!;

    return (
      <Modal
        isVisible={isAuthModalVisible}
        onBackdropPress={this.hide}
        onBackButtonPress={this.hide}
        style={styles.modal}
        backdropOpacity={0.4}
        animationInTiming={400}
        animationOutTiming={600}
        hideModalContentWhileAnimating={true}
        useNativeDriver
      >
        <SafeAreaView style={styles.container} pointerEvents="auto">
          <Text style={styles.title}>
            로그인하고 모든 기능을 사용하세요!
          </Text>
          <SocialProviderButton
            icon="facebook"
            backgroundColor={palette.brand.facebook}
          >
            페이스북으로 시작하기
          </SocialProviderButton>
          <SocialProviderButton
            icon="google"
            backgroundColor={palette.brand.google}
            onPress={this.signInWithGoogle}
          >
            구글 계정으로 시작하기
          </SocialProviderButton>
          <Text style={styles.description}>
            로그인하면 이용약관 및 개인정보처리방침에{'\n'}동의하는 것으로 간주합니다.
          </Text>
        </SafeAreaView>
      </Modal>
    );
  }

  private signInWithGoogle = async () => {
    try {
      await this.props.authStore!.signInWithGoogle();
      this.finishLogin();
    } catch {}
  }

  private finishLogin = () => {
    const { authStore } = this.props;
    const nextRoute = authStore!.popNextRoute();

    this.hide();

    if (nextRoute) {
      NavigationService.navigate(nextRoute);
    }
  }

  private hide = () => {
    const {
      toggleAuthModal,
      isAuthModalVisible,
    } = this.props.uiStore!;

    if (!isAuthModalVisible) {
      return;
    }

    toggleAuthModal();
  }
}

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
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: palette.gray[100],
  },
  description: {
    marginTop: 16,
    width: '100%',
    fontSize: 12,
    textAlign: 'center',
    color: palette.gray[60],
  },
});

export default AuthModal;
