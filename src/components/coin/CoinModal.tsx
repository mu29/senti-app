import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import { LoadingLayer } from 'components';
import { palette } from 'constants/style';
import CoinChargeView from './CoinChargeView';

interface Props {
  isVisible: boolean;
  isLoading: boolean;
  hide: () => void;
}

const CoinModal: React.FunctionComponent<Props> = ({
  isVisible,
  isLoading,
  hide,
}) => {
  return (
    <React.Fragment>
      {isLoading && <LoadingLayer />}
      <Modal
        isVisible={isVisible}
        onBackdropPress={hide}
        onBackButtonPress={hide}
        style={styles.modal}
        backdropOpacity={0.4}
        animationInTiming={400}
        animationOutTiming={600}
        hideModalContentWhileAnimating={true}
        useNativeDriver
      >
        <SafeAreaView style={styles.container} pointerEvents="auto">
          <CoinChargeView items={['30', '60', '100']} />
        </SafeAreaView>
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
    padding: 24,
    paddingTop: 0,
    backgroundColor: palette.white.default,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default React.memo(CoinModal);
