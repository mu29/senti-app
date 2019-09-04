import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Text,
} from 'components';
import { palette } from 'constants/style';

const HIT_SLOP = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

interface Props {
  isEnabled: boolean;
  isLoading: boolean;
  updateProfile: () => void;
}

const ProfileSaveButton: React.FunctionComponent<Props> = ({
  isEnabled,
  isLoading,
  updateProfile,
}) => {
  return (
    <Button
      hitSlop={HIT_SLOP}
      disabled={!isEnabled}
      onPress={updateProfile}
      isLoading={isLoading}
      style={styles.button}
    >
      <Text style={[styles.text, isEnabled && styles.enabled]}>
        저장
      </Text>
    </Button>
  );
};

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

export default React.memo(ProfileSaveButton);
