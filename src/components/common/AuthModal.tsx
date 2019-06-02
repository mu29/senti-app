import React from 'react';
import { StyleSheet, Alert } from 'react-native';
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
import { AuthState } from 'stores/states';
import {
  signInWithGoogleAction,
  signInWithFacebookAction,
  hideAuthModalAction,
} from 'stores/actions';
import {
  palette,
  typography,
} from 'constants/style';

interface AuthModalProps {
  authState?: AuthState;
}

@inject('authState')
@observer
class AuthModal extends React.Component<AuthModalProps> {
  public render() {
    const {
      isModalVisible,
      currentProvider,
    } = this.props.authState!;

    return (
      <Modal
        isVisible={isModalVisible}
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
          <Text style={[typography.heading1, styles.title]}>
            로그인하고 모든 기능을 사용하세요!
          </Text>
          <SocialProviderButton
            icon="facebook"
            backgroundColor={palette.brand.facebook}
            onPress={this.signInWithFacebook}
            isLoading={currentProvider === 'facebook'}
            indicatorSize={26}
          >
            페이스북으로 시작하기
          </SocialProviderButton>
          <SocialProviderButton
            icon="google"
            backgroundColor={palette.brand.google}
            onPress={this.signInWithGoogle}
            isLoading={currentProvider === 'google'}
            indicatorSize={26}
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
      const isSuccessful = await signInWithGoogleAction();
      if (isSuccessful) {
        this.hide();
      }
    } catch (error) {
      Alert.alert('로그인', `구글 로그인에 실패했습니다.\n${error.message}`);
    }
  }

  private signInWithFacebook = async () => {
    try {
      const isSuccessful = await signInWithFacebookAction();
      if (isSuccessful) {
        this.hide();
      }
    } catch (error) {
      Alert.alert('로그인', `페이스북 로그인에 실패했습니다.\n${error.message}`);
    }
  }

  private hide = () => {
    const {
      isModalVisible,
      currentProvider,
    } = this.props.authState!;

    if (!isModalVisible || currentProvider) {
      return;
    }

    hideAuthModalAction();
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
