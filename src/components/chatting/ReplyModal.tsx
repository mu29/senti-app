import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import { LoadingLayer } from 'components';
import { RecordController } from 'containers';
import { palette } from 'constants/style';

interface Props {
  isVisible: boolean;
  hide: () => void;
  create: ({
    url,
    duration,
  }: {
    url: string | null;
    duration: number;
  }) => Promise<void>;
}

const ReplyModal: React.FunctionComponent<Props> = ({
  isVisible,
  hide,
  create,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <React.Fragment>
      <Modal
        isVisible={isVisible}
        onBackdropPress={hide}
        onBackButtonPress={hide}
        style={styles.modal}
        backdropOpacity={0}
        backdropTransitionOutTiming={0}
        backdropTransitionInTiming={0}
        animationInTiming={400}
        animationOutTiming={600}
        hideModalContentWhileAnimating
        useNativeDriver
        hardwareAccelerated
      >
        <View style={styles.container}>
          <RecordController
            setIsLoading={setIsLoading}
            afterUpload={create}
            onFinish={hide}
          />
        </View>
        {isLoading && <LoadingLayer />}
      </Modal>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: palette.black.default,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

export default React.memo(ReplyModal);
