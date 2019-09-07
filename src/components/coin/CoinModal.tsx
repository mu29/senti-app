import React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import Modal from 'react-native-modal';
import {
  TabView,
  LoadingLayer,
} from 'components';
import {
  CoinList,
  CoinHistoryList,
} from 'containers';
import { palette } from 'constants/style';

const ROUTES = [
  { key: 'charge', title: '코인 충전' },
  { key: 'history', title: '사용 내역' },
];

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'never',
  bottom: 'always',
};

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
        <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
          <TabView routes={ROUTES}>
            <CoinList />
            <CoinHistoryList />
          </TabView>
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
    height: 288,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: palette.gray[100],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default React.memo(CoinModal);
