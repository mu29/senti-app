import React from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import { palette } from 'constants/style';
import { updateDescriptionAction } from 'stores/actions';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

class StoryDescription extends React.Component<{}> {
  public render() {
    return (
      <View
        onStartShouldSetResponder={this.dismissKeyboard}
        style={styles.container}
      >
        <AnimatedTextInput
          autoCapitalize="none"
          autoCorrect={false}
          numberOfLines={5}
          multiline
          placeholder="덧붙이고 싶은 말이 있나요?"
          placeholderTextColor={palette.white.default}
          selectionColor={palette.white.default}
          onChangeText={this.onChangeText}
          style={styles.input}
        />
      </View>
    );
  }

  private onChangeText = (text: string) => {
    updateDescriptionAction(text);
  }

  private dismissKeyboard = () => {
    Keyboard.dismiss();
    return false;
  }
}

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

export default StoryDescription;
