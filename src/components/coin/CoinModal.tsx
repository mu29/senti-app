import React, { useState } from 'react';
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
  TransactionList,
} from 'containers';
import { palette } from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

const ROUTES = [
  { key: 'charge', title: LocalizedStrings.COIN_CHARGE_TAB },
  { key: 'history', title: LocalizedStrings.COIN_HISTORY_TAB },
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
  hide: () => void;
}

const CoinModal: React.FunctionComponent<Props> = ({
  isVisible,
  hide,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <React.Fragment>
      <Modal
        isVisible={isVisible}
        onBackdropPress={hide}
        onBackButtonPress={hide}
        style={styles.modal}
        backdropOpacity={0.4}
        backdropTransitionOutTiming={0}
        backdropTransitionInTiming={0}
        animationInTiming={400}
        animationOutTiming={600}
        hideModalContentWhileAnimating
        useNativeDriver
        hardwareAccelerated
      >
        <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
          <TabView routes={ROUTES}>
            <CoinList setIsLoading={setIsLoading} />
            <TransactionList />
          </TabView>
        </SafeAreaView>
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
    height: 432,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: palette.gray[100],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default React.memo(CoinModal);
