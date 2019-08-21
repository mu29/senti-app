import React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import Modal from 'react-native-modal';
import {
  LoadingView,
  RecordController,
} from 'components';
import { palette } from 'constants/style';

const SAFE_AREA_INSET: {
  bottom: SafeAreaViewForceInsetValue;
} = {
  bottom: 'always',
};

interface Props {
  isVisible: boolean;
  isLoading: boolean;
  create: (path: string, duration: number) => Promise<void>;
  hide: () => void;
}

const ReplyModal: React.FunctionComponent<Props> = ({
  isVisible,
  isLoading,
  create,
  hide,
}) => (
  <React.Fragment>
    {isLoading && <LoadingView />}
    <Modal
      isVisible={isVisible}
      onBackdropPress={hide}
      onBackButtonPress={hide}
      style={styles.modal}
      backdropOpacity={0}
      animationInTiming={400}
      animationOutTiming={600}
      hideModalContentWhileAnimating={true}
      useNativeDriver
    >
      <SafeAreaView
        forceInset={SAFE_AREA_INSET}
        pointerEvents="auto"
        style={styles.container}
      >
        <RecordController create={create} />
      </SafeAreaView>
    </Modal>
  </React.Fragment>
);

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: palette.black.default,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

export default ReplyModal;
