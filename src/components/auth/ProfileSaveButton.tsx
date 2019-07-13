import React from 'react';
import { StyleSheet } from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import {
  Button,
  Text,
} from 'components';
import { updateProfileAction } from 'stores/actions';
import { AuthState, authState } from 'stores/states';
import { palette } from 'constants/style';
import { LoadingType } from 'constants/enums';

const HIT_SLOP = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

interface ProfileSaveButtonProps {
  authState?: AuthState;
}

@inject('authState')
@observer
class ProfileSaveButton extends React.Component<ProfileSaveButtonProps> {
  render() {
    const { candidate } = this.props.authState!;
    const isEnabled = Object.values(candidate).filter(Boolean).length > 0;

    return (
      <Button
        hitSlop={HIT_SLOP}
        disabled={!isEnabled}
        onPress={updateProfileAction}
        isLoading={authState.isLoading === LoadingType.UPDATE}
        style={styles.button}
      >
        <Text style={[styles.text, isEnabled && styles.enabled]}>
          저장
        </Text>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginRight: 4,
  },
  text: {
    color: palette.gray[50],
    fontSize: 16,
  },
  enabled: {
    color: palette.yellow.default,
  },
});

export default ProfileSaveButton;
