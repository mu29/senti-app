import React from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
} from 'react-native';
import {
  observer,
  inject,
} from 'mobx-react/native';
import { CreateStoryViewModel } from 'containers';
import { palette } from 'services/style';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface StoryDescriptionProps {
  viewModel?: CreateStoryViewModel;
}

@inject('viewModel')
@observer
class StoryDescription extends React.Component<StoryDescriptionProps> {
  public render() {
    return (
      <View style={styles.container}>
        <AnimatedTextInput
          autoCapitalize="none"
          autoCorrect={false}
          multiline={true}
          placeholder="덧붙이고 싶은 말이 있나요?"
          placeholderTextColor={palette.white.default}
          selectionColor={palette.white.default}
          onChangeText={this.onChangeText}
          style={[styles.input, this.fadeStyle]}
        />
      </View>
    );
  }

  private get fadeStyle() {
    return {
      opacity: this.props.viewModel!.fadeAnimation,
    };
  }

  private onChangeText = (text: string) => {
    this.props.viewModel!.updateDescription(text);
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
    textAlign: 'center',
    color: palette.white.default,
    fontSize: 18,
  },
});

export default StoryDescription;
