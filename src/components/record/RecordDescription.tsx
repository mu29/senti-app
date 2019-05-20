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
import { RecordViewModel } from 'containers';
import { palette } from 'services/style';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface RecordDescriptionProps {
  viewModel?: RecordViewModel;
}

@inject('viewModel')
@observer
class RecordDescription extends React.Component<RecordDescriptionProps> {
  public render() {
    const { fadeStyle } = this.props.viewModel!;

    return (
      <View style={styles.container}>
        <AnimatedTextInput
          autoCapitalize="none"
          autoCorrect={false}
          multiline={true}
          placeholder="덧붙이고 싶은 말이 있나요?"
          placeholderTextColor={palette.white.default}
          onChangeText={this.onChangeText}
          style={[styles.input, fadeStyle]}
        />
      </View>
    );
  }

  private onChangeText = (text: string) => {
    this.props.viewModel!.changeDescription(text);
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

export default RecordDescription;
