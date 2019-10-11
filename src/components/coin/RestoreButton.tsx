import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Text,
  Button,
} from 'components';
import { palette, typography } from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

interface Props {
  restore: () => void;
}

const RestoreButton: React.FunctionComponent<Props> = ({
  restore,
}) => {
  return (
    <View style={styles.container}>
      <Button onPress={restore} style={styles.button}>
        <Text style={typography.heading3}>
          {LocalizedStrings.COIN_RESTORE_BUTTON}
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 6,
    marginHorizontal: 10,
  },
  hint: {
    ...typography.body3,
    marginBottom: 6,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: palette.black.default,
  },
});

export default React.memo(RestoreButton);
