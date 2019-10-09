import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Text,
} from 'components';
import { palette } from 'constants/style';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

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
  const onPress = useCallback(() => {
    updateProfile();
    AnalyticsService.logEvent('click_update_profile_info');
  }, [updateProfile]);

  return (
    <Button
      hitSlop={HIT_SLOP}
      disabled={!isEnabled}
      onPress={onPress}
      isLoading={isLoading}
      style={styles.button}
      round
    >
      <Text style={[styles.text, isEnabled && styles.enabled]}>
        {LocalizedStrings.COMMON_SAVE}
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
