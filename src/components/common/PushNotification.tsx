import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  StatusBar,
  Vibration,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import {
  Text,
  Button,
  CachableImage,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import {
  NavigationService,
  NotificationService,
} from 'services';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
} = {
  top: 'always',
};

type PushNotificationData = {
  body: string;
  chattingId: string;
  partnerId: string;
  partnerName: string;
  partnerPhotoUrl: string;
}

interface State {
  data?: PushNotificationData;
}

class PushNotification extends React.PureComponent<{}, State> {
  public state = {
    data: undefined,
  };

  private translateAnimation = new Animated.Value(0);

  private containerStyle = {
    transform: [{
      translateY: this.translateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-160, 0],
        extrapolate: 'clamp',
      }),
    }],
  }

  public show(data: PushNotificationData) {
    this.setState({ data });
    Animated.timing(this.translateAnimation, {
      duration: 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
    Vibration.vibrate(500);

    setTimeout(() => this.hide(), 3000);
  }

  public hide() {
    this.translateAnimation.stopAnimation();
    Animated.timing(this.translateAnimation, {
      duration: 300,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ data: undefined });
    });
  }

  public render() {
    if (!this.state.data) {
      return null;
    }

    const {
      body,
      partnerName,
      partnerPhotoUrl,
    } = this.state.data!;

    if (!body || !partnerName || !partnerPhotoUrl) {
      return null;
    }

    return (
      <AnimatedSafeAreaView forceInset={SAFE_AREA_INSET} style={[styles.container, this.containerStyle]}>
        <Button onPress={this.onPress} style={styles.button}>
          <CachableImage prefix="profiles" source={partnerPhotoUrl} style={styles.profile} />
          <View style={styles.content}>
            <Text style={[typography.heading3, styles.name]}>
              {partnerName}
            </Text>
            <Text style={[typography.body3]}>
              {body}
            </Text>
          </View>
        </Button>
      </AnimatedSafeAreaView>
    );
  }

  private onPress = () => {
    if (!this.state.data) {
      return;
    }

    const {
      chattingId,
      partnerId,
      partnerName,
    } = this.state.data!;

    this.hide();
    NavigationService.navigate('Message', {
      chattingId,
      partnerId,
      partnerName,
    });
    NotificationService.clearBadge();
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: palette.gray[100],
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: palette.gray[100],
    borderBottomWidth: 1,
    borderBottomColor: palette.gray[90],
  },
  profile: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.gray[90],
    backgroundColor: palette.gray[80],
  },
  content: {
    justifyContent: 'center',
  },
  name: {
    marginBottom: 4,
  },
});

export default PushNotification;
