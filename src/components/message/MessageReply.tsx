import React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import { RecordController } from 'components';
import { createMessageAction } from 'stores/actions';
import { palette } from 'constants/style';

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'never',
  bottom: 'always',
};

class MessageReply extends React.Component<{}> {
  public render() {
    return (
      <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
        {/* <RecordController create={createMessageAction} /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: palette.black.default,
  },
});

export default MessageReply;
