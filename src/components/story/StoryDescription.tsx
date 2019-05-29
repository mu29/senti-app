import React from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  observer,
  inject,
} from 'mobx-react/native';
import { StoryStore } from 'stores';
import { palette } from 'constants/style';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface StoryDescriptionProps {
  storyStore?: StoryStore;
}

@inject('storyStore')
@observer
class StoryDescription extends React.Component<StoryDescriptionProps> {
  public render() {
    return (
      <View style={styles.container}>
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
    this.props.storyStore!.updateDescription(text);
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
    marginBottom: 72,
    textAlign: 'center',
    color: palette.white.default,
    fontSize: 18,
  },
});

export default StoryDescription;
