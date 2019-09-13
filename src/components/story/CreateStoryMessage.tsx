import React, { useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import { palette } from 'constants/style';

interface Props {
  onChangeText: (text: string) => void;
}

const CreateStoryMessage: React.FunctionComponent<Props> = ({
  onChangeText,
}) => {
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
    return false;
  }, []);

  return (
    <View
      onStartShouldSetResponder={dismissKeyboard}
      style={styles.container}
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        numberOfLines={5}
        multiline
        placeholder="여기를 눌러 #태그를 추가해 보세요"
        placeholderTextColor={palette.gray[30]}
        selectionColor={palette.white.default}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    maxHeight: Platform.select({
      ios: undefined,
      android: 164,
    }),
    padding: 24,
    marginBottom: 48,
    textAlign: 'center',
    color: palette.white.default,
    fontSize: 18,
  },
});

export default React.memo(CreateStoryMessage);
